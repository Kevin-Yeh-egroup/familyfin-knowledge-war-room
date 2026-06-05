const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const sources = [
  {
    id: "2026-06-05-biweekly-check",
    sourcePath: "reports/2026-06-05-biweekly-article-generation-check.md",
    type: "雙週產稿檢查",
    title: "上一次雙週產稿為什麼先停下來",
    summary: "2026-06-05 雙週流程未生成 10 篇文章包，主因是 review/comment 前置學習與候選題卡 gate 未通過。",
    highlights: [
      "未更新 war room review board 文章包資料。",
      "目前只有 3 張 reviewLearningReadyCards，可支撐的正式題卡不足。",
      "下一步要先恢復 review/comment 正確讀取，再重跑正式 10 題。"
    ]
  },
  {
    id: "2026-06-05-biweekly-log",
    sourcePath: "logs/2026-06-05-biweekly-article-generation-log.md",
    type: "執行日誌",
    title: "2026-06-05 雙週文章生成日誌",
    summary: "紀錄 automation-15 的 local-only 執行結果：因 fatal gate 未解除，停止產稿並改寫 blocker report。",
    highlights: [
      "執行範圍維持 read-only。",
      "確認同日既有結論：review/comment 證據不足、候選題卡不足。",
      "沒有改寫 InfoCenter、網站後台、GitHub、Vercel 或其他外部系統。"
    ]
  },
  {
    id: "2026-06-03-rejection-learning",
    sourcePath: "reports/2026-06-03-review-rejection-learning-daily.md",
    type: "審核駁回學習",
    title: "審核駁回列點擊學習：只看標題不夠",
    summary: "確認真正有訓練價值的是審核明細中的審核內容，而不是只知道文章被駁回或只看到審核標題。",
    highlights: [
      "抽樣 10 筆駁回事件，10 筆都成功打開評論中的文章。",
      "10 筆讀到審核標題，其中 3 筆讀到完整審核內容。",
      "沒有讀到審核內容時，只能算部分訊號，不能當完整訓練素材。"
    ]
  },
  {
    id: "2026-06-03-kevin-editorial-learning",
    sourcePath: "logs/2026-06-03-kevin-editorial-reference-learning-log.md",
    type: "Kevin 修稿樣本學習",
    title: "從 Kevin 修稿學到的文章節奏",
    summary: "把 Kevin 人工調整後的文章萃取成可重複使用的寫作判斷，包含自然開頭、數字推動判讀、禁用內部轉場語與結尾強度。",
    highlights: [
      "好的開頭先寫出壓力如何發生，不先介紹議題。",
      "數字要推動判讀，讓讀者看見前後差異、日期壓力、可撐天數或少一次周轉。",
      "正文不得出現寫給作者看的轉場語，結尾需獨立檢查 ending strength。"
    ]
  },
  {
    id: "2026-06-03-body-naturalness",
    sourcePath: "logs/2026-06-03-body-natural-taiwanese-fix-log.md",
    type: "正文語感修正",
    title: "把台灣中文語感擴展到正文",
    summary: "把翻譯腔或顧問簡報語列為正文品質 gate，讓文章更像一般民眾會讀下去的台灣中文。",
    highlights: [
      "正文避免收入空窗、財務止血、承接風險等抽象或翻譯腔。",
      "生成器加入 awkwardBodyPatterns，正文出現不自然語句會直接失敗。",
      "10 篇正文通過 role leak audit 與正文台灣中文語感 gate。"
    ]
  },
  {
    id: "2026-06-03-title-naturalness",
    sourcePath: "logs/2026-06-03-title-natural-taiwanese-fix-log.md",
    type: "標題語感修正",
    title: "標題不做系列感，也不要像美語直翻",
    summary: "將標題語感調整成台灣讀者比較自然會點開的句子，避免同一批文章看起來像固定模板系列。",
    highlights: [
      "標題要有不同切角，不把每篇做成同一系列。",
      "避免美語直翻式句子。",
      "標題需要先讓讀者感覺這篇跟自己的生活有關。"
    ]
  },
  {
    id: "2026-06-03-role-confusion",
    sourcePath: "logs/2026-06-03-role-confusion-and-public-default-fix-log.md",
    type: "角色錯亂修正",
    title: "文章正文不能混入審稿建議或作者提醒",
    summary: "回應文章中出現給作者或社工的建議句，將預設產稿切回一般民眾版，並把 role integrity 設為硬性 gate。",
    highlights: [
      "正文只能對目標讀者說話。",
      "不得混入作者建議、審稿語、投稿語、知識庫語或 agent 討論痕跡。",
      "後續預設先生成一般民眾閱讀文章，社工版需 Kevin 另行指定。"
    ]
  },
  {
    id: "2026-06-02-full-learning-summary",
    sourcePath: "reports/2026-06-02-full-learning-summary.md",
    type: "全文學習總結",
    title: "全量讀完後的知識庫學習總結",
    summary: "從 InfoCenter 事件列表最早文章開始分批讀取，完成 2026 則事件掃描與 540 篇可學正文統計。",
    highlights: [
      "成功文章通常具備生活現象、重新框架、資源或介入方向、收束到安全感或選擇空間四層。",
      "退修或駁回常見問題是篇幅不足、太概念化、缺台灣脈絡、案例無查核或標籤定位不清。",
      "後續要把新增建議升級為 10 篇可投稿文章包。"
    ]
  },
  {
    id: "2026-06-02-learning-milestone-001",
    sourcePath: "reports/2026-06-02-learning-milestone-001.md",
    type: "學習里程碑",
    title: "第一段全文學習里程碑",
    summary: "前 5 批共掃描 600 則事件、122 篇可學正文，建立成功稿與駁回稿的早期差異觀察。",
    highlights: [
      "通過稿多數會把生活情境放在前面。",
      "駁回稿常見問題不是沒有資訊，而是太像資料整理。",
      "真實案例有效，但需要去識別化與倫理邊界。"
    ]
  },
  {
    id: "2026-05-29-daily-report",
    sourcePath: "reports/2026-05-29-daily-report.md",
    type: "戰情室優化日報",
    title: "戰情室從盤點升級成工作流",
    summary: "第一輪復盤確認任務本質已從單次文章盤點，升級為內容戰情室 workflow 與審稿台。",
    highlights: [
      "新增建議不能只停在題目靈感，必須先有台灣制度、資料、案例或可行動窗口。",
      "Agent 最有價值的位置是分工審稿，而不是同時寫草稿。",
      "審稿台比靜態報告更接近實際工作流程。"
    ]
  }
];

