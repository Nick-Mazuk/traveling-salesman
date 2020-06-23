import { City } from './City';
import { Road } from './Road';

export class Tour {
    cities: City[];
    roads: Road[];
    totalLength: number;

    constructor (cities: City[] = []) {
        this.cities = cities.slice();
        this.roads = [];
    }

    length(): number {
        let length = 0;
        for (let i = 0; i < this.cities.length - 1; i++) {
            length += this.cities[i].distanceFromCity(this.cities[i + 1])
        }
        length += this.cities[0].distanceFromCity(this.cities[this.cities.length - 1])
        this.totalLength = length;
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

    addCity(city: City): void {
        this.cities.push(city);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        this._createRoads();
        this.roads.forEach(road => road.draw(ctx));
        this.cities.forEach(city => city.draw(ctx));
    }

    positionInCity(xPos, yPos): City[] {
        return this.cities.filter(city => city.pointIsInCity(xPos, yPos));
    }

    randomizeRoute(): void {
        this.cities = this.cities.sort(() => Math.random() - 0.5);
    }

    getRandomCityIndex(index = 0, temp = this.cities.length): number {
        return (Math.ceil(Math.random() * Math.min(this.cities.length - 1, temp)) + index) % this.cities.length;
    }

    getCityByIndex(index: number): City {
        return this.cities[index];
    }

    getLengthChangeFromSwappingCities(i: number, j: number): number {
        let lengthChange = 0;
        let cityA = this.cities[i];
        let cityB = this.cities[j];
        let previousCity = this.cities[i == 0 ? this.cities.length - 1 : i - 1];
        let nextCity = this.cities[(j + 1) % this.cities.length];

        lengthChange += cityA.distanceFromCity(previousCity)
        lengthChange += cityB.distanceFromCity(nextCity)

        lengthChange -= cityA.distanceFromCity(nextCity)
        lengthChange -= cityB.distanceFromCity(previousCity)
        if (lengthChange < 0.001 && lengthChange > -0.001) lengthChange = 0;
        return lengthChange;
    }

    swapCitiesByIndex(i: number, j: number): void {
        if (i == j) return;
        if (i > j) {
            let temp = i;
            i = j;
            j = temp;
        }
        let tempCities = this.cities.slice();
        this.cities = [...tempCities.slice(0, i)];
        this.cities.push(...tempCities.slice(i, j + 1).reverse());
        this.cities.push(...tempCities.slice(j + 1));
    }

    removeCity(removedCity: City) {
        this.cities = this.cities.filter(city => city.xPos != removedCity.xPos && city.yPos != removedCity.yPos);
    }

    findNeighbors(city: City): City[] {
        if (this.cities.includes(city) == false) throw new Error('City is not in tour, cannot find neighbors');
        if (this.cities.length < 3) throw new Error('Tour does not have enough cities to find neighbors');

        let neighbors = [];
        let cityIndex = this.cities.indexOf(city);
        switch (cityIndex) {
            case 0:
                neighbors.push(this.cities[this.cities.length - 1]);
                neighbors.push(this.cities[1]);
                break;
            case this.cities.length - 1:
                neighbors.push(this.cities[cityIndex - 1]);
                neighbors.push(this.cities[0]);
                break;
            default:
                neighbors.push(this.cities[cityIndex - 1]);
                neighbors.push(this.cities[cityIndex + 1]);
        }
        return neighbors;
    }

    cityNeighborsAreClosest(city: City): boolean {
        const neighbors = this.findNeighbors(city);
        const furthestNeighbor = Math.max(...neighbors.map(neighbor => city.distanceFromCity(neighbor)));
        for (let i = 0; i < this.cities.length; i++) {
            if (neighbors.includes(this.cities[i]) || this.cities[i] == city) continue;
            const distance = city.distanceFromCity(this.cities[i]);
            // console.log({ furthestNeighbor, distance })
            if (distance <= furthestNeighbor) return false;
        }
        return true;
    }

    clear(): void {
        this.cities = [];
        this.roads = [];
        this.totalLength = undefined;
    }

    static getPermutations(tour: Tour): City[][] {
        // permute function from https://stackoverflow.com/questions/9960908/permutations-in-javascript
        const permute = (inputArr: City[]): City[][] => {
            let result = [];

            const order = (arr: City[], m: City[] = []): void => {
                if (arr.length === 0) {
                    result.push(m)
                } else {
                    for (let i = 0; i < arr.length; i++) {
                        let curr = arr.slice();
                        let next = curr.splice(i, 1);
                        order(curr.slice(), m.concat(next))
                    }
                }
            }

            order(inputArr)

            return result;
        }
        return permute(tour.cities);
    }
}