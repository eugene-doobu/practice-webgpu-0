import Camera from "./camera";

export default class InputManager{
    //#region Singleton
    private static instance: InputManager;

    private constructor() {
    }

    public static getInstance() {
        return this.instance || (this.instance = new this())
    }
    //#endregion Singleton

    private isOnDrag: boolean = false;

    public initialize(canvas: HTMLCanvasElement): void {
        canvas.addEventListener("mousemove", this.onMouseMove);
        canvas.addEventListener("mousedown", this.onMouseDown);
        canvas.addEventListener("mouseup", this.onMouseUp);
        canvas.addEventListener("keydown", this.onKeyDown);
        canvas.addEventListener("keyup", this.onKeyUp);
        canvas.addEventListener("wheel", this.onWheel);
    }

    private onMouseMove(mouseEvent: MouseEvent): void {
        if (!this.isOnDrag) return;
        Camera.getInstance().rotateXY(mouseEvent.movementY / 100, mouseEvent.movementX / 100);
    }

    public onMouseDown(mouseEvent: MouseEvent): void {
        if (mouseEvent.button === 0) {
            this.isOnDrag = true;
        }
    }

    public onMouseUp(mouseEvent: MouseEvent): void {
        if (mouseEvent.button === 0) {
            this.isOnDrag = false;
        }
    }

    public onKeyDown(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.key === "`") {
            Camera.getInstance().initialize();
        }

        const inputManager = InputManager.getInstance();
        inputManager.processMoveKey(keyboardEvent);
    }

    public onKeyUp(keyboardEvent: KeyboardEvent): void {
    }

    public onWheel(wheelEvent: WheelEvent): void {
        Camera.getInstance().moveForward(wheelEvent.deltaY / 100);
    }

    private processMoveKey(keyboardEvent: KeyboardEvent): void {
        const moveSpeed = 0.3;
        if (keyboardEvent.key == "w")
            Camera.getInstance().moveForward(moveSpeed);
        if (keyboardEvent.key == "s")
            Camera.getInstance().moveForward(-moveSpeed);
        if (keyboardEvent.key == "a")
            Camera.getInstance().moveRight(moveSpeed);
        if (keyboardEvent.key == "d")
            Camera.getInstance().moveRight(-moveSpeed);
        if (keyboardEvent.key == "q")
            Camera.getInstance().moveUp(-moveSpeed);
        if (keyboardEvent.key == "e")
            Camera.getInstance().moveUp(moveSpeed);
    }
}