import { useState, useEffect } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    loading: boolean;
    error: string | null;
}

interface UseGeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

/**
 * Hook to get the user's current geolocation
 * @param options Geolocation API options
 * @returns GeolocationState object with coordinates and status
 */
export function useGeolocation(options: UseGeolocationOptions = {}) {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Geolocation is not supported by your browser',
            }));
            return;
        }

        const geoOptions = {
            enableHighAccuracy: options.enableHighAccuracy || true,
            timeout: options.timeout || 10000,
            maximumAge: options.maximumAge || 0,
        };

        const successHandler = (position: GeolocationPosition) => {
            setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                loading: false,
                error: null,
            });
        };

        const errorHandler = (error: GeolocationPositionError) => {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message,
            }));
        };

        const watchId = navigator.geolocation.watchPosition(
            successHandler,
            errorHandler,
            geoOptions
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

    return state;
}

/**
 * Hook to get the user's location from IP address as fallback
 * @returns Promise with location data
 */
export async function getLocationFromIP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        const data = await response.json();
        return {
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            region: data.region,
            country: data.country_name,
        };
    } catch (error) {
        console.error('Error fetching location from IP:', error);
        return null;
    }
}
