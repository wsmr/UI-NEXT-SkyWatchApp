import React, { useState } from 'react';
import LocationDetector from '../components/LocationDetector';
import { fetchNASAData, fetchTimeanddateData, fetchAuroraData, fetchMeteomaticsData } from '../lib/services/apiService';

const Home = () => {
    const [location, setLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleLocationDetected = async (loc) => {
        setLocation(loc);
        setLoading(true);
        const nasaData = await fetchNASAData('planetary/apod');
        const timeanddateData = await fetchTimeanddateData(`astro?latitude=${loc.latitude}&longitude=${loc.longitude}`);
        const auroraData = await fetchAuroraData();
        const meteomaticsData = await fetchMeteomaticsData('meteor_showers_perseids_visibility:idx');

        setEvents([nasaData, timeanddateData, auroraData, meteomaticsData].filter(event => event !== null));
        setLoading(false);
    };

    return (
        <div>
            <h1>SkyWatchApp</h1>
            <LocationDetector onLocationDetected={handleLocationDetected} />
            {loading ? (
                <p>Loading events...</p>
            ) : (
                <div>
                    {events.map((event, index) => (
                        <div key={index}>
                            <h2>{event.title || 'Event'}</h2>
                            <p>{event.explanation || event.description || 'No description available'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
