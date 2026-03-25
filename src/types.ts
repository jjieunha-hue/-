/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  details?: string[]; // Multiple paragraphs or bullet points
  tags: string[];
  category: 'environmental' | 'interior' | 'others';
  imageUrl?: string;
  detailImages?: string[];
  completedImages?: string[];
  designImages?: string[];
  icon?: string;
  order: number;
}

export interface FestivalItem {
  id: string;
  title: string;
  sub: string;
  order: number;
  description?: string;
  period?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface AboutInfo {
  name: string;
  title: string;
  highlight: string;
  description: string;
  phone: string;
  email: string;
  social?: {
    instagram?: string;
    behance?: string;
    notion?: string;
  };
  experiences: Experience[];
}

export interface Experience {
  id: string;
  company: string;
  period: string;
  opacity?: number;
}
