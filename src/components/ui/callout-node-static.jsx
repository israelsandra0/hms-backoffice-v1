import * as React from 'react';

import { SlateElement } from 'platejs/static';

import { cn } from '@/lib/utils';

export function CalloutElementStatic({
  children,
  className,
  ...props
}) {
  return (
    <SlateElement
      className={cn(
        'my-1 flex rounded-sm bg-neutral-100 p-4 pl-3 dark:bg-neutral-800',
        className
      )}
      style={{
        backgroundColor: props.element.backgroundColor,
      }}
      {...props}>
      <div className="flex w-full gap-2 rounded-md">
        <div
          className="size-6 text-[18px] select-none"
          style={{
            fontFamily:
              '"Apple Color Emoji", "Segoe UI NotoColorEmoji, "Noto Symbol", "Android EmojiSymbols',
          }}>
          <span data-plate-prevent-deserialization>
            {(props.element.icon) || '💡'}
          </span>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </SlateElement>
  );
}
