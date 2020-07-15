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

    draw(ctx: CanvasRenderingContext2D, cityGrid: boolean) {
        if (cityGrid) {
            ctx.beginPath();
            ctx.moveTo(this.cityA.anchorX, this.cityA.anchorY);
            ctx.lineTo(this.cityA.anchorX, this.cityB.anchorY);
            ctx.lineTo(this.cityB.anchorX, this.cityB.anchorY);
            ctx.strokeStyle = this.#color;
            if (cityGrid) ctx.strokeStyle = this.#realityColor;
            ctx.lineWidth = Road.width;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.cityA.xPos, this.cityA.yPos);
            ctx.lineTo(this.cityB.xPos, this.cityB.yPos);
            ctx.strokeStyle = this.#color;
            if (cityGrid) ctx.strokeStyle = this.#realityColor;
            ctx.lineWidth = Road.width;
            ctx.stroke();
        }
    }

    length(cityGrid: boolean): number {
        return this.cityA.distanceFromCity(this.cityB, cityGrid);
    }
}