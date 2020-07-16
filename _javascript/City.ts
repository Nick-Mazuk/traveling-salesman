import { Road } from './Road';

export class City {
    xPos: number;
    yPos: number;
    canvas: HTMLCanvasElement;
    #color = '#757575';
    selected = false;
    anchorX: number;
    anchorY: number;
    blockColumn: number;
    blockColumnPosition: number;
    blockXSize: number;
    blockYSize: number;
    static radius = 10;
    static houseImage = new Image();

    constructor (xPos: number, yPos: number, canvas: HTMLCanvasElement, anchorX?: number, anchorY?: number, blockColumn?: number, blockColumnPosition?: number, blockXSize?: number, blockYSize?: number) {
        this.canvas = canvas;
        this.move(xPos, yPos, anchorX, anchorY, blockColumn, blockColumnPosition, blockXSize, blockYSize);
    }

    draw(ctx: CanvasRenderingContext2D, cityGrid: boolean, blockSize: number): void {
        if (cityGrid) {
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

    distanceFromCity(city: City, cityGrid: boolean): number {
        if (cityGrid) {
            let distance = Math.abs(this.anchorX - city.anchorX) + Math.abs(this.anchorY - city.anchorY);
            const isInSameBlockColumn = this.blockColumn == city.blockColumn;
            const shareSameRoad = this.onSameHorizontalRoad(city);
            if (isInSameBlockColumn && !shareSameRoad) {
                if (this.blockColumnPosition == 1 && city.blockColumnPosition == 1) { // middle and outer
                    distance += this.blockXSize * 4;
                } else {
                    distance += this.blockXSize * 2;
                }
            }
            return distance;
        }
        return Math.sqrt((city.xPos - this.xPos) ** 2 + (city.yPos - this.yPos) ** 2);
    }

    move(xPos: number, yPos: number, anchorX?: number, anchorY?: number, blockColumn?: number, blockColumnPosition?: number, blockXSize?: number, blockYSize?: number) {
        if (xPos < City.radius) xPos = City.radius;
        if (yPos < City.radius) yPos = City.radius;

        if (xPos > this.canvas.getBoundingClientRect().width - City.radius) xPos = this.canvas.getBoundingClientRect().width - City.radius;
        if (yPos > this.canvas.getBoundingClientRect().height - City.radius) yPos = this.canvas.getBoundingClientRect().height - City.radius;
        this.xPos = xPos;
        this.yPos = yPos;
        if (anchorX) this.anchorX = anchorX;
        if (anchorY) this.anchorY = anchorY;
        if (blockColumn != undefined) this.blockColumn = blockColumn;
        if (blockColumnPosition != undefined) this.blockColumnPosition = blockColumnPosition;
        if (blockXSize) this.blockXSize = blockXSize;
        if (blockYSize) this.blockYSize = blockYSize;
    }

    onSameHorizontalRoad(city: City): boolean {
        return Math.abs(this.anchorY - city.anchorY) < 3;
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