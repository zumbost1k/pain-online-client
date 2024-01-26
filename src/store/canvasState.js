import { makeAutoObservable } from 'mobx';

class CanvasState {
  canvas = null;
  undoList = [];
  redoList = [];
  username = '';
  socket = null;
  sessionid = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  setUserName(username) {
    this.username = username;
  }

  setSessionId(id) {
    this.sessionid = id;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  pustToUndo(data) {
    this.undoList.push(data);
  }
  pustToRedo(data) {
    this.redoList.push(data);
  }
  undo() {
    let ctx = this.canvas.getContext('2d');
    if (this.undoList.length > 0) {
      let dataUrl = this.undoList.pop();
      this.redoList.push(this.canvas.toDataURL());
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.heigth);
    }
  }

  redo() {
    let ctx = this.canvas.getContext('2d');
    if (this.redoList.length > 0) {
      let dataUrl = this.redoList.pop();
      this.undoList.push(this.canvas.toDataURL());
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  }
}

const canvasStateInstance = new CanvasState();
export default canvasStateInstance;
