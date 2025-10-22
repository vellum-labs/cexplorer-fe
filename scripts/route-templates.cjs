const BASE_URL = "https://beta.cexplorer.io";

const defaultTemplate = {
  og_type: "website",
  og_image: "./resources/preview.png",
  og_site_name: "beta.cexplorer.io",
  og_locale: "en_US",
  twitter_card: "summary_large_image",
  twitter_image: "./resources/preview.png",
  twitter_site: "@cexplorer_io",
};

function generateJsonLd(config) {
  const jsonldObj = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.title,
    description: config.description,
    url: `${BASE_URL}${config.path}`,
    publisher: {
      "@type": "Organization",
      name: "Cexplorer.io",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Cexplorer.io",
      url: BASE_URL,
    },
    image: {
      "@type": "ImageObject",
      url: `${BASE_URL}/resources/preview.png`,
    },
  };

  return JSON.stringify(jsonldObj);
}

module.exports = {
  BASE_URL,
  defaultTemplate,
  generateJsonLd,
};
