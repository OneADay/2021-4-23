import BaseRecorder from './baseRecorder';

export default class Recorder implements BaseRecorder{

    mediaRecorder: MediaRecorder;

    constructor(canvas) {

        console.log("using MediaRecorder:");
        console.log('gif support?', MediaRecorder.isTypeSupported('image/gif'));
        console.log('webm support?', MediaRecorder.isTypeSupported('video/webm'));
        console.log('mp4 support?', MediaRecorder.isTypeSupported('video/mp4'));

        const canvasStream = canvas.captureStream(30);
        const stream = new MediaStream([
          canvasStream.getTracks()[0],
        ]);

        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
            videoBitsPerSecond: 5000000
        });
        this.mediaRecorder.addEventListener("dataavailable", (e) => this.handleFinishCapturing(e));
        console.log('videoBitsPerSecond', this.mediaRecorder.videoBitsPerSecond);
    }

    public start() {
        this.mediaRecorder.start();
    }

    public stop() {
        this.mediaRecorder.stop();
    }

    public update() {
        
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        
    }
    
    public setFormat(newFormat: string) {

    }

    private handleFinishCapturing(e) {
        const videoData = [e.data];
        const type = e.data.type.split(';');
        const mimeType = type[0];

        const blob = new Blob(videoData, { type: mimeType });
        const url = URL.createObjectURL(blob);
        this.download(url);
    }

    private download(url) {
        const link = document.createElement('a');
        link.href = url;
        const date = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
        link.download = `OneADay_${date}.webm`;
    
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true, 
            view: window 
          })
        );
    }
}