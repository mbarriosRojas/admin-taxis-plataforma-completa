import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../lib/mongodb';
import { getUserIdFromRequest, hashPassword } from '../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const db = await getDatabase();

    if (req.method === 'PUT') {
      const { email, password, name, role, city } = req.body;
      const updateData: any = {};

      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (role) updateData.role = role;
      if (city) updateData.city = city;
      if (password) updateData.password = hashPassword(password);

      const result = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after', projection: { password: 0 } }
      );

      if (!result) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        id: result._id.toString(),
        email: result.email,
        name: result.name,
        role: result.role,
        city: result.city,
        createdAt: result.createdAt,
      });
    }

    if (req.method === 'DELETE') {
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: 'User deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('User API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
