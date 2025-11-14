'use client';;
import * as React from 'react';

import {
  PlateElement,
  useFocused,
  useReadOnly,
  useSelected,
} from 'platejs/react';

import { cn } from '@/lib/utils';

export function HrElement(props) {
  const readOnly = useReadOnly();
  const selected = useSelected();
  const focused = useFocused();

  return (
    <PlateElement {...props}>
      <div className="py-6" contentEditable={false}>
        <hr
          className={cn(
            'h-0.5 rounded-sm border-none bg-neutral-100 bg-clip-content dark:bg-neutral-800',
            selected && focused && 'ring-2 ring-neutral-950 ring-offset-2 dark:ring-neutral-300',
            !readOnly && 'cursor-pointer'
          )} />
      </div>
      {props.children}
    </PlateElement>
  );
}
