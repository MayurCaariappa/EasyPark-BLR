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
        fetchParkingSpotsAndChargingStations(maplibre);
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

  const fetchParkingSpotsAndChargingStations = async (maplibre) => {
    try {
      // Fetch parking spots
      const parkingResponse = await fetch('https://easypark-blr.onrender.com/api/v1/parking-spots');
      // const parkingResponse  = await fetch('http://localhost:3000/api/v1/parking-spots');
      if (!parkingResponse .ok) throw new Error('Failed to fetch parking spots');

      const parkingData = await parkingResponse .json();
      const { parkingSpots = [] } = parkingData;

      // Fetch EV charging stations
      const chargingResponse = await fetch('https://easypark-blr.onrender.com/api/v1/charging-stations');
      // const chargingResponse = await fetch('http://localhost:3000/api/v1/charging-stations');
      if (!chargingResponse.ok) throw new Error('Failed to fetch EV charging stations');

      const chargingData = await chargingResponse.json();
      const { parkingSpots: evChargingStations = [] } = chargingData;

      // parking spots markers
      if (Array.isArray(parkingSpots)) {
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
      if (Array.isArray(evChargingStations)) {
        evChargingStations.forEach((station) => {
          if (station.type === 'node' && station.lat && station.lon) {
            const el = createEVMarker();

            const chargingName = station.tags?.name || station.tags?.addr || 'EV Charging';

            const popup = new maplibre.Popup({ offset: 25 }).setHTML(`
              <h3>${chargingName}</h3>
              <p>Location: ${station.lat.toFixed(4)}, ${station.lon.toFixed(4)}</p>
              ${station.tags?.parking ? `<p>Parking: ${station.tags.parking}</p>` : ''}`);

            new maplibre.Marker(el)
              .setLngLat([station.lon, station.lat])
              .setPopup(popup)
              .addTo(map.current);
          }
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
