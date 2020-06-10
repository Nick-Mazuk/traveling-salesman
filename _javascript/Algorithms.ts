import { Tour } from './Tour';

export class Algorithms {
    static annealing(tour: Tour, temp = 5, coolingRate = 0.001): Tour {
        if (tour.cities.length < 4) return tour;

        let shortestLength = tour.length();
        let shortest = new Tour(tour.cities);

        let lastTour = shortest;
        let lastLength = shortestLength;

        while (temp > 0.1) {
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
            } else if (Math.random() <= Math.exp(-Math.abs((currentLength - lastLength) / currentLength) / temp)) {
                lastTour = new Tour(tour.cities);
                lastLength = currentLength;
            }

            if (currentLength < shortestLength) {
                shortestLength = tour.length();
                shortest = tour;
            }

            temp *= (1 - coolingRate);
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