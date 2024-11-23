import { useState } from 'react';
import MapContainer from './components/MapContainer';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">EasyPark-BLR</h1>
      </header>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      <div className="map-wrapper">
        <MapContainer setLoading={setLoading} setError={setError} />
      </div>
    </div>
  );
}

export default App;
