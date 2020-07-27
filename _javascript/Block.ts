export class Block {
    xPos: number
    yPos: number
    width: number
    height: number
    #color = '#007A00'

    constructor(xPos: number, yPos: number, width: number, height: number) {
        this.xPos = xPos
        this.yPos = yPos
        this.width = width
        this.height = height
    }

    draw(ctx: CanvasRenderingContext2D, blockXSize: number, blockYSize: number): void {
        let radius = blockXSize / 4
        ctx.beginPath()
        ctx.moveTo(this.xPos * blockXSize + radius, this.yPos * blockYSize)
        ctx.lineTo((this.xPos + this.width) * blockXSize - radius, this.yPos * blockYSize)
        ctx.quadraticCurveTo(
            (this.xPos + this.width) * blockXSize,
            this.yPos * blockYSize,
            (this.xPos + this.width) * blockXSize,
            this.yPos * blockYSize + radius
        )
        ctx.lineTo((this.xPos + this.width) * blockXSize, (this.yPos + this.height) * blockYSize - radius)
        ctx.quadraticCurveTo(
            (this.xPos + this.width) * blockXSize,
            (this.yPos + this.height) * blockYSize,
            (this.xPos + this.width) * blockXSize - radius,
            (this.yPos + this.height) * blockYSize
        )
        ctx.lineTo(this.xPos * blockXSize + radius, (this.yPos + this.height) * blockYSize)
        ctx.quadraticCurveTo(
            this.xPos * blockXSize,
            (this.yPos + this.height) * blockYSize,
            this.xPos * blockXSize,
            (this.yPos + this.height) * blockYSize - radius
        )
        ctx.lineTo(this.xPos * blockXSize, this.yPos * blockYSize + radius)
        ctx.quadraticCurveTo(
            this.xPos * blockXSize,
            this.yPos * blockYSize,
            this.xPos * blockXSize + radius,
            this.yPos * blockYSize
        )
        ctx.fillStyle = this.#color
        ctx.fill()
    }
}
