/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html: string) {
  if (!html) return '';
  // Replace &nbsp; and double-encoded &nbsp; with regular space
  const cleaned = html.replace(/&nbsp;/g, ' ').replace(/&amp;nbsp;/g, ' ');
  // Strip HTML tags
  return cleaned.replace(/<[^>]*>/g, '').trim();
}
