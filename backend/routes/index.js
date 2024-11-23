const { Router } = require("express");
const cors = require("cors");
const express = require("express");
const axios = require("axios");

const app = express();
app.use(cors());

const router = Router();

const evChargingStations = [
    { lat: 12.651058133703, lon: 77.750244140625 },
    { lat: 12.460966044054, lon: 77.860107421875 },
    { lat: 12.739730648782, lon: 77.481079101563 },
    { lat: 12.996780096936, lon: 77.722778320312 },
    { lat: 12.921834590407, lon: 77.310791015625 },
    { lat: 12.745088524723, lon: 77.261352539063 },
    { lat: 12.911126250032, lon: 77.9150390625 },
    { lat: 12.893598718737, lon: 77.637634277344 },
    { lat: 12.840046397007, lon: 77.813415527344 },
    { lat: 12.7730899532, lon: 77.890319824219 },
    { lat: 12.912339327265, lon: 77.450866699219 },
    { lat: 12.671282205831, lon: 77.54150390625 },
];

router.get('/parking-spots', async (req, res) => {
    const overpassQuery = `[out:json][timeout:25];area(id:3607902476)->.searchArea;nwr["amenity"="parking"](area.searchArea);out geom;`;
    const apiUrl = 'https://overpass-api.de/api/interpreter';
    try {
        const response = await axios.post(apiUrl, `data=${encodeURIComponent(overpassQuery)}`, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded',},
        });

        res.json({
            parkingSpots: response.data.elements,
            evChargingStations: evChargingStations
        });
    } catch (error) {
        console.error('Error fetching parking spots:', error);
        res.status(500).json({ error: 'Failed to fetch parking spots' });
    }
});

module.exports = { router };