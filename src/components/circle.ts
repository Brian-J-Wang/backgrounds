import { LitElement, html, type PropertyValues, svg } from "lit";
import { randomRange } from "../utilities/random.js";

export type circleConfig = {
    posX: {
        min: number,
        max: number
    },
    posY: {
        min: number,
        max: number,
    }
    vel: {
        min: number,
        max: number
    },
    radius: {
        min: number,
        max: number
    },
    color: string
}

export class Circle {
    element: SVGCircleElement
    radius: number = 10;
    posX: number = 0;
    posY: number = 0;
    velX: number = 0;
    velY: number = 0;
    opacity: number = 0;
    color: string = "#292929";

    constructor(config: circleConfig) {
        this.posX = randomRange(config.posX.min, config.posX.max);
        this.posY = randomRange(config.posY.min, config.posY.max);

        const theta = randomRange(0, 2 * 3.14159);
        const vel = randomRange(config.vel.min, config.vel.max);
        this.velX = Math.cos(theta) * vel;
        this.velY = Math.sin(theta) * vel;

        this.color = config.color


        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circle.setAttribute("fill", "#292929");
        circle.setAttribute("opacity", `${this.opacity}%`);
        circle.setAttribute("cx", this.posX.toString());
        circle.setAttribute("cy", this.posY.toString());
        circle.setAttribute("r" , randomRange(config.radius.min, config.radius.max).toString());
        circle.setAttribute("fill", this.color);
        circle.setAttribute("class", "circle")

        this.element = circle;
    }

    step(dt: number) {
        this.posX += this.velX / 60;
        this.posY += this.velY / 60;
        
        if (this.opacity != 50) {
            this.opacity += 0.5;
            this.element.setAttribute("opacity", `${this.opacity}%`);
        }
        
        this.element.setAttribute("cx", this.posX.toString());
        this.element.setAttribute("cy", this.posY.toString());
    }
}
