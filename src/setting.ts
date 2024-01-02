export const canvasSize = 800;

export default class CameraSetting{
    static readonly fov = 45;
    static readonly fovRadian = CameraSetting.fov * Math.PI / 180;
    static readonly near = 0.1;
    static readonly far = 100;
}