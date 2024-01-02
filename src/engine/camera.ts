import { glMatrix, mat4, vec3 } from 'gl-matrix';
import CameraSetting, { canvasSize } from "../setting";

export default class Camera{
    //#region Singleton
    private static instance: Camera;

    private constructor() {
    }

    public static getInstance() {
        return this.instance || (this.instance = new this())
    }
    //#endregion Singleton

    private viewMatrix: mat4 = mat4.create();
    private projectionMatrix: mat4 = mat4.create();

    private position: vec3 = vec3.create();
    private rotation: vec3 = vec3.create();

    readonly maxDistance: number = 20;

    public initialize(): void {
        this.position = vec3.fromValues(0, 0, -10);
        this.rotation = vec3.fromValues(0, 0, 0);
        this.updateProjectionMatrix();
        this.updateViewMatrix();
    }

    public getPosition(): vec3 {
        return this.position;
    }

    public getProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public updateProjectionMatrix(): void {
        mat4.identity(this.projectionMatrix);
        mat4.perspective(this.projectionMatrix, CameraSetting.fovRadian, canvasSize / canvasSize, CameraSetting.near, CameraSetting.far);
    }

    public updateViewMatrix(): void {
        mat4.identity(this.viewMatrix);
        mat4.translate(this.viewMatrix, this.viewMatrix, this.position);
        mat4.rotateX(this.viewMatrix, this.viewMatrix, this.rotation[0]);
        mat4.rotateY(this.viewMatrix, this.viewMatrix, this.rotation[1]);
        mat4.rotateZ(this.viewMatrix, this.viewMatrix, this.rotation[2]);
    }

    public setPosition(position: vec3): void {
        this.position = position;
        this.updateViewMatrix();
    }

    public setRotation(rotation: vec3): void {
        this.rotation = rotation;
        this.updateViewMatrix();
    }

    public moveForward(distance: number): void {
        const forward = vec3.create();
        vec3.set(forward, 0, 0, distance);
        vec3.add(this.position, this.position, this.rotateVector(forward));

        this.clampPosition(this.position);
        this.updateViewMatrix();
    }

    public moveRight(distance: number): void {
        const right = vec3.create();
        vec3.set(right, distance, 0, 0);
        vec3.add(this.position, this.position, this.rotateVector(right));

        this.clampPosition(this.position);
        this.updateViewMatrix();
    }

    public moveUp(distance: number): void {
        const up = vec3.create();
        vec3.set(up, 0, distance, 0);
        vec3.add(this.position, this.position, this.rotateVector(up));

        this.clampPosition(this.position);
        this.updateViewMatrix();
    }

    private rotateVector(vector: vec3): vec3 {
        const toRadian = glMatrix.toRadian;
        vec3.rotateX(vector, vector, [0, 0, 0], toRadian(this.rotation[0]));
        vec3.rotateY(vector, vector, [0, 0, 0], toRadian(this.rotation[1]));
        vec3.rotateZ(vector, vector, [0, 0, 0], toRadian(this.rotation[2]));
        return vector;
    }

    private clampPosition(position: vec3): vec3 {
        position[0] = Math.min(position[0], this.maxDistance);
        position[0] = Math.max(position[0], -this.maxDistance);
        position[1] = Math.min(position[1], this.maxDistance);
        position[1] = Math.max(position[1], -this.maxDistance);
        position[2] = Math.min(position[2], this.maxDistance);
        position[2] = Math.max(position[2], -this.maxDistance);
        return position;
    }

    public rotateXY(x: number, y: number): void {
        this.rotation[0] += x;
        this.rotation[1] += y;
        this.updateViewMatrix();
    }
}

