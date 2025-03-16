import { z } from 'zod';

// Common types
export interface FreepikConfig {
  apiKey: string;
}

// Stock Photo types
export interface SearchResourcesParams {
  term?: string;
  page?: number;
  limit?: number;
  order?: 'relevance' | 'recent';
  filters?: {
    orientation?: {
      landscape?: boolean;
      portrait?: boolean;
      square?: boolean;
      panoramic?: boolean;
    };
    content_type?: {
      photo?: boolean;
      psd?: boolean;
      vector?: boolean;
    };
    license?: {
      freemium?: boolean;
      premium?: boolean;
    };
    people?: {
      include?: boolean;
      exclude?: boolean;
      number?: '1' | '2' | '3' | 'more_than_three';
      age?: 'infant' | 'child' | 'teen' | 'young-adult' | 'adult' | 'senior' | 'elder';
      gender?: 'male' | 'female';
      ethnicity?: 'south-asian' | 'middle-eastern' | 'east-asian' | 'black' | 'hispanic' | 'indian' | 'white' | 'multiracial';
    };
    color?: 'black' | 'blue' | 'gray' | 'green' | 'orange' | 'red' | 'white' | 'yellow' | 'purple' | 'cyan' | 'pink';
  };
}

export interface ResourceResponse {
  id: number;
  title: string;
  url: string;
  filename: string;
  licenses: Array<{
    type: 'freemium' | 'premium';
    url: string;
  }>;
  image: {
    type: 'photo' | 'vector' | 'psd';
    orientation: 'horizontal' | 'vertical' | 'square' | 'panoramic' | 'unknown';
    source: {
      url: string;
      key: string;
      size: string;
    };
  };
  author: {
    id: number;
    name: string;
    avatar: string;
    assets: number;
    slug: string;
  };
  stats: {
    downloads: number;
    likes: number;
  };
}

export interface SearchResourcesResponse {
  data: ResourceResponse[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Zod schemas for validation
export const SearchResourcesSchema = z.object({
  term: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).optional(),
  order: z.enum(['relevance', 'recent']).optional(),
  filters: z.object({
    orientation: z.object({
      landscape: z.boolean().optional(),
      portrait: z.boolean().optional(),
      square: z.boolean().optional(),
      panoramic: z.boolean().optional()
    }).optional(),
    content_type: z.object({
      photo: z.boolean().optional(),
      psd: z.boolean().optional(),
      vector: z.boolean().optional()
    }).optional(),
    license: z.object({
      freemium: z.boolean().optional(),
      premium: z.boolean().optional()
    }).optional()
  }).optional()
});

export const GetResourceSchema = z.object({
  id: z.number().min(1)
});

export const DownloadResourceSchema = z.object({
  id: z.number().min(1)
});

// Mystic types
export interface GenerateImageParams {
  prompt: string;
  resolution?: '2k' | '4k';
  aspect_ratio?: 'square_1_1' | 'classic_4_3' | 'traditional_3_4' | 'widescreen_16_9' | 'social_story_9_16';
  structure_reference?: string;
  style_reference?: string;
  realism?: boolean;
  engine?: 'automatic' | 'magnific_illusio' | 'magnific_sharpy' | 'magnific_sparkle';
  creative_detailing?: number;
  filter_nsfw?: boolean;
}

export interface GenerateImageResponse {
  task_id: string;
  status: string;
}

export interface CheckStatusResponse {
  status: string;
  generated?: string[];
}

// Mystic Zod schemas
export const GenerateImageSchema = z.object({
  prompt: z.string().min(1),
  resolution: z.enum(['2k', '4k']).optional(),
  aspect_ratio: z.enum([
    'square_1_1',
    'classic_4_3',
    'traditional_3_4',
    'widescreen_16_9',
    'social_story_9_16'
  ]).optional(),
  structure_reference: z.string().optional(),
  style_reference: z.string().optional(),
  realism: z.boolean().optional(),
  engine: z.enum(['automatic', 'magnific_illusio', 'magnific_sharpy', 'magnific_sparkle']).optional(),
  creative_detailing: z.number().min(0).max(100).optional(),
  filter_nsfw: z.boolean().optional()
});

export const CheckStatusSchema = z.object({
  task_id: z.string()
});