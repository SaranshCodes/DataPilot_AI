import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Predict from './pages/Predict';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/upload"
          element={token ? <Upload /> : <Navigate to="/" />}
        />
        <Route
          path="/results"
          element={token ? <Results /> : <Navigate to="/" />}
        />
        <Route
          path="/predict"
          element={token ? <Predict /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;