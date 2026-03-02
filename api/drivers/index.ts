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
      
      const drivers = await db.collection('drivers').find(filter).toArray();

      const formattedDrivers = drivers.map(driver => ({
        id: driver._id.toString(),
        name: driver.name,
        license: driver.license,
        phone: driver.phone,
        email: driver.email,
        city: driver.city,
        status: driver.status,
        assignedVehicle: driver.assignedVehicle,
        createdAt: driver.createdAt,
      }));

      return res.status(200).json(formattedDrivers);
    }

    if (req.method === 'POST') {
      const { name, license, phone, email, city, status, assignedVehicle } = req.body;

      if (!name || !license || !phone || !email || !city) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newDriver = {
        name,
        license,
        phone,
        email,
        city,
        status: status || 'active',
        assignedVehicle: assignedVehicle || null,
        createdAt: new Date().toISOString(),
      };

      const result = await db.collection('drivers').insertOne(newDriver);

      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newDriver,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Drivers API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
