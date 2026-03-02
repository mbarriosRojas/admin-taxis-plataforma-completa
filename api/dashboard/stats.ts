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
    const { city } = req.query;
    const filter = city && city !== 'all' ? { city } : {};

    const [
      totalVehicles,
      activeDrivers,
      activeRoutes,
      totalUsers,
      vehiclesByStatus,
      driversByCity,
    ] = await Promise.all([
      db.collection('vehicles').countDocuments(filter),
      db.collection('drivers').countDocuments({ ...filter, status: 'active' }),
      db.collection('routes').countDocuments({ ...filter, active: true }),
      db.collection('users').countDocuments(filter),
      db.collection('vehicles').aggregate([
        ...(city && city !== 'all' ? [{ $match: { city } }] : []),
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]).toArray(),
      db.collection('drivers').aggregate([
        ...(city && city !== 'all' ? [{ $match: { city } }] : []),
        { $group: { _id: '$city', count: { $sum: 1 } } },
      ]).toArray(),
    ]);

    const vehiclesByStatusMap: any = {
      available: 0,
      in_service: 0,
      maintenance: 0,
      out_of_service: 0,
    };

    vehiclesByStatus.forEach((item: any) => {
      vehiclesByStatusMap[item._id] = item.count;
    });

    const driversByCityMap: Record<string, number> = {};
    driversByCity.forEach((item: any) => {
      driversByCityMap[item._id] = item.count;
    });

    res.status(200).json({
      totalVehicles,
      activeDrivers,
      activeRoutes,
      totalUsers,
      vehiclesByStatus: vehiclesByStatusMap,
      driversByCity: driversByCityMap,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
