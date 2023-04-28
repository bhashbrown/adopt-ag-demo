import Page from '@/components/page';
import fsPromises from 'fs/promises';
import path from 'path';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useEffect, useRef, useState } from 'react';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';
import { Box } from '@mui/material';
import SaveHistory from './components/save-history';
import SaveMapButton from './components/save-map-button';
import SnackbarAlert from '@/components/snackbar-alert';

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

type Props = {
  polygonData: PolygonData[];
};

const MAPBOX_LOAD_FAILURE = 'Error: Mapbox failed to load';

export default function MapboxPage(props: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapboxRef = useRef<mapboxgl.Map | null>(null);
  const mapboxDrawRef = useRef<MapboxDraw | null>(null);

  const length = props.polygonData.length;
  const [polygonData, setPolygonData] = useState<PolygonData[]>(
    length ? props.polygonData : [],
  );
  const [status, setStatus] = useState<SaveStatus>(SaveStatus.ready);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCloseSnackbar = () => setStatus(SaveStatus.ready);

  // Initialize map only once (after component has mounted)
  useEffect(() => {
    mapboxRef.current = new mapboxgl.Map({
      accessToken: process.env.MAPBOX_GL_ACCESS_TOKEN,
      container: mapContainer.current!,
      style: 'mapbox://styles/b-hash/clgy8zl8i005g01pp2mibe22v',
      center: [-100, 38],
      zoom: 12,
    });

    mapboxDrawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });

    // add drawing capabilities to map
    mapboxRef.current.addControl(mapboxDrawRef.current, 'top-right');
  }, []);

  // separate map's onLoad function since it depends on polygonData
  useEffect(() => {
    if (!mapboxRef.current) {
      setStatus(SaveStatus.error);
      return setErrorMessage(MAPBOX_LOAD_FAILURE);
    }
    if (!mapboxDrawRef.current) {
      setStatus(SaveStatus.error);
      return setErrorMessage(MAPBOXDRAW_LOAD_FAILURE);
    }
    mapboxRef.current.on('load', () => {
      const length = props.polygonData.length;
      if (length) {
        mapboxDrawRef.current?.set(
          props.polygonData[length - 1].featureCollection,
        );
      }
    });
  }, [props.polygonData]);

  return (
    <Page>
      <Box margin="3rem 0" width="100%">
        <Box
          id="map"
          ref={mapContainer}
          borderRadius="0.5rem"
          height={{ xs: '20rem', sm: '25rem', md: '32rem' }}
          minWidth="18rem"
          width="100%"
        />
        <Box display="flex" justifyContent="flex-end" width="100%">
          <SaveMapButton
            mapboxDrawRef={mapboxDrawRef}
            setErrorMessage={setErrorMessage}
            setPolygonData={setPolygonData}
            setStatus={setStatus}
          />
        </Box>
        <SnackbarAlert
          open={status === SaveStatus.success}
          onClose={handleCloseSnackbar}
          severity="success"
        >
          Map saved successfully!
        </SnackbarAlert>
        <SnackbarAlert
          open={status === SaveStatus.error}
          onClose={handleCloseSnackbar}
          severity="error"
        >
          {errorMessage}
        </SnackbarAlert>
        {polygonData.length ? (
          <SaveHistory
            mapboxDrawRef={mapboxDrawRef}
            polygonDataArray={[...polygonData].reverse()}
            setErrorMessage={setErrorMessage}
            setStatus={setStatus}
          />
        ) : null}
      </Box>
    </Page>
  );
}

export async function getStaticProps() {
  // define file path to the local JSON file
  const dataFilePath = path.join(process.cwd(), 'db/polygon.json');
  // fetch and parse data from the local JSON file
  const polygonJSONData = await fsPromises.readFile(dataFilePath);
  const polygonData: PolygonData[] = JSON.parse(polygonJSONData.toString());
  // serve the data as props to the page
  return { props: { polygonData } };
}
