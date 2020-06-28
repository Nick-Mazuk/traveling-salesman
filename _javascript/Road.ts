import { City } from './City';

export class Road {
    cityA: City;
    cityB: City;
    #color = '#757575'
    #realityColor = '#FCCE00'
    static width = 3;

    constructor (cityA: City, cityB: City) {
        this.cityA = cityA;
        this.cityB = cityB;
    }

    draw(ctx: CanvasRenderingContext2D, realityMode: boolean) {
        ctx.beginPath();
        ctx.moveTo(this.cityA.xPos, this.cityA.yPos);
        ctx.lineTo(this.cityB.xPos, this.cityB.yPos);
        ctx.strokeStyle = this.#color;
        if (realityMode) ctx.strokeStyle = this.#realityColor;
        ctx.lineWidth = Road.width;
        ctx.stroke();
    }

    length(realityMode: boolean): number {
        return this.cityA.distanceFromCity(this.cityB, realityMode);
    }
}