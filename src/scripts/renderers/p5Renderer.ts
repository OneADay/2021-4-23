import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

let squares = [];

let tl;

let image;
let dw = 0, dh = 0;
let freq;
let minSize;
let px = [];

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
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

        tl = gsap.timeline({
            //paused: true,
            repeat: -1,
            onUpdate: () => {
                if (tl.time() === 4) {
                    if (this.completeCallback) {
                        this.completeCallback();
                    }
                }
        }});

        //tl.timeScale(0.5);

        s.noiseSeed(99);
        this.size = (s.width / 30);

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                let x = i * this.size;
                let y = j * this.size;

                let square = {ox: x, oy: y, x: x, y: y, r: 0, g: 0, b: 0, a: 0, scale: 0};
                squares.push(square);

                let _tl = gsap.timeline({repeat: -1});
                _tl.set(square, {scale: 0, y: y, r: 100, g: 200, b: 255, a: 255});
                _tl.to(square, {scale: 10, r: 255, g: 255, b: 255, a: 255, duration: 0.5, ease: 'none'});
                _tl.to(square, {y: '-=70', scale: 0, duration: 0.5, ease: 'pow2.inout'}, 0.5);
                _tl.to(square, {r: 255, g: 100, b: 200, a: 255, scale: 0, duration: 0.25, ease: 'pow.in'}, 0.5);
                _tl.to(square, {r: 255, g: 100, b: 200, a: 0, duration: 0.25, ease: 'pow.in'}, 0.75);

                let offset = 2 * s.noise(x, y);                
                tl.add(_tl, offset);
            }
        }
    }

    protected draw(s) {
        if (this.animating) { 
            s.background(0, 0, 0, 50);
            this.delta+= 0.01;

            s.translate(this.width / 5.5, this.width / 5.5);
            for (let i = 0; i < squares.length; i++) {
                let square = squares[i];
                let scale = square.scale;
                s.noStroke();
                //s.fill(255, 255, 255, 255);
                s.fill(square.r, square.g, square.b, square.a);
                s.rect(square.x - (scale / 2), square.y - (scale/ 2), scale, scale);
           }
        }
    }

    public render() {

    }

    public play() {
        this.recording = true;
        this.animating = true;
        tl.time(2);
        tl.tweenTo(4);
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