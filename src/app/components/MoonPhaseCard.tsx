import React from 'react';
import { MoonPhase } from '@/lib/astronomyService';

interface MoonPhaseCardProps {
    moonPhase: MoonPhase;
}

export default function MoonPhaseCard({ moonPhase }: MoonPhaseCardProps) {
    // Function to render the moon phase visualization
    const renderMoonPhaseVisualization = () => {
        const { phase, illumination } = moonPhase;

        // Determine which moon phase icon to show
        let moonIcon;
        if (phase.toLowerCase().includes('new')) {
            moonIcon = '🌑';
        } else if (phase.toLowerCase().includes('waxing crescent')) {
            moonIcon = '🌒';
        } else if (phase.toLowerCase().includes('first quarter')) {
            moonIcon = '🌓';
        } else if (phase.toLowerCase().includes('waxing gibbous')) {
            moonIcon = '🌔';
        } else if (phase.toLowerCase().includes('full')) {
            moonIcon = '🌕';
        } else if (phase.toLowerCase().includes('waning gibbous')) {
            moonIcon = '🌖';
        } else if (phase.toLowerCase().includes('last quarter')) {
            moonIcon = '🌗';
        } else if (phase.toLowerCase().includes('waning crescent')) {
            moonIcon = '🌘';
        } else {
            moonIcon = '🌙';
        }

        return (
            <div className="flex flex-col items-center">
                <div className="text-7xl mb-4">{moonIcon}</div>
                <div className="text-xl font-medium">{phase}</div>
                <div className="text-slate-300">{Math.round(illumination * 100)}% illuminated</div>
            </div>
        );
    };

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
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Moon Phase</h2>

            <div className="flex flex-col items-center mb-6">
                {renderMoonPhaseVisualization()}
            </div>

            <div className="space-y-3 mt-4">
                <div className="flex justify-between">
                    <span className="text-slate-300">Moon Age:</span>
                    <span className="font-medium">{moonPhase.age.toFixed(1)} days</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-300">Next Full Moon:</span>
                    <span className="font-medium">{formatDate(moonPhase.nextFullMoon)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-300">Next New Moon:</span>
                    <span className="font-medium">{formatDate(moonPhase.nextNewMoon)}</span>
                </div>
            </div>
        </div>
    );
}
