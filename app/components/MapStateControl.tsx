import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { type StateName } from '../data/states';

interface MapStateControlProps {
  selectedState: StateName | 'All States';
}

const MapStateControl: React.FC<MapStateControlProps> = ({ selectedState }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedState !== 'All States') {
      // State center coordinates
      const stateCoords: Record<StateName, [number, number]> = {
        'NCR': [28.6139, 77.2090],
        'Uttar Pradesh': [26.8467, 80.9462],
        'Maharashtra': [19.7515, 75.7139],
        'Karnataka': [15.3173, 75.7139],
        'Tamil Nadu': [11.1271, 78.6569],
        'Gujarat': [22.2587, 71.1924],
        'West Bengal': [22.9868, 87.8550],
        'Bihar': [25.0961, 85.3131],
        'Telangana': [17.1124, 79.0193],
        'Madhya Pradesh': [22.9734, 78.6569],
        'Rajasthan': [27.0238, 74.2179],
        'Kerala': [10.8505, 76.2711],
        'Punjab': [31.1471, 75.3412],
        'Odisha': [20.9517, 85.0985],
        'Andhra Pradesh': [15.9129, 79.7400],
        'Chhattisgarh': [21.2787, 81.8661],
        'Assam': [26.2006, 92.9376],
        'Jharkhand': [23.6102, 85.2799],
        'Uttarakhand': [30.0668, 79.0193],
        'Himachal Pradesh': [31.1048, 77.1734],
        'Jammu & Kashmir': [33.7782, 76.5762],
        'Goa': [15.2993, 74.1240],
        'Sikkim': [27.3389, 88.6065],
        'Meghalaya': [25.4670, 91.3662],
        'Manipur': [24.6637, 93.9063],
        'Mizoram': [23.1645, 92.9376],
        'Tripura': [23.9408, 91.9882],
        'Arunachal Pradesh': [28.2180, 94.7278],
        'Haryana': [29.0588, 76.0856]
      };

      // Adjust zoom level based on screen width
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      const zoomLevel = width < 640 ? 6 : 7; // sm breakpoint is 640px
      
      map.setView(stateCoords[selectedState], zoomLevel, {
        animate: true,
        duration: 1
      });
    } else {
      // Reset to India view
      // Adjust zoom level based on screen width
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      const zoomLevel = width < 640 ? 4 : 5; // sm breakpoint is 640px
      
      map.setView([20.5937, 78.9629], zoomLevel, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedState, map]);

  return null;
};

export default MapStateControl;
