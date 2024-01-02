import { glMatrix, mat4, vec3 } from 'gl-matrix';
import MeshData from "./meshData";

import vsCode from '../shaders/default.vert.wgsl';
import fsCode from '../shaders/default.frag.wgsl';

export default class Mesh{
    positionBuffer: GPUBuffer;
    colorBuffer: GPUBuffer;
    indexBuffer: GPUBuffer;

    device: GPUDevice;
    pipeline: GPURenderPipeline;

    vertModule: GPUShaderModule;
    fragModule: GPUShaderModule;

    numOfIndex: number;

    constructor(meshData: MeshData, device: GPUDevice) {
        const createBuffer = (
            arr: Float32Array | Uint16Array,
            usage: number
        ) => {
            // 📏 Align to 4 bytes (thanks @chrimsonite)
            let desc = {
                size: (arr.byteLength + 3) & ~3,
                usage,
                mappedAtCreation: true
            };
            let buffer = device.createBuffer(desc);
            const writeArray =
                arr instanceof Uint16Array
                    ? new Uint16Array(buffer.getMappedRange())
                    : new Float32Array(buffer.getMappedRange());
            writeArray.set(arr);
            buffer.unmap();
            return buffer;
        };

        this.device = device;
        this.createShaderModel();

        this.positionBuffer = createBuffer(meshData.positions, GPUBufferUsage.VERTEX);
        this.colorBuffer = createBuffer(meshData.colors, GPUBufferUsage.VERTEX);
        this.indexBuffer = createBuffer(meshData.indices, GPUBufferUsage.INDEX);
        this.numOfIndex = meshData.indices.length;

        this.createPipeline();
    }

    protected createShaderModel(){
        this.vertModule = this.device.createShaderModule({code: vsCode});
        this.fragModule = this.device.createShaderModule({code: fsCode});
    }

    protected createPipeline(){
        const positionAttribDesc: GPUVertexAttribute = {
            shaderLocation: 0, // [[location(0)]]
            offset: 0,
            format: 'float32x3'
        };
        const colorAttribDesc: GPUVertexAttribute = {
            shaderLocation: 1, // [[location(1)]]
            offset: 0,
            format: 'float32x4'
        };

        const positionBufferDesc: GPUVertexBufferLayout = {
            attributes: [positionAttribDesc],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        };
        const colorBufferDesc: GPUVertexBufferLayout = {
            attributes: [colorAttribDesc],
            arrayStride: 4 * 4, // sizeof(float) * 4
            stepMode: 'vertex'
        };

        const depthStencil: GPUDepthStencilState = {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus-stencil8'
        };

        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [{
                binding: 0, // camera uniforms
                visibility: GPUShaderStage.VERTEX,
                buffer: {},
            }, {
                binding: 1, // model uniform
                visibility: GPUShaderStage.VERTEX,
                buffer: {},
            }]
        });
        const pipelineLayoutDesc = { bindGroupLayouts: [
                bindGroupLayout // @group(0
            ] };
        const layout = this.device.createPipelineLayout(pipelineLayoutDesc);

        const vertex: GPUVertexState = {
            module: this.vertModule,
            entryPoint: 'main',
            buffers: [positionBufferDesc, colorBufferDesc]
        };

        const colorState: GPUColorTargetState = {
            format: 'bgra8unorm'
        };

        const fragment: GPUFragmentState = {
            module: this.fragModule,
            entryPoint: 'main',
            targets: [colorState]
        };

        const primitive: GPUPrimitiveState = {
            frontFace: 'cw',
            cullMode: 'none',
            topology: 'triangle-list'
        };

        const pipelineDesc: GPURenderPipelineDescriptor = {
            layout,

            vertex,
            fragment,

            primitive,
            depthStencil
        };
        this.pipeline = this.device.createRenderPipeline(pipelineDesc);
    }

    public render(passEncoder: GPURenderPassEncoder){
        const cameraBuffer = this.device.createBuffer({
            size: 144, // Room for two 4x4 matrices and a vec3
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
        });

        const modelBuffer = this.device.createBuffer({
            size: 64, // Room for one 4x4 matrix
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
        });

        const bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: cameraBuffer },
            }, {
                binding: 1,
                resource: { buffer: modelBuffer },
            }],
        });

        const objectPosition = vec3.fromValues(0, 0, 0);
        const objectRotation = vec3.fromValues(45, 45, 45);
        const objectScale = vec3.fromValues(1, 1, 1);

        const eyePosition = vec3.fromValues(0, 0, -5);
        const eyeRotation = vec3.fromValues(0, 0, 0);

        const fovRadians = 45 * Math.PI / 180;
        const aspect = 1;
        const zNear = 1;
        const zFar = 100;

        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // 스자이공부
        mat4.scale(modelMatrix, modelMatrix, objectScale);
        mat4.rotate(modelMatrix, modelMatrix, objectRotation[0], [1, 0, 0]);
        mat4.rotate(modelMatrix, modelMatrix, objectRotation[1], [0, 1, 0]);
        mat4.rotate(modelMatrix, modelMatrix, objectRotation[2], [0, 0, 1]);
        mat4.translate(modelMatrix, modelMatrix, objectPosition);

        mat4.rotate(viewMatrix, viewMatrix, eyeRotation[0], [1, 0, 0]);
        mat4.rotate(viewMatrix, viewMatrix, eyeRotation[1], [0, 1, 0]);
        mat4.rotate(viewMatrix, viewMatrix, eyeRotation[2], [0, 0, 1]);
        mat4.translate(viewMatrix, viewMatrix, eyePosition);

        mat4.perspective(projectionMatrix, fovRadians, aspect, zNear, zFar);

        const cameraArray = new Float32Array(36);
        cameraArray.set(projectionMatrix, 0);
        cameraArray.set(viewMatrix, 16);

        const modelArray = new Float32Array(16);
        modelArray.set(modelMatrix, 0);

        this.device.queue.writeBuffer(cameraBuffer, 0, cameraArray);
        this.device.queue.writeBuffer(modelBuffer, 0, modelArray);

        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, bindGroup);

        passEncoder.setVertexBuffer(0, this.positionBuffer);
        passEncoder.setVertexBuffer(1, this.colorBuffer);
        passEncoder.setIndexBuffer(this.indexBuffer, 'uint16');
        passEncoder.drawIndexed(this.numOfIndex);
    }
}