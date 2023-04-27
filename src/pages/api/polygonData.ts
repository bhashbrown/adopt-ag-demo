import type { NextApiRequest, NextApiResponse } from 'next';
import fsPromises from 'fs/promises';
import path from 'path';
import { FeatureCollection } from 'geojson';
import { createId } from '@paralleldrive/cuid2';

type PolygonData = {
  id: string;
  date: string; // ISO Date string
  featureCollection: FeatureCollection; // GeoJSON
};

type Data =
  | PolygonData[]
  | {
      message: string;
    };

const dataFilePath = path.join(process.cwd(), 'db/polygon.json');

export default async function processPolygonData(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: 'This API can only accept POST requests.' });
  }

  // define array outside the promise chain so the updated data
  // can be returned to the client after writing to the JSON file
  let polygonDataArray: PolygonData[] = [];

  // define new polygon data with a unique id
  const newPolygon: PolygonData = {
    id: createId(),
    ...req.body,
  };

  return (
    fsPromises
      .readFile(dataFilePath)
      .then((buffer) => {
        // fetch/parse current data from the local JSON file
        polygonDataArray = JSON.parse(buffer.toString());
        // add new save file to the data array
        polygonDataArray.push(newPolygon);
        // turn data back into JSON string
        const updatedPolygonData = JSON.stringify(polygonDataArray);
        // add the updated data to the local JSON file
        return fsPromises.writeFile(dataFilePath, updatedPolygonData);
      })
      // return updated polygon array to the client
      .then(() => res.status(200).json(polygonDataArray))
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .json({ message: 'Error storing polygon map data' });
      })
  );
}
