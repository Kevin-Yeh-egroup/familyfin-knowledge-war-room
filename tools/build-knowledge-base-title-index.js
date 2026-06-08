#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const outputPath = path.join(repoRoot, "data", "knowledge-base-title-index.json");

const organizationId = "0A4f9LDYSg2A7OzOih8A3g";
const locale = "zh_TW";
const pageSize = 100;
const sourceApi = `https://www.familyfinhealth.com/api/v1/organizations/${organizationId}/search/public/articles`;

function normalizeTitleForSimilarity(title) {
  return String(title || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[「」『』《》〈〉（）()【】\[\]{}、，。！？!?:：；;,.．・\-—_~～\s]/g, "")
    .trim();
}

async function fetchPage(startIndex) {
  const response = await fetch(sourceApi, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      startIndex,
      size: pageSize,
      locale,
    }),
  });

  if (!response.ok) {
    throw new Error(`FamilyFin public article API failed: HTTP ${response.status}`);
  }

  return response.json();
}

function articleTitle(record) {
  return record.articleTitle || record.title || record.name || "";
}

function articleId(record) {
  return record.articleId || record.id || "";
}

async function main() {
  const first = await fetchPage(0);
  const total = Number(first.total || first.count || 0);
  const records = [...(first.source || first.items || first.data || [])];

  for (let startIndex = pageSize; startIndex < total; startIndex += pageSize) {
    const page = await fetchPage(startIndex);
    records.push(...(page.source || page.items || page.data || []));
  }

  const seen = new Set();
  const titles = records
    .map((record) => ({
      articleId: articleId(record),
      title: articleTitle(record),
    }))
    .filter((record) => record.articleId && record.title)
    .filter((record) => {
      const key = `${record.articleId}:${record.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((record) => ({
      ...record,
      normalizedTitle: normalizeTitleForSimilarity(record.title),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "zh-Hant"));

  const output = {
    updatedAt: new Date().toISOString(),
    source: "FamilyFin public knowledge-base article title search API",
    sourceApi,
    organizationId,
    locale,
    privacy: {
      publicTitlesOnly: true,
      rawArticleBodiesStored: false,
      privateInfoCenterDataStored: false,
    },
    totalReportedByApi: total,
    fetchedRecords: records.length,
    titleCount: titles.length,
    titles,
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`knowledge-base-title-index.json updated with ${titles.length} titles.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
