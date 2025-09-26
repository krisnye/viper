import { customElement } from "lit/decorators.js";
import { html, css, CSSResult, TemplateResult } from "lit";
import { HelloModelBaseElement } from "./hello-model-base-element.js";
import { createHelloModelMainService } from "./services/main-service/hello-model-main-service.js";
import "../../graphics/elements/graphics-viewport.js";

export const tagName = "hello-model-application";

declare global {
    interface HTMLElementTagNameMap {
        [tagName]: HelloModelGame;
    }
}

@customElement(tagName)
export class HelloModelGame extends HelloModelBaseElement {
    constructor() {
        super();
        this.service = createHelloModelMainService();
    }

    static override styles: CSSResult = css`
    `;

    override render(): TemplateResult {
        return html`
            <div class="game-container">
                <div>
                    Hello Model!
                </div>
                <graphics-viewport style="border: 1px solid red;" .initialCamera=${{ position: [0, 10, 10], target: [0, 0, 0] }} .clearColor=${[1.0, 0.0, 0.0, 0.5] as const}>
                </graphics-viewport>
                <graphics-viewport style="border: 1px solid blue;" .initialCamera=${{ position: [0, 0, 10], target: [0, 0, 0] }} .clearColor=${[0.0, 0.0, 1.0, 0.5] as const}>
                </graphics-viewport>
            </div>
        `;
    }
}
