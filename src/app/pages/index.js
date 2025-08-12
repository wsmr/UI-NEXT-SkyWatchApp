import React, { useState } from 'react';
import LocationDetector from '../components/LocationDetector';
import { fetchNASAData, fetchTimeanddateData, fetchAuroraData, fetchMeteomaticsData } from '../services/apiService';

const Home = () => {
    const [location, setLocation] = useState(null);
    const [events, setEvents] = useState([]);

    const handleLocationDetected = async (loc) => {
        setLocation(loc);
        const nasaData = await fetchNASAData('planetary/apod');
        const timeanddateData = await fetchTimeanddateData('astro?latitude=' + loc.latitude + '&longitude=' + loc.longitude);
        const auroraData = await fetchAuroraData();
        const meteomaticsData = await fetchMeteomaticsData('meteor_showers_perseids_visibility:idx');

        // Combine all data into events and set it to state
        setEvents([...events, nasaData, timeanddateData, auroraData, meteomaticsData]);
    };

    return (
        <div>
            <h1>SkyWatchApp</h1>
            <LocationDetector onLocationDetected={handleLocationDetected} />
            {location && (
                <div>
                    <h2>Celestial Events</h2>
                    {events.map((event, index) => (
                        <div key={index}>
                            <h3>{event.title || 'Untitled Event'}</h3>
                            <p>{event.description || 'No description available'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
