import BaseRecorder from './baseRecorder';

declare global {
    interface Window { CCapture: any; }
}

export default class CCaptureRecorder implements BaseRecorder{

    capturing: boolean = false;
    capturer: any;
    canvas: HTMLCanvasElement;
    type: string = 'gif';

    constructor(canvas?: HTMLCanvasElement, format?: string) {
        this.type = format || this.type;
        this.canvas = canvas;
    }

    public start() {
        console.log(this.canvas);
        this.capturer = new window.CCapture( { 
            name: 'render',
            format: this.type, 
            workersPath: 'libs/ccapture/' 
        });
        this.capturing = true;
        this.capturer.start();
    }

    public stop() {
        this.capturing = false;
        this.capturer.stop();
        this.capturer.save();
    }

    public update() {
        if (this.capturing) {
            this.capturer.capture( this.canvas );
        }
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public setFormat(newFormat: string) {
        this.type = newFormat;
    }
}