import { Tour } from './Tour';
import { City } from './City';

export class Algorithms {
    static optimize(tour: Tour, algorithm: string, canvas: HTMLCanvasElement, cityGrid: boolean, movedCity?: City): Tour {
        if (tour.cities.length < 4) return tour;

        if (!movedCity) tour = Algorithms.bogo(tour);

        switch (algorithm) {
            case 'annealing':
                tour = Algorithms.annealing(tour, canvas, cityGrid, !!movedCity);
                break;
            case 'greedy':
                tour = Algorithms.greedy(tour, cityGrid);
                break;
            case 'bogo':
                tour = Algorithms.bogo(tour);
                break;
            case 'force':
                tour = Algorithms.force(tour, cityGrid);
                break;
            case 'uncross':
                tour = Algorithms.uncross(tour, cityGrid, !!movedCity);
                break;
            case 'speedy':
                tour = Algorithms.speedy(tour, cityGrid, movedCity);
                break;
            default:
                tour = Algorithms.speedy(tour, cityGrid, movedCity);
        }
        return tour;
    }

    static annealing(tour: Tour, canvas: HTMLCanvasElement, cityGrid: boolean, shortVersion?: boolean, maxTemp = 150): Tour {
        if (!shortVersion) tour = Algorithms.greedy(tour, cityGrid);

        function calcTemp(frame: number, maxTime: number, maxTemp: number): number {
            return maxTemp * (1 - frame / maxTime) + 0.0001;
        }

        if (canvas != void 0) {
            maxTemp = (canvas.getBoundingClientRect().width + canvas.getBoundingClientRect().height) / 18;
        }

        let largeMultiplier = shortVersion ? 1.8 : 2.5;
        let maxTime = tour.cities.length * 100 + (tour.cities.length > 10 ? (tour.cities.length - 10) ** largeMultiplier : 0);
        let frame = 0;
        let shortestLength = tour.length(cityGrid);
        let shortest = new Tour(tour.cities);

        let lastTour = shortest;
        let lastLength = shortestLength;

        while (frame < maxTime) {
            let temp = calcTemp(frame, maxTime, maxTemp);
            const tour = new Tour(lastTour.cities);

            const cityA = tour.getRandomCityIndex();
            let cityB = tour.getRandomCityIndex(cityA, temp);

            const change = tour.getLengthChangeFromSwappingCities(cityA, cityB, cityGrid);
            const random = Math.random()
            const prob = Math.exp(-Math.abs(change) / temp);
            if (change > 0 || (change != 0 && random <= prob)) {
                tour.swapCitiesByIndex(cityA, cityB);
                lastTour = tour;
                let newLength = tour.length(cityGrid);
                lastLength = newLength;
                if (newLength < shortestLength) {
                    shortestLength = newLength;
                    shortest = tour;
                }
            }


            frame++;
        }
        return shortest;
    }

    static greedy(tour: Tour, cityGrid: boolean): Tour {
        if (tour.cities.length < 4) return tour;
        for (let i = 0; i < tour.cities.length - 1; i++) {
            let closestCity = i + 1;
            let closestDistance = Infinity;
            for (let j = closestCity; j < tour.cities.length; j++) {
                let distance = tour.cities[i].distanceFromCity(tour.cities[j], cityGrid);
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

    static force(tour: Tour, cityGrid): Tour {
        if (tour.cities.length > 9) {
            alert('Brute force is slow. Very slow. It will likely take minutes if not much longer, so the algorithm was aborted. Please delete cities or choose another algorithm.');
            return tour;
        }
        let shortestLength = tour.length(cityGrid);
        let shortestTour = new Tour(tour.cities);
        const permutations = Tour.getPermutations(tour);
        permutations.forEach(order => {
            let currentTour = new Tour(order);
            const length = currentTour.length(cityGrid);
            if (length < shortestLength) {
                shortestLength = length;
                shortestTour = currentTour;
            }
        })
        return shortestTour;
    }

    static uncross(tour: Tour, cityGrid, shortVersion?: boolean): Tour {
        if (!shortVersion) tour = Algorithms.greedy(tour, cityGrid);
        let shortestOverallLength = tour.length(cityGrid);
        let previousRoundLength: number;
        do {
            previousRoundLength = shortestOverallLength;
            for (let i = 0; i < tour.cities.length; i++) {
                for (let j = i + 1; j < tour.cities.length; j++) {
                    if (i == j) continue;
                    const currentTour = new Tour(tour.cities);
                    const change = currentTour.getLengthChangeFromSwappingCities(i, j, cityGrid);
                    if (change > 0) {
                        currentTour.swapCitiesByIndex(i, j)
                        tour = currentTour;
                        shortestOverallLength = currentTour.length(cityGrid);
                    }
                }
            }
        } while (tour.length(cityGrid).toFixed(2) != previousRoundLength.toFixed(2))
        return tour;
    }

    static speedyAnnealing(tour, cityGrid: boolean): Tour {
        function calcTemp(frame: number, maxTime: number, maxTemp: number): number {
            return maxTemp * (1 - frame / maxTime) + 0.0001;
        }

        const maxTemp = tour.cities.length * 3;
        const maxTime = maxTemp * 50;
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

            const change = tour.getLengthChangeFromSwappingCities(cityA, cityB, cityGrid);
            const random = Math.random()
            const prob = Math.exp(-Math.abs(change) / temp);
            if (change > 0 || (change != 0 && random <= prob)) {
                tour.swapCitiesByIndex(cityA, cityB);
                lastTour = tour;
                let newLength = tour.length(cityGrid);
                lastLength = newLength;
                if (newLength < shortestLength) {
                    shortestLength = newLength;
                    shortest = tour;
                }
            }

            frame++;
        }
        return shortest;
    }

    static speedy(tour: Tour, cityGrid: boolean, movedCity?: City): Tour {
        if (movedCity != void 0) {
            let cityIndex = tour.cities.indexOf(movedCity);
            let swappedCities = false;
            // checks swapping any cities with the movedCity yields a better result
            for (let i = 0; i < tour.cities.length; i++) {
                if (i == cityIndex) continue;
                const currentTour = new Tour(tour.cities);
                const change = currentTour.getLengthChangeFromSwappingCities(i, cityIndex, cityGrid);
                if (change > 0) {
                    currentTour.swapCitiesByIndex(i, cityIndex)
                    tour = currentTour;
                    swappedCities = true;
                    break;
                }
            }
            if (swappedCities) {
                tour = Algorithms.speedyAnnealing(tour, cityGrid);
                return Algorithms.uncross(tour, cityGrid);
            }
            return tour;
        }
        tour = Algorithms.greedy(tour, cityGrid);
        tour = Algorithms.speedyAnnealing(tour, cityGrid);
        tour = Algorithms.uncross(tour, cityGrid, true);
        return tour;
    }
}