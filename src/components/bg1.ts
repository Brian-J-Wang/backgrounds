import { LitElement, html, css, type PropertyDeclarations, type CSSResultGroup } from "lit";
import "./circle.js"

export class BG1 extends HTMLElement {
    private root: ShadowRoot;

    static properties: PropertyDeclarations = {
        classNames: { type: String }
    };

    static styles?: CSSResultGroup = css`
        .body {
            display: flex;
            position: relative;
            width: 480px;
            height: 480px;
            background-color: #555ab9;
        }
    `;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        this.root.innerHTML = `
            <div class="body ${this.className}" id="body">
                Hellos
                <slot/>
            </div>
        `;
    }

    connectedCallback() {
        console.log("connected")
        console.log(this.appendChild(document.createElement("bg1-circle")));
    }
}
customElements.define("bg-1", BG1);

