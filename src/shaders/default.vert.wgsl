struct Camera {
  projection : mat4x4<f32>,
  view : mat4x4<f32>
};

@group(0) @binding(0) var<uniform> camera : Camera;
@group(0) @binding(1) var<uniform> model : mat4x4<f32>;

struct VSOut {
    @builtin(position) Position: vec4f,
    @location(0) color: vec3f,
 };

@vertex
fn main(@location(0) inPos: vec3f,
        @location(1) inColor: vec3f) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = camera.projection * camera.view * model * vec4f(inPos, 1);
    vsOut.color = inColor;
    return vsOut;
}