import { Vec3 } from "@adobe/data/math";
import { GraphicsStore } from "../graphics-store.js";
import { Rgba, Volume } from "data/index.js";
import { Entity } from "@adobe/data/ecs";

export function createVoxelModel(t: GraphicsStore,
    props: {
        id?: Entity,
        position: Vec3,
        voxelColor: Volume<Rgba>,
    }
) {
    if (props.id) {
        t.update(props.id, props);
        return props.id;
    } else {
        return t.archetypes.VoxelModel.insert(props as never);
    }
}