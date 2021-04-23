const formats = [
    'gif',
    'webm',
    'thumbnail'
];

export default class DebugUI{
    formatSelect: HTMLSelectElement;
    recordBtn: HTMLButtonElement;

    constructor() {

        this.formatSelect = document.createElement('select');
        for (let i = 0; i < formats.length; i++) {
            let option = document.createElement('option');
            option.value = formats[i];
            option.innerText = formats[i];
            this.formatSelect.appendChild(option);
        }
        
        this.recordBtn = document.createElement('button');
        this.recordBtn.innerText = 'render';


        document.body.appendChild(this.recordBtn);
        document.body.appendChild(this.formatSelect);
    }


}
