import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../lib/mongodb';
import { getUserIdFromRequest, hashPassword } from '../lib/auth';
import { ObjectId } from 'mongodb';

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
      
      const users = await db.collection('users')
        .find(filter)
        .project({ password: 0 })
        .toArray();

      const formattedUsers = users.map(user => ({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        city: user.city,
        createdAt: user.createdAt,
      }));

      return res.status(200).json(formattedUsers);
    }

    if (req.method === 'POST') {
      const { email, password, name, role, city } = req.body;

      if (!email || !password || !name || !city) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = hashPassword(password);
      const newUser = {
        email,
        password: hashedPassword,
        name,
        role: role || 'operator',
        city,
        createdAt: new Date().toISOString(),
      };

      const result = await db.collection('users').insertOne(newUser);

      return res.status(201).json({
        id: result.insertedId.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        city: newUser.city,
        createdAt: newUser.createdAt,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
