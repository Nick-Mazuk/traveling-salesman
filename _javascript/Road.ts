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

    draw(ctx: CanvasRenderingContext2D, cityGrid: boolean, blockXSize?: number) {
        if (cityGrid) {
            ctx.beginPath();
            // start position
            ctx.moveTo(this.cityA.anchorX, this.cityA.anchorY);

            if (this.cityA.onSameHorizontalRoad(this.cityB)) {
                ctx.lineTo(this.cityB.anchorX, this.cityB.anchorY);
            } else if (this.cityA.blockColumn == this.cityB.blockColumn) {
                if (this.cityA.blockColumnPosition > 0 && this.cityB.blockColumnPosition > 0) {
                    const xDiff = 3 - this.cityA.blockColumnPosition;
                    ctx.lineTo(this.cityA.anchorX + xDiff * blockXSize, this.cityA.anchorY);
                    ctx.lineTo(this.cityA.anchorX + xDiff * blockXSize, this.cityB.anchorY);
                } else {
                    const xDiff = this.cityA.blockColumnPosition + 1;
                    ctx.lineTo(this.cityA.anchorX - xDiff * blockXSize, this.cityA.anchorY);
                    ctx.lineTo(this.cityA.anchorX - xDiff * blockXSize, this.cityB.anchorY);
                }
                ctx.lineTo(this.cityB.anchorX, this.cityB.anchorY);
            } else {
                if (this.cityA.anchorX < this.cityB.anchorX) {
                    const xDiff = 3 - this.cityA.blockColumnPosition;
                    ctx.lineTo(this.cityA.anchorX + xDiff * blockXSize, this.cityA.anchorY);
                    ctx.lineTo(this.cityA.anchorX + xDiff * blockXSize, this.cityB.anchorY);
                } else {
                    const xDiff = this.cityA.blockColumnPosition + 1;
                    ctx.lineTo(this.cityA.anchorX - xDiff * blockXSize, this.cityA.anchorY);
                    ctx.lineTo(this.cityA.anchorX - xDiff * blockXSize, this.cityB.anchorY);
                }
                ctx.lineTo(this.cityB.anchorX, this.cityB.anchorY);
            }
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