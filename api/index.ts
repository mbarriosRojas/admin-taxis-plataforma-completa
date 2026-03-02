import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from './lib/mongodb';
import { getUserIdFromRequest, hashPassword, verifyPassword, generateToken } from './lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const path = (req.query.path as string[]) || [];
    const endpoint = path[0];
    const resourceId = path[1];

    // Auth endpoints
    if (endpoint === 'auth') {
      return handleAuth(req, res, path[1]);
    }

    // Protected endpoints - require authentication
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Route to appropriate handler
    switch (endpoint) {
      case 'users':
        return handleUsers(req, res, resourceId);
      case 'drivers':
        return handleDrivers(req, res, resourceId);
      case 'vehicles':
        return handleVehicles(req, res, resourceId);
      case 'routes':
        return handleRoutes(req, res, resourceId);
      case 'cities':
        return handleCities(req, res);
      case 'dashboard':
        return handleDashboard(req, res);
      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Auth handlers
async function handleAuth(req: VercelRequest, res: VercelResponse, action: string) {
  const db = await getDatabase();

  if (action === 'login' && req.method === 'POST') {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.collection('users').findOne({ email });
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    return res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        city: user.city,
        createdAt: user.createdAt,
      },
    });
  }

  if (action === 'register' && req.method === 'POST') {
    const { email, password, name, role = 'operator', city } = req.body;
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
      role,
      city,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('users').insertOne(newUser);
    const token = generateToken(result.insertedId.toString());

    return res.status(201).json({
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
  }

  return res.status(404).json({ error: 'Not found' });
}

// Users handlers
async function handleUsers(req: VercelRequest, res: VercelResponse, id?: string) {
  const db = await getDatabase();

  if (id) {
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
  } else {
    if (req.method === 'GET') {
      const { city } = req.query;
      const filter = city && city !== 'all' ? { city } : {};
      const users = await db.collection('users').find(filter).project({ password: 0 }).toArray();
      return res.status(200).json(users.map(u => ({
        id: u._id.toString(),
        email: u.email,
        name: u.name,
        role: u.role,
        city: u.city,
        createdAt: u.createdAt,
      })));
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
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Drivers handlers
async function handleDrivers(req: VercelRequest, res: VercelResponse, id?: string) {
  const db = await getDatabase();

  if (id) {
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
  } else {
    if (req.method === 'GET') {
      const { city } = req.query;
      const filter = city && city !== 'all' ? { city } : {};
      const drivers = await db.collection('drivers').find(filter).toArray();
      return res.status(200).json(drivers.map(d => ({
        id: d._id.toString(),
        name: d.name,
        license: d.license,
        phone: d.phone,
        email: d.email,
        city: d.city,
        status: d.status,
        assignedVehicle: d.assignedVehicle,
        createdAt: d.createdAt,
      })));
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
      return res.status(201).json({ id: result.insertedId.toString(), ...newDriver });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Vehicles handlers (similar pattern)
async function handleVehicles(req: VercelRequest, res: VercelResponse, id?: string) {
  const db = await getDatabase();

  if (id) {
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
  } else {
    if (req.method === 'GET') {
      const { city } = req.query;
      const filter = city && city !== 'all' ? { city } : {};
      const vehicles = await db.collection('vehicles').find(filter).toArray();
      return res.status(200).json(vehicles.map(v => ({
        id: v._id.toString(),
        plate: v.plate,
        brand: v.brand,
        model: v.model,
        year: v.year,
        city: v.city,
        status: v.status,
        assignedDriver: v.assignedDriver,
        mileage: v.mileage,
        createdAt: v.createdAt,
      })));
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
      return res.status(201).json({ id: result.insertedId.toString(), ...newVehicle });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Routes handlers
async function handleRoutes(req: VercelRequest, res: VercelResponse, id?: string) {
  const db = await getDatabase();

  if (id) {
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
  } else {
    if (req.method === 'GET') {
      const { city } = req.query;
      const filter = city && city !== 'all' ? { city } : {};
      const routes = await db.collection('routes').find(filter).toArray();
      return res.status(200).json(routes.map(r => ({
        id: r._id.toString(),
        name: r.name,
        origin: r.origin,
        destination: r.destination,
        distance: r.distance,
        estimatedTime: r.estimatedTime,
        price: r.price,
        city: r.city,
        active: r.active,
        createdAt: r.createdAt,
      })));
    }

    if (req.method === 'POST') {
      const { name, origin, destination, distance, estimatedTime, price, city, active } = req.body;
      if (!name || !origin || !destination || !city) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newRoute = {
        name,
        origin,
        destination,
        distance: distance || 0,
        estimatedTime: estimatedTime || 0,
        price: price || 0,
        city,
        active: active !== undefined ? active : true,
        createdAt: new Date().toISOString(),
      };

      const result = await db.collection('routes').insertOne(newRoute);
      return res.status(201).json({ id: result.insertedId.toString(), ...newRoute });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Cities handler
async function handleCities(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const db = await getDatabase();
  const cities = await db.collection('cities').find({ active: true }).toArray();
  return res.status(200).json(cities.map(c => ({
    id: c._id.toString(),
    name: c.name,
    code: c.code,
    active: c.active,
  })));
}

// Dashboard handler
async function handleDashboard(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  return res.status(200).json({
    totalVehicles,
    activeDrivers,
    activeRoutes,
    totalUsers,
    vehiclesByStatus: vehiclesByStatusMap,
    driversByCity: driversByCityMap,
  });
}
