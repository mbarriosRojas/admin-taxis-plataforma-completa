import { useEffect, useState } from 'react';
import { useCity } from '@/contexts/CityContext';
import { Vehicle } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export const Vehicles = () => {
  const { selectedCity } = useCity();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    city: '',
    status: 'available' as 'available' | 'in_service' | 'maintenance' | 'out_of_service',
    assignedDriver: '',
    mileage: 0,
  });

  useEffect(() => {
    fetchVehicles();
  }, [selectedCity]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const cityParam = selectedCity !== 'all' ? `?city=${selectedCity}` : '';
      const data = await api.get<Vehicle[]>(`/api/vehicles${cityParam}`);
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await api.put(`/api/vehicles/${editingVehicle.id}`, formData);
      } else {
        await api.post('/api/vehicles', formData);
      }
      fetchVehicles();
      resetForm();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este vehículo?')) return;
    try {
      await api.delete(`/api/vehicles/${id}`);
      fetchVehicles();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      city: vehicle.city,
      status: vehicle.status,
      assignedDriver: vehicle.assignedDriver || '',
      mileage: vehicle.mileage,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
    setFormData({
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      city: '',
      status: 'available',
      assignedDriver: '',
      mileage: 0,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      in_service: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-orange-100 text-orange-800',
      out_of_service: 'bg-red-100 text-red-800',
    };
    const labels = {
      available: 'Disponible',
      in_service: 'En Servicio',
      maintenance: 'Mantenimiento',
      out_of_service: 'Fuera de Servicio',
    };
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vehículos</h1>
          <p className="text-muted-foreground">Gestión de vehículos de la flota</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Vehículo
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
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
                <Label htmlFor="status">Estado</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  required
                >
                  <option value="available">Disponible</option>
                  <option value="in_service">En Servicio</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="out_of_service">Fuera de Servicio</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Kilometraje</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedDriver">Chofer Asignado (Licencia)</Label>
                <Input
                  id="assignedDriver"
                  value={formData.assignedDriver}
                  onChange={(e) => setFormData({ ...formData, assignedDriver: e.target.value })}
                />
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
                  <TableHead>Placa</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Kilometraje</TableHead>
                  <TableHead>Chofer</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plate}</TableCell>
                    <TableCell>{vehicle.brand}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.city}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                    <TableCell>{vehicle.assignedDriver || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(vehicle.id)}
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
