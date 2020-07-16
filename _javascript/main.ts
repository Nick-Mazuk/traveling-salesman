import { Algorithms } from './Algorithms';
import { City } from './City';
import { Tour } from './Tour';
import { Block } from './Block';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
const dpr = window.devicePixelRatio || 1;
let tour: Tour = new Tour();
let blocks: Block[] = [];
let selectedCity: City;
let mouseClickedPosition: number[];
let mouseStayedStillAfterClick: boolean;
let algorithmMode: string;
let timingElement: HTMLSpanElement;
let lengthElement: HTMLSpanElement;
let cityGrid: boolean;
let blocksYCount: number;
let blocksXCount: number;
let blockXSize: number;
let blockYSize: number;
const theoreticalBoardCount = 200;
const cityGridBoardCount = 20;
let initialBoardCityCount = cityGridBoardCount;
let hoveredHouse: HTMLImageElement;

let algorithmDescriptions = {
    'force': '<b>Brute Force Algorithm</b>: Checks every possible path, guarantees shortest path',
    'greedy': '<b>Greedy Algorithm</b>: Each node goes to the next closest node, finds suboptimal path excluding trivial cases',
    'hillClimber': '<b>Hill Climber Algorithm</b>: Compares tiny changes to current path, chooses better one',
    'annealing': '<b>Annealing Algorithm</b>: Like hill climber but avoids local minimums',
    'genetic': '<b>Genetic Algorithm</b>: Simulates all of human life',
    'uncross': '<b>Uncrossing Algorithm</b>: Chooses random path, then uncrosses intersections',
    'speedy': '<b>Speedy Algorithm</b>: A custom algorithm that combines greedy, annealing, and uncrossing algorithms',
    'bogo': '<b>Bogo-Style Algorithm</b>: Chooses random path, odds of finding shortest path is 1:(n - 1)!',
}

function optimizeTourAndDraw(onMouseMove: boolean = false) {
    let startTime = performance.now();
    if (onMouseMove) {
        tour = Algorithms.optimize(tour, algorithmMode, canvas, cityGrid, selectedCity);
    } else {
        tour = Algorithms.optimize(tour, algorithmMode, canvas, cityGrid);
    }
    let endTime = performance.now();
    timingElement.innerHTML = (endTime - startTime).toFixed(3);
    tour.draw(ctx, blocks, blockXSize, blockYSize, cityGrid);
    lengthElement.innerHTML = `${tour.length(cityGrid).toFixed(0)}`;
}

