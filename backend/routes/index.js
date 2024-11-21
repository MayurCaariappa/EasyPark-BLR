const { Router } = require("express");
const cors = require("cors");
const express = require("express");
const axios = require("axios");

const app = express();
app.use(cors());

const router = Router();

router.get('/parking-spots', async (req, res) => {
    const overpassQuery = `[out:json][timeout:25];area(id:3607902476)->.searchArea;nwr["amenity"="parking"](area.searchArea);out geom;`;
    const apiUrl = 'https://overpass-api.de/api/interpreter';
    try {
        const response = await axios.post(apiUrl, `data=${encodeURIComponent(overpassQuery)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching parking spots:', error);
        res.status(500).json({ error: 'Failed to fetch parking spots' });
    }
});

module.exports = { router };