import React from 'react';

function Loading() {
  return (
    <div style={styles.loadingStyle}>
      Loading parking spots...
    </div>
  );
}

const styles = {
  loadingStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1000,
  }
};

export default Loading;
