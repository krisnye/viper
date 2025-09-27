import { GraphicsService } from "graphics/graphics-service.js";
import { SystemFactory } from "systems/system-factory.js";
import { createStructGPUBuffer } from "graphics/create-struct-gpu-buffer.js";
import { toViewProjection } from "graphics/camera/to-view-projection.js";
import { F32, Mat4x4, Vec3 } from "@adobe/data/math";
import { createStructBuffer, copyToGPUBuffer, TypedBuffer, getStructLayout } from "@adobe/data/typed-buffer";
import { FromSchema } from "@adobe/data/schema";

// Scene uniforms schema
const SceneUniformsSchema = {
    type: 'object',
    properties: {
        viewProjectionMatrix: Mat4x4.schema,
        lightDirection: Vec3.schema,
        ambientStrength: F32.schema,
        lightColor: Vec3.schema,
    },
    required: ["viewProjectionMatrix", "lightDirection", "ambientStrength", "lightColor"],
    additionalProperties: false,
} as const;
type SceneUniforms = FromSchema<typeof SceneUniformsSchema>;

export const sceneUniformsSystem: SystemFactory<GraphicsService> = (service) => {
    const { store } = service;
    
    // Retain the struct buffer and GPU buffer
    let structBuffer: TypedBuffer<SceneUniforms> | null = null;
    let gpuBuffer: GPUBuffer | null = null;
    let structLayout = getStructLayout(SceneUniformsSchema);
    
    return [{
        name: "updateSceneUniforms",
        phase: "pre-render",
        run: () => {
            const { device } = store.resources;
            
            // Check if device is available
            if (!device) return;
            
            // Get the active viewport's camera
            const activeViewportId = store.resources.activeViewport;
            const activeViewport = store.read(activeViewportId, store.archetypes.Viewport);
            if (!activeViewport) return;

            const { camera } = activeViewport;
            
            // Calculate view-projection matrix
            const viewProjection = toViewProjection(camera);
            
            // Create struct buffer if it doesn't exist
            structBuffer ??= createStructBuffer(SceneUniformsSchema, new ArrayBuffer(structLayout.size));

            // Create GPU buffer if it doesn't exist
            gpuBuffer ??= device.createBuffer({
                size: structLayout.size,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            store.resources.sceneUniformsBuffer = gpuBuffer;

            console.log("ambientStrength", store.resources.ambientStrength);
            console.log("lightDirection", store.resources.lightDirection);
            console.log("lightColor", store.resources.lightColor);

            // Update the struct buffer with current values
            structBuffer.set(0, {
                viewProjectionMatrix: viewProjection,
                lightDirection: store.resources.lightDirection,
                ambientStrength: store.resources.ambientStrength,
                lightColor: store.resources.lightColor,
            });

            // Copy to GPU buffer
            copyToGPUBuffer(structBuffer, device, gpuBuffer);
        }
    }];
};
