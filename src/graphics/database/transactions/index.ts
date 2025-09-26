import { setDevice } from "./set-device.js";
import { setUpdateFrame } from "./set-update-frame.js";
import { setRenderFrame } from "./set-render-frame.js";
import { updateCamera } from "./update-camera.js";
import { insertViewport } from "./insert-viewport.js";

export { setDevice, setUpdateFrame, setRenderFrame, updateCamera, insertViewport };

export const graphicsTransactions = {
    setDevice,
    setUpdateFrame,
    setRenderFrame,
    updateCamera,
    insertViewport
};
