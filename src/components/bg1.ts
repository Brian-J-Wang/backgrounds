import { LitElement, html, css, type PropertyDeclarations, type CSSResultGroup, type PropertyValues } from "lit";
import "./circle.js"
import { randomRange } from "../utilities/random.js";
import { Circle, type circleConfig } from "./circle.js";

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
    circles: Circle[] = [];
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

        .background {
            display: flex;
            width: 100%;
            height: 100%
            position: absolute;
            z-index: 1;
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
        this.validColors = this.tryGetAttribute("palette", "")?.split(" ").filter((candidate) => {
            return candidate.match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
        });
    }

    buildCSS() {
        return
    }

    tryGetAttribute(name: string, fallback: string) {
        return this.getAttribute(name) ?? fallback
    }

    
    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.svgContent = this.shadowRoot!.getElementById("svg-content");

        for (let i = 0; i < this.numCircles; i++) {
            const circle = this.spawnCircle();
            this.svgContent!.appendChild(circle.element);
            this.circles.push(circle);
        }
        
        this.intervalID = setInterval(() => {
            if (!this.svgContent) return;

            const bounds = this.svgContent.getBoundingClientRect();
            this.circles = this.circles.filter((circle) => {
                circle.step(40.667);
                
                if (circle.posX + circle.radius < 0 ||
                    circle.posX - circle.radius > bounds.width ||
                    circle.posY + circle.radius < 0 ||
                    circle.posY - circle.radius > bounds.height
                ) {
                    this.svgContent!.removeChild(circle.element);
                    return false;
                }
                
                return true;
            });
            
            while( this.circles.length < this.numCircles) {
                const circle = this.spawnCircle();
                this.svgContent.appendChild(circle.element);
                this.circles.push(circle);
            }
        }, 40.667);
    }
    
    disconnectedCallback(): void {
        super.disconnectedCallback();
        
        clearInterval(this.intervalID);
    }   
    
    updateCircle(data: circleData) {
        
    }
    
    spawnCircle() {
        const rect = this.getBoundingClientRect();
        
        const config: circleConfig = {
            posX: {
                min: 0,
                max: rect.width
            },
            posY: {
                min: 0,
                max: rect.height
            },
            vel: {
                min: 10,
                max: 30
            },
            radius: {
                min: 10,
                max: 30
            },
            color: this.validColors[Math.floor(Math.random() * this.validColors.length)] ?? "#292929"
        }

        return new Circle(config);
    }
    
    protected render(): unknown {
        return html`
            <div class="body ${this.className}" id="body" style="background-color: ${this.tryGetAttribute("background", "#292929")}">
                <div class="content">
                    <slot></slot>
                </div>
                <svg class="svg" id="svg-content" width="100%" height="100%" xmls="http://www.w3.org/2000/svg" style="background-color: ${this.tryGetAttribute('background', '#292929')}; "/>
                    <filter>
                        
                    </filter>
                </svg>
            </div>`;
    }
}
customElements.define("bg-1", BG1);

