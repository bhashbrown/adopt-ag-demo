import { Button, Card, Typography } from '@mui/material';
import {
  MAPBOXDRAW_LOAD_FAILURE,
  PolygonData,
  SaveStatus,
} from '@/pages/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

type Props = {
  mapboxDrawRef: MutableRefObject<MapboxDraw | null>;
  polygonDataArray: PolygonData[];
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  setStatus: Dispatch<SetStateAction<SaveStatus>>;
};

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
      {polygonDataArray.map((polygon, index) => {
        const date = new Date(polygon.date);
        return (
          <Button
            key={`polygon-${index}`}
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
