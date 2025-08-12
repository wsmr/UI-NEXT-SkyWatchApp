import React, { useState } from 'react';
import LocationDetector from '@/components/LocationDetector';
import { fetchNASAData, fetchTimeanddateData, fetchAuroraData, fetchMeteomaticsData } from '@/lib/apiService';

const Home: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLocationDetected = async (loc: { latitude: number; longitude: number }) => {
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
