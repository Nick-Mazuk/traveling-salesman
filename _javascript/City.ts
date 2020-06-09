export class City {
    xPos: number;
    yPos: number;
    #color = '#dbdbdb'
    static radius = 10;

    constructor (xPos: number, yPos: number) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, City.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.#color;
        ctx.fill();
    }

    pointIsInCity(x: number, y: number): boolean {
        return this.distanceFromPoint(x, y) < City.radius;
    }

    distanceFromPoint(x: number, y: number): number {
        return Math.sqrt((x - this.xPos) ** 2 + (y - this.yPos) ** 2);
    }

    distanceFromCity(city: City): number {
        return Math.sqrt((city.xPos - this.xPos) ** 2 + (city.yPos - this.yPos) ** 2);
    }

    move(xPos: number, yPos: number) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
}