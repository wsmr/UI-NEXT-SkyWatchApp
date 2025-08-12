import {useGeolocation, getLocationFromIP} from '@/hooks/useGeolocation';
import {useState, useEffect} from 'react';

interface ManualLocationFormProps {
    onSubmit: (latitude: number, longitude: number) => void;
}

/**
 * Form component for manual location entry
 */
function ManualLocationForm({onSubmit}: ManualLocationFormProps) {
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
                const {lat, lon} = data[0];
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
        <form onSubmit={handleSubmit} className="manual-location-form">
            <div className="input-group">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="location-input"
                    required
                />
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Searching...' : 'Set Location'}
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    city: string | null;
    region: string | null;
    country: string | null;
    loading: boolean;
    error: string | null;
    source: 'browser' | 'ip' | 'manual' | null;
}

interface LocationDetectorProps {
    onLocationUpdate?: (lat: number, lng: number) => void
}

/**
 * Component for location detection with fallback to IP-based location and manual entry
 */
export default function LocationDetector({onLocationUpdate}: LocationDetectorProps) {
    const [locationState, setLocationState] = useState<LocationState>({
        latitude: null,
        longitude: null,
        city: null,
        region: null,
        country: null,
        loading: true,
        error: null,
        source: null,
    });

    const [showManualEntry, setShowManualEntry] = useState(false);
    const geoLocation = useGeolocation();

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
        <div className="location-detector">
            {locationState.loading ? (
                <div className="loading">Detecting your location...</div>
            ) : showManualEntry ? (
                <div className="manual-entry">
                    <p>Please enter your location:</p>
                    <ManualLocationForm onSubmit={handleManualLocationSubmit}/>
                </div>
            ) : locationState.error ? (
                <div className="error">
                    <p>Error: {locationState.error}</p>
                    <button onClick={() => setShowManualEntry(true)} className="manual-entry-button">
                        Enter Location Manually
                    </button>
                </div>
            ) : (
                <div className="location-info">
                    <p>
                        Location {locationState.source === 'manual' ? 'entered manually' :
                        locationState.source === 'ip' ? 'detected (using IP address)' :
                            'detected'}:
                        {locationState.city && ` ${locationState.city},`}
                        {locationState.region && ` ${locationState.region},`}
                        {locationState.country && ` ${locationState.country}`}
                        {!locationState.city && !locationState.region && !locationState.country &&
                            ` ${locationState.latitude?.toFixed(4)}, ${locationState.longitude?.toFixed(4)}`}
                    </p>
                    <button onClick={handleChangeLocation} className="change-location-button">
                        Change Location
                    </button>
                </div>
            )}
        </div>
    );
}
