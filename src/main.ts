import Renderer from "./engine/renderer";
import GeometryGenerator from "./objects/geometryGenerator";

const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
canvas.width = canvas.height = 800;

const renderer = new Renderer(canvas);
renderer.Start().then(r => {
    const geometryGenerator = new GeometryGenerator();
    renderer.AddMesh(geometryGenerator.makeSquare(0.7));
    renderer.render();
});