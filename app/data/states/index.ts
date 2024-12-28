import { NCR_CITIES } from './ncr';
import { UP_CITIES } from './uttar-pradesh';
import { MAHARASHTRA_CITIES } from './maharashtra';
import { KARNATAKA_CITIES } from './karnataka';
import { TAMIL_NADU_CITIES } from './tamil-nadu';
import { GUJARAT_CITIES } from './gujarat';
import { WEST_BENGAL_CITIES } from './west-bengal';
import { BIHAR_CITIES } from './bihar';
import { TELANGANA_CITIES } from './telangana';
import { MADHYA_PRADESH_CITIES } from './madhya-pradesh';
import { RAJASTHAN_CITIES } from './rajasthan';
import { KERALA_CITIES } from './kerala';
import { PUNJAB_CITIES } from './punjab';
import { ODISHA_CITIES } from './odisha';
import { ANDHRA_PRADESH_CITIES } from './andhra-pradesh';
import { CHHATTISGARH_CITIES } from './chhattisgarh';
import { ASSAM_CITIES } from './assam';
import { JHARKHAND_CITIES } from './jharkhand';
import { UTTARAKHAND_CITIES } from './uttarakhand';
import { HIMACHAL_PRADESH_CITIES } from './himachal-pradesh';
import { JAMMU_KASHMIR_CITIES } from './jammu-kashmir';
import { GOA_CITIES } from './goa';
import { SIKKIM_CITIES } from './sikkim';
import { MEGHALAYA_CITIES } from './meghalaya';
import { MANIPUR_CITIES } from './manipur';
import { MIZORAM_CITIES } from './mizoram';
import { TRIPURA_CITIES } from './tripura';
import { ARUNACHAL_PRADESH_CITIES } from './arunachal-pradesh';
import { HARYANA_CITIES } from './haryana';

export interface CityData {
  readonly name: string;
  readonly coords: readonly [number, number];
  readonly population: string;
  readonly area: string;
  readonly description: string;
}

export type ReadonlyCityData = Readonly<CityData>;

export const STATES = [
  'NCR',
  'Uttar Pradesh',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
  'West Bengal',
  'Bihar',
  'Telangana',
  'Madhya Pradesh',
  'Rajasthan',
  'Kerala',
  'Punjab',
  'Odisha',
  'Andhra Pradesh',
  'Chhattisgarh',
  'Assam',
  'Jharkhand',
  'Uttarakhand',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Goa',
  'Sikkim',
  'Meghalaya',
  'Manipur',
  'Mizoram',
  'Tripura',
  'Arunachal Pradesh',
  'Haryana'
] as const;

export type StateName = typeof STATES[number];

export const STATE_CITIES: Record<StateName, readonly ReadonlyCityData[]> = {
  'NCR': NCR_CITIES,
  'Uttar Pradesh': UP_CITIES,
  'Maharashtra': MAHARASHTRA_CITIES,
  'Karnataka': KARNATAKA_CITIES,
  'Tamil Nadu': TAMIL_NADU_CITIES,
  'Gujarat': GUJARAT_CITIES,
  'West Bengal': WEST_BENGAL_CITIES,
  'Bihar': BIHAR_CITIES,
  'Telangana': TELANGANA_CITIES,
  'Madhya Pradesh': MADHYA_PRADESH_CITIES,
  'Rajasthan': RAJASTHAN_CITIES,
  'Kerala': KERALA_CITIES,
  'Punjab': PUNJAB_CITIES,
  'Odisha': ODISHA_CITIES,
  'Andhra Pradesh': ANDHRA_PRADESH_CITIES,
  'Chhattisgarh': CHHATTISGARH_CITIES,
  'Assam': ASSAM_CITIES,
  'Jharkhand': JHARKHAND_CITIES,
  'Uttarakhand': UTTARAKHAND_CITIES,
  'Himachal Pradesh': HIMACHAL_PRADESH_CITIES,
  'Jammu & Kashmir': JAMMU_KASHMIR_CITIES,
  'Goa': GOA_CITIES,
  'Sikkim': SIKKIM_CITIES,
  'Meghalaya': MEGHALAYA_CITIES,
  'Manipur': MANIPUR_CITIES,
  'Mizoram': MIZORAM_CITIES,
  'Tripura': TRIPURA_CITIES,
  'Arunachal Pradesh': ARUNACHAL_PRADESH_CITIES,
  'Haryana': HARYANA_CITIES
};

// Get all cities in a flat array
export const ALL_CITIES: readonly ReadonlyCityData[] = Object.values(STATE_CITIES).flat();

// Get cities by state
export const getCitiesByState = (state: StateName | 'All States'): readonly ReadonlyCityData[] => {
  if (state === 'All States') {
    return ALL_CITIES;
  }
  return STATE_CITIES[state];
};

// Get top N cities by AQI for a state
export const getTopNCitiesByAQI = (state: StateName | 'All States', n: number = 10): readonly ReadonlyCityData[] => {
  const cities = getCitiesByState(state);
  return cities.slice(0, n);
};
