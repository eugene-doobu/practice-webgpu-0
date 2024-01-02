import Renderer from "./engine/renderer";
import GeometryGenerator from "./objects/geometryGenerator";
import {canvasSize} from "./setting";
import Camera from "./engine/camera";
import InputManager from "./engine/inputManager";

const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
canvas.width = canvas.height = canvasSize;

const renderer = new Renderer(canvas);
renderer.Start().then(r => {
    const geometryGenerator = new GeometryGenerator();
    Camera.getInstance().initialize();
    InputManager.getInstance().initialize(canvas);
    renderer.AddMesh(geometryGenerator.makeBox(0.7));
    renderer.render();
});