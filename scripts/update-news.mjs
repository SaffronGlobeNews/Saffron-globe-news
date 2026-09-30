import fs from "node:fs/promises";

const apiKey = process.env.GNEWS_API_KEY;
if (!apiKey) throw new Error("Missing GNEWS_API_KEY GitHub secret.");

const categories = ["world", "business", "entertainment", "sports"];
const base = "https://gnews.io/api/v4/top-headlines";
const all = [];

for (const category of categories) {
  const url = new URL(base);
  url.searchParams.set("category", category);
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", "10");
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GNews request failed for ${category}: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  for (const item of data.articles ?? []) {
    all.push({
      category,
      title: item.title ?? "",
      description: item.description ?? "",
      content: item.content ?? "",
      image: item.image ?? "",
      url: item.url ?? "",
      publishedAt: item.publishedAt ?? null,
      source: item.source?.name ?? "Unknown source"
    });
  }
}

const seen = new Set();
const stories = all
  .filter(item => item.title && item.url)
  .filter(item => {
    const key = item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
  .slice(0, 30);

await fs.mkdir("data", { recursive: true });
await fs.writeFile(
  "data/news.json",
  JSON.stringify({ updatedAt: new Date().toISOString(), source: "GNews API", stories }, null, 2) + "\n",
  "utf8"
);

console.log(`Saved ${stories.length} stories to data/news.json`);
