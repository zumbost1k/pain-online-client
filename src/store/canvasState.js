import { makeAutoObservable } from 'mobx';

class CanvasState {
  canvas = null;
  constructor() {
    makeAutoObservable(this);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }
}

const canvasStateInstance = new CanvasState();
export default canvasStateInstance;
