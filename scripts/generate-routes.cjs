/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const { routes: routesConfig } = require("../conf/metadata/routes-config.cjs");
const { defaultTemplate, generateJsonLd } = require("./route-templates.cjs");

function generateRoute(config) {
  const route = {
    path: config.path,
    title: config.title,
    description: config.description,
    keywords: config.keywords || "",
    canonical: config.path,

    og_title: config.og_title || config.title,
    og_description: config.og_description || config.description,
    ...defaultTemplate,

    twitter_title: config.twitter_title || config.title,
    twitter_description: config.twitter_description || config.description,

    jsonld: generateJsonLd(config),
  };

  if (typeof config.api === "string") {
    route.requiredApi = config.api;
  } else {
    route.requiredApi = false;
  }

  return route;
}

function generateRoutesFile() {
  console.log("🚀 Starting routes.json generation...\n");

  const routes = routesConfig.map((config, index) => {
    console.log(
      `✓ Processing route ${index + 1}/${routesConfig.length}: ${config.path}`,
    );
    return generateRoute(config);
  });

  const distDir = path.join(__dirname, "..", "dist");

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const outputPath = path.join(distDir, "routes.json");

  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2), "utf-8");

  console.log(`\n✅ Successfully generated ${routes.length} routes`);
  console.log(`📝 File saved: ${outputPath}`);

  const withApi = routes.filter(r => r.requiredApi !== false).length;
  const withoutApi = routes.filter(r => r.requiredApi === false).length;

  console.log(`\n📊 Statistics:`);
  console.log(`   - Routes with API: ${withApi}`);
  console.log(`   - Routes without API: ${withoutApi}`);
  console.log(`   - Total: ${routes.length}`);
}

try {
  generateRoutesFile();
} catch (error) {
  console.error("❌ Error generating routes.json:", error.message);
  process.exit(1);
}
