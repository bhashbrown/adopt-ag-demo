import Page from '@/components/page';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useEffect, useRef } from 'react';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapboxPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | any>(null);
  useEffect(() => {
    mapboxgl.accessToken = process.env.MAPBOX_GL_ACCESS_TOKEN ?? '';
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/b-hash/clgy8zl8i005g01pp2mibe22v',
      center: [-100, 38],
      zoom: 12,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: true,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: 'draw_polygon',
    });

    // Map#addControl takes an optional second argument to set the position of the control.
    // If no position is specified the control defaults to `top-right`. See the docs
    // for more details: https://docs.mapbox.com/mapbox-gl-js/api/#map#addcontrol

    map.current.addControl(draw, 'top-right');

    //     function updateArea(e: MapboxDraw.DrawEvent) {}

    map.current.on('load', () => {});
    //     map.on('draw.create', updateArea);
    //     map.on('draw.delete', updateArea);
    //     map.on('draw.update', updateArea);
  }, []);
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
    </Page>
  );
}
