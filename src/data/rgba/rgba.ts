import { Vec4 } from "@adobe/data/math";
import { U32Schema, FromSchema } from "@adobe/data/schema";

export const schema = U32Schema
export type Type = FromSchema<typeof schema>;

export const toVec4 = (rgba: Type): Vec4 => {
    return [
        (rgba >>> 0) & 0xFF / 255,
        (rgba >>> 8) & 0xFF / 255,
        (rgba >>> 16) & 0xFF / 255,
        (rgba >>> 24) & 0xFF / 255
    ]
}