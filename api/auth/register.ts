import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../lib/mongodb';
import { hashPassword, generateToken } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, role = 'operator', city } = req.body;

    if (!email || !password || !name || !city) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await getDatabase();
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = hashPassword(password);
    const newUser = {
      email,
      password: hashedPassword,
      name,
      role,
      city,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('users').insertOne(newUser);
    const token = generateToken(result.insertedId.toString());

    res.status(201).json({
      token,
      user: {
        id: result.insertedId.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        city: newUser.city,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
