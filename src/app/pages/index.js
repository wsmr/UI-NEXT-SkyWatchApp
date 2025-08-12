import React, { useState, useEffect } from 'react';
import { fetchNASAData, fetchTimeanddateData, fetchAuroraData, fetchMeteomaticsData } from '../services/apiService';

const Home = () => {
    const [location, setLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (location) {
            setLoading(true);
            const fetchData = async () => {
                const nasaData = await fetchNASAData('planetary/apod');
                const timeanddateData = await fetchTimeanddateData(`astro?latitude=${location.latitude}&longitude=${location.longitude}`);
                const auroraData = await fetchAuroraData();
                const meteomaticsData = await fetchMeteomaticsData('meteor_showers_perseids_visibility:idx');

                setEvents([nasaData, timeanddateData, auroraData, meteomaticsData].filter(event => event !== null));
                setLoading(false);
            };

            fetchData();
        }
    }, [location]);

    return (
        <div>
            <h1>SkyWatchApp</h1>
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
