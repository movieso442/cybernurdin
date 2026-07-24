import type { MetadataRoute } from 'next';
import { mentorshipPaths } from '@/lib/cybernurdin-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cybernurdin.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical, indexable URLs — /signup, /apply/step-*, /apply/review,
  // /apply/success, and /activate-access are duplicate or noindexed (see
  // their page-level metadata) and intentionally excluded here.
  const staticRoutes = ['/', '/about', '/contact', '/plans', '/courses', '/login', '/apply'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const pathRoutes = mentorshipPaths.map((path) => ({
    url: `${siteUrl}/paths/${path.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...pathRoutes];
}
