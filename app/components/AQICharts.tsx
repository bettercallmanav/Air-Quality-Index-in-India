'use client';

import React from 'react';
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
import { Line, Bar } from 'react-chartjs-2';
import { AQIData, getAQILevel } from '../types/aqi';

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

interface AQIChartsProps {
  data: AQIData;
}

const AQICharts = ({ data }: AQIChartsProps) => {
  const hasForecastData = data.data.forecast?.daily && (
    (data.data.forecast.daily.pm25?.length > 0 || data.data.forecast.daily.pm10?.length > 0)
  );

  // Process forecast data for line chart if available
  const forecastData = hasForecastData ? (() => {
    const datasets = [];
    let labels: string[] = [];

    if (data.data.forecast?.daily?.pm25?.length > 0) {
      labels = data.data.forecast.daily.pm25.map(item => 
        new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' })
      );
      datasets.push({
        label: 'PM2.5',
        data: data.data.forecast.daily.pm25.map(item => item.avg),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      });
    }

    if (data.data.forecast?.daily?.pm10?.length > 0) {
      if (labels.length === 0) {
        labels = data.data.forecast.daily.pm10.map(item => 
          new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' })
        );
      }
      datasets.push({
        label: 'PM10',
        data: data.data.forecast.daily.pm10.map(item => item.avg),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      });
    }

    return {
      labels,
      datasets
    };
  })() : null;

  // Process pollutant data for bar chart
  const pollutants = Object.entries(data.data.iaqi).filter(([key]) => 
    ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'].includes(key)
  );

  const pollutantData = {
    labels: pollutants.map(([key]) => key.toUpperCase()),
    datasets: [{
      label: 'Pollutant Levels',
      data: pollutants.map(([_, value]) => value.v),
      backgroundColor: pollutants.map(([_, value]) => {
        const level = getAQILevel(value.v);
        return level.color.replace('bg-', '').replace('red-900', '#7f1d1d')
          .replace('green-500', '#22c55e')
          .replace('yellow-500', '#eab308')
          .replace('orange-500', '#f97316')
          .replace('red-500', '#ef4444')
          .replace('purple-500', '#a855f7');
      }),
      borderRadius: 8,
    }]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
        },
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
        boxPadding: 6,
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Forecast Trend */}
      {forecastData && forecastData.datasets.length > 0 ? (
        <div className="glass-card p-2 sm:p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Forecast Trend</h3>
          <div className="h-[200px]">
            <Line data={forecastData} options={commonOptions} />
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 flex flex-col items-center justify-center h-[200px]">
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-sm text-gray-500">Forecast trend is not available</p>
        </div>
      )}

      {/* Pollutant Levels */}
        <div className="glass-card p-2 sm:p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Pollutant Levels</h3>
        <div className="h-[200px]">
          <Bar data={pollutantData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

export default AQICharts;
