import Canvas from './components/Canvas';
import SettingBar from './components/SettingBar';
import ToolBar from './components/Toolbar';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div className='app'>
        <Routes>
          <Route
            path='/:id'
            element={
              <div>
                <ToolBar />
                <SettingBar />
                <Canvas />
              </div>
            }
          />
          <Route
            path='*'
            element={
              <Navigate to={`f${(+new Date()).toString(16)}`} replace={true} />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
