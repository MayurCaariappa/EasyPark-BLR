import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import boltIcon from '../assets/bolt.svg';

function MapContainer({ setLoading, setError }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    import('maplibre-gl').then((maplibre) => {
      if (map.current) return;

      map.current = new maplibre.Map({
        container: mapContainer.current,
        style: 'https://api.maptiler.com/maps/hybrid/style.json?key=cUhaeJ76X7PhamPkbAvd',
        center: [77.5946, 12.9716],
        zoom: 12,
      });

      map.current.addControl(new maplibre.NavigationControl());
      map.current.on('load', () => {
        fetchParkingSpots(maplibre);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const createParkingMarker = () => {
    const el = document.createElement('div');
    el.className = 'marker parking-marker';
    el.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#3B82F6"
        style="cursor: pointer"
      >
        <circle cx="12" cy="12" r="12" fill="#3B82F6" />
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dy=".3em"
          font-size="12"
          fill="white"
          font-family="Arial"
          font-weight="bold"
        >
          P
        </text>
      </svg>`;
    return el;
  };

  const createEVMarker = () => {
    const el = document.createElement('div');
    el.className = 'marker ev-marker';
    
    // Create an img element for the bolt icon
    const img = document.createElement('img');
    img.src = boltIcon;
    img.style.width = '24px';
    img.style.height = '24px';
    img.style.cursor = 'pointer';
    
    el.appendChild(img);
    return el;
  };

  const fetchParkingSpots = async (maplibre) => {
    try {
      const response = await fetch('https://easypark-blr.onrender.com/api/v1/parking-spots');
      // const response = await fetch('http://localhost:3000/api/v1/parking-spots');
      if (!response.ok) throw new Error('Failed to fetch parking spots');

      const data = await response.json();
      const { parkingSpots = [], evChargingStations = [] } = data;

      console.log('Parking spots:', parkingSpots.length);
      console.log('EV stations:', evChargingStations.length);

      // parking spots markers
      if (parkingSpots && Array.isArray(parkingSpots)) {
        parkingSpots.forEach((spot) => {
          if (spot.type === 'node' && spot.lat && spot.lon) {
            const el = createParkingMarker();

            const parkingName = spot.tags?.name || spot.tags?.addr || 'Parking';

            const popup = new maplibre.Popup({ offset: 25 }).setHTML(`
              <h3>${parkingName}</h3>
              <p>Location: ${spot.lat.toFixed(4)}, ${spot.lon.toFixed(4)}</p>
              ${spot.tags?.capacity ? `<p>Capacity: ${spot.tags.capacity}</p>` : ''}
              ${spot.tags?.parking ? `<p>Parking: ${spot.tags.parking}</p>` : ''}`);

            new maplibre.Marker(el)
              .setLngLat([spot.lon, spot.lat])
              .setPopup(popup)
              .addTo(map.current);
          }
        });
      }

      // EV charging station
      if (evChargingStations && Array.isArray(evChargingStations)) {
        evChargingStations.forEach((station) => {
          const el = createEVMarker();

          const popup = new maplibre.Popup({ offset: 25 }).setHTML(`
            <h3>EV Charging Station</h3>
            <p>Location: ${station.lat.toFixed(4)}, ${station.lon.toFixed(4)}</p>`);

          new maplibre.Marker(el)
            .setLngLat([station.lon, station.lat])
            .setPopup(popup)
            .addTo(map.current);
        });
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching parking spots:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.mapContainerWrapper}>
        <div style={styles.legendContainer}>
          <div style={styles.legendStyle}>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, backgroundColor: '#3B82F6' }}></div>
              <span>Parking Spots</span>
            </div>
            <div style={styles.legendItem}>
              <img src={boltIcon} alt="EV" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              <span>EV Charging Stations</span>
            </div>
          </div>
        </div>
        <div ref={mapContainer} style={styles.mapContainerStyle} />
      </div>
    </>
  );
}

const styles = {
  mapContainerWrapper: {
    position: 'relative',
    width: '100%',
    height: '600px',
    marginTop: '20px',
  },
  mapContainerStyle: {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'block',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  
  legendContainer: {
    position: 'absolute',
    top: '10px',
    right: '50px',
    zIndex: 1,
    padding: '10px 15px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  legendStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: '16px',
    lineHeight: '1.5',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontWeight: '500',
  },
  legendDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    marginRight: '8px',
  },
};

// Mobile-friendly
const mobileStyles = {
  legendStyle: {
    fontSize: '12px',
  },
  legendDot: {
    width: '11px',
    height: '11px',
  },
};

if (window.innerWidth <= 768) {
  Object.assign(styles.legendStyle, mobileStyles.legendStyle);
  Object.assign(styles.legendDot, mobileStyles.legendDot);
}

MapContainer.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default MapContainer;
