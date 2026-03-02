import { useEffect, useState } from 'react';
import { useCity } from '@/contexts/CityContext';
import { Driver } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export const Drivers = () => {
  const { selectedCity } = useCity();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    license: '',
    phone: '',
    email: '',
    city: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    assignedVehicle: '',
  });

  useEffect(() => {
    fetchDrivers();
  }, [selectedCity]);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const cityParam = selectedCity !== 'all' ? `?city=${selectedCity}` : '';
      const data = await api.get<Driver[]>(`/api/drivers${cityParam}`);
      setDrivers(data);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await api.put(`/api/drivers/${editingDriver.id}`, formData);
      } else {
        await api.post('/api/drivers', formData);
      }
      fetchDrivers();
      resetForm();
    } catch (error) {
      console.error('Failed to save driver:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este chofer?')) return;
    try {
      await api.delete(`/api/drivers/${id}`);
      fetchDrivers();
    } catch (error) {
      console.error('Failed to delete driver:', error);
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      license: driver.license,
      phone: driver.phone,
      email: driver.email,
      city: driver.city,
      status: driver.status,
      assignedVehicle: driver.assignedVehicle || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingDriver(null);
    setFormData({
      name: '',
      license: '',
      phone: '',
      email: '',
      city: '',
      status: 'active',
      assignedVehicle: '',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status === 'active' ? 'Activo' : status === 'inactive' ? 'Inactivo' : 'Suspendido'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Choferes</h1>
          <p className="text-muted-foreground">Gestión de choferes de la flota</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Chofer
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingDriver ? 'Editar Chofer' : 'Nuevo Chofer'}</CardTitle>
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
                <Label htmlFor="license">Licencia</Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="suspended">Suspendido</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedVehicle">Vehículo Asignado (Placa)</Label>
                <Input
                  id="assignedVehicle"
                  value={formData.assignedVehicle}
                  onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Licencia</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.license}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.city}</TableCell>
                    <TableCell>{getStatusBadge(driver.status)}</TableCell>
                    <TableCell>{driver.assignedVehicle || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(driver)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(driver.id)}
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
