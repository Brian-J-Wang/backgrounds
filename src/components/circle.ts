import { LitElement, html, type PropertyValues } from "lit";

export class Circle extends LitElement {
    element: HTMLElement | null = null;

    static get observedAttributes() {
        return ["radius", "color"]
    }

    constructor() {
        super();
        this.render();
    }

    render() {
        return html`
            <circle id="child" fill="black"/>
        `
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.element = this.shadowRoot?.getElementById("child")!;
        this.element.setAttribute("cx", "240");
        this.element.setAttribute("cy", "240");
        this.element.setAttribute("r" , "25");
    }
}

customElements.define("bg1-circle", Circle)

