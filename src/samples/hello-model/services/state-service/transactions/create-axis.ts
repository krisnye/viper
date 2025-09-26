import { GraphicsStore } from "graphics/database/graphics-store.js";


export function createAxis(t: GraphicsStore) {
    // Black particle at center
    t.archetypes.Particle.insert({
        position: [0, 0, 0],
        color: [0, 0, 0, 1],
    });
    
    // Red particle on X-axis at distance 1
    t.archetypes.Particle.insert({
        position: [1, 0, 0],
        color: [1, 0, 0, 1],
    });
    
    // Green particle on Y-axis at distance 1
    t.archetypes.Particle.insert({
        position: [0, 1, 0],
        color: [0, 1, 0, 1],
    });
    
    // Blue particle on Z-axis at distance 1
    t.archetypes.Particle.insert({
        position: [0, 0, 1],
        color: [0, 0, 1, 1],
    });
}