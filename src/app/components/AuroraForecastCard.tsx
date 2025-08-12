import React from 'react';
import { AuroraForecast } from '@/lib/astronomyService';

interface AuroraForecastCardProps {
    auroraForecast: AuroraForecast;
    latitude: number;
}

export default function AuroraForecastCard({ auroraForecast, latitude }: AuroraForecastCardProps) {
    // Function to determine if aurora might be visible based on KP index and latitude
    const isAuroraLikelyVisible = () => {
        const absLatitude = Math.abs(latitude);

        // General rule of thumb for aurora visibility based on KP index and latitude
        if (auroraForecast.kpIndex >= 9) return absLatitude > 40; // Extreme storm
        if (auroraForecast.kpIndex >= 7) return absLatitude > 45; // Strong storm
        if (auroraForecast.kpIndex >= 5) return absLatitude > 55; // Moderate storm
        if (auroraForecast.kpIndex >= 3) return absLatitude > 65; // Minor storm
        return false; // Not likely visible
    };

    // Function to get aurora forecast description
    const getAuroraDescription = () => {
        const kp = auroraForecast.kpIndex;

        if (kp >= 7) return "Major geomagnetic storm in progress";
        if (kp >= 5) return "Moderate geomagnetic storm in progress";
        if (kp >= 3) return "Minor geomagnetic activity";
        return "Low geomagnetic activity";
    };

    // Function to render KP index indicator
    const renderKpIndexIndicator = () => {
        const kp = auroraForecast.kpIndex;
        const percentage = (kp / 9) * 100;

        let color = 'bg-green-500';
        if (kp >= 7) {
            color = 'bg-red-500';
        } else if (kp >= 5) {
            color = 'bg-orange-500';
        } else if (kp >= 3) {
            color = 'bg-yellow-500';
        }

        return (
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>0</span>
                    <span>3</span>
                    <span>5</span>
                    <span>7</span>
                    <span>9</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    // Function to render visibility probability
    const renderProbabilityIndicator = (probability: number) => {
        const percentage = Math.round(probability * 100);
        let color = 'bg-red-500';

        if (percentage >= 70) {
            color = 'bg-green-500';
        } else if (percentage >= 40) {
            color = 'bg-yellow-500';
        }

        return (
            <div className="flex items-center">
                <div className="w-full bg-slate-700 rounded-full h-2.5 mr-2">
                    <div
                        className={`h-2.5 rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <span className="text-sm">{percentage}%</span>
            </div>
        );
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Aurora Forecast</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Current KP Index: {auroraForecast.kpIndex.toFixed(1)}</h3>
                        <p className="text-slate-300 mb-3">{getAuroraDescription()}</p>
                        {renderKpIndexIndicator()}
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-slate-400 block mb-1">Probability of Aurora:</span>
                            {renderProbabilityIndicator(auroraForecast.probability)}
                        </div>

                        <div>
                            <span className="text-sm text-slate-400 block mb-1">Visibility Conditions:</span>
                            {renderProbabilityIndicator(auroraForecast.visibility)}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3">Viewing Forecast</h3>

                    {isAuroraLikelyVisible() ? (
                        <div className="space-y-3">
                            <div className="flex items-center text-green-400">
                                <span className="text-2xl mr-2">✓</span>
                                <span className="font-medium">Aurora may be visible tonight!</span>
                            </div>
                            <p className="text-sm">
                                With a KP index of {auroraForecast.kpIndex.toFixed(1)}, aurora activity might be visible from your latitude
                                ({latitude.toFixed(2)}°) under dark sky conditions away from city lights.
                            </p>
                            <div className="mt-2 text-sm">
                                <p className="font-medium">Best viewing tips:</p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Find a dark location away from city lights</li>
                                    <li>Allow 20-30 minutes for your eyes to adjust to darkness</li>
                                    <li>Look toward the northern horizon (in Northern Hemisphere)</li>
                                    <li>Be patient - auroras can appear and disappear</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center text-yellow-400">
                                <span className="text-2xl mr-2">✗</span>
                                <span className="font-medium">Aurora unlikely to be visible</span>
                            </div>
                            <p className="text-sm">
                                With the current KP index of {auroraForecast.kpIndex.toFixed(1)}, aurora activity is unlikely to be visible
                                from your latitude ({latitude.toFixed(2)}°). Aurora is typically visible at higher latitudes unless there is
                                a major geomagnetic storm.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
