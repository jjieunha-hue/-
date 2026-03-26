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
  design2DImages?: string[];
  design3DImages?: string[];
  icon?: string;
  order: number;
}

export interface FestivalItem {
  id: string;
  title: string;
  sub: string;
  order: number;
  location?: string;
  description?: string;
  details?: string[];
  period?: string;
  tags?: string[];
  imageUrl?: string;
  completedImages?: string[];
  design2DImages?: string[];
  design3DImages?: string[];
  detailImages?: string[];
}

export interface AboutInfo {
  name: string;
  title: string;
  highlight: string;
  description: string;
  phone: string;
  email: string;
  environmentalTitle?: string;
  interiorTitle?: string;
  othersTitle?: string;
  festivalTitle?: string;
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
