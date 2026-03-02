import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../lib/mongodb';
import { getUserIdFromRequest } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = await getDatabase();

    if (req.method === 'GET') {
      const { city } = req.query;
      const filter = city && city !== 'all' ? { city } : {};
      
      const routes = await db.collection('routes').find(filter).toArray();

      const formattedRoutes = routes.map(route => ({
        id: route._id.toString(),
        name: route.name,
        origin: route.origin,
        destination: route.destination,
        distance: route.distance,
        estimatedTime: route.estimatedTime,
        price: route.price,
        city: route.city,
        active: route.active,
        createdAt: route.createdAt,
      }));

      return res.status(200).json(formattedRoutes);
    }

    if (req.method === 'POST') {
      const { name, origin, destination, distance, estimatedTime, price, city, active } = req.body;

      if (!name || !origin || !destination || !city) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newRoute = {
        name,
        origin,
        destination,
        distance: distance || 0,
        estimatedTime: estimatedTime || 0,
        price: price || 0,
        city,
        active: active !== undefined ? active : true,
        createdAt: new Date().toISOString(),
      };

      const result = await db.collection('routes').insertOne(newRoute);

      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newRoute,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Routes API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
