import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CityProvider } from '@/contexts/CityContext';

export const AdminLayout = () => {
  return (
    <CityProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto bg-background p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </CityProvider>
  );
};
