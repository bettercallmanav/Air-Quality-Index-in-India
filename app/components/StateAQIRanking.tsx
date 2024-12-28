'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AQIData, getAQILevel } from '../types/aqi';
import { STATES, type StateName } from '../data/states';

interface CityAQIData {
  name: string;
  coords: readonly [number, number];
  population: string;
  area: string;
  description: string;
  aqi: AQIData;
}

interface StateAQIRankingProps {
  cities: CityAQIData[];
  selectedState: StateName | 'All States';
  onStateChange: (state: StateName | 'All States') => void;
}

const StateAQIRanking: React.FC<StateAQIRankingProps> = ({
  cities,
  selectedState,
  onStateChange,
}) => {
  const filteredCities = cities
    .filter(city => selectedState === 'All States' || city.area === selectedState)
    .sort((a, b) => {
      const aAQI = a.aqi?.data?.aqi || 0;
      const bAQI = b.aqi?.data?.aqi || 0;
      return bAQI - aAQI;
    })
    .slice(0, 10);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl">State AQI Ranking</CardTitle>
          <div className="relative">
            <select
              className="w-full sm:w-auto p-1.5 sm:p-2 border rounded-md bg-background text-xs sm:text-sm appearance-none pr-8"
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
      </CardHeader>
      <CardContent>
        {filteredCities.length > 0 ? (
          <div className="space-y-4">
            {filteredCities.map((city, index) => {
              const level = getAQILevel(city.aqi.data.aqi);
              return (
                <div
                  key={city.name}
                  className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-base sm:text-lg font-semibold text-muted-foreground w-6 sm:w-8 text-center">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-medium">{city.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {city.area}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${level.color}`} />
                    <span className="text-sm sm:text-base font-semibold">{city.aqi.data.aqi}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-muted-foreground">
            No data available for {selectedState}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StateAQIRanking;
