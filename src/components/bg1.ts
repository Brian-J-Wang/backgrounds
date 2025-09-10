import { LitElement, html, css, type PropertyDeclarations, type CSSResultGroup, type PropertyValues } from "lit";
import "./circle.js"
import { randomRange } from "../utilities/random.js";

type circleData = { 
    element: SVGCircleElement, 
    posX: number,
    posY: number,
    delX: number, 
    delY: number,
    radius: number;
    opacity: number;
}

export class BG1 extends LitElement {
    svgContent: HTMLElement | null = null;
    circles: circleData[] = [];
    intervalID: number = 0;
    numCircles: number = 10;
    validColors: string[] = [];

    static properties: PropertyDeclarations = {
        className: { type: String },
    };

    static styles?: CSSResultGroup = css`
        .body {
            display: flex;
            position: relative;
            width: 480px;
            height: 480px;
        }

        .content {
            position: absolute;
            z-index: 2;
        }

        .svg {
            position: absolute;
            z-index: 1;
        }

        .circle {
            backdrop-filter: blur(16px);
        }
    `;

    attributeChangedCallback(name: string, _old: string, _new: string): void {
        if (_old === _new) return;
        if (name === "className") this.className = _new;
    }

    constructor() {
        super();
        this.className = "";
        this.numCircles = parseInt(this.getAttribute("instances") ?? "10");
        this.validColors = this.getAttributeValue("palette", "")?.split(" ").filter((candidate) => {
            return candidate.match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
        })

        console.log(this.validColors);
    }

    buildCSS() {
        return
    }

    getAttributeValue(name: string, fallback: string) {
        return this.getAttribute(name) ?? fallback
    }

    protected render(): unknown {
        return html`
            <div class="body ${this.className}" id="body">
                <div class="content">
                    <slot></slot>
                </div>
                <svg class="svg" id="svg-content" width="100%" height="100%" xmls="http://www.w3.org/2000/svg" style="background-color: ${this.getAttributeValue('background', '#292929')}"/></svg>
            </div>`;
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.svgContent = this.shadowRoot!.getElementById("svg-content")!;
        for (let i = 0; i < this.numCircles; i++) {
            const circle = this.spawnCircle();
            this.svgContent.appendChild(circle.element);
            this.circles.push(circle);
        }

        this.intervalID = setInterval(() => {
            const bounds = this.svgContent!.getBoundingClientRect();
            this.circles = this.circles.filter((circle) => {
                this.updateCircle(circle);

                if (circle.posX + circle.radius < 0 ||
                    circle.posX - circle.radius > bounds.width ||
                    circle.posY + circle.radius < 0 ||
                    circle.posY - circle.radius > bounds.height
                ) {
                    this.svgContent?.removeChild(circle.element);
                    return false;
                }

                return true;
            });

            while( this.circles.length < this.numCircles) {
                const circle = this.spawnCircle();
                this.svgContent?.appendChild(circle.element);
                this.circles.push(circle);
            }
        }, 40.667);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        clearInterval(this.intervalID);
    }   

    updateCircle(data: circleData) {
        data.posX += data.delX / 60;
        data.posY += data.delY / 60;
        
        if (data.opacity != 50) {
            data.opacity += 0.5;
            data.element.setAttribute("opacity", `${data.opacity}%`);
        }

        data.element.setAttribute("cx", data.posX.toString());
        data.element.setAttribute("cy", data.posY.toString());
    }

    spawnCircle() {
        const rect = this.svgContent!.getBoundingClientRect();
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const circleData: circleData = {
            element: circle,
            posX: randomRange(0, rect.width),
            posY: randomRange(0, rect.height),
            delX: (Math.random() - 0.5) * 20,
            delY: (Math.random() - 0.5) * 20,
            radius: randomRange(20, 80),
            opacity: 0
        }

        circle.setAttribute("fill", "#292929");
        circle.setAttribute("opacity", `${circleData.opacity}%`);
        circle.setAttribute("cx", circleData.posX.toString());
        circle.setAttribute("cy", circleData.posY.toString());
        circle.setAttribute("r" , circleData.radius.toString());
        circle.setAttribute("fill", this.validColors[Math.floor(Math.random() * this.validColors.length)] ?? "#292929");
        circle.setAttribute("class", "circle")

        return circleData;
    }
}
customElements.define("bg-1", BG1);

