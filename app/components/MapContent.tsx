'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { AQIData, getAQILevel } from '../types/aqi';

interface MapContentProps {
  data: AQIData;
}

const MapContent = ({ data }: MapContentProps) => {
  const position: [number, number] = [data.data.city.geo[0], data.data.city.geo[1]];
  const aqiLevel = getAQILevel(data.data.aqi);

  // Create custom marker icon
  const customIcon = useMemo(() => {
    const getMarkerColor = () => {
      switch (aqiLevel.level) {
        case 'Good': return '#22c55e'; // green-500
        case 'Moderate': return '#eab308'; // yellow-500
        case 'Unhealthy for Sensitive Groups': return '#f97316'; // orange-500
        case 'Unhealthy': return '#ef4444'; // red-500
        case 'Very Unhealthy': return '#a855f7'; // purple-500
        case 'Hazardous': return '#7f1d1d'; // red-900
        default: return '#3b82f6'; // blue-500
      }
    };

    const color = getMarkerColor();
    return new L.DivIcon({
      className: 'custom-marker',
      html: `
        <div class="relative">
          <div style="
            background: linear-gradient(135deg, ${color}, ${color}dd);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 0 20px ${color}40;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            transform-origin: center bottom;
            animation: markerPulse 2s infinite;
          ">
            ${data.data.aqi}
          </div>
          <div style="
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 8px;
            background: ${color};
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "></div>
        </div>
      `,
      iconSize: [48, 56],
      iconAnchor: [24, 56],
      popupAnchor: [0, -48],
    });
  }, [data.data.aqi, aqiLevel.level]);

  // Convert Tailwind color classes to hex values
  const getColorHex = (colorClass: string) => {
    return colorClass
      .replace('bg-', '')
      .replace('red-900', '#7f1d1d')
      .replace('green-500', '#22c55e')
      .replace('yellow-500', '#eab308')
      .replace('orange-500', '#f97316')
      .replace('red-500', '#ef4444')
      .replace('purple-500', '#a855f7');
  };

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="z-0 rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Coverage Area Circle */}
      <Circle
        center={position}
        radius={10000}
        pathOptions={{
          color: getColorHex(aqiLevel.color),
          fillColor: getColorHex(aqiLevel.color),
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 5',
          opacity: 0.7,
        }}
      />

      {/* Location Marker */}
      <Marker position={position} icon={customIcon}>
        <Popup>
          <div className="p-4 min-w-[280px]">
            <h3 className="text-xl font-bold mb-3 gradient-text">{data.data.city.name}</h3>
            <div className={`glass-card px-4 py-3 mb-3 border-l-4 ${aqiLevel.color}`}>
              <div className="text-lg font-bold gradient-text">AQI: {data.data.aqi}</div>
              <div className="text-sm text-gray-600">{aqiLevel.level}</div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed glass-card p-3">
              {aqiLevel.description}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="font-medium">Coordinates:</span>
              <span>{data.data.city.geo[0].toFixed(4)}, {data.data.city.geo[1].toFixed(4)}</span>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapContent;
