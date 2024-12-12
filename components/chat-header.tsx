'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { deleteTrailingMessages, updateChatVisibility } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { TrashIcon, EyeIcon } from './icons';
import { ModelSelector } from './model-selector';
import { VisibilitySelector, VisibilityType } from './visibility-selector';

export function ChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between px-4 py-2 border-b">
      <div className="flex flex-row gap-2 items-center">
        {!isReadonly && (
          <Button
            variant="ghost"
            className="px-2 h-[34px]"
            onClick={async () => {
              setIsDeleting(true);

              try {
                await fetch(`/api/chat?id=${chatId}`, {
                  method: 'DELETE',
                });

                router.push('/');
              } catch (error) {
                console.error(error);
              } finally {
                setIsDeleting(false);
              }
            }}
            disabled={isDeleting}
          >
            <TrashIcon />
          </Button>
        )}
      </div>

      <div
        className={cn(
          'flex flex-row gap-2 items-center order-2 md:order-1 w-full md:w-fit',
        )}
      >
        {!isReadonly && (
          <ModelSelector
            selectedModelId={selectedModelId}
            onChange={async (modelId) => {
              // Handle model change
              router.refresh();
            }}
          />
        )}
      </div>

      <div className="flex flex-row gap-2 items-center order-3">
        {!isReadonly && (
          <VisibilitySelector
            selectedVisibilityType={selectedVisibilityType}
            onSelect={async (visibility) => {
              await updateChatVisibility({
                chatId,
                visibility,
              });

              router.refresh();
            }}
          >
            <Button variant="ghost" className="px-2 h-[34px]">
              <EyeIcon className={selectedVisibilityType === 'private' ? 'opacity-50' : ''} />
            </Button>
          </VisibilitySelector>
        )}
      </div>
    </div>
  );
}
