import * as React from 'react';

import { ChevronRight } from 'lucide-react';
import { SlateElement } from 'platejs/static';

export function ToggleElementStatic(props) {
  return (
    <SlateElement {...props} className="pl-6">
      <div
        className="absolute top-0 -left-0.5 size-6 cursor-pointer items-center justify-center rounded-md p-px text-neutral-500 transition-colors select-none hover:bg-neutral-100 [&_svg]:size-4 dark:text-neutral-400 dark:hover:bg-neutral-800"
        contentEditable={false}>
        <ChevronRight className="rotate-0 transition-transform duration-75" />
      </div>
      {props.children}
    </SlateElement>
  );
}
