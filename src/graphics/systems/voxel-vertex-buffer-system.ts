import { SystemFactory } from "systems/system-factory.js";
import { GraphicsStore } from "../database/graphics-store.js";
import { rgbaVolumeToVertexData } from "../functions/rgba-volume-to-vertex-data.js";
import { GraphicsService } from "graphics/graphics-service.js";
import { copyToGPUBuffer } from "@adobe/data/typed-buffer";

/**
 * System that manages voxel vertex buffers for VoxelModel entities.
 * 
 * Runs every frame to:
 * 1. Check all VoxelModels
 * 2. Validate if vertex buffer exists and is up-to-date
 * 3. Regenerate buffer if voxelColor volume has changed
 * 4. Clean up old buffers before creating new ones
 */
export const voxelVertexBufferSystem : SystemFactory<GraphicsService> = (service) => {
    // Get all VoxelModel tables - following the pattern from other systems
    const { store } = service;

    return [{
        name: "voxelVertexBufferSystem",
        phase: "update",
        run: () => {
            const voxelTables = store.queryArchetypes(store.archetypes.VoxelModel.components);
            for (const table of voxelTables) {
                const entityIds = table.columns.id.getTypedArray();
                for (let i = 0; i < table.rowCount; i++) {
                    const entityId = entityIds[i];
                    const voxelColor = table.columns.voxelColor.get(i);
                    const existingComputedBuffer = store.get(entityId, "voxelVertexBuffer");
                    const needsUpdate = existingComputedBuffer?.source !== voxelColor;
                    if (needsUpdate) {
                        existingComputedBuffer?.buffer?.destroy()
                        updateVoxelVertexBuffer(store, entityId, voxelColor);
                    }
                }
            }
        }
    }]
}

/**
 * Update the voxel vertex buffer for an entity.
 * Creates a new WebGPU buffer from the voxel color volume data.
 */
function updateVoxelVertexBuffer(
    store: GraphicsStore, 
    entityId: number, 
    voxelColor: any
): void {
    const device = store.resources.device;
    
    if (!device) {
        return;
    }
    
    // Convert voxel volume to vertex data
    const vertexData = rgbaVolumeToVertexData(voxelColor);
    
    // Check if we have an existing buffer to reuse, otherwise create a new placeholder
    const existingBuffer = store.get(entityId, "voxelVertexBuffer")?.buffer;
    let gpuBuffer = existingBuffer;
    
    // If no existing buffer, create a new one with proper usage flags
    if (!gpuBuffer) {
        const dataArray = vertexData.getTypedArray();
        gpuBuffer = device.createBuffer({
            size: dataArray.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        });
    }
    
    // Use the efficient copyToGPUBuffer utility
    const finalBuffer = copyToGPUBuffer(vertexData, device, gpuBuffer);
    
    // Store the computed buffer (includes buffer + source for change tracking)
    store.update(entityId, { voxelVertexBuffer: {
        buffer: finalBuffer,
        source: voxelColor
    } });
    
    console.log(`Created vertex buffer for entity ${entityId}: ${finalBuffer.size} bytes`);
}
