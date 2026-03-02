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
    return res.status(400).json({ error: 'Invalid driver ID' });
  }

  try {
    const db = await getDatabase();

    if (req.method === 'PUT') {
      const { name, license, phone, email, city, status, assignedVehicle } = req.body;
      const updateData: any = {};

      if (name) updateData.name = name;
      if (license) updateData.license = license;
      if (phone) updateData.phone = phone;
      if (email) updateData.email = email;
      if (city) updateData.city = city;
      if (status) updateData.status = status;
      if (assignedVehicle !== undefined) updateData.assignedVehicle = assignedVehicle;

      const result = await db.collection('drivers').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      return res.status(200).json({
        id: result._id.toString(),
        name: result.name,
        license: result.license,
        phone: result.phone,
        email: result.email,
        city: result.city,
        status: result.status,
        assignedVehicle: result.assignedVehicle,
        createdAt: result.createdAt,
      });
    }

    if (req.method === 'DELETE') {
      const result = await db.collection('drivers').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      return res.status(200).json({ message: 'Driver deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Driver API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
