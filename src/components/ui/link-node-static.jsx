import * as React from 'react';

import { getLinkAttributes } from '@platejs/link';
import { SlateElement } from 'platejs/static';

export function LinkElementStatic(props) {
  return (
    <SlateElement
      {...props}
      as="a"
      className="font-medium text-neutral-900 underline decoration-primary underline-offset-4 dark:text-neutral-50"
      attributes={{
        ...props.attributes,
        ...getLinkAttributes(props.editor, props.element),
      }}>
      {props.children}
    </SlateElement>
  );
}
