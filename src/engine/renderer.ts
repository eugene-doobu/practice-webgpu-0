export default class Renderer{
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
    }

    async init(): Promise<boolean>{
        // 현재 브라우징 컨텍스트에 대한 GPU 객체를 반환, 이는 WebGPU API의 진입점
        const entry: GPU = navigator.gpu;
        if (!entry) {
            console.log("WebGPU가 지원되지 않습니다.");
            return false;
        }

        const adapter: GPUAdapter = await entry.requestAdapter();
        if (!adapter) {
            console.log("GPUAdapter를 가져올 수 없습니다.");
            return false;
        }

        const device: GPUDevice = await adapter.requestDevice();
        const queue: GPUQueue = device.queue;
    }
}