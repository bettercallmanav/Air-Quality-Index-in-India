import React from 'react';
import { STATES } from '../data/states';
import { Card, CardContent } from '../../components/ui/card';

import { type StateName } from '../data/states';

interface MapControlsProps {
  selectedState: StateName | 'All States';
  onStateChange: (state: StateName | 'All States') => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  selectedState,
  onStateChange,
}) => {
  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label htmlFor="state-filter" className="text-xs sm:text-sm font-medium">
              Filter by State:
            </label>
            <div className="relative">
              <select
                id="state-filter"
                className="w-full sm:w-auto p-1.5 sm:p-2 border rounded-md bg-background min-w-[180px] sm:min-w-[200px] text-xs sm:text-sm appearance-none pr-8"
                value={selectedState}
                onChange={(e) => onStateChange(e.target.value as StateName | 'All States')}
              >
                <option value="All States">All States</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] sm:text-sm text-muted-foreground">
              {selectedState === 'All States' 
                ? 'Showing all states' 
                : `Showing data for ${selectedState}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapControls;
