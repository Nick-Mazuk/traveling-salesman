// TODO Animate algorithms

import { Algorithms } from './Algorithms';
import { City } from './City';
import { Tour } from './Tour';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let tour: Tour = new Tour();
let selectedCity: City;
let mouseClickedPosition: number[];
let algorithmMode: string;

function getDistanceBetweenPoints(pointA: number[], pointB: number[]) {
    return Math.sqrt((pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2);
}

function optimizeTourAndDraw(onMouseMove: boolean = false) {
    if (onMouseMove) {
        tour = Algorithms.optimize(tour, algorithmMode, canvas, selectedCity);
    } else {
        tour = Algorithms.optimize(tour, algorithmMode, canvas);
    }
    tour.draw(ctx);
}

function getMousePosition(e: MouseEvent): number[] {
    return [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
}

function createCity(e: MouseEvent) {
    let xPos = e.clientX - canvas.getBoundingClientRect().left - City.radius / 2;
    let yPos = e.clientY - canvas.getBoundingClientRect().top - City.radius / 2;
    let city = new City(xPos, yPos);
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
}

function randomBoard() {
    const cityCount = 7;
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    const cityRadius = City.radius;

    tour.clear();
    for (let i = 0; i < cityCount; i++) {
        const city = new City(Math.floor(Math.random() * (width - 2 * cityRadius)) + cityRadius, Math.floor(Math.random() * (height - 2 * cityRadius)) + cityRadius);
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
    setupCanvas(canvas);
    setupEventListeners();
    randomBoard();
}

window.addEventListener('DOMContentLoaded', setup);