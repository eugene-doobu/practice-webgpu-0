import {glMatrix, mat4, quat, vec3} from 'gl-matrix';
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
        mat4.rotateX(this.viewMatrix, this.viewMatrix, this.rotation[0]);
        mat4.rotateY(this.viewMatrix, this.viewMatrix, this.rotation[1]);
        mat4.rotateZ(this.viewMatrix, this.viewMatrix, this.rotation[2]);
        mat4.translate(this.viewMatrix, this.viewMatrix, this.position);
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
        let invertedView = mat4.create();
        mat4.invert(invertedView, this.viewMatrix);

        const sliceValues = invertedView.slice(8, 11);
        let forward = vec3.fromValues(sliceValues[0], sliceValues[1], sliceValues[2]);
        vec3.normalize(forward, forward);
        vec3.scale(forward, forward, distance);
        vec3.add(this.position, this.position, forward);

        this.clampPosition(this.position);
        this.updateViewMatrix();
    }

    public moveRight(distance: number): void {
        let invertedView = mat4.create();
        mat4.invert(invertedView, this.viewMatrix);

        const sliceValues = invertedView.slice(0, 3);
        let right = vec3.fromValues(sliceValues[0], sliceValues[1], sliceValues[2]);
        vec3.normalize(right, right);
        vec3.scale(right, right, distance);
        vec3.add(this.position, this.position, right);

        this.clampPosition(this.position);
        this.updateViewMatrix();
    }

    public moveUp(distance: number): void {
        let invertedView = mat4.create();
        mat4.invert(invertedView, this.viewMatrix);

        const sliceValues = invertedView.slice(4, 7);
        let up = vec3.fromValues(sliceValues[0], sliceValues[1], sliceValues[2]);
        vec3.normalize(up, up);
        vec3.scale(up, up, distance);
        vec3.add(this.position, this.position, up);

        this.clampPosition(this.position);
        this.updateViewMatrix();
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

    private getRotationQuat(): quat {
        let q = quat.create();
        quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2]);
        quat.rotateX(q, q, this.rotation[0] * 180 / Math.PI);
        quat.rotateY(q, q, this.rotation[1] * 180 / Math.PI);
        quat.rotateZ(q, q, this.rotation[2] * 180 / Math.PI);
        return q;
    }

    public rotateXY(x: number, y: number): void {
        this.rotation[0] += x;
        this.rotation[1] += y;
        this.updateViewMatrix();
    }
}

