import React from 'react';
import { PlanetVisibility } from '@/lib/astronomyService';

interface PlanetsCardProps {
    planets: PlanetVisibility[];
}

export default function PlanetsCard({ planets }: PlanetsCardProps) {
    // Planet emoji mapping
    const planetEmojis: Record<string, string> = {
        'Mercury': '☿️',
        'Venus': '♀️',
        'Mars': '♂️',
        'Jupiter': '♃',
        'Saturn': '♄',
        'Uranus': '♅',
        'Neptune': '♆',
        'Pluto': '♇'
    };

    // Get only visible planets
    const visiblePlanets = planets.filter(planet => planet.visible);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Visible Planets</h2>

            {visiblePlanets.length > 0 ? (
                <div className="space-y-4">
                    {visiblePlanets.map((planet) => (
                        <div key={planet.name} className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">{planetEmojis[planet.name] || '🪐'}</span>
                                <h3 className="text-xl font-medium">{planet.name}</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {planet.riseTime && (
                                    <div>
                                        <span className="text-slate-400">Rise: </span>
                                        <span>{planet.riseTime}</span>
                                    </div>
                                )}

                                {planet.setTime && (
                                    <div>
                                        <span className="text-slate-400">Set: </span>
                                        <span>{planet.setTime}</span>
                                    </div>
                                )}

                                {planet.altitude !== undefined && (
                                    <div>
                                        <span className="text-slate-400">Altitude: </span>
                                        <span>{planet.altitude.toFixed(1)}°</span>
                                    </div>
                                )}

                                {planet.azimuth !== undefined && (
                                    <div>
                                        <span className="text-slate-400">Azimuth: </span>
                                        <span>{planet.azimuth.toFixed(1)}°</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-400">
                    <p>No planets visible tonight</p>
                </div>
            )}

            {planets.length > visiblePlanets.length && (
                <div className="mt-4 text-sm text-slate-400">
                    <p>{planets.length - visiblePlanets.length} planets are not visible from your location tonight.</p>
                </div>
            )}
        </div>
    );
}
