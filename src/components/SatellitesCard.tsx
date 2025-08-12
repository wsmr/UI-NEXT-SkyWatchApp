import React from 'react';
import { SatellitePass } from '@/lib/astronomyService';

interface SatellitesCardProps {
    satellites: SatellitePass[];
}

export default function SatellitesCard({ satellites }: SatellitesCardProps) {
    // Format time to be more readable
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format date to show day and time
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get visible satellites
    const visibleSatellites = satellites.filter(satellite => satellite.visible);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">ISS & Satellite Passes</h2>

            {visibleSatellites.length > 0 ? (
                <div className="space-y-4">
                    {visibleSatellites.map((satellite) => (
                        <div key={satellite.name} className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">🛰️</span>
                                <h3 className="text-xl font-medium">{satellite.name}</h3>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Visible:</span>
                                    <span className="font-medium">{formatDateTime(satellite.startTime)} - {formatTime(satellite.endTime)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-400">Max Elevation:</span>
                                    <span className="font-medium">{satellite.maxElevation.toFixed(1)}°</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-400">Direction:</span>
                                    <span className="font-medium">
                    {getDirectionFromAzimuth(satellite.startAzimuth)} to {getDirectionFromAzimuth(satellite.endAzimuth)}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-400">
                    <p>No satellite passes visible tonight</p>
                </div>
            )}
        </div>
    );
}

// Helper function to convert azimuth to cardinal direction
function getDirectionFromAzimuth(azimuth: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.round(azimuth / 45) % 8];
}
