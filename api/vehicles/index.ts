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
      
      const vehicles = await db.collection('vehicles').find(filter).toArray();

      const formattedVehicles = vehicles.map(vehicle => ({
        id: vehicle._id.toString(),
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        city: vehicle.city,
        status: vehicle.status,
        assignedDriver: vehicle.assignedDriver,
        mileage: vehicle.mileage,
        createdAt: vehicle.createdAt,
      }));

      return res.status(200).json(formattedVehicles);
    }

    if (req.method === 'POST') {
      const { plate, brand, model, year, city, status, assignedDriver, mileage } = req.body;

      if (!plate || !brand || !model || !year || !city) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newVehicle = {
        plate,
        brand,
        model,
        year,
        city,
        status: status || 'available',
        assignedDriver: assignedDriver || null,
        mileage: mileage || 0,
        createdAt: new Date().toISOString(),
      };

      const result = await db.collection('vehicles').insertOne(newVehicle);

      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newVehicle,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vehicles API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
