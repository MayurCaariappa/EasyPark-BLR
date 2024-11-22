import React, { useEffect, useRef } from 'react';

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
        zoom: 12
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

  const fetchParkingSpots = async (maplibre) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/parking-spots');
      if (!response.ok) throw new Error('Failed to fetch parking spots');
      
      const data = await response.json();
      const spots = data.elements || [];
      
      spots.forEach(spot => {
        if (spot.type === 'node' && spot.lat && spot.lon) {
          const el = document.createElement('div');
          el.className = 'parking-marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/708/708949.png)';
          el.style.backgroundSize = 'cover';
          el.style.cursor = 'pointer';

          const parkingName = spot.tags?.name || spot.tags?.addr || "Parking";

          const popup = new maplibre.Popup({ offset: 25 })
            .setHTML(`
              <h3>${parkingName}</h3>
              <p>Location: ${spot.lat.toFixed(4)}, ${spot.lon.toFixed(4)}</p>
              ${spot.tags?.capacity ? `<p>Capacity: ${spot.tags.capacity}</p>` : ''}
              ${spot.tags?.parking ? `<p>Parking: ${spot.tags.parking}</p>` : ''}
            `);

          new maplibre.Marker(el)
            .setLngLat([spot.lon, spot.lat])
            .setPopup(popup)
            .addTo(map.current);
        }
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching parking spots:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return <div ref={mapContainer} style={styles.mapContainerStyle} />;
}

const styles = {
  mapContainerStyle: {
    width: '1200px',
    height: '400px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'block'
  }
};

export default MapContainer;
