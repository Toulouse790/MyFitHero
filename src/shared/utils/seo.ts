export const generateSitemap = () => {
  const baseUrl = 'https://myfithero.app';
  const pages = [
    {
      url: '',
      priority: 1.0,
      changefreq: 'daily',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/auth',
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/dashboard',
      priority: 0.9,
      changefreq: 'daily',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/workout',
      priority: 0.9,
      changefreq: 'daily',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/nutrition',
      priority: 0.9,
      changefreq: 'daily',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/profile',
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/privacy',
      priority: 0.5,
      changefreq: 'yearly',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/terms',
      priority: 0.5,
      changefreq: 'yearly',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/support',
      priority: 0.6,
      changefreq: 'monthly',
      lastmod: new Date().toISOString().split('T')[0]
    }
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://myfithero.app/sitemap.xml

# Crawl-delay pour éviter la surcharge
Crawl-delay: 1

# Disallow paths non-utiles pour SEO
Disallow: /api/
Disallow: /*.json$
Disallow: /admin/
Disallow: /private/
Disallow: /*?*utm_*
Disallow: /*?*debug*
Disallow: /*?*test*`;
};

export const structuredDataWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "MyFitHero",
  "description": "Application de fitness intelligente avec IA - Suivi complet d'entraînement, nutrition, sommeil et hydratation",
  "url": "https://myfithero.app",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Organization",
    "name": "MyFitHero Team"
  },
  "featureList": [
    "Suivi personnalisé des entraînements",
    "Analyse nutritionnelle par photo",
    "Coaching IA intelligent",
    "Suivi du sommeil et hydratation",
    "Communauté sociale fitness",
    "Synchronisation avec objets connectés"
  ],
  "screenshot": [
    "https://myfithero.app/screenshots/dashboard.jpg",
    "https://myfithero.app/screenshots/workout.jpg",
    "https://myfithero.app/screenshots/nutrition.jpg"
  ]
};

export const structuredDataOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyFitHero",
  "url": "https://myfithero.app",
  "logo": "https://myfithero.app/icon-512.svg",
  "description": "Plateforme de fitness intelligente avec suivi personnalisé et coaching IA",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+33-1-23-45-67-89",
    "contactType": "Customer Service",
    "email": "support@myfithero.app",
    "availableLanguage": ["French", "English"]
  },
  "sameAs": [
    "https://twitter.com/myfithero",
    "https://facebook.com/myfithero",
    "https://instagram.com/myfithero"
  ]
};