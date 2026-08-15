import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

const LAST_MODIFIED = new Date('2026-01-01');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/offer`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
