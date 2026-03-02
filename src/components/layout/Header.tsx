import { useAuth } from '@/contexts/AuthContext';
import { useCity } from '@/contexts/CityContext';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { LogOut, MapPin } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { selectedCity, setSelectedCity, cities } = useCity();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <MapPin className="h-5 w-5 text-muted-foreground" />
        <Select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-48"
        >
          <option value="all">Todas las ciudades</option>
          {cities.map((city) => (
            <option key={city.id} value={city.code}>
              {city.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
