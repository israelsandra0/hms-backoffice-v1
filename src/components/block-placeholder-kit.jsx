'use client';

import { KEYS } from 'platejs';
import { BlockPlaceholderPlugin } from 'platejs/react';

export const BlockPlaceholderKit = [
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        'before:absolute before:cursor-text before:text-neutral-500/80 before:content-[attr(placeholder)] dark:before:text-neutral-400/80',
      placeholders: {
        [KEYS.p]: 'Type something...',
      },
      query: ({ path }) => {
        return path.length === 1;
      },
    },
  }),
];
