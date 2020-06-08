import { City } from './City';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let cities: City[] = [];

function getClickedPosition(e: MouseEvent): number[] {
    return [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
}

function createCity(e: MouseEvent) {
    let xPos = e.clientX - canvas.getBoundingClientRect().left - City.radius / 2;
    let yPos = e.clientY - canvas.getBoundingClientRect().top - City.radius / 2;
    let city = new City(xPos, yPos);
    cities.push(city);
    city.draw(ctx);
}

function clickedInCity(e: MouseEvent): City[] {
    const clickedPosition = getClickedPosition(e);
    return cities.filter(city => city.pointIsInCity(clickedPosition[0], clickedPosition[1]));
}

function canvasClicked(e: MouseEvent) {
    if (!clickedInCity(e).length) {
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