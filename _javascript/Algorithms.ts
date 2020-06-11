import { Tour } from './Tour';

export class Algorithms {
    static annealing(tour: Tour, canvas?: HTMLCanvasElement, shortVersion?: boolean, maxTemp = 100, coolingRate = 0.001): Tour {
        if (tour.cities.length < 4) return tour;

        function calcTemp(frame: number, maxTime: number, maxTemp: number): number {
            return maxTemp * (1 - frame / maxTime) + 0.0001;
        }

        if (canvas != void 0) {
            maxTemp = (canvas.getBoundingClientRect().width + canvas.getBoundingClientRect().height) / 18;
        }

        let largeMultiplier = shortVersion ? 1.8 : 2.5;
        let maxTime = tour.cities.length * 100 + (tour.cities.length > 10 ? (tour.cities.length - 10) ** largeMultiplier : 0);
        let frame = 0;

        let shortestLength = tour.length();
        let shortest = new Tour(tour.cities);

        let lastTour = shortest;
        let lastLength = shortestLength;

        while (frame < maxTime) {
            let temp = calcTemp(frame, maxTime, maxTemp);
            const tour = new Tour(lastTour.cities);

            // generate random city indexes
            const cityA = tour.getRandomCityIndex();
            let cityB = tour.getRandomCityIndex(cityA, temp);

            while (cityA == cityB) {
                cityB = tour.getRandomCityIndex();
            }

            tour.swapCitiesByIndex(cityA, cityB);
            const currentLength = tour.length();

            if (currentLength < lastLength) {
                lastTour = new Tour(tour.cities);
                lastLength = currentLength;
            } else if (Math.random() <= Math.exp(-Math.abs(currentLength - lastLength) / temp)) {
                // console.log(Math.exp(-Math.abs((currentLength - lastLength) / currentLength) / (temp / maxTemp)), { currentLength, lastLength, temp })
                lastTour = new Tour(tour.cities);
                lastLength = currentLength;
            }

            if (currentLength < shortestLength) {
                shortestLength = tour.length();
                shortest = tour;
            }

            frame++;
        }
        return shortest;
    }

    static greedy(tour: Tour): Tour {
        if (tour.cities.length < 4) return tour;
        for (let i = 0; i < tour.cities.length - 1; i++) {
            let closestCity = i + 1;
            let closestDistance = Infinity;
            for (let j = closestCity; j < tour.cities.length; j++) {
                let distance = tour.cities[i].distanceFromCity(tour.cities[j]);
                if (distance < closestDistance) {
                    closestCity = j;
                    closestDistance = distance;
                }
            }
            tour.swapCitiesByIndex(i + 1, closestCity);
        }
        return tour;
    }
}