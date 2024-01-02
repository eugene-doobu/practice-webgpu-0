import MeshData from "./meshData";

export default class Mesh{
    positionBuffer: GPUBuffer;
    colorBuffer: GPUBuffer;
    indexBuffer: GPUBuffer;

    device: GPUDevice;

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

        this.createPipeline();
    }

    protected createShaderModel(){

    }

    protected createPipeline(){

    }

    public render(passEncoder: GPURenderPassEncoder){

    }
}