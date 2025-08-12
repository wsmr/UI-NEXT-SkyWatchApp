import { useGeolocation, getLocationFromIP } from '@/hooks/useGeolocation';
import { useState, useEffect } from 'react';

interface LocationDetectorProps {
    onLocationUpdate: (latitude: number, longitude: number) => void;
}

interface ManualLocationFormProps {
    onSubmit: (latitude: number, longitude: number) => void;
}

/**
 * Form component for manual location entry
 */
function ManualLocationForm({ onSubmit }: ManualLocationFormProps) {
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // Use OpenStreetMap Nominatim API to geocode the city name
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                onSubmit(parseFloat(lat), parseFloat(lon));
            } else {
                setError('Location not found. Please try a different city name.');
            }
        } catch (err) {
            setError('Error searching for location. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="input-group">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name or address"
                    className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                >
                    {loading ? 'Searching...' : 'Set Location'}
                </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
    );
}

/**
 * Component for location detection with fallback to IP-based location and manual entry
 */
export default function LocationDetector({ onLocationUpdate }: LocationDetectorProps) {
    const [locationState, setLocationState] = useState({
        latitude: null as number | null,
        longitude: null as number | null,
        city: null as string | null,
        region: null as string | null,
        country: null as string | null,
        loading: true,
        error: null as string | null,
        source: null as 'browser' | 'ip' | 'manual' | null,
    });

    const [showManualEntry, setShowManualEntry] = useState(false);
    const geoLocation = useGeolocation();

    // Update parent component when location changes
    useEffect(() => {
        if (locationState.latitude && locationState.longitude) {
            onLocationUpdate(locationState.latitude, locationState.longitude);
        }
    }, [locationState.latitude, locationState.longitude, onLocationUpdate]);

    useEffect(() => {
        async function getLocation() {
            // If browser geolocation is successful, use it
            if (geoLocation.latitude && geoLocation.longitude) {
                setLocationState({
                    latitude: geoLocation.latitude,
                    longitude: geoLocation.longitude,
                    city: null, // We don't get city from browser geolocation
                    region: null,
                    country: null,
                    loading: false,
                    error: null,
                    source: 'browser',
                });
                return;
            }

            // If browser geolocation failed or is still loading after timeout, try IP-based location
            if (geoLocation.error || geoLocation.loading) {
                try {
                    const ipLocation = await getLocationFromIP();
                    if (ipLocation) {
                        setLocationState({
                            latitude: ipLocation.latitude,
                            longitude: ipLocation.longitude,
                            city: ipLocation.city,
                            region: ipLocation.region,
                            country: ipLocation.country,
                            loading: false,
                            error: null,
                            source: 'ip',
                        });
                    } else {
                        setLocationState(prev => ({
                            ...prev,
                            loading: false,
                            error: 'Could not determine location automatically',
                            source: null,
                        }));
                        setShowManualEntry(true);
                    }
                } catch (error) {
                    setLocationState(prev => ({
                        ...prev,
                        loading: false,
                        error: 'Failed to get location automatically',
                        source: null,
                    }));
                    setShowManualEntry(true);
                }
            }
        }

        // Wait a bit before trying IP-based location to give browser geolocation a chance
        const timeoutId = setTimeout(() => {
            if (geoLocation.loading) {
                getLocation();
            }
        }, 5000);

        // If geolocation resolves before timeout, handle it immediately
        if (!geoLocation.loading) {
            getLocation();
            clearTimeout(timeoutId);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [geoLocation.latitude, geoLocation.longitude, geoLocation.loading, geoLocation.error]);

    const handleManualLocationSubmit = (latitude: number, longitude: number) => {
        setLocationState({
            latitude,
            longitude,
            city: null,
            region: null,
            country: null,
            loading: false,
            error: null,
            source: 'manual',
        });
        setShowManualEntry(false);
    };

    const handleChangeLocation = () => {
        setShowManualEntry(true);
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Location</h2>

            {locationState.loading ? (
                <div className="text-center py-2">
                    <p>Detecting your location...</p>
                    <button
                        onClick={() => {
                            setLocationState(prev => ({ ...prev, loading: false }));
                            setShowManualEntry(true);
                        }}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                    >
                        Enter Location Manually
                    </button>
                </div>
            ) : showManualEntry ? (
                <div className="manual-entry">
                    <p className="mb-3">Please enter your location:</p>
                    <ManualLocationForm onSubmit={handleManualLocationSubmit} />
                    {locationState.latitude && locationState.longitude && (
                        <button
                            onClick={() => setShowManualEntry(false)}
                            className="mt-3 w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-white"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            ) : locationState.error ? (
                <div className="error text-center">
                    <p className="text-red-400 mb-3">Error: {locationState.error}</p>
                    <button
                        onClick={() => setShowManualEntry(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                    >
                        Enter Location Manually
                    </button>
                </div>
            ) : (
                <div className="location-info text-center">
                    <p className="mb-3">
                        Location {locationState.source === 'manual' ? 'entered manually' :
                        locationState.source === 'ip' ? 'detected (using IP address)' :
                            'detected'}:
                        {locationState.city && ` ${locationState.city},`}
                        {locationState.region && ` ${locationState.region},`}
                        {locationState.country && ` ${locationState.country}`}
                        {!locationState.city && !locationState.region && !locationState.country &&
                            ` ${locationState.latitude?.toFixed(4)}, ${locationState.longitude?.toFixed(4)}`}
                    </p>
                    <button
                        onClick={handleChangeLocation}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                    >
                        Change Location
                    </button>
                </div>
            )}
        </div>
    );
}