const weeklyNotes = {
  "2026-06-01": {
    title: "2026-06-01 至 2026-06-07 週報｜全文學習、審核駁回與文章品質 gate",
    status: "需處理",
    summary: "本週完成知識庫全文學習與文章品質規則升級，也確認審核駁回內容必須點開明細才有完整訓練價值。雙週產稿因 review/comment 證據與候選題卡不足先停，避免產出看似完整但訓練基礎不足的文章包。",
    outcomes: [
      "完成 2026 則事件掃描與 540 篇可學正文統計。",
      "建立審核駁回點擊學習路徑，確認 10 筆抽樣中有 3 筆具完整審核內容。",
      "加入角色一致、家庭經濟、非概念文、數值證明、台灣中文語感與結尾強度等文章品質 gate。"
    ],
    blockers: [
      "review/comment 讀取仍未完全恢復，不能把只有審核標題的資料視為完整訓練素材。",
      "正式 10 題雙週文章包的候選題卡不足，因此 2026-06-05 產稿流程先停止。",
      "目前公開戰情室只保存去識別整理，不保存後台原始文章或審核原文。"
    ],
    nextActions: [
      "先補週戰情室輸出檔與 review/comment 正確讀取。",
      "補足一般民眾候選題卡後，再重跑正式 10 題產稿。",
      "每次產稿前檢查是否有內部轉場語、角色錯亂、翻譯腔與弱結尾。"
    ]
  },
  "2026-05-25": {
    title: "2026-05-25 至 2026-05-31 週報｜戰情室工作流成形",
    status: "已完成",
    summary: "本週把知識庫盤點從一次性報告升級為可持續運作的戰情室工作流，建立資料檔驅動、審稿台、Rubric 與後續自動化方向。",
    outcomes: [
      "建立 `suggestions.json` 作為前端資料來源。",
      "將新增建議升級為可審稿、可核准、可退修與可分類存放的工作台。",
      "確認新增建議必須具備台灣制度、資料、案例或可行動窗口，不能只停在題目靈感。"
    ],
    blockers: [
      "核准狀態仍使用瀏覽器 localStorage，尚未成為跨裝置正式紀錄。",
      "正式自動寫入 repo 或外部系統仍需 Kevin 核准。"
    ],
    nextActions: [
      "觀察 2 至 3 次週報後，再決定是否提升為全域 Codex skill。",
      "若多人使用審稿台，下一版可評估接 GitHub PR 或 Google Sheet 保存核准狀態。"
    ]
  }
};

function readUtf8(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function sourceExists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function dateFromPath(relativePath) {
  const match = relativePath.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function weekStartFor(dateString) {
  const date = parseDate(dateString);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - day + 1);
  return formatDate(date);
}

function sanitizeContent(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/C:\\Users\\Kevin\\Documents\\Codex\\familyfin-knowledge-war-room\\/g, "")
    .replace(/C:\\Users\\Kevin\\\.codex\\automations\\automation-\d+\\memory\.md/g, "[內部 automation memory]")
    .replace(/C:\\Users\\Kevin\\\.codex\\[^`\n\r)]+/g, "[內部 Codex 路徑]")
    .replace(/C:\\Users\\Kevin\\[^`\n\r)]+/g, "[內部本機路徑]")
    .replace(/private-event-hash-[a-f0-9]+/g, "private-event-hash-[已去識別]")
    .trim();
}

