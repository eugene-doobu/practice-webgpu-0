export default class Renderer{
    private canvas: HTMLCanvasElement;

    // web-gpu entry
    private device: GPUDevice;
    private queue: GPUQueue;

    // frame backings
    private context: GPUCanvasContext;
    private colorTexture: GPUTexture;
    private colorTextureView: GPUTextureView;
    private depthTexture: GPUTexture;
    private depthTextureView: GPUTextureView;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
    }

    public async Start() {
        if (!await this.init()) return;
        this.resizeBackings();
        this.encodeCommands();
    }

    private async init(): Promise<boolean>{
        // 현재 브라우징 컨텍스트에 대한 GPU 객체를 반환, 이는 WebGPU API의 진입점
        const entry: GPU = navigator.gpu;
        if (!entry) {
            console.log("WebGPU가 지원되지 않습니다.");
            return false;
        }
        console.log("WebGPU가 지원됩니다.");

        const adapter: GPUAdapter = await entry.requestAdapter();
        if (!adapter) {
            console.log("GPUAdapter를 가져올 수 없습니다.");
            return false;
        }

        this.device = await adapter.requestDevice();
        this.queue = this.device.queue;

        return true;
    }

    private resizeBackings(){
        this.context = this.canvas.getContext('webgpu');
        const canvasConfig: GPUCanvasConfiguration = {
            device: this.device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: "opaque",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        };
        this.context.configure(canvasConfig);

        this.colorTexture = this.context.getCurrentTexture();
        this.colorTextureView = this.colorTexture.createView();

        const depthTextureDesc: GPUTextureDescriptor = {
            size: [this.canvas.width, this.canvas.height, 1],
            dimension: '2d',
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        };

        this.depthTexture = this.device.createTexture(depthTextureDesc);
        this.depthTextureView = this.depthTexture.createView();
    }

    private encodeCommands(){
        let colorAttachment: GPURenderPassColorAttachment = {
            view: this.colorTextureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store'
        };

        const depthAttachment: GPURenderPassDepthStencilAttachment = {
            view: this.depthTextureView,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
            stencilClearValue: 0,
            stencilLoadOp: 'clear',
            stencilStoreOp: 'store'
        };

        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: [colorAttachment],
            depthStencilAttachment: depthAttachment
        };

        const commandEncoder: GPUCommandEncoder = this.device.createCommandEncoder();
        const passEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(renderPassDesc);
        passEncoder.setViewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height,
            0,
            1
        );
        passEncoder.setScissorRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // TODO: render mesh

        passEncoder.end();
        this.queue.submit([commandEncoder.finish()]);
    }
}