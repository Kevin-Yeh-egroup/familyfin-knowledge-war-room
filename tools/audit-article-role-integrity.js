#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const targetArg = process.argv[2] || "articles";
const targetPath = path.resolve(repoRoot, targetArg);

const roleLeakPatterns = [
  /讀者版本/,
  /一般民眾版/,
  /社工版/,
  /這篇文章/,
  /以下用/,
  /這不是單一真實故事/,
  /常見(?:家庭收支|租屋家庭)?(?:狀況)?整理/,
  /情境說明/,
  /先把一個狀況說完/,
  /文章裡/,
  /本文可以/,
  /本文應/,
  /文章最後/,
  /文章發展/,
  /如果這篇(?:文章)?要(?:投稿|用在知識庫)/,
  /對一般民眾版(?:文章)?而言/,
  /對知識庫文章而言/,
  /可以提醒讀者/,
  /建議每篇/,
  /好理家在文章的重要任務/,
  /知識文章要做到/,
  /審稿/,
  /投稿/,
  /\bagent\b/i,
];

const socialWorkerVoicePatterns = [
  /讀者版本：社工/,
  /對社工而言/,
  /社工可以/,
  /社工介入/,
  /社工評估/,
  /服務對象/,
  /個案/,
  /助人者/,
  /助人工作者/,
];

function listTxtFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listTxtFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith(".txt")) return [fullPath];
    return [];
  });
}

function bodyLines(text) {
  const lines = text.split(/\r?\n/);
  const bodyStart = lines.findIndex((line) => line.trim() === "正文");
  return {
    metadata: bodyStart >= 0 ? lines.slice(0, bodyStart) : [],
    body: bodyStart >= 0 ? lines.slice(bodyStart + 1) : lines,
  };
}

function collectMatches(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const { metadata, body } = bodyLines(text);
  const matches = [];
  const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, "/");

  body.forEach((line, index) => {
    const lineNumber = metadata.length + 2 + index;
    for (const pattern of roleLeakPatterns) {
      if (pattern.test(line)) {
        matches.push({
          file: relativePath,
          line: lineNumber,
          type: "role_leak_in_body",
          pattern: pattern.toString(),
          text: line.trim(),
        });
        break;
      }
    }
    for (const pattern of socialWorkerVoicePatterns) {
      if (pattern.test(line)) {
        matches.push({
          file: relativePath,
          line: lineNumber,
          type: "social_worker_voice_in_public_default",
          pattern: pattern.toString(),
          text: line.trim(),
        });
        break;
      }
    }
  });

  metadata.forEach((line, index) => {
    if (/讀者版本：社工/.test(line)) {
      matches.push({
        file: relativePath,
        line: index + 1,
        type: "non_default_audience_metadata",
        pattern: "/讀者版本：社工/",
        text: line.trim(),
      });
    }
  });

  return matches;
}

if (!fs.existsSync(targetPath)) {
  console.error(`Target not found: ${targetPath}`);
  process.exit(2);
}

const files = fs.statSync(targetPath).isDirectory() ? listTxtFiles(targetPath) : [targetPath];
const matches = files.flatMap(collectMatches);
const summary = {
  scannedFiles: files.length,
  matches: matches.length,
  pass: matches.length === 0,
  target: path.relative(repoRoot, targetPath).replace(/\\/g, "/") || ".",
  matchesByType: matches.reduce((acc, match) => {
    acc[match.type] = (acc[match.type] || 0) + 1;
    return acc;
  }, {}),
  details: matches,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(matches.length === 0 ? 0 : 1);
