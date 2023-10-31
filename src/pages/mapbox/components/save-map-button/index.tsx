import { Button } from '@mui/material';
import {
  MAPBOXDRAW_LOAD_FAILURE,
  PolygonData,
  SaveStatus,
} from '@/components/mapbox/utils';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';
import { FeatureCollection } from 'geojson';
import SaveIcon from '@mui/icons-material/Save';

type Props = {
  mapboxDrawRef: MutableRefObject<MapboxDraw | null>;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  setPolygonData: Dispatch<SetStateAction<PolygonData[]>>;
  setStatus: Dispatch<SetStateAction<SaveStatus>>;
};
const SAVE_FAILURE = 'There was an error while trying to save your map!';

/**
 * Saves the current state of the MapboxDraw polygons by creating a POST request to `/api/polygonData`.
 * A successful POST request will result in a response with the most up to date
 * list of saved GeoJSON data. This data is rendered in the `SaveHistory` component.
 */
export default function SaveMapButton({
  mapboxDrawRef,
  setErrorMessage,
  setPolygonData,
  setStatus,
}: Props) {
  const [isMutating, setIsMutating] = useState(false);
  const handleSave = async () => {
    if (!mapboxDrawRef.current) {
      setStatus(SaveStatus.error);
      return setErrorMessage(MAPBOXDRAW_LOAD_FAILURE);
    }
    setStatus(SaveStatus.ready);
    setErrorMessage(null);
    setIsMutating(true);
    const featureCollection: FeatureCollection = mapboxDrawRef.current.getAll();
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

  return (
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
  );
}
