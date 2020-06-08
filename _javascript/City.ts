export class City {
    xPos: number;
    yPos: number;
    static radius = 10;
    static fillColor = '#dbdbdb'

    constructor (xPos: number, yPos: number) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, City.radius, 0, Math.PI * 2);
        ctx.fillStyle = City.fillColor;
        ctx.fill();
    }

    pointIsInCity(x: number, y: number) {
        return this.distanceFromPoint(x, y) < City.radius;
    }

    distanceFromPoint(x: number, y: number) {
        return Math.sqrt((x - this.xPos) ** 2 + (y - this.yPos) ** 2);
    }
}