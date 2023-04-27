import type { NextApiRequest, NextApiResponse } from 'next';
import fsPromises from 'fs/promises';
import path from 'path';
import { FeatureCollection } from 'geojson';

type PolygonData = {
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
  let polygonDataArray: PolygonData[] = [];

  return fsPromises
    .readFile(dataFilePath)
    .then((buffer) => {
      polygonDataArray = JSON.parse(buffer.toString());

      if (req.method === 'GET') {
        return res.status(200).json(polygonDataArray);
      }

      if (req.method === 'POST') {
        const newPolygon: PolygonData = req.body;
        polygonDataArray.push(newPolygon);
        const updatedPolygonData = JSON.stringify(polygonDataArray);
        return fsPromises.writeFile(dataFilePath, updatedPolygonData);
      }
    })
    .then(() => {
      if (req.method === 'POST') {
        return res.status(200).json(polygonDataArray);
      }
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error storing/fetching map data' });
    });
}
