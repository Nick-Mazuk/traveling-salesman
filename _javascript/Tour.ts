import { City } from './City';
import { Road } from './Road';

export class Tour {
    cities: City[];
    roads: Road[];

    constructor (cities: City[]) {
        this.cities = cities;
    }

    length(): number {
        let length = 0;
        this.roads.forEach(road => length += road.length());
        return length;
    }

    createRoads(): Road[] {
        this.roads = [];
        if (this.cities.length > 2) {
            for (let i = 0; i < this.cities.length - 1; i++) {
                this.roads.push(new Road(this.cities[i], this.cities[i + 1]));
            }
            this.roads.push(new Road(this.cities[this.cities.length - 1], this.cities[0]));
        }
        return this.roads;
    }

    addCity(city: City) {
        this.cities.push(city);
    }

    draw(ctx: CanvasRenderingContext2D) {
        console.time('Draw')
        ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        this.roads.forEach(road => road.draw(ctx));
        this.cities.forEach(city => city.draw(ctx));
        console.timeEnd('Draw');
    }

    positionInCity(xPos, yPos): City[] {
        return this.cities.filter(city => city.pointIsInCity(xPos, yPos));
    }
}