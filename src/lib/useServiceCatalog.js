import { useEffect, useState } from 'react';
import { maintenance as defaults, packages as defaultPackages, templates as defaultTemplates } from '../data/services.js';
import { simulationEnabled, simulationRequest } from './simulation-api.js';

export function useServiceCatalog() {
  const [catalog, setCatalog] = useState({
    packages: defaultPackages,
    maintenance: defaults,
    templates: defaultTemplates,
    loading: simulationEnabled,
    error: '',
  });

  useEffect(() => {
    if (!simulationEnabled) return undefined;
    const controller = new AbortController();
    simulationRequest('/api/catalog', { signal: controller.signal })
      .then((result) => setCatalog({
        packages: result.packages,
        maintenance: result.maintenance,
        templates: result.templates,
        loading: false,
        error: '',
      }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setCatalog((current) => ({ ...current, loading: false, error: error.message }));
        }
      });
    return () => controller.abort();
  }, []);

  return catalog;
}
