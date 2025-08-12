import { useState, useEffect } from 'react';

// Define interfaces for API responses
interface MoonPhase {
    phase: string;
    illumination: number;
    age: number;
    nextFullMoon: string;
    nextNewMoon: string;
}

interface PlanetVisibility {
    name: string;
    visible: boolean;
    riseTime?: string;
    setTime?: string;
    altitude?: number;
    azimuth?: number;
}

interface SatellitePass {
    name: string;
    startTime: string;
    endTime: string;
    maxElevation: number;
    startAzimuth: number;
    endAzimuth: number;
    visible: boolean;
}

interface MeteorShower {
    name: string;
    active: boolean;
    peak: string;
    rate: number;
    visibility: number;
}

export interface AuroraForecast {
    kpIndex: number;
    probability: number;
    visibility: number;
}

interface AstronomyData {
    date: string;
    location: {
        latitude: number;
        longitude: number;
        name?: string;
    };
    moonPhase?: MoonPhase;
    planets?: PlanetVisibility[];
    satellites?: SatellitePass[];
    meteorShowers?: MeteorShower[];
    auroraForecast?: AuroraForecast;
    error?: string;
}

// NASA API key - in production, this should be stored in environment variables
const NASA_API_KEY = 'DEMO_KEY';

/**
 * Fetch moon phase data from Moon-API
 */
async function fetchMoonPhase(latitude: number, longitude: number, date: string): Promise<MoonPhase | null> {
    try {
        // Note: In a production app, you would need to sign up for Moon-API and use your API key
        // This is a mock implementation for demonstration purposes
        const response = await fetch(`https://moon-api.com/v1/moon?lat=${latitude}&lng=${longitude}&date=${date}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch moon data: ${response.status}`);
        }

        const data = await response.json();
        return {
            phase: data.phase.name,
            illumination: data.illumination,
            age: data.age,
            nextFullMoon: data.nextFullMoon,
            nextNewMoon: data.nextNewMoon
        };
    } catch (error) {
        console.error('Error fetching moon phase:', error);
        return null;
    }
}

/**
 * Fetch planet visibility data from Timeanddate API
 */
