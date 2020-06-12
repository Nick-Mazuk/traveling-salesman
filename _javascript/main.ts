// TODO Animate algorithms
// TODO Canvas always 100% vh and vw
// TODO Canvas updates on window resize
// TODO Create tutorial
// TODO Create "about the algorithms" section

import { Algorithms } from './Algorithms';
import { City } from './City';
import { Tour } from './Tour';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let tour: Tour = new Tour();
let selectedCity: City;
let mouseClickedPosition: number[];
let algorithmMode: string;
let timingElement: HTMLSpanElement;

let algorithmDescriptions = {
    'force': '<b>Brute Force Algorithm</b>: Checks every possible path, guarantees shortest path',
    'greedy': '<b>Greedy Algorithm</b>: Each node goes to the next closest node, finds suboptimal path excluding trivial cases',
    'hillClimber': '<b>Hill Climber Algorithm</b>: Compares tiny changes to current path, chooses better one',
    'annealing': '<b>Annealing Algorithm</b>: Like hill climber but avoids local minimums',
    'genetic': '<b>Genetic Algorithm</b>: Simulates all of human life',
    'uncrossing': '<b>Uncrossing Algorithm</b>: Chooses random path, then uncrosses intersections',
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
    tour.draw(ctx);
}

function getMousePosition(e: MouseEvent): number[] {
    return [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
}

function createCity(e: MouseEvent) {
    let xPos = e.clientX - canvas.getBoundingClientRect().left - City.radius / 2;
    let yPos = e.clientY - canvas.getBoundingClientRect().top - City.radius / 2;
    let city = new City(xPos, yPos, canvas);
    tour.addCity(city);
    optimizeTourAndDraw();
}

function mouseInCity(mousePosition?: number[]): City[] {
    if (mousePosition == undefined) mousePosition = mouseClickedPosition
    return tour.positionInCity(mousePosition[0], mousePosition[1]);
}

function canvasClicked(e: MouseEvent) {
    let rightClicked = e.which == 3 || e.button == 2;
    if (!rightClicked) {
        mouseClickedPosition = getMousePosition(e);
        let clickedCities = mouseInCity();
        if (!clickedCities.length) {
            createCity(e);
        } else {
            selectedCity = clickedCities[0];
        }
    }
}

function canvasMouseReleased(e: MouseEvent) {
    let currentMousePosition = getMousePosition(e);
    if (selectedCity && getDistanceBetweenPoints(currentMousePosition, mouseClickedPosition) < City.radius) {
        tour.removeCity(selectedCity);
        selectedCity = undefined;
        optimizeTourAndDraw();
    }
    mouseClickedPosition = undefined;
    selectedCity = undefined;
}

function canvasMouseMoved(e: MouseEvent) {
    if (selectedCity) {
        let currentMousePosition = getMousePosition(e);
        selectedCity.move(currentMousePosition[0], currentMousePosition[1]);
        optimizeTourAndDraw(true);
    }
}

function setupCanvas(canvas: HTMLCanvasElement) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    canvas.addEventListener('mousedown', canvasClicked);
    canvas.addEventListener('mouseup', canvasMouseReleased);
    canvas.addEventListener('mousemove', canvasMouseMoved);
}

function changeAlgorithmMode() {
    algorithmMode = (<HTMLSelectElement>document.getElementById('algorithm-mode')).value;
    tour.randomizeRoute();
    optimizeTourAndDraw();
    document.querySelector('#algorithm-descriptions').innerHTML = algorithmDescriptions[algorithmMode];
}

function randomBoard() {
    const cityCount = 7;
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    const cityRadius = City.radius;

    tour.clear();
    for (let i = 0; i < cityCount; i++) {
        const city = new City(Math.floor(Math.random() * (width - 2 * cityRadius)) + cityRadius, Math.floor(Math.random() * (height - 2 * cityRadius)) + cityRadius, canvas);
        tour.addCity(city)
    }
    changeAlgorithmMode()
}

function clearBoard() {
    tour.clear()
    optimizeTourAndDraw();
}

function setupEventListeners() {
    document.getElementById('algorithm-mode').addEventListener('change', changeAlgorithmMode);
    document.getElementById('clear-board').addEventListener('click', clearBoard);
    document.getElementById('random-board').addEventListener('click', randomBoard);
}

function setup() {
    canvas = document.querySelector('canvas');
    timingElement = document.querySelector('#timing');
    setupCanvas(canvas);
    setupEventListeners();
    randomBoard();
}

window.addEventListener('DOMContentLoaded', setup);