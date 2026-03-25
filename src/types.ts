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
  tags: string[];
  category: 'environmental' | 'interior' | 'others';
  imageUrl?: string;
  icon?: string;
}

export interface FestivalItem {
  id: string;
  title: string;
  sub: string;
  order: number;
}

export interface AboutInfo {
  name: string;
  title: string;
  highlight: string;
  description: string;
  phone: string;
  email: string;
  experiences: Experience[];
}

export interface Experience {
  id: string;
  company: string;
  period: string;
  opacity?: number;
}
