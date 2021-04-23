import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

let squares = [];

let image;
let dw = 0, dh = 0;
let freq;
let minSize;
let px = [];

export default class P5Renderer implements BaseRenderer{

    colors = ['#D1CDC4', '#340352', '#732A70', '#FF6EA7', '#FFE15F'];
    backgroundColor = '#FFFFFF';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);

    }

    protected setup(s) {
        freq = s.createVector(1, 1);
        minSize = s.createVector(.7, .7);//image min size (width and height)

        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;

        s.background(0, 0, 0, 255);

        this.size = (s.width / 30);

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                let x = i * this.size;
                let y = j * this.size;
                squares.push({ox: x, oy: y, x: x, y: y});
            }
        }

    }

    protected draw(s) {

        if (this.animating) { 
            s.background(0, 0, 0, 50);
            this.delta+= 0.01;

            //s.noLoop();
            s.translate(this.width / 5.5, this.width / 5.5);
            for (let i = 0; i < squares.length; i++) {
               let square = squares[i];

               let scale = this.size * this.periodicFunction(this.delta-this.offset(square.x,square.y));//s.noise(square.x + this.delta, square.y + this.delta);
               let yoffset = 0;

               s.noStroke();
               s.fill(255, 255, 255, 255);
               s.rect(square.x - (scale / 2), square.y - (scale/ 2) - yoffset, scale, scale);
           }

        }
    }

    protected periodicFunction(p)
    {
      return 1.0 * this.s.sin(this.s.TWO_PI * p);
    }
    
    protected offset(x, y)
    {
      return this.s.noise(x, y);
    }

    public render() {

    }

    public play() {
        this.animating = true;
        setTimeout(() => {
            console.log('go');
            if (this.completeCallback) {
                this.completeCallback();
            }
        }, 10000);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}