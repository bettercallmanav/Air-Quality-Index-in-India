'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AQIData } from '../types/aqi';

interface MapDisplayProps {
  data: AQIData;
}

// Dynamic import of MapContent to avoid SSR issues
const MapContent = dynamic(
  () => import('./MapContent'),
  { 
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="loading-spinner h-8 w-8" />
          <div className="text-gray-500 font-medium">Loading map...</div>
        </div>
      </div>
    ),
    ssr: false
  }
);

const MapDisplay = ({ data }: MapDisplayProps) => {
  return (
    <div className="data-card">
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10
              bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg
              transform transition-all duration-300 hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold gradient-text">
                Location Map
              </h3>
              <p className="text-sm text-gray-500">
                {data.data.city.name}
              </p>
            </div>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-gray-600
            transform transition-all duration-300 hover:scale-105">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Interactive Map</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 rounded-full opacity-20 blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="h-[400px] w-full relative">
        {/* Map Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-green-100/10 z-10 pointer-events-none" />
        
        {/* Map Content */}
        <div className="absolute inset-0 z-0">
          <MapContent data={data} />
        </div>

        {/* Map Controls Hint */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="glass-card px-3 py-2 text-xs text-gray-600 flex items-center gap-2
            animate-fade-in opacity-75 hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Drag to move • Scroll to zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
