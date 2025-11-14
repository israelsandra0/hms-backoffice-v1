'use client';;
import * as React from 'react';

import { useToggleButton, useToggleButtonState } from '@platejs/toggle/react';
import { ChevronRight } from 'lucide-react';
import { PlateElement } from 'platejs/react';

import { Button } from '@/components/ui/button';

export function ToggleElement(props) {
  const element = props.element;
  const state = useToggleButtonState(element.id);
  const { buttonProps, open } = useToggleButton(state);

  return (
    <PlateElement {...props} className="pl-6">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-0 -left-0.5 size-6 cursor-pointer items-center justify-center rounded-md p-px text-neutral-500 transition-colors select-none hover:bg-neutral-100 [&_svg]:size-4 dark:text-neutral-400 dark:hover:bg-neutral-800"
        contentEditable={false}
        {...buttonProps}>
        <ChevronRight
          className={
            open
              ? 'rotate-90 transition-transform duration-75'
              : 'rotate-0 transition-transform duration-75'
          } />
      </Button>
      {props.children}
    </PlateElement>
  );
}
