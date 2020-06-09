import { Tour } from './Tour';

export class Algorithms {
    static annealing(tour: Tour, temp = 10000, coolingRate = 0.001): Tour {
        if (tour.cities.length < 3) return tour;

        function acceptableImprovement(originalDistance, newDistance, temp) {
            if (newDistance < originalDistance) return 1;
            return Math.exp(-(newDistance - originalDistance) / temp);
        }

        let shortestLength = tour.length();
        let shortest = new Tour(tour.cities);

        while (temp > 1) {
            const tour = new Tour(shortest.cities);

            // generate random city indexes
            const cityA = tour.getRandomCityIndex();
            let cityB = tour.getRandomCityIndex();

            while (cityA == cityB) {
                cityB = tour.getRandomCityIndex();
            }

            tour.swapCitiesByIndex(cityA, cityB);
            const currentLength = tour.length();

            if (acceptableImprovement(shortestLength, currentLength, temp) < Math.random()) {
                console.log('switched', shortestLength, currentLength)
                shortest = new Tour(tour.cities);
            }

            if (tour.length() < shortestLength) {
                shortestLength = tour.length();
            }

            temp *= (1 - coolingRate);
        }

        return shortest;
    }
}