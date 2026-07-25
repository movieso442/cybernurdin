import { socialLinks } from '@/lib/cybernurdin-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cybernurdin.com';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Site-wide Organization + WebSite structured data, rendered once in the root layout. */
export function SiteStructuredData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'CyberNurdin',
    url: siteUrl,
    logo: `${siteUrl}/cybernurdin-logo-mark-transparent.png`,
    description:
      'CyberNurdin is a premium cybersecurity mentorship platform that helps beginners build cybersecurity foundations through structured lessons, practical tasks, curated resources, and mentor-guided progression.',
    areaServed: {
      '@type': 'Country',
      name: 'Cameroon',
    },
    sameAs: socialLinks.map((social) => social.href),
    founder: {
      '@type': 'Person',
      name: 'Kewangang Muhammed Nurdin',
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CyberNurdin',
    url: siteUrl,
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
  return <JsonLd data={data} />;
}

export function CourseStructuredData({
  name,
  description,
  url,
  level,
}: {
  name: string;
  description: string;
  url: string;
  level: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: `${siteUrl}${url}`,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'CyberNurdin',
      url: siteUrl,
      sameAs: socialLinks.map((social) => social.href),
    },
    educationalLevel: level,
    inLanguage: 'en',
    about: 'Cybersecurity',
  };
  return <JsonLd data={data} />;
}
