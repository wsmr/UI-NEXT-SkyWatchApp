const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/astronomical-events', async (req, res) => {
    const { location } = req.query;
    try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY&location=${location}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from NASA API:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
