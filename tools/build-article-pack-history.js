const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const suggestionsPath = path.join(repoRoot, "suggestions.json");
const outputPath = path.join(repoRoot, "article-pack-history.json");

const packDefinitions = [
  {
    id: "2026-06-10-two-article-trial-pack",
    date: "2026-06-10",
    title: "2026-06-10 兩篇試產稿｜退件學習後的題目驗證與去 AI 感測試",
    status: "trial_review_pack",
    statusLabel: "2 篇試產稿",
    audience: "一般民眾",
    directory: "articles/2026-06-10-two-article-trial-pack",
    generatedBy: "tools/build-trial-article-pack-2026-06-10.js",
    currentReviewBoard: false,
    currentTrialPack: true,
    notes: [
      "本批先產 2 篇，不取代目前 10 篇主工作台文章包。",
      "動用 Agent OS 討論後，將「假設性議題，缺乏驗證」拆成 verified topic、source-to-life-number、reader appeal 與 financial decision gate。",
      "兩篇題目均以台灣勞保局官方制度為證據底盤，來源留在 metadata，正文不放來源清單或審稿語。",
      "正文以一般民眾閱讀角度、家庭現金流、日期壓力、前後差異與可帶走的財務判斷能力為主。",
      "2026-06-11 已補入三張通過稿結構卡的 `approvedAuthorStructureUse` 採用紀錄。",
      "後續 8 篇需待 Kevin 看完語感與效果後再補。"
    ],
    checks: [
      "正文非空白字數均超過 2000 字。",
      "role leak audit 通過。",
      "preGenerationReview 逐篇通過。",
      "approvedAuthorStructureUse 逐篇通過。",
      "articlePackReviewGate 綠燈 2/2。",
      "前端以獨立下拉選單呈現，不混入 10 篇主包核准台。"
    ],
    relatedLogs: [
      "reports/2026-06-10-two-article-trial-pack-agent-discussion.md",
      "reports/2026-06-10-two-article-trial-pack.md",
      "logs/2026-06-10-two-article-trial-pack-log.md",
      "reports/2026-06-10-improvement-plan-gap-and-author-learning.md",
      "docs/reviewer-rule-delta-2026-06-10.md",
      "reports/2026-06-11-approved-author-learning-generation-optimization.md",
      "logs/2026-06-11-approved-author-learning-generation-optimization-log.md"
    ]
  },
  {
    id: "2026-06-09-rejection-learned-pack",
    date: "2026-06-09",
    title: "2026-06-09 駁回學習與前置驗證後重生文章包",
    status: "current_review_pack",
    statusLabel: "目前工作台文章包",
    audience: "一般民眾",
    directory: "articles/2026-06-09-rejection-learned-pack",
    generatedBy: "tools/build-public-article-pack-2026-06-09.js",
    currentReviewBoard: true,
    notes: [
      "納入 2026-06-09 最新 InfoCenter 駁回學習：350 筆審核駁回、51 筆完整審核內容、50 張可交叉學習卡。",
      "2026-06-09 重新更新 10 篇文章生成時，逐篇套用 topicEvidenceCard、readerFitCard、financialDecisionCard、financialLiteracyTransfer。",
      "2026-06-11 補入三張通過稿結構卡的 `approvedAuthorStructureUse` 採用紀錄。",
      "本批次仍以一般民眾閱讀角度生成，社工版需 Kevin 明確指定。",
      "正文維持純文字，不顯示 SEO/AIO、來源清單、審稿建議或 agent 討論。",
      "6/9 gate 加嚴重點：同題換標題、數字拼湊、處遇建議未盤點、概念文、內部審稿語、假設性議題驗證、讀者吸引力與財務知能轉移。"
    ],
    checks: [
      "正文非空白字數均超過 2000 字。",
      "role leak audit 通過。",
      "preGenerationReview 逐篇通過。",
      "approvedAuthorStructureUse 逐篇通過。",
      "articlePackReviewGate 綠燈 10/10。",
      "validator 使用 data/submission-quality-gates-2026-06-09.json 檢查。",
      "reviewRejectionLearningReadyCards 已更新為 50，解除舊 3/8 blocker。"
    ],
    relatedLogs: [
      "reports/2026-06-09-review-rejection-learning.md",
      "reports/2026-06-09-agent-discussion-topic-verification-readability-financial-decision.md",
      "logs/2026-06-09-review-rejection-learning-log.md",
      "logs/2026-06-09-topic-verification-reader-decision-agent-log.md",
      "docs/reviewer-rule-delta-2026-06-09.md",
      "reports/2026-06-10-improvement-plan-gap-and-author-learning.md",
      "docs/reviewer-rule-delta-2026-06-10.md",
      "reports/2026-06-11-approved-author-learning-generation-optimization.md",
      "logs/2026-06-11-approved-author-learning-generation-optimization-log.md"
    ]
  },
  {
    id: "2026-06-03-public-regenerated-pack",
    date: "2026-06-03",
    title: "2026-06-03 家庭生活壓力與財務缺口候選稿",
    status: "superseded_by_2026_06_09",
    statusLabel: "已由 6/9 駁回學習版取代",
    audience: "一般民眾",
    directory: "articles/2026-06-03-public-regenerated-pack",
    generatedBy: "tools/build-public-article-pack-2026-06-03.js",
    currentReviewBoard: false,
    notes: [
      "修正角色錯亂、標題語感、正文翻譯腔與內部轉場語問題。",
      "10 篇皆為一般民眾閱讀角度。",
      "SEO/AIO、來源與檢核資訊只保存在 suggestions.json，不放入投稿正文。",
      "每篇純文字正文進入工作台前，必須先有 articlePackReviewGate 綠燈紀錄。"
    ],
    checks: [
      "正文非空白字數均超過 2000 字。",
      "role leak audit 通過。",
      "正文台灣中文語感 gate 通過。",
      "Kevin 修稿樣本與結尾強度規則已納入後續產稿 gate。",
      "articlePackReviewGate 綠燈 10/10；非綠燈稿件不得進入 Kevin 核准工作台。"
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
      "已由 2026-06-03 public regenerated pack 取代。",
      "此批沒有 articlePackReviewGate，不可視為可投稿綠燈包。"
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
  if (suggestions.articlePack?.id === packId) {
    return (suggestions.articlePack.articles || []).map((article) => article.title);
  }
  const trialPack = (suggestions.trialArticlePacks || []).find((pack) => pack.id === packId);
  if (trialPack) return (trialPack.articles || []).map((article) => article.title);
  return [];
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
