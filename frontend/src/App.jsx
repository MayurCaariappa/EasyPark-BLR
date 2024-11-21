import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [parkingSpots, setParkingSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/parking-spots')
      .then((response) => {
        // console.log('Response:', response.data)
        const spots = response.data.elements || []
        setParkingSpots(spots)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <h1>EasyPark-BLR</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error loading data: {error.message}</p>}

      {Array.isArray(parkingSpots) && parkingSpots.length > 0 ? (
        <ul>
          {parkingSpots.map((spot, index) => (
            <li key={index}>
              {spot.type === 'node' && (
                <div>
                  <p>Parking Spot at: ({spot.lat}, {spot.lon})</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No parking spots found.</p>
      )}
    </div>
  )
}

export default App
