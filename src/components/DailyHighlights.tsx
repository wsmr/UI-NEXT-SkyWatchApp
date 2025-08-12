import React from 'react';
import { AstronomyData } from '@/lib/astronomyService';

interface DailyHighlightsProps {
    data: AstronomyData;
}

export default function DailyHighlights({ data }: DailyHighlightsProps) {
    // Function to determine the most interesting events for the day
    const getHighlights = () => {
        const highlights = [];

        // Check for full or new moon
        if (data.moonPhase) {
            const { phase } = data.moonPhase;
            if (phase.toLowerCase().includes('full')) {
                highlights.push({
                    title: 'Full Moon Tonight',
                    description: 'The moon is full tonight, providing excellent illumination for nighttime activities.',
                    icon: '🌕',
                    priority: 1
                });
            } else if (phase.toLowerCase().includes('new')) {
                highlights.push({
                    title: 'New Moon Tonight',
                    description: 'The new moon provides dark skies, perfect for observing faint objects like galaxies and nebulae.',
                    icon: '🌑',
                    priority: 1
                });
            }
        }

        // Check for visible planets
        if (data.planets) {
            const visiblePlanets = data.planets.filter(planet => planet.visible);
            if (visiblePlanets.length >= 3) {
                highlights.push({
                    title: `${visiblePlanets.length} Planets Visible Tonight`,
                    description: `Look for ${visiblePlanets.map(p => p.name).join(', ')} in the night sky.`,
                    icon: '🪐',
                    priority: 2
                });
            } else if (visiblePlanets.length > 0) {
                // Check for particularly interesting planets (Jupiter, Saturn)
                const interestingPlanets = visiblePlanets.filter(p =>
                    ['Jupiter', 'Saturn'].includes(p.name)
                );

                if (interestingPlanets.length > 0) {
                    highlights.push({
                        title: `${interestingPlanets[0].name} Visible Tonight`,
                        description: `Look for ${interestingPlanets[0].name} in the night sky.`,
                        icon: '🪐',
                        priority: 3
                    });
                }
            }
        }

        // Check for ISS passes
        if (data.satellites) {
            const issPasses = data.satellites.filter(
                sat => sat.name.includes('ISS') && sat.visible
            );

            if (issPasses.length > 0) {
                const pass = issPasses[0];
                const time = new Date(pass.startTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                highlights.push({
                    title: 'ISS Visible Tonight',
                    description: `The International Space Station will be visible at ${time} with a maximum elevation of ${pass.maxElevation.toFixed(1)}°.`,
                    icon: '🛰️',
                    priority: 1
                });
            }
        }

        // Check for meteor showers
        if (data.meteorShowers) {
            const activeShowers = data.meteorShowers.filter(shower =>
                shower.active && shower.visibility > 0.4
            );

            if (activeShowers.length > 0) {
                const shower = activeShowers[0];
                highlights.push({
                    title: `${shower.name} Meteor Shower Active`,
                    description: `The ${shower.name} meteor shower is active with an expected rate of ${shower.rate} meteors per hour.`,
                    icon: '☄️',
                    priority: 1
                });
            }
        }

        // Check for aurora possibility
        if (data.auroraForecast && data.location.latitude) {
            const { kpIndex, probability } = data.auroraForecast;
            const absLatitude = Math.abs(data.location.latitude);

            // Determine if aurora might be visible based on KP index and latitude
            let auroraVisible = false;
            if (kpIndex >= 9 && absLatitude > 40) auroraVisible = true;
            if (kpIndex >= 7 && absLatitude > 45) auroraVisible = true;
            if (kpIndex >= 5 && absLatitude > 55) auroraVisible = true;
            if (kpIndex >= 3 && absLatitude > 65) auroraVisible = true;

            if (auroraVisible && probability > 0.3) {
                highlights.push({
                    title: 'Aurora Possible Tonight',
                    description: `With a KP index of ${kpIndex.toFixed(1)}, aurora activity might be visible from your latitude under dark sky conditions.`,
                    icon: '✨',
                    priority: 0 // Highest priority
                });
            }
        }

        // Sort by priority (lower number = higher priority)
        return highlights.sort((a, b) => a.priority - b.priority);
    };

    const highlights = getHighlights();

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-gradient-to-r from-indigo-900/70 to-purple-900/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-700 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Tonight&#39;s Highlights
            </h2>
            <p className="text-slate-300 mb-6">{formatDate(data.date)}</p>

            {highlights.length > 0 ? (
                <div className="space-y-4">
                    {highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                            <div className="text-3xl mr-4">{highlight.icon}</div>
                            <div>
                                <h3 className="text-xl font-medium text-blue-200">{highlight.title}</h3>
                                <p className="text-slate-300">{highlight.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-slate-300">No special astronomical events tonight. Check the detailed sections below for regular observations.</p>
                </div>
            )}
        </div>
    );
}
