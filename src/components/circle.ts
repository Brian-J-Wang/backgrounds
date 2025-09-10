export class Circle extends HTMLElement {
    private root: ShadowRoot;

    static get observedAttributes() {
        return ["radius", "color"]
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" })
        this.render();
    }

    render() {
        this.root.innerHTML = `This should be a circle`;
    }
}

customElements.define("bg1-circle", Circle)

