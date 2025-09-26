import { GraphicsService } from "graphics/graphics-service.js";
import { SystemFactory } from "systems/system-factory.js";

export const voxelRenderingSystem: SystemFactory<GraphicsService> = (service) => {
    return [{
        name: "voxelRenderingSystem",
        phase: "render",
        run: () => {
            console.log("voxelRenderingSystem.run");
        },
    }];
}