import { Camera } from "graphics/camera/camera.js";
import { GraphicsStore } from "../graphics-store.js";
import { Vec4 } from "@adobe/data/math";

export const insertViewport = (t: GraphicsStore, viewport: { context: GPUCanvasContext, camera: Camera, depthTexture: GPUTexture, color: Vec4 }) => {
    return t.archetypes.Viewport.insert(viewport);
};
