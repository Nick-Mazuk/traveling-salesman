import { Tour } from './Tour';
import { City } from './City';

export class Algorithms {
    static optimize(tour: Tour, algorithm: string, canvas: HTMLCanvasElement, movedCity?: City): Tour {
        if (tour.cities.length < 4) return tour;

        switch (algorithm) {
            case 'annealing':
                tour = Algorithms.annealing(tour, canvas, !!movedCity);
                break;
            case 'greedy':
                tour = Algorithms.greedy(tour);
                break;
            case 'bogo':
                tour = Algorithms.bogo(tour);
                break;
            case 'force':
                tour = Algorithms.force(tour);
                break;
            case 'uncross':
                tour = Algorithms.uncross(tour);
                break;
            default:
                tour = Algorithms.annealing(tour, canvas, !!movedCity);
        }
        return tour;
    }

    static annealing(tour: Tour, canvas?: HTMLCanvasElement, shortVersion?: boolean, maxTemp = 150, coolingRate = 0.001): Tour {

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

            const cityA = tour.getRandomCityIndex();
            let cityB = tour.getRandomCityIndex(cityA, temp);

            tour.swapCitiesByIndex(cityA, cityB);
            let currentLength = tour.length();

            if (currentLength < lastLength || Math.random() <= Math.exp(-Math.abs(currentLength - lastLength) / temp)) {
                lastTour = tour;
                lastLength = currentLength;
            }

            if (currentLength < shortestLength) {
                shortestLength = currentLength;
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

    static bogo(tour: Tour): Tour {
        tour.randomizeRoute();
        return tour;
    }

    static force(tour: Tour): Tour {
        if (tour.cities.length > 9) {
            alert('Brute force is slow. Very slow. It will likely take minutes if not much longer, so the algorithm was aborted. Please delete cities or choose another algorithm.');
            return tour;
        }
        let shortestLength = tour.length();
        let shortestTour = new Tour(tour.cities);
        const permutations = Tour.getPermutations(tour);
        permutations.forEach(order => {
            let currentTour = new Tour(order);
            const length = currentTour.length();
            if (length < shortestLength) {
                shortestLength = length;
                shortestTour = currentTour;
            }
        })
        return shortestTour;
    }

    static uncross(tour: Tour): Tour {
        tour = Algorithms.greedy(tour);
        let shortestOverallLength: number;
        do {
            shortestOverallLength = tour.length();
            for (let i = 0; i < tour.cities.length; i++) {
                for (let j = i + 1; j < tour.cities.length; j++) {
                    const currentTour = new Tour(tour.cities);
                    currentTour.swapCitiesByIndex(i, j);
                    const currentLength = currentTour.length();
                    if (currentLength < shortestOverallLength) {
                        tour = currentTour;
                        shortestOverallLength = currentLength;
                    }
                }
            }
        } while (tour.length().toFixed(2) != shortestOverallLength.toFixed(2))
        return tour;
    }
}