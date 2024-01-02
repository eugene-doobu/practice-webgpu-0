import Renderer from "./engine/renderer";

const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
canvas.width = canvas.height = 800;

const renderer = new Renderer(canvas);
renderer.Start();