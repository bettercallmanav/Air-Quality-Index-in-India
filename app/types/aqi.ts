export interface AQIData {
  status: string;
  data: {
    aqi: number;
    idx: number;
    city: {
      name: string;
      url: string;
      geo: number[];
    };
    dominentpol: string;
    iaqi: {
      co?: { v: number };
      h?: { v: number };
      no2?: { v: number };
      o3?: { v: number };
      p?: { v: number };
      pm10?: { v: number };
      pm25?: { v: number };
      so2?: { v: number };
      t?: { v: number };
      w?: { v: number };
    };
    time: {
      s: string;
      tz: string;
      iso: string;
    };
    forecast: {
      daily: {
        o3: ForecastItem[];
        pm10: ForecastItem[];
        pm25: ForecastItem[];
        uvi: ForecastItem[];
      };
    };
  };
}

export interface ForecastItem {
  avg: number;
  day: string;
  max: number;
  min: number;
}

export interface IAQIItem {
  name: string;
  value: number;
  unit: string;
}

export const getAQILevel = (aqi: number): {
  level: string;
  color: string;
  description: string;
} => {
  if (aqi <= 50) {
    return {
      level: "Good",
      color: "bg-green-500",
      description: "Air quality is satisfactory, and air pollution poses little or no risk.",
    };
  } else if (aqi <= 100) {
    return {
      level: "Moderate",
      color: "bg-yellow-500",
      description: "Air quality is acceptable. However, there may be a risk for some people.",
    };
  } else if (aqi <= 150) {
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "bg-orange-500",
      description: "Members of sensitive groups may experience health effects.",
    };
  } else if (aqi <= 200) {
    return {
      level: "Unhealthy",
      color: "bg-red-500",
      description: "Everyone may begin to experience health effects.",
    };
  } else if (aqi <= 300) {
    return {
      level: "Very Unhealthy",
      color: "bg-purple-500",
      description: "Health warnings of emergency conditions. The entire population is likely to be affected.",
    };
  } else {
    return {
      level: "Hazardous",
      color: "bg-red-900",
      description: "Health alert: everyone may experience more serious health effects.",
    };
  }
};
