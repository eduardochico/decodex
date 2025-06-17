import { createContext, useContext, useState } from 'react';

export interface Application {
  id: number;
  name: string;
  status: 'ok' | 'error' | 'warning';
  repository: string;
  gitUrl: string;
}

interface AppsContextType {
  apps: Application[];
  addApp: (app: Omit<Application, 'id' | 'status'>) => void;
  updateApp: (app: Application) => void;
}

const dummyApps: Application[] = [
  { id: 1, name: 'Inventory', status: 'ok', repository: 'git', gitUrl: 'https://example.com/inventory.git' },
  { id: 2, name: 'Billing', status: 'error', repository: 'git', gitUrl: 'https://example.com/billing.git' },
  { id: 3, name: 'Shipping', status: 'warning', repository: 'git', gitUrl: 'https://example.com/shipping.git' },
];

const AppsContext = createContext<AppsContextType | undefined>(undefined);

export const AppsProvider = ({ children }: { children: React.ReactNode }) => {
  const [apps, setApps] = useState<Application[]>(dummyApps);

  const addApp = (app: Omit<Application, 'id' | 'status'>) => {
    setApps(prev => [...prev, { id: Date.now(), status: 'ok', ...app }]);
  };

  const updateApp = (updated: Application) => {
    setApps(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  return (
    <AppsContext.Provider value={{ apps, addApp, updateApp }}>
      {children}
    </AppsContext.Provider>
  );
};

export const useApps = () => {
  const ctx = useContext(AppsContext);
  if (!ctx) throw new Error('useApps must be used within AppsProvider');
  return ctx;
};