function getMousePosition(e: MouseEvent): number[] {
    return [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
}

function createCity(e: MouseEvent): void {
    let xPos: number;
    let yPos: number;
    let city: City;
    if (cityGrid) {
        xPos = mouseClickedPosition[0];
        yPos = mouseClickedPosition[1];
        let anchorX = xPos;
        let anchorY = yPos - blockYSize;
        const isAnchorAbove = City.isPointInBlock([xPos, yPos - blockYSize], ctx, dpr);
        if (isAnchorAbove) {
            anchorY = yPos + blockYSize;
        }

        // pixelSpace to grid space
        let x = Math.round(xPos / blockXSize);

        // grid space to block space
        const xCoordinate = x - 1 - Math.floor(x / 4);

        // block space to block position
        const blockColumn = Math.floor(x / 4);
        const blockColumnPosition = xCoordinate % 3;

        city = new City(xPos, yPos, canvas, anchorX, anchorY, blockColumn, blockColumnPosition, blockXSize);
    } else {
        xPos = e.clientX - canvas.getBoundingClientRect().left - City.radius / 2;
        yPos = e.clientY - canvas.getBoundingClientRect().top - City.radius / 2;
        city = new City(xPos, yPos, canvas);
    }
    tour.addCity(city);
    optimizeTourAndDraw();
}

function mouseInCity(mousePosition?: number[]): City[] {
    if (mousePosition == undefined) mousePosition = mouseClickedPosition;
    return tour.positionInCity(mousePosition[0], mousePosition[1]);
}

function canvasClicked(e: MouseEvent): void {
    let rightClicked = e.which == 3 || e.button == 2;
    if (!rightClicked) {
        if (cityGrid == true) {
            mouseClickedPosition = calculateCityPosition(getMousePosition(e));
            if (City.isPointInBlock(mouseClickedPosition, ctx, dpr) == false) return;
        } else {
            mouseClickedPosition = getMousePosition(e);
        }
        let clickedCities = mouseInCity();
        if (!clickedCities.length) {
            createCity(e);
        } else {
            selectedCity = clickedCities[0];
            selectedCity.selected = true;
            if (cityGrid)
                tour.draw(ctx, blocks, blockXSize, blockYSize, cityGrid);
        }
    }
    mouseStayedStillAfterClick = true;
}

function canvasMouseReleased(e: MouseEvent): void {
    if (selectedCity && mouseStayedStillAfterClick) {
        tour.removeCity(selectedCity);
        optimizeTourAndDraw();
    }
    mouseStayedStillAfterClick = undefined;
    if (selectedCity) selectedCity.selected = false;
    selectedCity = undefined;
    if (cityGrid) {
        hoveredHouse.classList.add('is-hidden');
        tour.draw(ctx, blocks, blockXSize, blockYSize, cityGrid);
    }
}

function drawHoveredHouse(e) {
    hoveredHouse.classList.remove('is-hidden');
    hoveredHouse.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 200%)) rotate(-30deg)`;
}

function canvasMouseMoved(e: MouseEvent) {
    if (selectedCity) {
        if (cityGrid) {
            let currentMousePosition = calculateCityPosition(getMousePosition(e));
            if (currentMousePosition[0] != selectedCity.xPos || currentMousePosition[1] != selectedCity.yPos) {
                if (City.isPointInBlock(currentMousePosition, ctx, dpr)) {
                    if (tour.positionInCity(currentMousePosition[0], currentMousePosition[1]).length == 0) {
                        let anchorX = currentMousePosition[0];
                        let anchorY = currentMousePosition[1] - blockYSize;
                        const isAnchorAbove = City.isPointInBlock([currentMousePosition[0], currentMousePosition[1] - blockYSize], ctx, dpr);
                        if (isAnchorAbove) {
                            anchorY = currentMousePosition[1] + blockYSize;
                        }

                        // pixelSpace to grid space
                        let x = Math.round(currentMousePosition[0] / blockXSize);

                        // grid space to block space
                        const xCoordinate = x - 1 - Math.floor(x / 4);

                        // block space to block position
                        const blockColumn = Math.floor(x / 4);
                        const blockColumnPosition = xCoordinate % 3;

                        selectedCity.move(currentMousePosition[0], currentMousePosition[1], anchorX, anchorY, blockColumn, blockColumnPosition, blockXSize);
                        optimizeTourAndDraw(true);
                    }
                }
            }
            drawHoveredHouse(e);
        } else {
            let currentMousePosition = getMousePosition(e);
            selectedCity.move(currentMousePosition[0], currentMousePosition[1]);
            optimizeTourAndDraw(true);
        }
    }
    mouseStayedStillAfterClick = false;
}

function isMouseInBlock(e: MouseEvent) {
    const mousePosition = getMousePosition(e);
    return City.isPointInBlock(mousePosition, ctx, dpr);
}

function calculateCityPosition(coordinates: number[]): number[] {
    return calculateCoordinatesFromGridPosition(calculateGridPositionFromCoordinates(coordinates));
}

function calculateGridPositionFromCoordinates(coordinates: number[]): number[] {
    let xPos = Math.floor(coordinates[0] / blockXSize);
    let yPos = Math.floor(coordinates[1] / blockYSize);
    return [xPos, yPos];
}

function calculateCoordinatesFromGridPosition(gridPosition: number[]): number[] {
    let xPos = Math.floor(gridPosition[0] * blockXSize + blockXSize / 2);
    let yPos = Math.floor(gridPosition[1] * blockYSize + blockYSize / 2);
    return [xPos, yPos];
}

function resizeCities(oldWidth: number, oldHeight: number, newWidth: number, newHeight: number) {
    if (tour.cities.length) {
        const changeX = newWidth / oldWidth;
        const changeY = newHeight / oldHeight;
        tour.cities.forEach(city => {
            city.canvas = canvas;
            city.move(Math.round(city.xPos * changeX), Math.round(city.yPos * changeY));
        })
    }
}

function createCanvasSize(canvas: HTMLCanvasElement, doNotDraw?: boolean) {
    let width = window.innerWidth;
    let height = window.innerHeight;
    height -= document.querySelector('#top-navbar').getBoundingClientRect().height;
    height -= document.querySelector('#bottom-navbar').getBoundingClientRect().height;

    width *= dpr;
    height *= dpr;

    resizeCities(canvas.width, canvas.height, width, height);

    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    if (doNotDraw != false) optimizeTourAndDraw();
}

function setupCanvas(canvas: HTMLCanvasElement) {
    createCanvasSize(canvas, false);

    canvas.addEventListener('mousedown', canvasClicked);
    canvas.addEventListener('mouseup', canvasMouseReleased);
    canvas.addEventListener('mousemove', canvasMouseMoved);

    cityGrid = (<HTMLInputElement>document.getElementById('mode')).checked;
    City.houseImage.src = './assets/house.svg';
}

function changeAlgorithmMode() {
    algorithmMode = (<HTMLSelectElement>document.getElementById('algorithm-mode')).value;
    tour.randomizeRoute();
    optimizeTourAndDraw();
    document.querySelector('#algorithm-descriptions').innerHTML = algorithmDescriptions[algorithmMode];
}

function randomizeCities(cityCount: number) {
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    const cityRadius = City.radius;

    tour.clear();
    tour.draw(ctx, blocks, blockXSize, blockYSize, cityGrid);
    if (!cityGrid) {
        for (let i = 0; i < cityCount; i++) {
            const city = new City(Math.floor(Math.random() * (width - 2 * cityRadius)) + cityRadius, Math.floor(Math.random() * (height - 2 * cityRadius)) + cityRadius, canvas);
            tour.addCity(city)
        }
    } else {
        const houseSpacesX = blocksXCount * 3;
        const houseSpacesY = blocksYCount * 2;
        const tempCities: number[][] = [];

        const revisedCityCount = Math.min(cityCount, houseSpacesX * houseSpacesY);
        while (tempCities.length < revisedCityCount) {
            const xPos = Math.floor(Math.random() * houseSpacesX);
            const yPos = Math.floor(Math.random() * houseSpacesY);

            if (tempCities.filter(city => city[0] == xPos && city[1] == yPos).length == 0)
                tempCities.push([xPos, yPos]);
        }

        tempCities.forEach(coordinates => {
            const xPos = (coordinates[0] + Math.floor(coordinates[0] / 3) + 1) * blockXSize + blockXSize / 2;
            const yPos = (coordinates[1] + Math.floor(coordinates[1] / 2) + 1) * blockYSize + blockYSize / 2;
            let anchorX = xPos;
            let anchorY = yPos - blockYSize;
            const isAnchorAbove = City.isPointInBlock([xPos, yPos - blockYSize], ctx, dpr);
            if (isAnchorAbove) {
                anchorY = yPos + blockYSize;
            }
            const blockColumn = Math.floor(coordinates[0] / 3);
            const blockColumnPosition = coordinates[0] % 3;
            const city = new City(xPos, yPos, canvas, anchorX, anchorY, blockColumn, blockColumnPosition, blockXSize, blockYSize);
            tour.addCity(city);
        })
    }
    changeAlgorithmMode()
}

function createCityBlockGrid() {
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    blocksXCount = Math.floor(width / 200);
    blockXSize = width / (blocksXCount * 4 + 1);
    blocksYCount = Math.round(height / (blockXSize * 3 + 1));
    blockYSize = height / (blocksYCount * 3 + 1);
    for (let i = 0; i < blocksXCount; i++) {
        let left = i * 4 + 1;
        for (let j = 0; j < blocksYCount; j++) {
            let top = j * 3 + 1;
            blocks.push(new Block(left, top, 3, 2));
        }
    }
}

function removeCityBlockGrid() {
    blocks = [];
}

function createBoard(): void {
    if (cityGrid) {
        createCityBlockGrid();
    } else {
        removeCityBlockGrid();
    }
}

function clearBoard() {
    tour.clear()
    optimizeTourAndDraw();
}

function changeMode(e) {
    cityGrid = e.currentTarget.checked;
    initialBoardCityCount = cityGrid ? cityGridBoardCount : theoreticalBoardCount;
    createBoard();
    randomizeCities(initialBoardCityCount);
}

function recalculate(e) {
    optimizeTourAndDraw(false);
}

function setupEventListeners() {
    document.getElementById('algorithm-mode').addEventListener('change', changeAlgorithmMode);
    document.getElementById('clear-board').addEventListener('click', clearBoard);
    document.getElementById('random-board').addEventListener('click', () => randomizeCities(initialBoardCityCount));
    document.getElementById('mode').addEventListener('change', changeMode);
    window.addEventListener('resize', () => createCanvasSize(canvas));
    document.getElementById('recalculate-button').addEventListener('click', recalculate)
}

function setup() {
    canvas = document.querySelector('canvas');
    timingElement = document.querySelector('#timing');
    lengthElement = document.querySelector('#length');
    hoveredHouse = document.querySelector('#hoveredHouse');
    setupCanvas(canvas);
    setupEventListeners();
    createBoard();
    randomizeCities(initialBoardCityCount);
}

window.addEventListener('DOMContentLoaded', setup);