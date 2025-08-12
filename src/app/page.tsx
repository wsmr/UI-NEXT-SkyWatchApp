import { useState } from 'react';
import LocationDetector from '@/components/LocationDetector';
import { useAstronomyData } from '@/lib/astronomyService';
import MoonPhaseCard from '@/components/MoonPhaseCard';
import PlanetsCard from '@/components/PlanetsCard';
import SatellitesCard from '@/components/SatellitesCard';
import MeteorShowersCard from '@/components/MeteorShowersCard';
import AuroraForecastCard from '@/components/AuroraForecastCard';
import DailyHighlights from '@/components/DailyHighlights';

export default function Home() {
    const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
        latitude: null,
        longitude: null
    });
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Update location when detected
    const handleLocationUpdate = (lat: number, lng: number) => {
        setLocation({ latitude: lat, longitude: lng });
    };

    // Fetch astronomy data based on location
    const { data, loading, error } = useAstronomyData(location.latitude, location.longitude, date);

    return (
        <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-900 to-indigo-950 text-white">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        SkyWatch
                    </h1>
                    <p className="text-lg text-slate-300">
                        Your daily guide to celestial events visible from your location
                    </p>
                </header>

                <div className="mb-8">
                    <LocationDetector onLocationUpdate={handleLocationUpdate} />
                </div>

                {location.latitude && location.longitude ? (
                    <div className="date-selector mb-6">
                        <label htmlFor="date-select" className="block mb-2 text-lg font-medium">
                            Select Date:
                        </label>
                        <input
                            id="date-select"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                ) : null}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-400 border-r-transparent"></div>
                        <p className="mt-4 text-xl">Loading astronomy data...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg">
                        <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
                        <p>{error}</p>
                    </div>
                ) : data ? (
                    <>
                        {/* Daily Highlights Section */}
                        <DailyHighlights data={data} />

                        {/* Detailed Astronomy Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.moonPhase && (
                                <MoonPhaseCard moonPhase={data.moonPhase} />
                            )}

                            {data.planets && data.planets.length > 0 && (
                                <PlanetsCard planets={data.planets} />
                            )}

                            {data.satellites && data.satellites.length > 0 && (
                                <SatellitesCard satellites={data.satellites} />
                            )}

                            {data.meteorShowers && data.meteorShowers.length > 0 && (
                                <MeteorShowersCard meteorShowers={data.meteorShowers} />
                            )}

                            {data.auroraForecast && data.location.latitude && (
                                <div className="md:col-span-2">
                                    <AuroraForecastCard
                                        auroraForecast={data.auroraForecast}
                                        latitude={data.location.latitude}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
                        <h2 className="text-2xl font-bold mb-4">Welcome to SkyWatch</h2>
                        <p className="text-lg mb-4">Please set your location to see astronomical events visible from your area.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
