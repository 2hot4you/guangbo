import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";

const skillsUrl = "https://icons.lobehub.com/skills.md";
const output = path.resolve("src/content/lobe-icon-catalog.ts");
const packageJson = JSON.parse(await readFile("node_modules/@lobehub/icons/package.json", "utf8"));

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function collectEntries(markdown) {
  let category = null;
  const entries = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (line === "#### Model") { category = "model"; continue; }
    if (line === "#### Provider") { category = "provider"; continue; }
    if (/^#{1,4} /.test(line)) { category = null; continue; }
    if (!category) continue;
    const match = line.match(/^- \[([^\]]+)\]\((https:\/\/icons\.lobehub\.com\/skills\/components\/[^)]+\.md)\)/);
    if (match) entries.push({category, name: match[1], docs: match[2]});
  }
  return entries;
}

async function resolveIcon(entry) {
  const markdown = await fetchText(entry.docs);
  const source = markdown.match(/Source: `src\/([^/]+)\/index\.mdx`/);
  if (!source) throw new Error(`Missing icon source for ${entry.name}`);
  return {id: source[1], name: entry.name, category: entry.category};
}

async function resolveInBatches(entries, size = 12) {
  const result = [];
  for (let index = 0; index < entries.length; index += size) {
    result.push(...await Promise.all(entries.slice(index, index + size).map(resolveIcon)));
  }
  return result;
}

const entries = await resolveInBatches(collectEntries(await fetchText(skillsUrl)));
const providers = entries.filter((item) => item.category === "provider").sort((a, b) => a.name.localeCompare(b.name));
const models = entries.filter((item) => item.category === "model").sort((a, b) => a.name.localeCompare(b.name));
if (providers.length !== 136 || models.length !== 72) {
  throw new Error(`Catalog count changed: providers=${providers.length}, models=${models.length}`);
}
const body = `export type LobeCatalogCategory = "provider" | "model";\nexport interface LobeCatalogItem { readonly id: string; readonly name: string; readonly category: LobeCatalogCategory; }\nexport const LOBE_ICON_CATALOG_VERSION = ${JSON.stringify(packageJson.version)};\nexport const lobeProviderCatalog = ${JSON.stringify(providers, null, 2)} as const satisfies readonly LobeCatalogItem[];\nexport const lobeModelCatalog = ${JSON.stringify(models, null, 2)} as const satisfies readonly LobeCatalogItem[];\n`;
await writeFile(output, body);
