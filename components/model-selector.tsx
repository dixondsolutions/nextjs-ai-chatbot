'use client';

import { useEffect, useState } from 'react';
import { ModelProvider } from '@/app/(chat)/api/models/route';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function ModelSelector({
  selectedModelId,
  onChange
}: {
  selectedModelId: string;
  onChange: (modelId: string) => void;
}) {
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  if (loading) {
    return <div>Loading models...</div>;
  }

  return (
    <Select value={selectedModelId} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {providers.map((provider) => (
          <div key={provider.id}>
            <div className="px-2 py-1.5 text-sm font-semibold">{provider.name}</div>
            {provider.models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.label}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
