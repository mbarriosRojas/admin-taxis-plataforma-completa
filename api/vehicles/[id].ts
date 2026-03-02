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
    return res.status(400).json({ error: 'Invalid vehicle ID' });
  }

  try {
    const db = await getDatabase();

    if (req.method === 'PUT') {
      const { plate, brand, model, year, city, status, assignedDriver, mileage } = req.body;
      const updateData: any = {};

      if (plate) updateData.plate = plate;
      if (brand) updateData.brand = brand;
      if (model) updateData.model = model;
      if (year) updateData.year = year;
      if (city) updateData.city = city;
      if (status) updateData.status = status;
      if (assignedDriver !== undefined) updateData.assignedDriver = assignedDriver;
      if (mileage !== undefined) updateData.mileage = mileage;

      const result = await db.collection('vehicles').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.status(200).json({
        id: result._id.toString(),
        plate: result.plate,
        brand: result.brand,
        model: result.model,
        year: result.year,
        city: result.city,
        status: result.status,
        assignedDriver: result.assignedDriver,
        mileage: result.mileage,
        createdAt: result.createdAt,
      });
    }

    if (req.method === 'DELETE') {
      const result = await db.collection('vehicles').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.status(200).json({ message: 'Vehicle deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vehicle API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
