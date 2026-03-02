export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supervisor' | 'operator';
  city: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  email: string;
  city: string;
  status: 'active' | 'inactive' | 'suspended';
  assignedVehicle?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  status: 'available' | 'in_service' | 'maintenance' | 'out_of_service';
  assignedDriver?: string;
  mileage: number;
  createdAt: string;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  price: number;
  city: string;
  active: boolean;
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface DashboardStats {
  totalVehicles: number;
  activeDrivers: number;
  activeRoutes: number;
  totalUsers: number;
  vehiclesByStatus: {
    available: number;
    in_service: number;
    maintenance: number;
    out_of_service: number;
  };
  driversByCity: Record<string, number>;
}

export interface AuthResponse {
  token: string;
  user: User;
}
