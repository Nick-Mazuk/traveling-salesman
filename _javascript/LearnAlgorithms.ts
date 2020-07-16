export class LearnAlgorithms {
    modalElement: HTMLDivElement;
    closeButton: HTMLButtonElement;
    learnAlgorithmsElement: HTMLAnchorElement;
    tabs: NodeListOf<HTMLAnchorElement>;
    algorithmOverview: HTMLDivElement;
    algorithmSpecifics: HTMLDivElement;
    algorithmFeatures: HTMLDivElement;
    algorithms = {
        'force': {
            overview: `Checks every possible path, guarantees shortest path.`,
            specifics: `<p>Loop through every possible route. If the current route is shorter than all routes already checked, then set it as the shortest route. Return the shortest route at the end.</p>
            
            <code class='multi-line'>function bruteForce(route) {
    let shortestLength = route.length();
    let shortestRoute = new Route(route.houses); // clones route
    const permutations = Route.getPermutations(route);
    permutations.forEach(order => {
        let currentRoute = new Route(order);
        const length = currentRoute.length();
        if (length < shortestLength) {
            shortestLength = length;
            shortestRoute = currentRoute;
        }
    })
    return shortestRoute;
}</code>`,
            features: `<ul>
            <li>Very slow: <code>O(n!)</code></li>
            </ul>`,
        },
        'greedy': {
            overview: `Each house connects with the next closest house.`,
            specifics: `<p>Loop through each house. Then, find the closes house that hasn't already been picked.</p>
            
            <code class='multi-line'>function greedy(route) {
    for (let i = 0; i < route.houses.length - 1; i++) {
        let closestHouse = i + 1;
        let closestDistance = Infinity;
        for (let j = closestHouse; j < route.houses.length; j++) {
            let distance = route.houses[i].distanceFromHouse(route.houses[j]);
            if (distance < closestDistance) {
                closestHouse = j;
                closestDistance = distance;
            }
        }
        route.swapHousesByIndex(i + 1, closestHouse);
    }
    return route;
}</code>`,
            features: `<ul>
            <li>Very fast (comparatively): <code>O(n^2)</code></li>
            <li>Guaranteed to produce not-worst case</li>
            <li>Guaranteed to produce not-best case, either</li>
            </ul>`,
        },
        'annealing': {
            overview: `Gradually improves through random changes, avoids local mins.`,
            specifics: `
<p>Repeatedly make changes to the route. As time goes on, make smaller and smaller changes. After each change, check if the new route is shorter than the previous. If so, set it as the new shortest.</p>

<p>Also, every now and then, it's okay to pick worse route than your current shortest. That way, you can avoid local mins.</p>

<p>As time goes on, make the variations smaller and lower your tolerance for worse routes.</p>

<p><i>Simplified code:</i></p>
            <code class='multi-line'>function annealing (route) {
    function calcTemp(frame, maxTime, maxTemp) {
        return maxTemp * (1 - frame / maxTime) + 0.0001;
    }

    const maxTemp = CONSTANT;
    const maxTime = VARIABLE; // depends on # of houses, ~O(n^2)
    let frame = 0;
    let shortestLength = route.length();
    let shortest = new Route(route.houses);

    let lastRoute = shortest;
    let lastLength = shortestLength;

    while (frame < maxTime) {
        let temp = calcTemp(frame, maxTime, maxTemp);
        const route = new Route(lastRoute.houses);

        const houseA = route.getRandomHouseIndex();
        const houseB = route.getRandomHouseIndex();

        const change = route.diffFromSwappingHouses(houseA, houseB);
        const random = Math.random();
        const prob = Math.exp(-Math.abs(change) / temp); // probability function for determining "acceptable worseness"
        if (change > 0 || (change != 0 && random <= prob)) {
            route.swapHousesByIndex(houseA, houseB); // O(n) worst case for this specific swap function
            lastRoute = route;
            let newLength = route.length();
            lastLength = newLength;
            if (newLength < shortestLength) {
                shortestLength = newLength;
                shortest = route;
            }
        }


        frame++;
    }
    return shortest;

}</code>`,
            features: `<ul>
            <li>Not slow, but not extremely fast: <code>O(~n^3)</code></li>
            <li>Because worse routes are occasionally accepted, this algorithm avoids local minimums</li>
            <li>Very similar to a hill-climbing algorithm</li>
            </ul>`,
        },
        'uncross': {
            overview: `Chooses random path, then uncrosses intersections.`,
            specifics: `<p>Picks two random roads between houses. If those roads are crossing, uncross them. This will always shorten the path. Continue looping over all roads until all routes are uncrossed.</p>
            <code class='multi-line'>function uncross(route) {
    let shortestOverallLength = route.length();
    let previousRoundLength;
    do {
        previousRoundLength = shortestOverallLength;
        for (let i = 0; i < route.houses.length; i++) {
            for (let j = i + 1; j < route.houses.length; j++) {
                const currentRoute = new Route(route.houses);
                const crossed = currentRoute.areHousesCrossed(i, j);
                if (crossed) {
                    currentRoute.swapHousesByIndex(i, j);
                    route = currentRoute;
                    shortestOverallLength = currentRoute.length();
                }
            }
        }
    } while (route.length != previousRoundLength)
    return route;
}</code>
            `,
            features: `<ul>
            <li>Very fast: <code>O(n^2)</code></li>
            <li>Because uncrossing roads always makes the route shorter, it is very good at eliminating inefficiencies other algorithms won't easily find.</li>
            <li>Very good, gets close to ideal route, but susceptible to local mins</li>
            </ul>`,
        },
        'speedy': {
            overview: `Custom algorithm, combines greedy, annealing, and 2-opt.`,
            specifics: `<ul>
            <li><b>Greedy</b> is very good at getting not-worst path fast</li>
            <li><b>Annealing</b> is very good at avoiding local mins</li>
            <li><b>2-Opt</b> is very good at removing small inefficiencies</li>
            </ul>
            
            <p>So this algorithm combines all of them in that order to take advantage of each algorithm's strengths while avoiding their weaknesses.</p>
            
            <p>For instance, because the Annealing algorithm doesn't need to find the best solution (only avoid local min), you can loop through it fewer times, resulting in a far lower time complexity.</p>

            <p>Furthermore, when you are moving a house, Speedy first looks to see if swapping any house with the one you're moving makes a shorter route. It will only run fully if there's a shorter route.</p>

            <code class='multi-line'>function speedy(route, movedHouse) {
    if (movedHouse) {
        let houseIndex = route.houses.indexOf(movedHouse);
        let swappedHouses = false;

        for (let i = 0; i < route.houses.length; i++) {
            if (i == houseIndex) continue;
            const currentRoute = new Route(route.houses);
            const change = currentRoute.diffFromSwappingHouses(i, houseIndex);
            if (change > 0) {
                currentRoute.swapHousesByIndex(i);
                route = currentRoute;
                swappedHouses = true;
                break;
            }
        }
        if (swappedHouses) {
            // since house movements are continuous, no need to run greedy
            route = annealing(route); // faster version
            return uncross(route); // 2-opt
        }
        return route;
    }
    // if running from the start
    route = greedy(route);
    route = annealing(route); // faster version
    route = uncross(route); // 2-opt
    return route;
}</code>`,
            features: `<ul>
            <li>Very fast:
                <ul>
                <li>Best case: <code>O(n)</code></li>
                <li>Worst case: <code>O(n^2)</code></li>
                </ul>
            </li>
            <li>When moving a house, no other standard algorithm is faster</li>
            <li>On average, it produces results slightly better than annealing and 2-opt</li>
            <li>On average, it is faster than annealing, though slower in real-time speed than 2-opt</li>
            </ul>`,
        },
        'bogo': {
            overview: `Chooses random path, odds of finding shortest path is <code>1:(n - 1)!</code>`,
            specifics: `<p>Simply randomize the route.</p>
            <code class='multi-line'>function bogo(route) {
    return route.houses.sort(() => Math.random() - 0.5);
}</code>`,
            features: `<ul>
            <li>Very fast: <code>O(n log(n))</code></li>
            <li>If you ever get a decent route with many houses, buy a lottery ticket</li>
            <li>Looks neat when moving houses around!</li>
            </ul>`,
        },
    }

    constructor () {
        this.getHTMLElements();
        this.addEventListeners();
    }

    getHTMLElements(): void {
        this.modalElement = document.querySelector('#algorithms-modal');
        this.closeButton = document.querySelector('#algorithms-modal-close');
        this.learnAlgorithmsElement = document.querySelector('#learn-algorithms');
        this.algorithmOverview = document.querySelector('#algorithm-overview');
        this.algorithmSpecifics = document.querySelector('#algorithm-specifics');
        this.algorithmFeatures = document.querySelector('#algorithm-features');
        this.tabs = document.querySelectorAll('.algorithms-tab');
    }

    addEventListeners(): void {
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.learnAlgorithmsElement.addEventListener('click', () => this.openModal());
        this.tabs.forEach(tab => tab.addEventListener('click', (e) => this.switchTab(e)));
    }

    openModal(): void {
        this.modalElement.classList.add('is-active');
        const algorithm = (<HTMLSelectElement>document.querySelector('#algorithm-mode')).value;
        this.displayDetails(algorithm);
        const tab = <HTMLAnchorElement>document.querySelector(`.algorithms-tab[data-algorithm=${algorithm}]`);
        this.activateTab(tab);
    }

    closeModal(): void {
        this.modalElement.classList.remove('is-active');
    }

    activateTab(tab: HTMLAnchorElement): void {
        this.tabs.forEach(tab => tab.classList.remove('is-active'));
        tab.classList.add('is-active');
    }

    displayDetails(algorithm: string): void {
        this.algorithmOverview.innerHTML = this.algorithms[algorithm].overview;
        this.algorithmSpecifics.innerHTML = this.algorithms[algorithm].specifics;
        this.algorithmFeatures.innerHTML = this.algorithms[algorithm].features;
    }

    switchTab(e: Event): void {
        let tab = <HTMLAnchorElement>e.currentTarget;
        const newAlgorithm = tab.dataset.algorithm;
        this.activateTab(tab);
        this.displayDetails(newAlgorithm);
    }
}