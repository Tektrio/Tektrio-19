import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tenant } from '@shared/schema';

// Create a context to manage current tenant state
interface TenantContextType {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  tenants: Tenant[];
  isLoading: boolean;
  error: Error | null;
}

const TenantContext = React.createContext<TenantContextType>({
  currentTenant: null,
  setCurrentTenant: () => {},
  tenants: [],
  isLoading: false,
  error: null,
});

// Provider component to wrap the app with
export function TenantProvider(props: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = React.useState<Tenant | null>(null);
  
  // Fetch available tenants
  const { 
    data: tenants = [], 
    isLoading, 
    error 
  } = useQuery<Tenant[], Error>({
    queryKey: ['/api/tenants'],
  });
  
  // Set the first tenant as the current tenant when data is loaded
  React.useEffect(() => {
    if (tenants.length > 0 && !currentTenant) {
      // Try to get the last selected tenant from localStorage
      const savedTenantId = localStorage.getItem('currentTenantId');
      
      if (savedTenantId) {
        const saved = tenants.find(t => t.id === parseInt(savedTenantId));
        if (saved) {
          setCurrentTenant(saved);
          return;
        }
      }
      
      // Default to first tenant if no saved tenant
      setCurrentTenant(tenants[0]);
    }
  }, [tenants, currentTenant]);
  
  // Save the current tenant ID to localStorage when it changes
  React.useEffect(() => {
    if (currentTenant) {
      localStorage.setItem('currentTenantId', currentTenant.id.toString());
    }
  }, [currentTenant]);
  
  return React.createElement(TenantContext.Provider, {
    value: {
      currentTenant,
      setCurrentTenant,
      tenants,
      isLoading,
      error: error as Error
    }
  }, props.children);
}

// Hook to use the tenant context
export function useTenant() {
  return React.useContext(TenantContext);
}
