'use client';

import React, { useState } from 'react';
import AQIDisplay from './components/AQIDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import MapDisplay from './components/MapDisplay';
import AQICharts from './components/AQICharts';
import ComparisonView from './components/ComparisonView';
import IndiaMetroMap from './components/IndiaMetroMap';
import { AQIData } from './types/aqi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Icon components remain the same...
const LoadingSpinner = () => (
  <div className="loading-spinner h-8 w-8" />
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CompareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function Home() {
  // State declarations and functions remain the same...
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedCities, setComparedCities] = useState<AQIData[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMethod, setLocationMethod] = useState<'GPS' | 'IP' | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  // All functions remain the same...
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (!comparisonMode && aqiData) {
      setComparedCities([aqiData]);
    } else {
      setComparedCities([]);
      setAqiData(null);
    }
  };

  const addCityToComparison = (data: AQIData) => {
    if (comparedCities.length < 5) {
      const cityExists = comparedCities.some(
        city => city.data.city.name === data.data.city.name
      );
      if (!cityExists) {
        setComparedCities([...comparedCities, data]);
      }
    }
  };

  const removeCityFromComparison = (cityName: string) => {
    setComparedCities(comparedCities.filter(city => city.data.city.name !== cityName));
  };

  const getCityFromCoords = async (latitude: number, longitude: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` + 
        `lat=${latitude}&lon=${longitude}&` +
        `format=json&addressdetails=1&zoom=10`,
        {
          headers: {
            'User-Agent': 'AQI-Checker/1.0',
            'Accept-Language': 'en'
          }
        }
      );
      const data = await response.json();
      
      const locationName = 
        data.address?.city ||
        data.address?.town ||
        data.address?.municipality ||
        data.address?.district ||
        data.address?.suburb ||
        data.address?.village ||
        data.address?.county ||
        data.address?.state_district;

      const state = data.address?.state;
      if (locationName && state && !locationName.includes(state)) {
        return `${locationName}, ${state}`;
      }
      
      return locationName || null;
    } catch (err) {
      console.error('Error getting location name:', err);
      return null;
    }
  };

  const fetchAQIData = async (query: string) => {
    const response = await fetch(
      `https://api.waqi.info/feed/${query}/?token=${process.env.NEXT_PUBLIC_AQI_API_TOKEN}`
    );
    const data = await response.json();

    if (data.status === 'ok') {
      if (!data.data.forecast?.daily) {
        data.data.forecast = {
          daily: {
            o3: [],
            pm10: [],
            pm25: [],
            uvi: []
          }
        };
      }
      if (comparisonMode) {
        addCityToComparison(data);
      } else {
        setAqiData(data);
      }
      return true;
    }
    
    throw new Error('City not found or data unavailable');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    if (!comparisonMode) {
      setAqiData(null);
    }
    
    try {
      await fetchAQIData(encodeURIComponent(city));
      setCity('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch AQI data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = () => {
    setLocationLoading(true);
    setError('');
    if (!comparisonMode) {
      setAqiData(null);
    }
    setLocationMethod(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationMethod('GPS');
        setLocationAccuracy(position.coords.accuracy);
        await handlePosition(position);
      },
      async (error) => {
        if (error.code === error.TIMEOUT) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              setLocationMethod('GPS');
              setLocationAccuracy(position.coords.accuracy);
              await handlePosition(position);
            },
            handleLocationError,
            { 
              timeout: 10000,
              enableHighAccuracy: false,
              maximumAge: 60000
            }
          );
        } else {
          handleLocationError(error);
        }
      },
      { 
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  };

  const handlePosition = async (position: GeolocationPosition) => {
    try {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Location accuracy: ${accuracy} meters`);
      
      const locationName = await getCityFromCoords(latitude, longitude);
      
      if (locationName) {
        try {
          await fetchAQIData(locationName);
          return;
        } catch {
          try {
            await fetchAQIData(`geo:${latitude};${longitude}`);
            return;
          } catch {
            throw new Error('No air quality data available for your location');
          }
        }
      } else {
        try {
          await fetchAQIData(`geo:${latitude};${longitude}`);
          return;
        } catch {
          throw new Error('Could not find air quality data for your location');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to get air quality data for your location');
      }
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = 'Failed to get your location. ';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage += 'Please enable location access in your browser settings.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage += 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage += 'Location request timed out.';
        break;
      default:
        errorMessage += 'An unknown error occurred.';
    }
    setError(errorMessage);
    setLocationLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-1.5 sm:p-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold">Air Quality Index</h1>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://www.linkedin.com/in/bettercallmanav/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] sm:text-xs text-muted-foreground hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    <span>by Manav</span>
                    <svg 
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a 
                    href="/case-study" 
                    className="text-[10px] sm:text-xs text-muted-foreground hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    <span>View Case Study</span>
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <Button
                onClick={toggleComparisonMode}
                variant={comparisonMode ? "default" : "secondary"}
                className="gap-2"
              >
                <CompareIcon />
                <span className="hidden sm:inline">
                  {comparisonMode ? 'Exit Comparison' : 'Compare Cities'}
                </span>
              </Button>

              <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-[300px]">
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={comparisonMode ? "Add city..." : "Enter city name..."}
                  className="w-full"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  disabled={loading || (comparisonMode && comparedCities.length >= 5)}
                  className="absolute right-0 top-0"
                >
                  {loading ? <LoadingSpinner /> : <SearchIcon />}
                </Button>
              </form>

              <Button
                onClick={handleLocationSearch}
                variant="secondary"
                disabled={locationLoading || (comparisonMode && comparedCities.length >= 5)}
                className="gap-1 px-2 sm:px-4"
                title="Use Location"
              >
                {locationLoading ? <LoadingSpinner /> : <LocationIcon />}
                <span className="hidden sm:inline">Location</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-screen-2xl py-6">
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="flex items-center gap-2 p-4">
              <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Comparison View */}
        {comparisonMode && comparedCities.length > 0 && (
          <div className="animate-fade-in mb-6">
            <ComparisonView
              cities={comparedCities}
              onRemoveCity={removeCityFromComparison}
            />
          </div>
        )}

        {/* Single City View */}
        {!comparisonMode && aqiData && (
          <div className="grid grid-cols-12 gap-4 animate-fade-in">
            <div className="grid grid-cols-12 col-span-12 gap-4">
              {/* Current AQI */}
              <div className="col-span-12 lg:col-span-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current AQI</CardTitle>
                    <ChartIcon />
                  </CardHeader>
                  <CardContent>
                    <AQIDisplay data={aqiData} />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-8 grid gap-4">
                {/* Charts */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Air Quality Trends</CardTitle>
                    <ChartIcon />
                  </CardHeader>
                  <CardContent>
                    <AQICharts data={aqiData} />
                  </CardContent>
                </Card>

                {/* Map */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Location</CardTitle>
                    <MapIcon />
                  </CardHeader>
                  <CardContent className="h-[300px] p-0">
                    <MapDisplay data={aqiData} />
                  </CardContent>
                </Card>
              </div>

              {/* Forecast */}
              <div className="col-span-12 lg:col-span-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Forecast</CardTitle>
                    <CalendarIcon />
                  </CardHeader>
                  <CardContent>
                    <ForecastDisplay data={aqiData} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Default View - India Metro Cities Map */}
        {!aqiData && !comparisonMode && !loading && !error && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight">Air Quality Index</h2>
              <p className="text-muted-foreground mt-2">
                Real-time air quality data for major Indian metropolitan cities
              </p>
            </div>
            <IndiaMetroMap />
            <div className="text-center text-sm text-muted-foreground">
              Enter a city name or use your location to get detailed air quality data
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
