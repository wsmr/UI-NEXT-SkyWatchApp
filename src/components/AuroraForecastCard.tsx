// src/components/AuroraForecastCard.tsx
import React, { useState, useEffect } from 'react';
import { fetchAuroraData } from '@/lib/apiService';

interface AuroraData {
    issued: string;
    breakdown: Array<{
        start: string;
        kp: string;
    }>;
}

const AuroraForecastCard: React.FC = () => {
    const [auroraData, setAuroraData] = useState<AuroraData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAuroraData();
                if (data) {
                    setAuroraData(data);
                } else {
                    setError("No aurora forecast data available.");
                }
            } catch (err) {
                setError("Failed to fetch aurora forecast data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading aurora forecast...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-xl font-bold mb-4">Aurora Forecast</h2>
            {auroraData && (
                <div>
                    <p className="mb-2">Forecast issued: {new Date(auroraData.issued).toLocaleString()}</p>
                    <div className="space-y-2">
                        {auroraData.breakdown.map((item, index) => (
                            <div key={index} className="p-4 bg-gray-100 rounded-lg">
                                <p>Date: {new Date(item.start).toLocaleDateString()}</p>
                                <p>KP Index: {item.kp}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuroraForecastCard;
