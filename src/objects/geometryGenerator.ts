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

    public makeSquare(scale: number): MeshData{
        let positions = new Float32Array([
            -scale, -scale, 0.0,
            scale, -scale, 0.0,
            scale, scale, 0.0,
            -scale, scale, 0.0,
        ]);
        let colors = new Float32Array([
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
        ]);
        let indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
        ]);

        return new MeshData(positions, colors, indices);
    }

    public makeBox(scale: number): MeshData{
        let positions = new Float32Array([
            // top
            -scale, scale, -scale,
            -scale, scale, scale,
            scale, scale, scale,
            scale, scale, -scale,
            // bottom
            -scale, -scale, -scale,
            scale, -scale, -scale,
            scale, -scale, scale,
            -scale, -scale, scale,
            // front
            -scale, -scale, -scale,
            -scale, scale, -scale,
            scale, scale, -scale,
            scale, -scale, -scale,
            // back
            -scale, -scale, scale,
            scale, -scale, scale,
            scale, scale, scale,
            -scale, scale, scale,
            // left
            -scale, -scale, scale,
            -scale, scale, scale,
            -scale, scale, -scale,
            -scale, -scale, -scale,
            // right
            scale, -scale, scale,
            scale, -scale, -scale,
            scale, scale, -scale,
            scale, scale, scale,
        ]);
        let colors = new Float32Array([
            // top - red
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            // bottom - green
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            // front - blue
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            // back - yellow
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            // left - cyan
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            // right - magenta
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
        ]);
        let indices = new Uint16Array([
            // top
            0, 1, 2, 0, 2, 3,
            // bottom
            4, 5, 6, 4, 6, 7,
            // front
            8, 9, 10, 8, 10, 11,
            // back
            12, 13, 14, 12, 14, 15,
            // left
            16, 17, 18, 16, 18, 19,
            // right
            20, 21, 22, 20, 22, 23,
        ]);

        return new MeshData(positions, colors, indices);
    }
}