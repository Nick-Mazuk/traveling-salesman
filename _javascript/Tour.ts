import { City } from './City';
import { Road } from './Road';

export class Tour {
    cities: City[];
    roads: Road[];

    constructor (cities: City[] = []) {
        this.cities = [];
        cities.forEach(city => this.cities.push(city));
        this.roads = [];
    }

    length(): number {
        this._createRoads();
        let length = 0;
        this.roads.forEach(road => length += road.length());
        return length;
    }

    _createRoads(): Road[] {
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
        ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        this._createRoads();
        this.roads.forEach(road => road.draw(ctx));
        this.cities.forEach(city => city.draw(ctx));
    }

    positionInCity(xPos, yPos): City[] {
        return this.cities.filter(city => city.pointIsInCity(xPos, yPos));
    }

    randomizeRoute() {
        this.cities = this.cities.sort(() => Math.random() - 0.5);
    }

    getRandomCityIndex(index = 0, temp = this.cities.length): number {
        return (Math.floor(Math.random() * Math.min(this.cities.length, temp)) + index) % this.cities.length;
    }

    getCityByIndex(index: number) {
        return this.cities[index];
    }

    swapCitiesByIndex(i: number, j: number) {
        let tempCity = this.cities[i];
        this.cities[i] = this.cities[j];
        this.cities[j] = tempCity;
    }

    removeCity(removedCity: City) {
        this.cities = this.cities.filter(city => city.xPos != removedCity.xPos && city.yPos != removedCity.yPos);
    }
}