import axios from 'axios';

const API_KEYS = {
    NASA: 'YOUR_NASA_API_KEY',
    TIMEANDDATE: 'YOUR_TIMEANDDATE_API_KEY',
    AURORA: 'YOUR_AURORA_API_KEY',
    METEOMATICS: 'YOUR_METEOMATICS_API_KEY'
};

export const fetchNASAData = async (endpoint) => {
    try {
        const response = await axios.get(`https://api.nasa.gov/${endpoint}?api_key=${API_KEYS.NASA}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching NASA data:', error);
        return null;
    }
};

export const fetchTimeanddateData = async (endpoint) => {
    try {
        const response = await axios.get(`https://dev.timeanddate.com/astro/${endpoint}?api_key=${API_KEYS.TIMEANDDATE}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Timeanddate data:', error);
        return null;
    }
};

export const fetchAuroraData = async () => {
    try {
        const response = await axios.get('https://api.aurora.example.com/forecast');
        return response.data;
    } catch (error) {
        console.error('Error fetching Aurora data:', error);
        return null;
    }
};

export const fetchMeteomaticsData = async (parameter) => {
    try {
        const response = await axios.get(`https://api.meteomatics.com/${parameter}?api_key=${API_KEYS.METEOMATICS}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Meteomatics data:', error);
        return null;
    }
};
