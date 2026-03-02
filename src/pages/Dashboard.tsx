import { useEffect, useState } from 'react';
import { useCity } from '@/contexts/CityContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import { api } from '@/services/api';
import { Users, Car, Route, UserCircle } from 'lucide-react';

export const Dashboard = () => {
  const { selectedCity } = useCity();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const cityParam = selectedCity !== 'all' ? `?city=${selectedCity}` : '';
        const data = await api.get<DashboardStats>(`/api/dashboard/stats${cityParam}`);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [selectedCity]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const statCards = [
    {
      title: 'Total Vehículos',
      value: stats?.totalVehicles || 0,
      icon: Car,
      color: 'text-blue-600',
    },
    {
      title: 'Choferes Activos',
      value: stats?.activeDrivers || 0,
      icon: UserCircle,
      color: 'text-green-600',
    },
    {
      title: 'Rutas Activas',
      value: stats?.activeRoutes || 0,
      icon: Route,
      color: 'text-purple-600',
    },
    {
      title: 'Usuarios',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Vista general de la plataforma de administración de taxis
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehículos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Disponibles</span>
                <span className="font-bold text-green-600">
                  {stats?.vehiclesByStatus.available || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">En Servicio</span>
                <span className="font-bold text-blue-600">
                  {stats?.vehiclesByStatus.in_service || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mantenimiento</span>
                <span className="font-bold text-orange-600">
                  {stats?.vehiclesByStatus.maintenance || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fuera de Servicio</span>
                <span className="font-bold text-red-600">
                  {stats?.vehiclesByStatus.out_of_service || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Choferes por Ciudad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.driversByCity && Object.entries(stats.driversByCity).map(([city, count]) => (
                <div key={city} className="flex items-center justify-between">
                  <span className="text-sm">{city}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
              {(!stats?.driversByCity || Object.keys(stats.driversByCity).length === 0) && (
                <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
