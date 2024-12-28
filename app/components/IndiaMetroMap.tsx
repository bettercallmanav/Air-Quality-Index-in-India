'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { AQIData, getAQILevel } from '../types/aqi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import StateAQIRanking from './StateAQIRanking';
import MapStateControl from './MapStateControl';
import type { MapContainer as MapContainerType, TileLayer as TileLayerType, Marker as MarkerType, Popup as PopupType, ZoomControl as ZoomControlType } from 'react-leaflet';
import type { LatLngBounds } from 'leaflet';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Dynamically import Leaflet CSS and L
const L = typeof window !== 'undefined' ? require('leaflet') : null;
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
}

import { ALL_CITIES, STATES, getCitiesByState, type StateName, type CityData } from '../data/states';
import MapControls from './MapControls';

const AQI_LEVELS = [
  { range: '0-50', level: 'Good', color: 'bg-green-500' },
  { range: '51-100', level: 'Moderate', color: 'bg-yellow-500' },
  { range: '101-150', level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500' },
  { range: '151-200', level: 'Unhealthy', color: 'bg-red-500' },
  { range: '201-300', level: 'Very Unhealthy', color: 'bg-purple-500' },
  { range: '300+', level: 'Hazardous', color: 'bg-red-900' }
];

interface CityAQIData {
  name: string;
  coords: readonly [number, number];
  population: string;
  area: string;
  description: string;
  aqi: AQIData;
}

interface BoundsAQIData {
  lat: number;
  lon: number;
  uid: number;
  aqi: string;
  station: {
    name: string;
    time: string;
  };
}

interface StationWithDistance extends BoundsAQIData {
  distance: number;
}

interface CachedData {
  [key: string]: {
    data: CityAQIData;
    timestamp: number;
  };
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Legend = () => (
  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-[1000] bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-lg border border-border">
    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">AQI Levels</h4>
    <div className="grid gap-1 sm:gap-2">
      {AQI_LEVELS.map((level) => (
        <div key={level.range} className="flex items-center gap-1 sm:gap-2">
          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${level.color}`} />
          <span className="text-xs sm:text-sm">
            {level.range} - {level.level}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const LoadingOverlay = () => (
  <div className="absolute bottom-[30px] sm:bottom-[40px] left-[30px] sm:left-[40px] z-[1000] bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg border border-border flex items-center gap-2">
    <div className="loading-spinner h-3 w-3 sm:h-4 sm:w-4" />
    <div className="flex flex-col">
      <p className="text-xs sm:text-sm text-muted-foreground">Loading nearby stations...</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground">Zoom in to see more stations</p>
    </div>
  </div>
);

const NoDataOverlay = () => (
  <div className="absolute bottom-[30px] sm:bottom-[40px] left-[30px] sm:left-[40px] z-[1000] bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg border border-border">
    <p className="text-xs sm:text-sm text-muted-foreground">No stations found in this area</p>
    <p className="text-[10px] sm:text-xs text-muted-foreground">Try zooming out or moving the map</p>
  </div>
);

const MapEvents = dynamic(() => Promise.resolve(({ onViewportChange }: { onViewportChange: (bounds: LatLngBounds, zoom: number) => void }) => {
  const map = require('react-leaflet').useMapEvents({
    moveend() {
      onViewportChange(map.getBounds(), map.getZoom());
    },
    zoomend() {
      onViewportChange(map.getBounds(), map.getZoom());
    }
  });
  return null;
}), { ssr: false });

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const IndiaMetroMap = () => {
  const [metroData, setMetroData] = useState<CityAQIData[]>([]);
  const [boundsData, setBoundsData] = useState<CityAQIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArea, setLoadingArea] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateName | 'All States'>('All States');
  const cache = useRef<CachedData>({});

  const fetchBoundsData = useCallback(async (bounds: L.LatLngBounds) => {
    setLoadingArea(true);
    try {
      const center = bounds.getCenter();
      const centerLat = center.lat;
      const centerLng = center.lng;

      const response = await fetch(
        `https://api.waqi.info/map/bounds/?token=${process.env.NEXT_PUBLIC_AQI_API_TOKEN}&latlng=` +
        `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`
      );
      const data = await response.json();
      
      if (data.status === 'ok') {
        const validStations = data.data
          .filter((station: BoundsAQIData) => {
            const aqi = Number(station.aqi);
            return !isNaN(aqi) && station.aqi !== '-';
          })
          .map((station: BoundsAQIData): StationWithDistance => ({
            ...station,
            distance: calculateDistance(centerLat, centerLng, station.lat, station.lon)
          }))
          .sort((a: StationWithDistance, b: StationWithDistance) => a.distance - b.distance)
          .slice(0, 5);

        const newBoundsData: CityAQIData[] = [];

        for (const station of validStations) {
          const cacheKey = `${station.uid}`;
          const now = Date.now();
          
          let cityData: CityAQIData | null = null;

          if (cache.current[cacheKey] && 
              now - cache.current[cacheKey].timestamp < CACHE_DURATION) {
            cityData = cache.current[cacheKey].data;
          } else {
            try {
              const detailResponse = await fetch(
                `https://api.waqi.info/feed/@${station.uid}/?token=${process.env.NEXT_PUBLIC_AQI_API_TOKEN}`
              );
              const detailData = await detailResponse.json();
              
              if (detailData.status === 'ok' && detailData.data) {
                const coords: readonly [number, number] = [station.lat, station.lon] as const;
                cityData = {
                  name: station.station.name,
                  coords,
                  aqi: detailData.data,
                  population: 'N/A',
                  area: 'N/A',
                  description: station.station.name
                };

                cache.current[cacheKey] = {
                  data: cityData,
                  timestamp: now
                };
              }
            } catch (err) {
              console.error(`Error fetching details for station ${station.uid}:`, err);
            }
          }

          if (cityData && 
              cityData.aqi?.data?.aqi !== undefined && 
              typeof cityData.aqi.data.aqi === 'number') {
            newBoundsData.push(cityData);
          }
        }

        setBoundsData(newBoundsData);
      }
    } catch (err) {
      console.error('Error fetching bounds data:', err);
    } finally {
      setLoadingArea(false);
    }
  }, []);

  const debouncedFetchBoundsData = useCallback(
    debounce((bounds: L.LatLngBounds) => fetchBoundsData(bounds), 300),
    [fetchBoundsData]
  );

  const handleViewportChange = useCallback((bounds: L.LatLngBounds, zoom: number) => {
    if (zoom >= 6) {
      debouncedFetchBoundsData(bounds);
    } else {
      setBoundsData([]);
      const now = Date.now();
      Object.keys(cache.current).forEach(key => {
        if (now - cache.current[key].timestamp > CACHE_DURATION) {
          delete cache.current[key];
        }
      });
    }
  }, [debouncedFetchBoundsData]);

  const fetchMetroData = useCallback(async () => {
    try {
      const stateCities = getCitiesByState(selectedState);
      const promises = stateCities.map(async (city) => {
        const response = await fetch(
          `https://api.waqi.info/feed/${city.name}/?token=${process.env.NEXT_PUBLIC_AQI_API_TOKEN}`
        );
        const data = await response.json();
        if (data.status === 'ok' && data.data?.aqi !== undefined) {
          const cityData: CityAQIData = {
            name: city.name,
            coords: city.coords,
            aqi: data,
            population: city.population,
            area: city.area,
            description: city.description
          };
          return cityData;
        }
        return null;
      });

      const results = await Promise.all(promises);
      const validResults = results.filter((result): result is CityAQIData => 
        result !== null && 
        result.aqi?.data?.aqi !== undefined && 
        typeof result.aqi.data.aqi === 'number'
      );
      setMetroData(validResults);
    } catch (err) {
      setError('Failed to fetch cities data');
      console.error('Error fetching cities data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedState]);

  useEffect(() => {
    fetchMetroData();
  }, [fetchMetroData, selectedState]);

  const renderMarker = (city: CityAQIData) => {
    if (!city?.aqi?.data?.aqi || typeof city.aqi.data.aqi !== 'number') {
      return null;
    }

    const level = getAQILevel(city.aqi.data.aqi);
    const isSelected = selectedCity === city.name;
    
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative group">
          <div class="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${level.color} flex items-center justify-center text-white text-[10px] sm:text-xs font-semibold shadow-lg transform transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}">
            ${city.aqi.data.aqi}
          </div>
          <div class="absolute -top-8 sm:-top-10 left-4 sm:left-6 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-lg text-[10px] sm:text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            ${city.name}
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    return (
      <Marker
        key={`${city.name}-${city.coords[0]}-${city.coords[1]}`}
        position={[...city.coords] as [number, number]}
        icon={customIcon}
        eventHandlers={{
          click: () => setSelectedCity(city.name),
          popupclose: () => setSelectedCity(null)
        }}
        zIndexOffset={1000}
      >
        <Popup className="custom-popup" offset={[0, -20]} autoPan={true}>
          <div className="p-2">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <h3 className="font-semibold text-base sm:text-lg">{city.name}</h3>
              <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs text-white ${level.color}`}>
                {level.level}
              </span>
            </div>
            {city && (
              <>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  {city.description}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm mb-2 sm:mb-4">
                  <div>
                    <div className="text-muted-foreground">Population</div>
                    <div className="font-medium">{city.population}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">State/UT</div>
                    <div className="font-medium">{city.area}</div>
                  </div>
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <div className="text-muted-foreground">AQI</div>
                <div className="font-medium">{city.aqi.data.aqi}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium">{level.level}</div>
              </div>
              <div>
                <div className="text-muted-foreground">PM2.5</div>
                <div className="font-medium">
                  {city.aqi.data.iaqi?.pm25?.v || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">PM10</div>
                <div className="font-medium">
                  {city.aqi.data.iaqi?.pm10?.v || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 sm:gap-4">
            <div className="loading-spinner h-6 w-6 sm:h-8 sm:w-8" />
            <p className="text-xs sm:text-sm text-muted-foreground">Loading air quality data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center">
          <div className="flex items-center gap-2 text-destructive">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <MapControls
        selectedState={selectedState}
        onStateChange={(state: string) => setSelectedState(state as StateName | 'All States')}
      />
      <Card>
        <CardContent className="p-0">
          <div className="h-[400px] sm:h-[500px] md:h-[600px] relative">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              className="h-full w-full rounded-lg"
              zoomControl={false}
              minZoom={4}
              maxZoom={13}
            >
              <ZoomControl position="bottomleft" />
              <MapEvents onViewportChange={handleViewportChange} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {metroData.map(renderMarker)}
              {boundsData.map(renderMarker)}
              <Legend />
              {loadingArea && <LoadingOverlay />}
              {!loadingArea && boundsData.length === 0 && <NoDataOverlay />}
              <MapStateControl selectedState={selectedState} />
            </MapContainer>
          </div>
        </CardContent>
      </Card>
      <StateAQIRanking
        cities={metroData}
        selectedState={selectedState}
        onStateChange={setSelectedState}
      />
    </div>
  );
};

export default IndiaMetroMap;
