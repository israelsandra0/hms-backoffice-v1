import * as React from 'react';

import { getEquationHtml } from '@platejs/math';
import { RadicalIcon } from 'lucide-react';
import { SlateElement } from 'platejs/static';

import { cn } from '@/lib/utils';

export function EquationElementStatic(
  props
) {
  const { element } = props;

  const html = getEquationHtml({
    element,
    options: {
      displayMode: true,
      errorColor: '#cc0000',
      fleqn: false,
      leqno: false,
      macros: { '\\f': '#1f(#2)' },
      output: 'htmlAndMathml',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    },
  });

  return (
    <SlateElement className="my-1" {...props}>
      <div
        className={cn(
          'group flex items-center justify-center rounded-sm select-none hover:bg-neutral-900/10 data-[selected=true]:bg-neutral-900/10 dark:hover:bg-neutral-50/10 dark:data-[selected=true]:bg-neutral-50/10',
          element.texExpression.length === 0 ? 'bg-neutral-100 p-3 pr-9 dark:bg-neutral-800' : 'px-2 py-1'
        )}>
        {element.texExpression.length > 0 ? (
          <span
            dangerouslySetInnerHTML={{
              __html: html,
            }} />
        ) : (
          <div
            className="flex h-7 w-full items-center gap-2 text-sm whitespace-nowrap text-neutral-500 dark:text-neutral-400">
            <RadicalIcon className="size-6 text-neutral-500/80 dark:text-neutral-400/80" />
            <div>Add a Tex equation</div>
          </div>
        )}
      </div>
      {props.children}
    </SlateElement>
  );
}

export function InlineEquationElementStatic(
  props
) {
  const html = getEquationHtml({
    element: props.element,
    options: {
      displayMode: true,
      errorColor: '#cc0000',
      fleqn: false,
      leqno: false,
      macros: { '\\f': '#1f(#2)' },
      output: 'htmlAndMathml',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    },
  });

  return (
    <SlateElement
      {...props}
      className="inline-block rounded-sm select-none [&_.katex-display]:my-0">
      <div
        className={cn(
          'after:absolute after:inset-0 after:-top-0.5 after:-left-1 after:z-1 after:h-[calc(100%)+4px] after:w-[calc(100%+8px)] after:rounded-sm after:content-[""]',
          'h-6',
          props.element.texExpression.length === 0 &&
            'text-neutral-500 after:bg-neutral-500/10 dark:text-neutral-400'
        )}>
        <span
          className={cn(
            props.element.texExpression.length === 0 && 'hidden',
            'font-mono leading-none'
          )}
          dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {props.children}
    </SlateElement>
  );
}
