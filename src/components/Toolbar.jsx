import toolState from '../store/toolState';
import '../styles/toolbar.css';
import Brush from '../tools/Brush';
import canvasState from '../store/canvasState';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';

const ToolBar = () => {
  const changeColor = (e) => {
    toolState.setStrokeColor(e.target.value);
    toolState.setFillColor(e.target.value);
  };

  const downloadHandler = () => {
    const dataUrl = canvasState.canvas.toDataURL();
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = canvasState.sessionid + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div className='toolbar'>
      <button
        className='toolbar__btn brush'
        onClick={() =>
          toolState.setTool(
            new Brush(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      />
      <button
        className='toolbar__btn rect'
        onClick={() =>
          toolState.setTool(
            new Rect(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      />

      <button
        className='toolbar__btn circle'
        onClick={() => {
          toolState.setTool(new Circle(canvasState.canvas));
        }}
      />
      <button
        className='toolbar__btn eraser'
        onClick={() => {
          toolState.setTool(new Eraser(canvasState.canvas));
        }}
      />
      <button className='toolbar__btn line' />
      <input onChange={changeColor} type='color' style={{ marginLeft: 10 }} />
      <button
        className='toolbar__btn undo'
        onClick={() => {
          canvasState.undo();
        }}
      />
      <button
        className='toolbar__btn redo'
        onClick={() => {
          canvasState.redo();
        }}
      />
      <button className='toolbar__btn save' onClick={downloadHandler} />
    </div>
  );
};

export default ToolBar;
