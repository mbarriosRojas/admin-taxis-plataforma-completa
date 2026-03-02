import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  UserCircle,
  Route,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Usuarios', path: '/users' },
  { icon: UserCircle, label: 'Choferes', path: '/drivers' },
  { icon: Car, label: 'Vehículos', path: '/vehicles' },
  { icon: Route, label: 'Rutas', path: '/routes' },
  { icon: Settings, label: 'Configuración', path: '/settings' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Admin Taxis</h1>
        <p className="text-sm text-muted-foreground">Plataforma Completa</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
