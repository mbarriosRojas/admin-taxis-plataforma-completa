import { useEffect, useState } from 'react';
import { useCity } from '@/contexts/CityContext';
import { Route } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export const Routes = () => {
  const { selectedCity } = useCity();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: 0,
    estimatedTime: 0,
    price: 0,
    city: '',
    active: true,
  });

  useEffect(() => {
    fetchRoutes();
  }, [selectedCity]);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const cityParam = selectedCity !== 'all' ? `?city=${selectedCity}` : '';
      const data = await api.get<Route[]>(`/api/routes${cityParam}`);
      setRoutes(data);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await api.put(`/api/routes/${editingRoute.id}`, formData);
      } else {
        await api.post('/api/routes', formData);
      }
      fetchRoutes();
      resetForm();
    } catch (error) {
      console.error('Failed to save route:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta ruta?')) return;
    try {
      await api.delete(`/api/routes/${id}`);
      fetchRoutes();
    } catch (error) {
      console.error('Failed to delete route:', error);
    }
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      price: route.price,
      city: route.city,
      active: route.active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingRoute(null);
    setFormData({
      name: '',
      origin: '',
      destination: '',
      distance: 0,
      estimatedTime: 0,
      price: 0,
      city: '',
      active: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rutas</h1>
          <p className="text-muted-foreground">Gestión de rutas de la flota</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ruta
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRoute ? 'Editar Ruta' : 'Nueva Ruta'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Origen</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance">Distancia (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Tiempo Estimado (min)</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="active">Ruta Activa</Label>
              </div>

              <div className="flex gap-2 md:col-span-2">
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div>Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Distancia</TableHead>
                  <TableHead>Tiempo Est.</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{route.origin}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>{route.distance} km</TableCell>
                    <TableCell>{route.estimatedTime} min</TableCell>
                    <TableCell>${route.price.toFixed(2)}</TableCell>
                    <TableCell>{route.city}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          route.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {route.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(route)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(route.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
