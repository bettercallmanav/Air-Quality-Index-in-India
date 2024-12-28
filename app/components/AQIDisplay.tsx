'use client';

import React from 'react';
import { AQIData, getAQILevel, IAQIItem } from '../types/aqi';

interface AQIDisplayProps {
  data: AQIData;
}

const PollutantIcon = ({ name }: { name: string }) => {
  const icons: { [key: string]: JSX.Element } = {
    PM25: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    PM10: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    O3: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
      </svg>
    ),
    NO2: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
      </svg>
    ),
    SO2: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <path d="M15 8h-6v2h6v-2zm0 3h-6v2h6v-2zm0 3h-6v2h6v-2z"/>
      </svg>
    ),
    CO: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      </svg>
    ),
    T: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1.1 0 2 .9 2 2v7.59l4.29-4.3 1.42 1.42L12 16.41l-7.71-7.7 1.42-1.42L10 11.59V4c0-1.1.9-2 2-2zm0 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      </svg>
    ),
    H: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-13h-2v6h-2v2h2v2h2v-2h2v-2h-2z"/>
      </svg>
    ),
    W: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-14v4h2V6h-2z"/>
        <path d="M13 14.5s2 1.5 2 2.5-1 2-2 2-2-.9-2-2 2-2.5 2-2.5z"/>
      </svg>
    ),
    P: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/>
      </svg>
    )
  };

  return icons[name] || (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    </svg>
  );
};

const AQIDisplay = ({ data }: AQIDisplayProps) => {
  const aqiLevel = getAQILevel(data.data.aqi);
  
  const iaqiItems: IAQIItem[] = Object.entries(data.data.iaqi).map(([key, value]) => {
    const units: { [key: string]: string } = {
      pm25: 'µg/m³',
      pm10: 'µg/m³',
      o3: 'ppb',
      no2: 'ppb',
      so2: 'ppb',
      co: 'ppm',
      t: '°C',
      h: '%',
      w: 'm/s',
      p: 'hPa'
    };

    return {
      name: key.toUpperCase(),
      value: value.v,
      unit: units[key] || ''
    };
  });

  return (
    <div className="data-card">
      <div className="text-center mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 gradient-text">
          {data.data.city.name}
        </h2>
        
        {/* AQI Gauge */}
        <div className="relative inline-flex items-center justify-center mb-4 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-full opacity-30 blur-xl animate-float"></div>
          <svg className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 transform transition-transform duration-1000" viewBox="0 0 100 100">
            {/* Background circles for depth */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              className="opacity-50"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={aqiLevel.color.replace('bg-', 'text-')}
              strokeWidth="8"
              strokeDasharray={`${Math.min((data.data.aqi / 500) * 283, 283)} 283`}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="283"
                to="0"
                dur="1.5s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              />
            </circle>
          </svg>
          <div className="absolute flex flex-col items-center transform transition-all duration-500">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">{data.data.aqi}</span>
            <span className="text-sm sm:text-base md:text-lg font-semibold mt-0.5 sm:mt-1 text-gray-600">{aqiLevel.level}</span>
          </div>
        </div>
        
        <div className={`inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-white ${aqiLevel.color} 
          shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
          <p className="text-xs sm:text-sm md:text-base font-medium">{aqiLevel.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {iaqiItems.map((item, index) => (
          <div 
            key={item.name}
            className="glass-card p-2 sm:p-3 md:p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl
              animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-blue-500 transform transition-transform duration-300 hover:scale-110">
                <PollutantIcon name={item.name} />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-100/80 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                {item.name}
              </div>
            </div>
            <div className="text-base sm:text-lg md:text-xl font-semibold gradient-text">
              {item.value.toFixed(1)} 
              <span className="text-xs sm:text-sm text-gray-500 ml-0.5 sm:ml-1">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-gray-500 text-center flex items-center justify-center gap-1 sm:gap-2
        transform transition-opacity duration-300 hover:text-gray-600">
        <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
        Last updated: {new Date(data.data.time.iso).toLocaleString()}
      </div>
    </div>
  );
};

export default AQIDisplay;
