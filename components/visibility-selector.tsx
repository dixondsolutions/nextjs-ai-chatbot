'use client';

import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export type VisibilityType = 'public' | 'private';

interface VisibilitySelectorProps {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  onSelect: (visibility: VisibilityType) => Promise<void>;
  children: ReactNode;
}

export function VisibilitySelector({
  chatId,
  selectedVisibilityType,
  onSelect,
  children,
}: VisibilitySelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onSelect('public')}
          className="gap-2"
        >
          Public
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSelect('private')}
          className="gap-2"
        >
          Private
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
