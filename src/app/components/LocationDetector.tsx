import { useState, useEffect } from 'react';
import { useGeolocation, getLocationFromIP } from '@/hooks/useGeolocation';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  region: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;
  source: 'browser' | 'ip' | null;
}

/**
 * Component for location detection with fallback to IP-based location
 */
export default function LocationDetector() {
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
              error: 'Could not determine location from IP address',
            }));
          }
        } catch (error) {
          setLocationState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to get location: ' + (error instanceof Error ? error.message : String(error)),
          }));
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

  return (
    <div className="location-detector">
      {locationState.loading ? (
        <div className="loading">Detecting your location...</div>
      ) : locationState.error ? (
        <div className="error">
          <p>Error: {locationState.error}</p>
          <p>Please enter your location manually:</p>
          {/* Location input form would go here */}
        </div>
      ) : (
        <div className="location-info">
          <p>
            Location detected{locationState.source === 'ip' ? ' (using IP address)' : ''}:
            {locationState.city && ` ${locationState.city},`}
            {locationState.region && ` ${locationState.region},`}
            {locationState.country && ` ${locationState.country}`}
          </p>
          <p>
            Coordinates: {locationState.latitude?.toFixed(4)}, {locationState.longitude?.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}
