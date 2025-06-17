import { createContext, useContext, useState } from 'react';

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

const dummyApps: Application[] = [
  { id: 1, name: 'Inventory', status: 'ok', repository: 'git', gitUrl: 'https://example.com/inventory.git' },
  { id: 2, name: 'Billing', status: 'error', repository: 'git', gitUrl: 'https://example.com/billing.git' },
  { id: 3, name: 'Shipping', status: 'warning', repository: 'git', gitUrl: 'https://example.com/shipping.git' },
];

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const ApplicationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [apps, setApps] = useState<Application[]>(dummyApps);

  const addApp = (app: Omit<Application, 'id' | 'status'>) => {
    setApps(prev => [...prev, { id: Date.now(), status: 'ok', ...app }]);
  };

  const updateApp = (updated: Application) => {
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
