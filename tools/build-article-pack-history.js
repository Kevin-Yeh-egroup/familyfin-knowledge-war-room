const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const suggestionsPath = path.join(repoRoot, "suggestions.json");
const outputPath = path.join(repoRoot, "article-pack-history.json");

const packDefinitions = [
  {
    id: "2026-06-11-grounded-12-article-pack",
    date: "2026-06-11",
    title: "2026-06-11 FamilyFin grounded workflow 重生 12 篇文章包",
    status: "current_review_pack",
    statusLabel: "目前工作台文章包，12 篇重生稿",
    audience: "一般民眾",
    directory: "articles/2026-06-11-grounded-12-article-pack",
    generatedBy: "tools/build-grounded-12-article-pack-2026-06-11.js",
    currentReviewBoard: true,
    currentTrialPack: false,
    notes: [
      "將先前 6/9 正式 10 篇與 6/10 試產 2 篇合併重生。",
      "套用全域 FamilyFin grounded workflow：分段討論、逐段放行、最後綠燈才進工作台。",
      "每篇都補入改善計畫、前後差異、施行效果、剩餘缺口與求助路徑。",
      "每篇開頭使用「姓名（化名）」與生活切片式敘事，提高帶入感，但不宣稱真實案例、不保留個資。",
      "每篇補入承接敘述並合併過短提示段，讓情境、數字與改善計畫形成較連續的閱讀脈絡。",
      "資源段以家庭好處呈現，不寫成政策公告。",
      "正文為純文字，未放入來源清單、審稿語、agent 討論、SEO/AIO 欄位。"
    ],
    checks: [
      "正文非空白字數均超過 2000 字。",
      "preGenerationReview 逐篇通過。",
      "groundedWorkflowReview 逐篇通過。",
      "articlePackReviewGate 綠燈 12/12。",
      "resourceBenefitTranslation、scenarioNarrativeReview、behaviorRealismReview 已納入逐篇 metadata。",
      "pseudonymNarrativeReview 已納入生成規則：化名角色只作情境載體，不宣稱真實案例。",
      "paragraphRhythmGate 已納入生成規則：18-24 段、無過短提示段、平均段落不低於 100 字。",
      "role leak audit 通過。"
    ],
    relatedLogs: [
      "reports/2026-06-11-grounded-12-article-pack.md",
      "logs/2026-06-11-grounded-12-article-pack-log.md"
    ]
  },
  {
    id: "2026-06-11-staged-editorial-workflow-test",
    date: "2026-06-11",
    title: "2026-06-11 分段 agent 編輯工作流試驗｜房租日期現金流二修稿",
    status: "staged_editorial_workflow_test",
    statusLabel: "1 篇分段編輯試驗稿",
    audience: "一般民眾",
    directory: "articles/2026-06-11-staged-editorial-workflow-test",
    generatedBy: "tools/build-staged-editorial-workflow-test-2026-06-11.js",
    currentReviewBoard: false,
    currentTrialPack: true,
    notes: [
      "本批只產 1 篇，用來測試分段 agent 工作流，不取代正式工作台文章包。",
      "從 6/9 房租補貼稿抽出一篇做二修，主軸改成房租日前後五天的現金流盤點。",
      "115年度租金補貼資訊已重新查核，原稿每月1,800元示例不再沿用為政策說明。",
      "2026-06-11 依 Kevin 回饋補入資源利益轉譯：資源段不寫成公告布達，需說明能替家庭少掉哪一筆、爭取哪幾天、避免哪種債。",
      "2026-06-11 依 Kevin 回饋補入情境敘事規則：故事性用來增加代入感，不偽裝真實案例，也不寫成假設題。",
      "2026-06-11 依 Kevin 回饋補入台灣真實回饋語感規則：官方資料只作事實查核，語氣優先參考讀者留言、公共討論與文章回饋。",
      "2026-06-11 依 Kevin 回饋補入行動常理檢查：文章建議不能把一般人因合約、面子或信用壓力不太會做的行動寫得太容易。",
      "2026-06-11 依 Kevin 回饋升級為專案內 FamilyFin grounded workflow skill：不只用於文章，也用於檢查、工具生成、工作台、週報與 agent 工作流。",
      "正文不放來源清單、審稿語、agent 語或 SEO/AIO 欄位。"
    ],
    checks: [
      "正文非空白字數超過 2000 字。",
      "role leak audit 通過。",
      "preGenerationReview 通過。",
      "approvedAuthorStructureUse 通過。",
      "articlePackReviewGate 綠燈 1/1。",
      "resourceBenefitTranslation 通過。",
      "scenarioNarrativeReview 通過。",
      "taiwanNaturalLanguageFeedbackReview 已建立 seed。",
      "behaviorRealismReview 通過。",
      "projectScopedGroundedWorkflowSkill 已建立，尚未升級全域。",
      "stagedEditorialWorkflowReview 通過試驗。"
    ],
    relatedLogs: [
      "reports/2026-06-11-staged-editorial-workflow-test.md",
      "logs/2026-06-11-staged-editorial-workflow-test-log.md"
    ]
  },
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
    currentTrialPack: false,
    notes: [
      "本批先產 2 篇，不取代正式主工作台文章包。",
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
      "前端以獨立下拉選單呈現，不混入正式主包核准台。"
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
    currentReviewBoard: false,
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

function nonWhitespaceCount(text) {
  return (text.match(/\S/g) || []).length;
}

function splitParagraphs(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function paragraphStats(text) {
  const paragraphs = splitParagraphs(text);
  const lengths = paragraphs.map((paragraph) => nonWhitespaceCount(paragraph));
  return {
    paragraphs: paragraphs.length,
    shortestParagraph: lengths.length ? Math.min(...lengths) : 0,
    longestParagraph: lengths.length ? Math.max(...lengths) : 0,
    averageParagraph: lengths.length
      ? Math.round(lengths.reduce((sum, value) => sum + value, 0) / lengths.length)
      : 0,
    veryShortParagraphs: lengths.filter((value) => value < 45).length
  };
}

function stylePatternStats(text) {
  const contrastPattern = /不是[^。！？\n]{0,80}(而是|而在|而要|只是)/g;
  const stablePhrasePattern = /怎麼做比較穩|比較穩的做法|比較穩的順序|比較穩的是|比較穩，/g;
  const fakeQuestionPattern =
    /(?:但|可是|那|回到|這時).{0,30}(怎麼辦|能不能|要不要)[？?，,].{0,60}(還是要先|還是|先|所以|答案是|關鍵是|比較穩)|但這個月.{0,10}怎麼辦[，,].{0,20}還是要先/g;
  return {
    notButCount: (text.match(contrastPattern) || []).length,
    stablePhraseCount: (text.match(stablePhrasePattern) || []).length,
    selfQuestionTransitionCount: (text.match(fakeQuestionPattern) || []).length,
    trueNeedCount: (text.match(/真正/g) || []).length
  };
}

function fileStats(files) {
  const stats = files.map((relativePath) => {
    const raw = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
    const body = bodyText(raw);
    const nonWhitespaceChars = nonWhitespaceCount(body);
    return {
      path: relativePath,
      chars: nonWhitespaceChars,
      charsIncludingWhitespace: body.length,
      paragraphRhythm: paragraphStats(body),
      styleVariation: stylePatternStats(body)
    };
  });
  const counts = stats.map((item) => item.chars);
  const whitespaceCounts = stats.map((item) => item.charsIncludingWhitespace);
  const rhythmStats = stats.map((item) => item.paragraphRhythm);
  const styleStats = stats.map((item) => item.styleVariation);
  return {
    files: stats,
    articleCount: stats.length,
    bodyCharsMin: counts.length ? Math.min(...counts) : 0,
    bodyCharsMax: counts.length ? Math.max(...counts) : 0,
    bodyCharsTotal: counts.reduce((sum, value) => sum + value, 0),
    bodyCharsIncludingWhitespaceMin: whitespaceCounts.length ? Math.min(...whitespaceCounts) : 0,
    bodyCharsIncludingWhitespaceMax: whitespaceCounts.length ? Math.max(...whitespaceCounts) : 0,
    paragraphRhythm: rhythmStats.length
      ? {
          paragraphsMin: Math.min(...rhythmStats.map((item) => item.paragraphs)),
          paragraphsMax: Math.max(...rhythmStats.map((item) => item.paragraphs)),
          averageParagraphMin: Math.min(...rhythmStats.map((item) => item.averageParagraph)),
          averageParagraphMax: Math.max(...rhythmStats.map((item) => item.averageParagraph)),
          shortestParagraphMin: Math.min(...rhythmStats.map((item) => item.shortestParagraph)),
          longestParagraphMax: Math.max(...rhythmStats.map((item) => item.longestParagraph)),
          veryShortParagraphsTotal: rhythmStats.reduce((sum, item) => sum + item.veryShortParagraphs, 0)
        }
      : null,
    styleVariation: styleStats.length
      ? {
          notButMax: Math.max(...styleStats.map((item) => item.notButCount)),
          notButTotal: styleStats.reduce((sum, item) => sum + item.notButCount, 0),
          articlesWithNotBut: styleStats.filter((item) => item.notButCount > 0).length,
          stablePhraseTotal: styleStats.reduce((sum, item) => sum + item.stablePhraseCount, 0),
          selfQuestionMax: Math.max(...styleStats.map((item) => item.selfQuestionTransitionCount)),
          trueNeedMax: Math.max(...styleStats.map((item) => item.trueNeedCount))
        }
      : null
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
      paragraphRhythm: stats.paragraphRhythm,
      styleVariation: stats.styleVariation,
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
        stats.paragraphRhythm
          ? `段落節奏：${stats.paragraphRhythm.paragraphsMin} 到 ${stats.paragraphRhythm.paragraphsMax} 段，平均 ${stats.paragraphRhythm.averageParagraphMin} 到 ${stats.paragraphRhythm.averageParagraphMax} 字，過短段落 ${stats.paragraphRhythm.veryShortParagraphsTotal}`
          : null,
        stats.styleVariation
          ? `語氣變奏：不是...而是最多 ${stats.styleVariation.notButMax} 次，整包 ${stats.styleVariation.notButTotal} 次／${stats.styleVariation.articlesWithNotBut} 篇；比較穩 ${stats.styleVariation.stablePhraseTotal} 次，自問自答最多 ${stats.styleVariation.selfQuestionMax} 次，真正最多 ${stats.styleVariation.trueNeedMax} 次`
          : null,
        "",
        "紀錄重點",
        ...pack.notes.map((item) => `- ${item}`),
        "",
        "檢查",
        ...pack.checks.map((item) => `- ${item}`)
      ].join("\n")
    };
  }).sort((a, b) => {
    const priority = (record) => {
      if (record.currentReviewBoard) return 0;
      if (record.currentTrialPack) return 1;
      return 2;
    };
    const priorityDiff = priority(a) - priority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return b.date.localeCompare(a.date);
  });
}

const records = buildRecords();
const latestRecord = records.find((record) => record.currentReviewBoard) || records[0] || null;
const output = {
  updatedAt: new Date().toISOString(),
  source: "FamilyFin plain-text article pack generation records",
  privacy: {
    rawInfoCenterArticleBodiesStored: false,
    rawReviewTextStored: false,
    publicSafeDerivedRecordsOnly: true
  },
  latestPackId: latestRecord?.id || null,
  packCount: records.length,
  generationAttemptCount: generationAttempts.length,
  records,
  generationAttempts
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`article-pack-history.json updated with ${records.length} packs and ${generationAttempts.length} attempts.`);
