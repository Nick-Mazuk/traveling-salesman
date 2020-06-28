// TODO Animate algorithms
// TODO Create tutorial
// TODO Create "about the algorithms" section
// TODO Calculate time complexities for algorithms
// TODO Make cities houses
// TODO Create road system
// TODO Implement distance system for roads w/ obstacles

import { Algorithms } from './Algorithms';
import { City } from './City';
import { Tour } from './Tour';
import { Road } from './Road';
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
let realityMode: boolean;
let blockXSize: number;
let blockYSize: number;
const initialBoardCityCount = 200;

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

function getDistanceBetweenPoints(pointA: number[], pointB: number[]) {
    return Math.sqrt((pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2);
}

function optimizeTourAndDraw(onMouseMove: boolean = false) {
    let startTime = performance.now();
    if (onMouseMove) {
        tour = Algorithms.optimize(tour, algorithmMode, canvas, selectedCity);
    } else {
        tour = Algorithms.optimize(tour, algorithmMode, canvas);
    }
    let endTime = performance.now();
    timingElement.innerHTML = (endTime - startTime).toFixed(3);
    tour.draw(ctx, blocks, blockXSize, blockYSize, realityMode);
    lengthElement.innerHTML = `${tour.length().toFixed(0)}`;
}

function getMousePosition(e: MouseEvent): number[] {
    return [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
}

function createCity(e: MouseEvent): void {
    let xPos: number;
    let yPos: number;
    if (realityMode) {
        xPos = mouseClickedPosition[0];
        yPos = mouseClickedPosition[1];
    } else {
        xPos = e.clientX - canvas.getBoundingClientRect().left - City.radius / 2;
        yPos = e.clientY - canvas.getBoundingClientRect().top - City.radius / 2;
    }
    let city = new City(xPos, yPos, canvas);
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
        if (realityMode == true) {
            mouseClickedPosition = calculateCityPosition(getMousePosition(e));
            if (isPointInBlock(mouseClickedPosition) == false) return;
        } else {
            mouseClickedPosition = getMousePosition(e);
        }
        let clickedCities = mouseInCity();
        if (!clickedCities.length) {
            createCity(e);
        } else {
            selectedCity = clickedCities[0];
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
    selectedCity = undefined;
}

function canvasMouseMoved(e: MouseEvent) {
    if (selectedCity) {
        if (realityMode) {
            let currentMousePosition = calculateCityPosition(getMousePosition(e));
            if (currentMousePosition[0] != selectedCity.xPos || currentMousePosition[1] != selectedCity.yPos) {
                if (isPointInBlock(currentMousePosition)) {
                    if (tour.positionInCity(currentMousePosition[0], currentMousePosition[1]).length == 0) {
                        selectedCity.move(currentMousePosition[0], currentMousePosition[1]);
                        optimizeTourAndDraw(true);
                    }
                }
            }
        } else {
            let currentMousePosition = getMousePosition(e);
            selectedCity.move(currentMousePosition[0], currentMousePosition[1]);
            optimizeTourAndDraw(true);
        }
    }
    mouseStayedStillAfterClick = false;
}

function isPointInBlock(mousePosition: number[]): boolean {
    const topPixel = ctx.getImageData(mousePosition[0] * dpr, (mousePosition[1] + Road.width + 3) * dpr, 1, 1).data;
    if (topPixel[0] == 23 && topPixel[1] == 23 && topPixel[2] == 23)
        return false;
    const bottomPixel = ctx.getImageData(mousePosition[0] * dpr, (mousePosition[1] - Road.width - 3) * dpr, 1, 1).data;
    if (bottomPixel[0] == 23 && bottomPixel[1] == 23 && bottomPixel[2] == 23)
        return false;
    const leftPixel = ctx.getImageData((mousePosition[0] - Road.width - 3) * dpr, mousePosition[1] * dpr, 1, 1).data;
    if (leftPixel[0] == 23 && leftPixel[1] == 23 && leftPixel[2] == 23)
        return false;
    const rightPixel = ctx.getImageData((mousePosition[0] + Road.width + 3) * dpr, mousePosition[1] * dpr, 1, 1).data;
    if (rightPixel[0] == 23 && rightPixel[1] == 23 && rightPixel[2] == 23)
        return false;
    return true;
}

function isMouseInBlock(e: MouseEvent) {
    const mousePosition = getMousePosition(e);
    return isPointInBlock(mousePosition);
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

    realityMode = (<HTMLInputElement>document.getElementById('mode')).checked;
    City.houseImage.src = '/assets/house.svg';
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
    tour.draw(ctx, blocks, blockXSize, blockYSize, realityMode);
    if (!realityMode) {
        for (let i = 0; i < cityCount; i++) {
            const city = new City(Math.floor(Math.random() * (width - 2 * cityRadius)) + cityRadius, Math.floor(Math.random() * (height - 2 * cityRadius)) + cityRadius, canvas);
            tour.addCity(city)
        }
        changeAlgorithmMode() //TODO Move this to after ELSE statement
    }
}

function createCityBlockGrid() {
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    const blocksXCount = Math.floor(width / 200);
    blockXSize = width / (blocksXCount * 4 + 1);
    const blocksYCount = Math.round(height / (blockXSize * 3 + 1));
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
    if (realityMode) {
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
    realityMode = e.currentTarget.checked;
    createBoard();
    randomizeCities(initialBoardCityCount);
}

function setupEventListeners() {
    document.getElementById('algorithm-mode').addEventListener('change', changeAlgorithmMode);
    document.getElementById('clear-board').addEventListener('click', clearBoard);
    document.getElementById('random-board').addEventListener('click', () => randomizeCities(initialBoardCityCount));
    document.getElementById('mode').addEventListener('change', changeMode);
    window.addEventListener('resize', () => createCanvasSize(canvas))
}

function setup() {
    canvas = document.querySelector('canvas');
    timingElement = document.querySelector('#timing');
    lengthElement = document.querySelector('#length');
    setupCanvas(canvas);
    setupEventListeners();
    createBoard();
    randomizeCities(initialBoardCityCount);
}

window.addEventListener('DOMContentLoaded', setup);