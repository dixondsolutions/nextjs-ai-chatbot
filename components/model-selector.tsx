'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { ChevronDownIcon } from './icons';

interface ModelSelectorProps {
  selectedModelId: string;
  onChange: (modelId: string) => void;
}

export function ModelSelector({ selectedModelId, onChange }: ModelSelectorProps) {
  const [providers, setProviders] = useState<Array<{
    id: string;
    name: string;
    models: Array<{
      id: string;
      name: string;
      apiIdentifier: string;
    }>;
  }>>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };

    fetchModels();
  }, []);

  return (
    <Select value={selectedModelId} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'w-fit gap-2 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        )}
      >
        <SelectValue defaultValue={selectedModelId} />
        <ChevronDownIcon />
      </SelectTrigger>
      <SelectContent align="start" className="min-w-[300px]">
        {providers.map((provider) => (
          <div key={provider.id}>
            <SelectGroup>
              <SelectLabel className="text-xs">{provider.name}</SelectLabel>
              {provider.models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
