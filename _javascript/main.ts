import { Algorithms } from './Algorithms';
import { City } from './City';
import { Tour } from './Tour';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let tour: Tour = new Tour();
let selectedCity: City;

function getClickedPosition(e: MouseEvent): number[] {
    return [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
}

function createCity(e: MouseEvent) {
    let xPos = e.clientX - canvas.getBoundingClientRect().left - City.radius / 2;
    let yPos = e.clientY - canvas.getBoundingClientRect().top - City.radius / 2;
    let city = new City(xPos, yPos);
    tour.addCity(city);
    tour = Algorithms.greedy(tour);
    tour.draw(ctx);
}

function clickedInCity(e: MouseEvent): City[] {
    const clickedPosition = getClickedPosition(e);
    return tour.positionInCity(clickedPosition[0], clickedPosition[1]);
}

function canvasClicked(e: MouseEvent) {
    let clickedCities = clickedInCity(e);
    if (!clickedCities.length) {
        createCity(e);
    } else {
        selectedCity = clickedCities[0];
    }
}

function canvasMouseReleased(e: MouseEvent) {
    let clickedCities = clickedInCity(e);
    if (clickedCities.length && clickedCities[0] == selectedCity) {
        tour.removeCity(selectedCity);
        selectedCity = undefined;
        tour.draw(ctx);
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
}

function setup() {
    canvas = document.querySelector('canvas');
    setupCanvas(canvas);
}

window.addEventListener('DOMContentLoaded', setup);