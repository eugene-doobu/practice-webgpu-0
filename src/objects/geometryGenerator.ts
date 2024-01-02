import MeshData from "./meshData";

export default class GeometryGenerator{
    public makeTriangle(scale: number): MeshData{
        let positions = new Float32Array([
            -scale, -scale, 0.0,
            scale, -scale, 0.0,
            0.0, scale, 0.0,
        ]);
        let colors = new Float32Array([
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.5, 0.5, 1.0, 1.0,
        ]);
        let indices = new Uint16Array([
            0, 1, 2,
        ]);
        return new MeshData(positions, colors, indices);
    };
}