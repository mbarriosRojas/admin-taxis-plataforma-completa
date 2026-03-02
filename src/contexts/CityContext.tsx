import React, { createContext, useContext, useState, useEffect } from 'react';
import { City } from '@/types';

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: City[];
  isLoading: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/cities`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, cities, isLoading }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
