import { Road } from './Road';

export class City {
    xPos: number;
    yPos: number;
    canvas: HTMLCanvasElement;
    #color = '#757575';
    selected = false;
    static radius = 10;
    static houseImage = new Image();

    constructor (xPos: number, yPos: number, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.move(xPos, yPos);
    }

    draw(ctx: CanvasRenderingContext2D, realityMode: boolean, blockSize: number): void {
        if (realityMode) {
            const imageYSize = blockSize * .5;
            const imageYOffset = imageYSize / 2;
            const imageXSize = imageYSize * 1.25;
            const imageXOffset = imageXSize / 2;
            if (this.selected) ctx.globalAlpha = 0.5;
            ctx.drawImage(City.houseImage, this.xPos - imageXOffset, this.yPos - imageYOffset, imageXSize, imageYSize);
            if (this.selected) ctx.globalAlpha = 1;
        } else {
            ctx.beginPath();
            ctx.arc(this.xPos, this.yPos, City.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.#color;
            ctx.fill();
        }
    }

    pointIsInCity(x: number, y: number): boolean {
        return this.distanceFromPoint(x, y) < City.radius;
    }

    distanceFromPoint(x: number, y: number): number {
        return Math.sqrt((x - this.xPos) ** 2 + (y - this.yPos) ** 2);
    }

    distanceFromCity(city: City, realityMode: boolean): number {
        if (realityMode)
            return Math.abs(this.xPos - city.xPos) + Math.abs(this.yPos - city.yPos);
        return Math.sqrt((city.xPos - this.xPos) ** 2 + (city.yPos - this.yPos) ** 2);
    }

    move(xPos: number, yPos: number) {
        if (xPos < City.radius) xPos = City.radius;
        if (yPos < City.radius) yPos = City.radius;

        if (xPos > this.canvas.getBoundingClientRect().width - City.radius) xPos = this.canvas.getBoundingClientRect().width - City.radius;
        if (yPos > this.canvas.getBoundingClientRect().height - City.radius) yPos = this.canvas.getBoundingClientRect().height - City.radius;
        this.xPos = xPos;
        this.yPos = yPos;
    }

    static isPointInBlock(coordinates: number[], ctx: CanvasRenderingContext2D, dpr: number): boolean {
        const topPixel = ctx.getImageData(coordinates[0] * dpr, (coordinates[1] + Road.width) * dpr, 1, 1).data;
        if (topPixel[0] == 23 && topPixel[1] == 23 && topPixel[2] == 23)
            return false;
        const bottomPixel = ctx.getImageData(coordinates[0] * dpr, (coordinates[1] - Road.width) * dpr, 1, 1).data;
        if (bottomPixel[0] == 23 && bottomPixel[1] == 23 && bottomPixel[2] == 23)
            return false;
        const leftPixel = ctx.getImageData((coordinates[0] - Road.width) * dpr, coordinates[1] * dpr, 1, 1).data;
        if (leftPixel[0] == 23 && leftPixel[1] == 23 && leftPixel[2] == 23)
            return false;
        const rightPixel = ctx.getImageData((coordinates[0] + Road.width) * dpr, coordinates[1] * dpr, 1, 1).data;
        if (rightPixel[0] == 23 && rightPixel[1] == 23 && rightPixel[2] == 23)
            return false;
        return true;
    }
}