// Voxel rendering shader
// Based on the particle rendering approach but adapted for voxels

struct SceneUniforms {
    viewProjectionMatrix: mat4x4<f32>,
    lightDirection: vec3<f32>,
    ambientStrength: f32,
    lightColor: vec3<f32>,
}


// Vertex data for a cube (12 triangles, 36 vertices)
const CUBE_VERTICES: array<vec3<f32>, 36> = array<vec3<f32>, 36>(
    // Front face
    vec3<f32>(-0.5, -0.5,  0.5), vec3<f32>( 0.5, -0.5,  0.5), vec3<f32>( 0.5,  0.5,  0.5),
    vec3<f32>(-0.5, -0.5,  0.5), vec3<f32>( 0.5,  0.5,  0.5), vec3<f32>(-0.5,  0.5,  0.5),
    // Back face
    vec3<f32>( 0.5, -0.5, -0.5), vec3<f32>(-0.5, -0.5, -0.5), vec3<f32>(-0.5,  0.5, -0.5),
    vec3<f32>( 0.5, -0.5, -0.5), vec3<f32>(-0.5,  0.5, -0.5), vec3<f32>( 0.5,  0.5, -0.5),
    // Left face
    vec3<f32>(-0.5, -0.5, -0.5), vec3<f32>(-0.5, -0.5,  0.5), vec3<f32>(-0.5,  0.5,  0.5),
    vec3<f32>(-0.5, -0.5, -0.5), vec3<f32>(-0.5,  0.5,  0.5), vec3<f32>(-0.5,  0.5, -0.5),
    // Right face
    vec3<f32>( 0.5, -0.5,  0.5), vec3<f32>( 0.5, -0.5, -0.5), vec3<f32>( 0.5,  0.5, -0.5),
    vec3<f32>( 0.5, -0.5,  0.5), vec3<f32>( 0.5,  0.5, -0.5), vec3<f32>( 0.5,  0.5,  0.5),
    // Top face
    vec3<f32>(-0.5,  0.5,  0.5), vec3<f32>( 0.5,  0.5,  0.5), vec3<f32>( 0.5,  0.5, -0.5),
    vec3<f32>(-0.5,  0.5,  0.5), vec3<f32>( 0.5,  0.5, -0.5), vec3<f32>(-0.5,  0.5, -0.5),
    // Bottom face
    vec3<f32>(-0.5, -0.5, -0.5), vec3<f32>( 0.5, -0.5, -0.5), vec3<f32>( 0.5, -0.5,  0.5),
    vec3<f32>(-0.5, -0.5, -0.5), vec3<f32>( 0.5, -0.5,  0.5), vec3<f32>(-0.5, -0.5,  0.5),
);

@binding(0) @group(0) var<uniform> sceneUniforms: SceneUniforms;
@binding(1) @group(0) var<storage, read> voxelPositions: array<vec3<f32>>;
@binding(2) @group(0) var<storage, read> voxelColors: array<vec4<f32>>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) worldPosition: vec3<f32>,
    @location(2) normal: vec3<f32>,
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> VertexOutput {
    let voxelPosition = voxelPositions[instanceIndex];
    let voxelColor = voxelColors[instanceIndex];
    
    let vertex = CUBE_VERTICES[vertexIndex];
    let worldPosition = voxelPosition + vertex; // Unit cube vertices
    let clipPosition = sceneUniforms.viewProjectionMatrix * vec4<f32>(worldPosition, 1.0);
    
    // Calculate normal (simplified - using the vertex as normal for now)
    let normal = normalize(vertex);
    
    return VertexOutput(
        clipPosition,
        voxelColor,
        worldPosition,
        normal
    );
}

struct FragmentOutput {
    @location(0) color: vec4<f32>,
}

@fragment
fn fragmentMain(input: VertexOutput) -> FragmentOutput {
    // Simple lighting calculation
    let lightDir = normalize(sceneUniforms.lightDirection);
    let normal = normalize(input.normal);
    let lightIntensity = max(dot(normal, -lightDir), 0.0);
    
    let ambient = sceneUniforms.ambientStrength;
    let diffuse = lightIntensity;
    let lighting = ambient + diffuse;
    
    let finalColor = input.color * lighting * vec4<f32>(sceneUniforms.lightColor, 1.0);
    
    return FragmentOutput(finalColor);
}
