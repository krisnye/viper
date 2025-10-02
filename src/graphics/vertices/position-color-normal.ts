import { Vec3, Vec4 } from "@adobe/data/math";
import { FromSchema, Schema } from "@adobe/data/schema";

export const positionColorNormalVertexSchema = {
    type: "object",
    properties: {
        position: Vec3.schema,
        color: Vec4.schema,
        normal: Vec3.schema,
    },
    required: ["position", "color", "normal"],
    additionalProperties: false,
} as const satisfies Schema;

export type PositionColorNormalVertex = FromSchema<typeof positionColorNormalVertexSchema>;
