import type { MetadataRoute } from 'next';
import { mentorshipPaths } from '@/lib/cybernurdin-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cybernurdin.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/home', '/about', '/contact', '/plans', '/courses', '/login', '/signup'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const pathRoutes = mentorshipPaths.map((path) => ({
    url: `${siteUrl}/paths/${path.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...pathRoutes];
}
