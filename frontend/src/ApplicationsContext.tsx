import { createContext, useContext, useEffect, useState } from 'react';

export interface Application {
  id: number;
  name: string;
  status: 'ok' | 'error' | 'warning';
  repository: string;
  gitUrl: string;
}

interface ApplicationsContextType {
  apps: Application[];
  addApp: (app: Omit<Application, 'id' | 'status'>) => void;
  updateApp: (app: Application) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const ApplicationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/applications`).then(r => r.json()).then(setApps).catch(() => setApps([]));
  }, []);

  const addApp = async (app: Omit<Application, 'id' | 'status'>) => {
    const res = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });
    const created = await res.json();
    setApps(prev => [...prev, created]);
  };

  const updateApp = async (updated: Application) => {
    await fetch(`${API_URL}/applications/${updated.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setApps(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  return (
    <ApplicationsContext.Provider value={{ apps, addApp, updateApp }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error('useApplications must be used within ApplicationsProvider');
  return ctx;
};
