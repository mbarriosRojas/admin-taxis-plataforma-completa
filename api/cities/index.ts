import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../lib/mongodb';
import { getUserIdFromRequest } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDatabase();
    const cities = await db.collection('cities').find({ active: true }).toArray();

    const formattedCities = cities.map(city => ({
      id: city._id.toString(),
      name: city.name,
      code: city.code,
      active: city.active,
    }));

    res.status(200).json(formattedCities);
  } catch (error) {
    console.error('Cities API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
