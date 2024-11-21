# EasyPark-BLR

**EasyPark-BLR** helps users find parking spots in Bangalore, India. It fetches real-time data and displays it on an interactive map, making parking spot discovery easier for users.


## Features

-   **Real-Time Parking Spot Data**: Fetches parking spot data from OpenStreetMap using the Overpass API.
-   **Interactive Map**: Displays parking spots on an interactive map using MapLibre.
-   **Custom Popup Information**: Each parking spot is marked with a clickable icon that shows detailed information like the parking name, location, and capacity.
-   **Backend Integration**: The backend (Express.js) communicates with the Overpass API and serves parking data to the frontend.

## Tech Stack

-   **Frontend**: React.js, Vite, MapLibre
-   **Backend**: Node.js, Express.js, Axios
-   **Map Service**: MapLibre for interactive map rendering
-   **Data Source**: OpenStreetMap via Overpass API