import { City } from './City';
import { Road } from './Road';
import { Tour } from './Tour';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let tour: Tour = new Tour([]);

function clearCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

function getClickedPosition(e: MouseEvent): number[] {
    return [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
}

function createCity(e: MouseEvent) {
    let xPos = e.clientX - canvas.getBoundingClientRect().left - City.radius / 2;
    let yPos = e.clientY - canvas.getBoundingClientRect().top - City.radius / 2;
    let city = new City(xPos, yPos);
    tour.addCity(city);
    city.draw(ctx);
}

function clickedInCity(e: MouseEvent): City[] {
    const clickedPosition = getClickedPosition(e);
    return tour.positionInCity(clickedPosition[0], clickedPosition[1]);
}

function canvasClicked(e: MouseEvent) {
    let clickedCities = clickedInCity(e)
    if (!clickedCities.length) {
        createCity(e);
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
}

function setup() {
    canvas = document.querySelector('canvas');
    setupCanvas(canvas);
}

window.addEventListener('DOMContentLoaded', setup);