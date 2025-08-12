// src/app/page.tsx
import React from 'react';
import AuroraForecastCard from '@/components/AuroraForecastCard';
import LocationDetector from '@/components/LocationDetector';
import { fetchNASAData, fetchTimeanddateData, fetchAuroraData, fetchMeteomaticsData } from '@/lib/apiService';

const HomePage: React.FC = () => {
  const [location, setLocation] = React.useState<{ latitude: number; longitude: number } | null>(null);

  const handleLocationDetected = (loc: { latitude: number; longitude: number }) => {
    setLocation(loc);
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">SkyWatchApp</h1>
        <LocationDetector onLocationDetected={handleLocationDetected} />
        {location && (
            <div className="mt-6">
              <AuroraForecastCard />
            </div>
        )}
      </div>
  );
};

export default HomePage;
