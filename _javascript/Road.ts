import { City } from './City';

export class Road {
    cityA: City;
    cityB: City;
    static width = 3;
    static color = '#777777'

    constructor (cityA: City, cityB: City) {
        this.cityA = cityA;
        this.cityB = cityB;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.cityA.xPos, this.cityA.yPos);
        ctx.lineTo(this.cityB.xPos, this.cityB.yPos);
        ctx.strokeStyle = Road.color;
        ctx.lineWidth = Road.width;
        ctx.stroke();
    }

    length(): number {
        return this.cityA.distanceFromCity(this.cityB);
    }
}