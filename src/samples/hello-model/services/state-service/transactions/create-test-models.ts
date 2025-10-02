import { createAxis } from "graphics/database/index.js";
import { HelloModelStore } from "../hello-model-store.js";
import { createCircleModel } from "graphics/database/transactions/create-circle-model.js";
export const createTestModels = (t: HelloModelStore) => {   
    createAxis(t);
    createCircleModel(t, {
        position: [0, 0, 0],
        color: [1, 0, 0, 1],
        radius: 5
    });
}