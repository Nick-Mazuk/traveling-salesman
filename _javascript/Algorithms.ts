import { Tour } from './Tour';

export class Algorithms {
    static annealing(tour: Tour, temp = 10000, coolingRate = 0.001): Tour {
        if (tour.cities.length < 3) return tour;

        function acceptance(originalDistance, newDistance, temp) {
            if (originalDistance < newDistance) return 1;
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

            if (acceptance(shortestLength, currentLength, temp) < Math.random()) {
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

    static greedy(tour: Tour): Tour {
        if (tour.cities.length < 3) return tour;
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