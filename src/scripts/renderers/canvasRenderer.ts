import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';

const WIDTH: number = 1920 / 2;
const HEIGHT: number = 1080 / 2;

let tl;

const srandom = seedrandom('b');

export default class CanvasRenderer implements BaseRenderer{

    colors = ['#4EEC6C', '#FFEB34', '#00A7FF', '#FF6100', '#FF0053'];
    backgroundColor = '#FFFFFF';
    items: any = [];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    maxSize = 10;
    completeCallback: any;
    delta = 0;
    color = this.colors[0];

    constructor(canvas: HTMLCanvasElement) {
        
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        /// add items

        for (let i = 0; i < 1000; i++) {
            let x = -100 + (i * 10);
            let y = srandom();
            let int = Math.floor(srandom() * this.colors.length);
            let color = this.colors[int];
            this.items.push({pos: {x, y}, color});
        }

        /// end add items

        this.reset();
        //this.createTimeline();
    }

    private reset() {
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            item.pos.y += -10;
        }
    }

    public render() {
        this.animate();

        for (let i = this.items.length - 1; i > -1; i--) {
            this.ctx.save();
            this.ctx.beginPath();

            let item = this.items[i];
            let x = item.pos.x;
            let y = item.pos.y;

            this.ctx.fillStyle = item.color;

            this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }

    }

    private animate() {
        this.delta += 0.1;

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            item.pos.x += Math.sin(this.delta) * 3;
            item.pos.y += 3;

            if (item.pos.y > HEIGHT) {
                item.pos.y = -10;
                if (this.completeCallback) {
                    this.completeCallback();
                }
            }
        }
    }

    private createTimeline() {
        
        /*
        tl = gsap.timeline({
            repeat: -1,
            onComplete: () => this.handleComplete(),
            onRepeat: () => this.handleRepeat()
        });

        tl.timeScale(10);

        const duration = 10;

        for (let j = 0; j < 500; j++) {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];

                let dist = 1;
                tl.set(item.pos, {
                    x: `+=${dist}`,
                    y: `+=${dist}`
                }, j / duration)
            }
        }

        tl.to(this, {
            color: this.delta,
            duration: duration,
            ease: 'none'
        }, 0);
                
        console.log('DURATION:', tl.duration());
        */

    }

    protected handleRepeat() {

        if (this.completeCallback) {
            this.completeCallback();
        }

        this.reset();
    }

    protected handleComplete() {

    }

    public play() {
        this.reset();
        //tl.restart();
    }

    public stop() {
        this.reset();
        //tl.pause(true);
        //tl.time(0);
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        
    }

    randomX(i: number) {
        return (WIDTH / 2) + Math.sin(i) * ( 50 * srandom());
    }

    randomY(i: number) {
        return (WIDTH / 2) + Math.sin(i) * ( 50 * srandom());
    }
}