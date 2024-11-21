import React, { useState } from 'react';
import MapContainer from './components/MapContainer';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div style={styles.pageStyle}>
      <header style={styles.headerStyle}>
        <h1 style={styles.headerTitle}>EasyPark-BLR</h1>
      </header>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      <MapContainer setLoading={setLoading} setError={setError} />
    </div>
  );
}

const styles = {
  pageStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
  },
  headerStyle: {
    color: 'black',
    marginBottom: '5px',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
};

export default App;