async function fetchPlanetVisibility(latitude: number, longitude: number, date: string): Promise<PlanetVisibility[] | null> {
    try {
        // Note: In a production app, you would need to sign up for Timeanddate API and use your API key
        // This is a mock implementation for demonstration purposes
        const planets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

        // Simulate API response with mock data
        const mockPlanets = planets.map(name => {
            const visible = Math.random() > 0.3; // 70% chance of being visible
            return {
                name,
                visible,
                riseTime: visible ? `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM` : undefined,
                setTime: visible ? `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : undefined,
                altitude: visible ? Math.random() * 90 : undefined,
                azimuth: visible ? Math.random() * 360 : undefined
            };
        });

        return mockPlanets;
    } catch (error) {
        console.error('Error fetching planet visibility:', error);
        return null;
    }
}

/**
 * Fetch ISS and satellite passes from NASA TLE API
 */
async function fetchSatellitePasses(latitude: number, longitude: number, date: string): Promise<SatellitePass[] | null> {
    try {
        // For ISS tracking, we would use NASA's TLE API in production
        // This is a mock implementation for demonstration purposes

        // Simulate API response with mock data for ISS
        const mockISS: SatellitePass = {
            name: 'ISS (ZARYA)',
            startTime: new Date(new Date(date).getTime() + Math.random() * 86400000).toISOString(),
            endTime: new Date(new Date(date).getTime() + Math.random() * 86400000 + 600000).toISOString(),
            maxElevation: Math.random() * 90,
            startAzimuth: Math.random() * 360,
            endAzimuth: Math.random() * 360,
            visible: Math.random() > 0.5
        };

        // Add a few more random satellites
        const satellites = ['Hubble Space Telescope', 'NOAA-19', 'Starlink-1234'];
        const mockSatellites = satellites.map(name => ({
            name,
            startTime: new Date(new Date(date).getTime() + Math.random() * 86400000).toISOString(),
            endTime: new Date(new Date(date).getTime() + Math.random() * 86400000 + 600000).toISOString(),
            maxElevation: Math.random() * 90,
            startAzimuth: Math.random() * 360,
            endAzimuth: Math.random() * 360,
            visible: Math.random() > 0.5
        }));

        return [mockISS, ...mockSatellites];
    } catch (error) {
        console.error('Error fetching satellite passes:', error);
        return null;
    }
}

/**
 * Fetch meteor shower data from Meteomatics API
 */
async function fetchMeteorShowers(latitude: number, longitude: number, date: string): Promise<MeteorShower[] | null> {
    try {
        // Note: In a production app, you would need to sign up for Meteomatics API and use your API key
        // This is a mock implementation for demonstration purposes

        // Major meteor showers throughout the year
        const showers = [
            { name: 'Quadrantids', peak: 'January 3-4' },
            { name: 'Lyrids', peak: 'April 22-23' },
            { name: 'Eta Aquariids', peak: 'May 5-6' },
            { name: 'Perseids', peak: 'August 12-13' },
            { name: 'Orionids', peak: 'October 21-22' },
            { name: 'Leonids', peak: 'November 17-18' },
            { name: 'Geminids', peak: 'December 13-14' }
        ];

        // Get current month to determine active showers
        const currentMonth = new Date(date).getMonth();

        // Simulate API response with mock data
        const mockShowers = showers.map(shower => {
            // Determine if shower is active based on month
            const peakMonth = new Date(shower.peak + ', 2025').getMonth();
            const active = Math.abs(currentMonth - peakMonth) <= 1 ||
                (currentMonth === 11 && peakMonth === 0) ||
                (currentMonth === 0 && peakMonth === 11);

            return {
                name: shower.name,
                active,
                peak: shower.peak,
                rate: active ? Math.floor(Math.random() * 100) : 0,
                visibility: active ? Math.random() : 0
            };
        });

        return mockShowers.filter(shower => shower.active || Math.random() > 0.7); // Show some inactive ones too
    } catch (error) {
        console.error('Error fetching meteor showers:', error);
        return null;
    }
}

/**
 * Fetch aurora forecast data from Aurora API
 */
async function fetchAuroraForecast(latitude: number, longitude: number): Promise<AuroraForecast | null> {
    try {
        // Note: In a production app, you would use the aurora-api or NOAA's API
        // This is a mock implementation for demonstration purposes

        // Simulate API response with mock data
        const kpIndex = Math.random() * 9; // KP index ranges from 0-9

        // Higher probability for higher latitudes
        const latitudeEffect = Math.abs(latitude) > 50 ? 0.7 : Math.abs(latitude) > 40 ? 0.3 : 0.1;

        return {
            kpIndex,
            probability: kpIndex > 5 ? 0.8 * latitudeEffect : kpIndex > 3 ? 0.5 * latitudeEffect : 0.2 * latitudeEffect,
            visibility: kpIndex > 5 ? 0.9 * latitudeEffect : kpIndex > 3 ? 0.6 * latitudeEffect : 0.3 * latitudeEffect
        };
    } catch (error) {
        console.error('Error fetching aurora forecast:', error);
        return null;
    }
}

/**
 * Main function to fetch all astronomy data
 */
export async function fetchAstronomyData(latitude: number, longitude: number, date: string = new Date().toISOString().split('T')[0]): Promise<AstronomyData> {
    try {
        // Fetch all data in parallel
        const [moonPhase, planets, satellites, meteorShowers, auroraForecast] = await Promise.all([
            fetchMoonPhase(latitude, longitude, date),
            fetchPlanetVisibility(latitude, longitude, date),
            fetchSatellitePasses(latitude, longitude, date),
            fetchMeteorShowers(latitude, longitude, date),
            fetchAuroraForecast(latitude, longitude)
        ]);

        return {
            date,
            location: {
                latitude,
                longitude
            },
            moonPhase: moonPhase || undefined,
            planets: planets || undefined,
            satellites: satellites || undefined,
            meteorShowers: meteorShowers || undefined,
            auroraForecast: auroraForecast || undefined
        };
    } catch (error) {
        console.error('Error fetching astronomy data:', error);
        return {
            date,
            location: {
                latitude,
                longitude
            },
            error: 'Failed to fetch astronomy data'
        };
    }
}

/**
 * Hook to fetch astronomy data based on location
 */
export function useAstronomyData(latitude: number | null, longitude: number | null, date?: string) {
    const [data, setData] = useState<AstronomyData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            if (latitude === null || longitude === null) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const astronomyData = await fetchAstronomyData(latitude, longitude, date);
                setData(astronomyData);
            } catch (err) {
                setError('Failed to fetch astronomy data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [latitude, longitude, date]);

    return { data, loading, error };
}
