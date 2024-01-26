import { observer } from 'mobx-react-lite';
import '../styles/canvas.css';
import { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import Brush from '../tools/Brush';
import toolState from '../store/toolState';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';
import axios from 'axios';

const Canvas = observer(() => {
  const [modal, setModal] = useState(true);
  const usernameRef = useRef();
  const canvasRef = useRef();
  const { id } = useParams();
  const mouseDownHandler = () => {
    canvasState.pustToUndo(canvasRef.current.toDataURL());
    axios.post(`http://localhost:5000/image?id=${id}`, {
      img: canvasRef.current.toDataURL(),
    });
  };

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext('2d');
    axios.get(`http://localhost:5000/image?id=${id}`).then((responce) => {
      const img = new Image();
      img.src = responce.data;
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(
          img,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      };
    });
  }, [id]);

  useEffect(() => {
    if (!modal) {
      const socket = new WebSocket(`ws://localhost:5000/`);
      canvasState.setSocket(socket);
      canvasState.setSessionId(id);
      toolState.setTool(new Brush(canvasRef.current, socket, id));
      socket.onopen = () => {
        console.log('connection sucessfuly');
        socket.send(
          JSON.stringify({
            id: id,
            username: canvasState.username,
            method: 'connection',
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case 'connection':
            console.log(`user ${msg.username} connected`);
            break;
          case 'draw':
            drawHandler(msg);
            break;

          default:
            break;
        }
      };
    }
  }, [id, modal]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case 'rect':
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color
        );
        break;
      case 'finish':
        ctx.beginPath();
        break;
      default:
        break;
    }
  };

  const connectHandler = () => {
    if (usernameRef.current.value) {
      canvasState.setUserName(usernameRef.current.value);
      setModal(false);
    }
  };

  return (
    <div className='canvas'>
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Enter your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type='text' ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => connectHandler()}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={mouseDownHandler}
        ref={canvasRef}
        width={600}
        height={400}
      />
    </div>
  );
});

export default Canvas;
