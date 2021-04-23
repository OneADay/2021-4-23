

let saveThumbnail = (canvas: HTMLCanvasElement) => {
    let url = canvas.toDataURL('image/jpg');

    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail.jpg`;

    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );
}

export default saveThumbnail;