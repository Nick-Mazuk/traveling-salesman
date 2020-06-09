import { City } from './City';

export class Road {
    cityA: City;
    cityB: City;
    #width = 3;
    #color = '#777777'

    constructor (cityA: City, cityB: City) {
        this.cityA = cityA;
        this.cityB = cityB;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.cityA.xPos, this.cityA.yPos);
        ctx.lineTo(this.cityB.xPos, this.cityB.yPos);
        ctx.strokeStyle = this.#color;
        ctx.lineWidth = this.#width;
        ctx.stroke();
    }

    length(): number {
        return this.cityA.distanceFromCity(this.cityB);
    }
}