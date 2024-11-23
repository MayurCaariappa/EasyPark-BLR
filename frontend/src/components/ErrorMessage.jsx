import PropTypes from 'prop-types';

function ErrorMessage({ message }) {
  return (
    <div style={styles.errorStyle}>
      Error: {message}
    </div>
  );
}

const styles = {
  errorStyle: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '1rem',
    borderRadius: '8px',
    zIndex: 1000,
  }
};

ErrorMessage.propTypes = {
  message: PropTypes.func.isRequired
};

export default ErrorMessage;
