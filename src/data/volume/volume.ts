import { Vec3 } from "@adobe/data/math"
import { TypedBuffer } from "@adobe/data/typed-buffer"

export type Volume<T> = {
    size: Vec3,
    data: TypedBuffer<T>
}

/**
 * Get the index of a voxel in a volume.
 * @param volume 
 * @param x 
 * @param y 
 * @param z 
 * @returns The index of the voxel.
 */
export const index = <T>(volume: Volume<T>, x: number, y: number, z: number): number => {
    const [width, height] = volume.size;
    return x + width * (y + z * height);
}
