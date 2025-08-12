import React from 'react';
import { MeteorShower } from '@/lib/astronomyService';

interface MeteorShowersCardProps {
    meteorShowers: MeteorShower[];
}

export default function MeteorShowersCard({ meteorShowers }: MeteorShowersCardProps) {
    // Sort meteor showers by activity and visibility
    const sortedShowers = [...meteorShowers].sort((a, b) => {
        // First sort by active status
        if (a.active && !b.active) return -1;
        if (!a.active && b.active) return 1;

        // Then sort by visibility for active showers
        if (a.active && b.active) {
            return b.visibility - a.visibility;
        }

        return 0;
    });

    // Function to render visibility indicator
    const renderVisibilityIndicator = (visibility: number) => {
        const percentage = Math.round(visibility * 100);
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
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Meteor Showers</h2>

            {sortedShowers.length > 0 ? (
                <div className="space-y-4">
                    {sortedShowers.map((shower) => (
                        <div
                            key={shower.name}
                            className={`rounded-lg p-4 ${shower.active ? 'bg-slate-700/50' : 'bg-slate-800/30'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">☄️</span>
                                    <h3 className="text-xl font-medium">{shower.name}</h3>
                                </div>
                                {shower.active && (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-900/50 text-green-400 rounded-full">
                    Active
                  </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Peak Date:</span>
                                    <span>{shower.peak}</span>
                                </div>

                                {shower.active && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Hourly Rate:</span>
                                            <span>{shower.rate} meteors/hour</span>
                                        </div>

                                        <div className="mt-2">
                                            <span className="text-sm text-slate-400 block mb-1">Visibility:</span>
                                            {renderVisibilityIndicator(shower.visibility)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-400">
                    <p>No meteor shower data available</p>
                </div>
            )}
        </div>
    );
}
