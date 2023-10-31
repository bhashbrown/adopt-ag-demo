import { Button, Card, Typography } from '@mui/material';
import {
  MAPBOXDRAW_LOAD_FAILURE,
  PolygonData,
  SaveStatus,
} from '@/components/mapbox/utils';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

type Props = {
  mapboxDrawRef: MutableRefObject<MapboxDraw | null>;
  polygonDataArray: PolygonData[];
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  setStatus: Dispatch<SetStateAction<SaveStatus>>;
};

/**
 * Shows a list of timestamps that represent saved GeoJSON files.
 * Clicking on one will load that GeoJSON polygon onto the Mapbox.
 */
export default function SaveHistory({
  mapboxDrawRef,
  polygonDataArray,
  setErrorMessage,
  setStatus,
}: Props) {
  const handleLoad = async (id: string) => {
    setStatus(SaveStatus.ready);
    setErrorMessage(null);
    if (!mapboxDrawRef.current) {
      setStatus(SaveStatus.error);
      return setErrorMessage(MAPBOXDRAW_LOAD_FAILURE);
    }
    if (polygonDataArray) {
      const polygon = polygonDataArray.find(
        (polygon) => polygon.id === id,
      )?.featureCollection;
      return polygon ? mapboxDrawRef.current.set(polygon) : null;
    }
  };

  return (
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
      {polygonDataArray?.map((polygon, index) => {
        const date = new Date(polygon.date);
        return (
          <Button
            key={`polygon-${polygon.id}`}
            onClick={() => handleLoad(polygon.id)}
            size="large"
            fullWidth
          >
            {`${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`}
          </Button>
        );
      })}
    </Card>
  );
}
