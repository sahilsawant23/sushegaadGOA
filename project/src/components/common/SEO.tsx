import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Sushegaad GOA - Discover Paradise & Local Experiences',
  description = 'Explore pristine Goa beaches, verified local guides, authentic shacks, self-drive vehicle rentals, and curated tour packages with Sushegaad GOA.',
  keywords = 'Goa travel, Goa beach rentals, self-drive car rental Goa, Goa tour packages, Sushegaad Goa, Goa local guides, Goa shacks',
  ogImage = '/og-image.jpg',
}) => {
  useEffect(() => {
    const fullTitle = title.includes('Sushegaad GOA') ? title : `${title} | Sushegaad GOA`;
    document.title = fullTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('twitter:card', 'summary_large_image', true);

  }, [title, description, keywords, ogImage]);

  return null;
};

export default SEO;
