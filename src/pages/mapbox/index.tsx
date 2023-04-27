import Page from '@/components/page';
import fsPromises from 'fs/promises';
import path from 'path';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useEffect, useRef, useState } from 'react';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';
import { Button } from '@mui/material';

type PolygonData = {
  id: string;
  date: string; // ISO Date string
  featureCollection: FeatureCollection; // GeoJSON
};

type Props = {
  polygonData: PolygonData[];
};

const MAPBOXDRAW_LOAD_FAILURE = 'Error: MapboxDraw failed to load';
const MAPBOX_LOAD_FAILURE = 'Error: Mapbox failed to load';

export default function MapboxPage(props: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const length = props.polygonData.length;
  const [polygonData, setPolygonData] = useState<PolygonData[]>(
    length ? props.polygonData : [],
  );
  const [isMutating, setIsMutating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccessfulSave = () => {
    setTimeout(() => setSuccessMessage('Map saved successfully!'), 0);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSave = async () => {
    setErrorMessage(null);
    if (!draw.current) {
      return setErrorMessage(MAPBOXDRAW_LOAD_FAILURE);
    }
    setIsMutating(true);
    const featureCollection: FeatureCollection = draw.current.getAll();
    const now = new Date().toISOString();

    try {
      const response = await fetch('/api/polygonData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: now,
          featureCollection: featureCollection,
        }),
      });
      const data = await response.json();
      setPolygonData(data);
      handleSuccessfulSave();
    } catch (error) {
      setErrorMessage('Error storing polygon map data');
    } finally {
      setIsMutating(false);
    }
  };

  const handleLoad = async () => {
    setErrorMessage(null);
    if (!draw.current) {
      return setErrorMessage(MAPBOXDRAW_LOAD_FAILURE);
    }
    if (polygonData) {
      const length = polygonData.length;
      const latestPolygonData = polygonData[length - 1].featureCollection;
      draw.current.set(latestPolygonData);
    }
  };

  // Initialize map only once (after component has mounted)
  useEffect(() => {
    map.current = new mapboxgl.Map({
      accessToken: process.env.MAPBOX_GL_ACCESS_TOKEN,
      container: mapContainer.current!,
      style: 'mapbox://styles/b-hash/clgy8zl8i005g01pp2mibe22v',
      center: [-100, 38],
      zoom: 12,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });

    // add drawing capabilities to map
    map.current.addControl(draw.current, 'top-right');
  }, []);

  // separate map's onLoad function since it depends on polygonData
  useEffect(() => {
    setErrorMessage(null);
    if (!map.current) {
      return setErrorMessage(MAPBOX_LOAD_FAILURE);
    }
    if (!draw.current) {
      return setErrorMessage(MAPBOXDRAW_LOAD_FAILURE);
    }
    map.current.on('load', () => {
      const length = props.polygonData.length;
      if (length) {
        draw.current?.set(props.polygonData[length - 1].featureCollection);
      }
    });
  }, [props.polygonData]);

  return (
    <Page>
      <div
        id="map"
        ref={mapContainer}
        style={{
          borderRadius: '0.3rem',
          maxWidth: '1100px',
          minWidth: '400px',
          minHeight: '400px',
          width: '100%',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <Button disabled={isMutating} onClick={handleLoad} variant="outlined">
          Load
        </Button>
        <Button disabled={isMutating} onClick={handleSave} variant="outlined">
          Save
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <p>{errorMessage}</p>
        <p>{successMessage}</p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <h2>Save History</h2>
        {polygonData &&
          [...polygonData].reverse().map((polygon, index) => {
            const date = new Date(polygon.date);
            return (
              <div
                key={`polygon-${index}`}
                style={{ display: 'flex', width: '100%' }}
              >
                <p>{`${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`}</p>
              </div>
            );
          })}
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const dataFilePath = path.join(process.cwd(), 'db/polygon.json');
  const polygonJSONData = await fsPromises.readFile(dataFilePath);
  const polygonData: PolygonData[] = JSON.parse(polygonJSONData.toString());
  return { props: { polygonData } };
}
