import Page from '@/components/page';
import fsPromises from 'fs/promises';
import path from 'path';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useEffect, useRef, useState } from 'react';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';
import { Alert, Box, Button, Card, Snackbar, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

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
const SAVE_FAILURE = 'There was an error while trying to save your map!';
enum SaveStatus {
  ready,
  success,
  error,
}

export default function MapboxPage(props: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const length = props.polygonData.length;
  const [polygonData, setPolygonData] = useState<PolygonData[]>(
    length ? props.polygonData : [],
  );
  const [isMutating, setIsMutating] = useState(false);
  const [status, setStatus] = useState<SaveStatus>(SaveStatus.ready);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCloseSnackbar = () => setStatus(SaveStatus.ready);

  const handleSave = async () => {
    if (!draw.current) {
      setStatus(SaveStatus.error);
      return setErrorMessage(MAPBOXDRAW_LOAD_FAILURE);
    }
    setStatus(SaveStatus.ready);
    setErrorMessage(null);
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

      if (response.status === 200) {
        setPolygonData(data);
        setStatus(SaveStatus.success);
      } else {
        setErrorMessage(SAVE_FAILURE);
        setStatus(SaveStatus.error);
      }
    } catch (error) {
      setStatus(SaveStatus.error);
      setErrorMessage(SAVE_FAILURE);
    } finally {
      setIsMutating(false);
    }
  };

  const handleLoad = async (id: string) => {
    setStatus(SaveStatus.ready);
    setErrorMessage(null);
    if (!draw.current) {
      setStatus(SaveStatus.error);
      return setErrorMessage(MAPBOXDRAW_LOAD_FAILURE);
    }
    if (polygonData) {
      const polygon = polygonData.find(
        (polygon) => polygon.id === id,
      )?.featureCollection;
      return polygon ? draw.current.set(polygon) : null;
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
    if (!map.current) {
      setStatus(SaveStatus.error);
      return setErrorMessage(MAPBOX_LOAD_FAILURE);
    }
    if (!draw.current) {
      setStatus(SaveStatus.error);
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
          <Button
            disabled={isMutating}
            onClick={handleSave}
            size="large"
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{
              margin: { xs: '1rem 0', sm: '1rem 0 0 1rem' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Save Map
          </Button>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={status !== SaveStatus.ready}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={status === SaveStatus.success ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {status === SaveStatus.success
              ? 'Map saved successfully!'
              : errorMessage}
          </Alert>
        </Snackbar>
        {polygonData.length ? (
          <Card
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1rem',
              width: { xs: '100%', sm: '15rem' },
            }}
          >
            <Typography component="h2" variant="h5" marginBottom="0.5rem">
              Save History
            </Typography>
            {[...polygonData].reverse().map((polygon, index) => {
              const date = new Date(polygon.date);
              return (
                <Button
                  key={`polygon-${index}`}
                  disabled={isMutating}
                  onClick={() => handleLoad(polygon.id)}
                  size="large"
                  fullWidth
                >
                  {`${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`}
                </Button>
              );
            })}
          </Card>
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