function buildEntry(source) {
  const raw = readUtf8(source.sourcePath);
  const content = sanitizeContent(raw);
  return {
    ...source,
    date: dateFromPath(source.sourcePath),
    sourcePath: source.sourcePath.replace(/\\/g, "/"),
    content,
    copyText: [source.title, "", content].join("\n")
  };
}

function statusFromEntries(entries) {
  const joined = entries.map((entry) => `${entry.summary}\n${entry.content}`).join("\n");
  if (/blocked|未生成|阻擋|不足|未恢復|尚未|需先|不可直接投稿/.test(joined)) return "需處理";
  return "已完成";
}

function fallbackWeeklyReport(weekStart, weekEnd, entries) {
  const titles = entries.map((entry) => entry.title);
  return {
    title: `${weekStart} 至 ${weekEnd} 週報`,
    status: statusFromEntries(entries),
    summary: `本週共有 ${entries.length} 筆分析紀錄，重點包含：${titles.join("、")}。`,
    outcomes: entries.slice(0, 5).map((entry) => entry.summary),
    blockers: entries
      .filter((entry) => /blocked|未生成|不足|未恢復|不可直接投稿/.test(`${entry.summary}\n${entry.content}`))
      .map((entry) => entry.summary),
    nextActions: ["回到該週紀錄展開查看細節，將阻擋原因轉成下次流程的檢查清單。"]
  };
}

function buildWeeklyCopy(report) {
  const lines = [
    report.title,
    "",
    `狀態：${report.status}`,
    `週期：${report.weekStart} 至 ${report.weekEnd}`,
    "",
    "本週摘要",
    report.summary,
    "",
    "本週完成",
    ...report.outcomes.map((item) => `- ${item}`),
    "",
    "阻擋或風險",
    ...(report.blockers.length ? report.blockers.map((item) => `- ${item}`) : ["- 無明確阻擋。"]),
    "",
    "下一步",
    ...report.nextActions.map((item) => `- ${item}`),
    "",
    "本週紀錄",
    ...report.records.map((record) => `- ${record.date}｜${record.type}｜${record.title}`)
  ];
  return lines.join("\n");
}

function buildWeeklyReports(entries) {
  const groups = entries.reduce((acc, entry) => {
    const weekStart = weekStartFor(entry.date);
    acc[weekStart] = acc[weekStart] || [];
    acc[weekStart].push(entry);
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([weekStart, weekEntries]) => {
      const start = parseDate(weekStart);
      const weekEnd = formatDate(addDays(start, 6));
      const note = weeklyNotes[weekStart] || fallbackWeeklyReport(weekStart, weekEnd, weekEntries);
      const records = weekEntries.map((entry) => ({
        id: entry.id,
        date: entry.date,
        type: entry.type,
        title: entry.title,
        summary: entry.summary,
        sourcePath: entry.sourcePath
      }));
      const report = {
        id: `week-${weekStart}`,
        weekStart,
        weekEnd,
        title: note.title,
        status: note.status,
        summary: note.summary,
        outcomes: note.outcomes || [],
        blockers: note.blockers || [],
        nextActions: note.nextActions || [],
        records
      };
      return {
        ...report,
        copyText: buildWeeklyCopy(report)
      };
    })
    .sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1));
}

const entries = sources
  .map((source, order) => ({ ...source, order }))
  .filter((source) => sourceExists(source.sourcePath))
  .map(buildEntry)
  .sort((a, b) => {
    if (a.date === b.date) return a.order - b.order;
    return a.date < b.date ? 1 : -1;
  })
  .map(({ order, ...entry }) => entry);

const weeklyReports = buildWeeklyReports(entries);

const output = {
  updatedAt: new Date().toISOString(),
  source: "public-safe derived analysis logs and reports",
  privacy: {
    rawInfoCenterArticleBodiesStored: false,
    rawReviewTextStored: false,
    localPrivatePathsNormalized: true,
    publicSafeDerivedSummariesOnly: true
  },
  latestEntryId: entries[0]?.id || null,
  latestWeeklyReportId: weeklyReports[0]?.id || null,
  count: entries.length,
  weeklyReportCount: weeklyReports.length,
  weeklyReports,
  entries
};

fs.writeFileSync(
  path.join(repoRoot, "analysis-history.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8"
);

console.log(`analysis-history.json updated with ${entries.length} entries.`);
