import { FeatureCollection } from 'geojson';

export type PolygonData = {
  id: string;
  date: string; // ISO Date string
  featureCollection: FeatureCollection; // GeoJSON
};

export enum SaveStatus {
  ready,
  success,
  error,
}
export const MAPBOXDRAW_LOAD_FAILURE = 'Error: MapboxDraw failed to load';
export const MAPBOX_LOAD_FAILURE = 'Error: Mapbox failed to load';
