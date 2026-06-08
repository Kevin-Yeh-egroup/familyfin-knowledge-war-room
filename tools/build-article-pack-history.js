const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const suggestionsPath = path.join(repoRoot, "suggestions.json");
const outputPath = path.join(repoRoot, "article-pack-history.json");

const packDefinitions = [
  {
    id: "2026-06-03-public-regenerated-pack",
    date: "2026-06-03",
    title: "2026-06-03 家庭生活壓力與財務缺口候選稿",
    status: "current_review_pack",
    statusLabel: "目前工作台文章包",
    audience: "一般民眾",
    directory: "articles/2026-06-03-public-regenerated-pack",
    generatedBy: "tools/build-public-article-pack-2026-06-03.js",
    currentReviewBoard: true,
    notes: [
      "修正角色錯亂、標題語感、正文翻譯腔與內部轉場語問題。",
      "10 篇皆為一般民眾閱讀角度。",
      "SEO/AIO、來源與檢核資訊只保存在 suggestions.json，不放入投稿正文。"
    ],
    checks: [
      "正文非空白字數均超過 2000 字。",
      "role leak audit 通過。",
      "正文台灣中文語感 gate 通過。",
      "Kevin 修稿樣本與結尾強度規則已納入後續產稿 gate。"
    ],
    relatedLogs: [
      "logs/2026-06-03-public-article-pack-regeneration-log.md",
      "logs/2026-06-03-role-confusion-and-public-default-fix-log.md",
      "logs/2026-06-03-body-natural-taiwanese-fix-log.md",
      "logs/2026-06-03-kevin-editorial-reference-learning-log.md"
    ]
  },
  {
    id: "2026-06-02-weekly-pack",
    date: "2026-06-02",
    title: "2026-06-02 首批 10 篇純文字投稿文章包",
    status: "superseded_do_not_submit",
    statusLabel: "保留為錯誤樣本",
    audience: "混合受眾，不再作為投稿稿",
    directory: "articles/2026-06-02-weekly-pack",
    generatedBy: "週戰情室初版文章包流程",
    currentReviewBoard: false,
    notes: [
      "首批文章已降級為需重生，不可直接投稿。",
      "保留作為角色錯亂、後台語混入正文與預設社工版風險的學習樣本。",
      "後續文章包需通過 role_leak_reviewer 後才可進入 Kevin 核准清單。"
    ],
    checks: [
      "每篇正文扣除欄位後均超過 2000 字；此批保留為錯誤樣本，不作投稿依據。",
      "後續掃描發現角色錯亂，因此整批降級。",
      "已由 2026-06-03 public regenerated pack 取代。"
    ],
    relatedLogs: [
      "logs/2026-06-02-full-learning-and-automation-log.md",
      "logs/2026-06-02-plain-text-non-concept-upgrade-log.md",
      "logs/2026-06-03-role-confusion-and-public-default-fix-log.md"
    ]
  }
];

const generationAttempts = [
  {
    id: "2026-06-05-biweekly-generation-blocked",
    date: "2026-06-05",
    title: "2026-06-05 雙週文章生成未產出",
    status: "blocked_no_pack_generated",
    statusLabel: "未產出",
    articleCount: 0,
    directory: null,
    reason: "review/comment 前置學習與候選題卡 gate 未通過，未生成 10 篇文章包。",
    nextActions: [
      "先恢復 review/comment 正確讀取。",
      "補足一般民眾候選題卡。",
      "再重跑正式 10 題雙週包。"
    ],
    relatedLogs: [
      "reports/2026-06-05-biweekly-article-generation-check.md",
      "logs/2026-06-05-biweekly-article-generation-log.md"
    ]
  }
];

function safeReadJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return fallback;
  }
}

function listTxtFiles(directory) {
  const fullDir = path.join(repoRoot, directory);
  if (!fs.existsSync(fullDir)) return [];
  return fs.readdirSync(fullDir)
    .filter((name) => name.endsWith(".txt"))
    .sort()
    .map((fileName) => `${directory}/${fileName}`.replace(/\\/g, "/"));
}

function bodyText(rawText) {
  const normalized = rawText.replace(/\r\n/g, "\n").trim();
  const bodyMarker = normalized.match(/(^|\n)\s*正文\s*(\n|$)/);
  if (!bodyMarker) return normalized;
  return normalized.slice(bodyMarker.index + bodyMarker[0].length).trim();
}

function fileStats(files) {
  const stats = files.map((relativePath) => {
    const raw = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
    const body = bodyText(raw);
    const nonWhitespaceChars = (body.match(/\S/g) || []).length;
    return {
      path: relativePath,
      chars: nonWhitespaceChars,
      charsIncludingWhitespace: body.length
    };
  });
  const counts = stats.map((item) => item.chars);
  const whitespaceCounts = stats.map((item) => item.charsIncludingWhitespace);
  return {
    files: stats,
    articleCount: stats.length,
    bodyCharsMin: counts.length ? Math.min(...counts) : 0,
    bodyCharsMax: counts.length ? Math.max(...counts) : 0,
    bodyCharsTotal: counts.reduce((sum, value) => sum + value, 0),
    bodyCharsIncludingWhitespaceMin: whitespaceCounts.length ? Math.min(...whitespaceCounts) : 0,
    bodyCharsIncludingWhitespaceMax: whitespaceCounts.length ? Math.max(...whitespaceCounts) : 0
  };
}

function articleTitlesFromSuggestions(packId, suggestions) {
  if (suggestions.articlePack?.id !== packId) return [];
  return (suggestions.articlePack.articles || []).map((article) => article.title);
}

function buildRecords() {
  const suggestions = safeReadJson(suggestionsPath, {});
  return packDefinitions.map((pack) => {
    const bodyFiles = listTxtFiles(pack.directory);
    const stats = fileStats(bodyFiles);
    return {
      ...pack,
      outputType: "plain_text_article_pack",
      format: "txt",
      articleCount: stats.articleCount,
      bodyCountMode: "non_whitespace",
      bodyCharsMin: stats.bodyCharsMin,
      bodyCharsMax: stats.bodyCharsMax,
      bodyCharsIncludingWhitespaceMin: stats.bodyCharsIncludingWhitespaceMin,
      bodyCharsIncludingWhitespaceMax: stats.bodyCharsIncludingWhitespaceMax,
      bodyFiles,
      titles: articleTitlesFromSuggestions(pack.id, suggestions),
      copyText: [
        pack.title,
        "",
        `日期：${pack.date}`,
        `狀態：${pack.statusLabel}`,
        `目錄：${pack.directory}`,
        `篇數：${stats.articleCount}`,
        `正文非空白字數：${stats.bodyCharsMin} 到 ${stats.bodyCharsMax} 字`,
        `含空白正文長度：${stats.bodyCharsIncludingWhitespaceMin} 到 ${stats.bodyCharsIncludingWhitespaceMax} 字`,
        "",
        "紀錄重點",
        ...pack.notes.map((item) => `- ${item}`),
        "",
        "檢查",
        ...pack.checks.map((item) => `- ${item}`)
      ].join("\n")
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

const records = buildRecords();
const output = {
  updatedAt: new Date().toISOString(),
  source: "FamilyFin plain-text article pack generation records",
  privacy: {
    rawInfoCenterArticleBodiesStored: false,
    rawReviewTextStored: false,
    publicSafeDerivedRecordsOnly: true
  },
  latestPackId: records[0]?.id || null,
  packCount: records.length,
  generationAttemptCount: generationAttempts.length,
  records,
  generationAttempts
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`article-pack-history.json updated with ${records.length} packs and ${generationAttempts.length} attempts.`);
