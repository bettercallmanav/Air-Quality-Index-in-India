'use client';

import React from 'react';
import { AQIData, getAQILevel } from '../types/aqi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ComparisonViewProps {
  cities: AQIData[];
  onRemoveCity: (cityName: string) => void;
}

const ComparisonView = ({ cities, onRemoveCity }: ComparisonViewProps) => {
  const chartData = {
    labels: cities.map(city => city.data.city.name),
    datasets: [
      {
        label: 'Air Quality Index',
        data: cities.map(city => city.data.aqi),
        backgroundColor: cities.map(city => {
          const level = getAQILevel(city.data.aqi);
          return level.color.replace('bg-', '').replace('red-900', '#7f1d1d')
            .replace('green-500', '#22c55e')
            .replace('yellow-500', '#eab308')
            .replace('orange-500', '#f97316')
            .replace('red-500', '#ef4444')
            .replace('purple-500', '#a855f7');
        }),
        borderRadius: 8,
      },
      {
        label: 'PM2.5',
        data: cities.map(city => city.data.iaqi.pm25?.v || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderRadius: 8,
      },
      {
        label: 'PM10',
        data: cities.map(city => city.data.iaqi.pm10?.v || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">City Comparison</CardTitle>
        <div className="text-sm text-muted-foreground">
          {cities.length} cities selected
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => (
            <Card key={city.data.city.name} className="relative">
              <button
                onClick={() => onRemoveCity(city.data.city.name)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <CardContent className="pt-4">
                <h3 className="font-medium">{city.data.city.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">AQI</div>
                    <div className="font-medium">{city.data.aqi}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div className="font-medium">{getAQILevel(city.data.aqi).level}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">PM2.5</div>
                    <div className="font-medium">{city.data.iaqi.pm25?.v || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">PM10</div>
                    <div className="font-medium">{city.data.iaqi.pm10?.v || 'N/A'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonView;
