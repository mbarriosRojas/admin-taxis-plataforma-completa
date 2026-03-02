import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../lib/mongodb';
import { getUserIdFromRequest } from '../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid route ID' });
  }

  try {
    const db = await getDatabase();

    if (req.method === 'PUT') {
      const { name, origin, destination, distance, estimatedTime, price, city, active } = req.body;
      const updateData: any = {};

      if (name) updateData.name = name;
      if (origin) updateData.origin = origin;
      if (destination) updateData.destination = destination;
      if (distance !== undefined) updateData.distance = distance;
      if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime;
      if (price !== undefined) updateData.price = price;
      if (city) updateData.city = city;
      if (active !== undefined) updateData.active = active;

      const result = await db.collection('routes').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ error: 'Route not found' });
      }

      return res.status(200).json({
        id: result._id.toString(),
        name: result.name,
        origin: result.origin,
        destination: result.destination,
        distance: result.distance,
        estimatedTime: result.estimatedTime,
        price: result.price,
        city: result.city,
        active: result.active,
        createdAt: result.createdAt,
      });
    }

    if (req.method === 'DELETE') {
      const result = await db.collection('routes').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Route not found' });
      }

      return res.status(200).json({ message: 'Route deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Route API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
