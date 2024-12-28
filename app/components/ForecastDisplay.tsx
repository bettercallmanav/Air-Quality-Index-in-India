'use client';

import React from 'react';
import { AQIData, ForecastItem } from '../types/aqi';

interface ForecastDisplayProps {
  data: AQIData;
}

const ForecastIcon = ({ type }: { type: string }) => {
  const icons: { [key: string]: JSX.Element } = {
    pm25: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    pm10: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    o3: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
      </svg>
    ),
    uvi: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 2L8 6h8zm0 20l4-4H8zm10-10l-4 4V8zM2 12l4 4V8zm2.5-6.5l3 3-1.5 1.5-3-3zm15 0l-3 3 1.5 1.5 3-3zm-15 15l3-3-1.5-1.5-3 3zm15 0l-3-3 1.5-1.5 3 3z"/>
      </svg>
    )
  };

  return icons[type] || (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    </svg>
  );
};

const ForecastDisplay = ({ data }: ForecastDisplayProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage <= 33) return 'from-green-400 to-green-500';
    if (percentage <= 66) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const renderForecastSection = (title: string, items: ForecastItem[], type: string) => {
    const maxValue = Math.max(...items.map(item => item.max));
    
    return (
      <div className="mb-8 sm:mb-12 transform transition-all duration-500 hover:translate-y-[-2px]">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12
              bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg
              transform transition-all duration-300 hover:scale-110">
              <ForecastIcon type={type} />
            </div>
            <h3 className="text-xl font-semibold gradient-text">
              {title}
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {items.slice(0, 4).map((item, index) => (
            <div 
              key={item.day} 
              className="glass-card p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="glass-card px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-4 inline-block">
                {formatDate(item.day)}
              </div>
              
              {/* Average Value Display */}
              <div className="mb-3 sm:mb-5">
                <div className="text-xs text-gray-500 mb-1">Average</div>
                <div className="text-lg sm:text-2xl font-bold gradient-text mb-2">{item.avg.toFixed(1)}</div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getProgressColor(item.avg, maxValue)} 
                      transition-all duration-500 ease-out`}
                    style={{ width: `${(item.avg / maxValue) * 100}%` }}
                  />
                </div>
              </div>

              {/* Min/Max Display */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="glass-card p-1.5 sm:p-2">
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Min</div>
                  <div className="text-xs sm:text-sm font-semibold gradient-text">{item.min.toFixed(1)}</div>
                </div>
                <div className="glass-card p-1.5 sm:p-2">
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Max</div>
                  <div className="text-xs sm:text-sm font-semibold gradient-text">{item.max.toFixed(1)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasForecastData = data.data.forecast?.daily && (
    data.data.forecast.daily.pm25?.length > 0 ||
    data.data.forecast.daily.pm10?.length > 0 ||
    data.data.forecast.daily.o3?.length > 0 ||
    data.data.forecast.daily.uvi?.length > 0
  );

  if (!hasForecastData) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p className="text-gray-500">Forecast data is not available for this location</p>
      </div>
    );
  }

  return (
    <div className="data-card">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-bold gradient-text flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12
            bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg
            transform transition-all duration-300 hover:scale-110">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
            </svg>
          </div>
          Forecast
        </h2>
        <div className="glass-card px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600
          transform transition-all duration-300 hover:scale-105">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Next 4 days</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 rounded-full opacity-20 blur-2xl translate-y-1/2 -translate-x-1/2" />

      {data.data.forecast?.daily?.pm25?.length > 0 && renderForecastSection('PM2.5 Forecast', data.data.forecast.daily.pm25, 'pm25')}
      {data.data.forecast?.daily?.pm10?.length > 0 && renderForecastSection('PM10 Forecast', data.data.forecast.daily.pm10, 'pm10')}
      {data.data.forecast?.daily?.o3?.length > 0 && renderForecastSection('Ozone (O₃) Forecast', data.data.forecast.daily.o3, 'o3')}
      {data.data.forecast?.daily?.uvi?.length > 0 && renderForecastSection('UV Index Forecast', data.data.forecast.daily.uvi, 'uvi')}
    </div>
  );
};

export default ForecastDisplay;
