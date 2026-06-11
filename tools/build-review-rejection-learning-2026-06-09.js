#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoRoot = path.resolve(__dirname, "..");
const rawPath = path.join(repoRoot, "work-private", "all-review-rejections-raw-2026-06-09.jsonl");
const baselinePublicPath = path.join(repoRoot, "data", "review-rejection-derived-full-2026-06-03.json");
const previousGatesPath = path.join(repoRoot, "data", "submission-quality-gates-2026-06-03.json");
const qualityGatesOutPath = path.join(repoRoot, "data", "submission-quality-gates-2026-06-09.json");
const learningOutPath = path.join(repoRoot, "data", "review-rejection-learning-2026-06-09.json");
const ruleDeltaOutPath = path.join(repoRoot, "docs", "reviewer-rule-delta-2026-06-09.md");
const rulebookOutPath = path.join(repoRoot, "docs", "submission-quality-gate-rulebook.md");
const agentSpecOutPath = path.join(repoRoot, "docs", "submission-quality-gate-agent.md");
const reportOutPath = path.join(repoRoot, "reports", "2026-06-09-review-rejection-learning.md");
const logOutPath = path.join(repoRoot, "logs", "2026-06-09-review-rejection-learning-log.md");

function readJsonl(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

function reviewObject(row) {
  return row.reviewDetail || row.review || {};
}

function reviewText(row) {
  const review = reviewObject(row);
  return `${review.title || ""}\n${review.content || ""}`.replace(/\s+/g, " ").trim();
}

function bodyCount(row) {
  return (row.articleBodies || []).length || Number(row.articleBodyCount || 0);
}

function bodyChars(row) {
  if (row.articleBodies) {
    return row.articleBodies.reduce((sum, item) => sum + String(item.text || "").length, 0);
  }
  return Number(row.articleBodyCharCount || 0);
}

function countPattern(textRows, pattern) {
  return textRows.filter((text) => pattern.test(text)).length;
}

function hashObject(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function assertNoPrivateLeak(publicText, rawRows) {
  for (const row of rawRows) {
    if (row.eventId && publicText.includes(row.eventId)) {
      throw new Error(`Private event id leaked: ${row.eventId}`);
    }
    const raw = reviewText(row);
    if (raw.length >= 16 && publicText.includes(raw)) {
      throw new Error("Long raw review comment leaked into public output.");
    }
  }
}

const rawRows = readJsonl(rawPath);
const baseline = readJson(baselinePublicPath, {});
const previousGates = readJson(previousGatesPath, {});
const rejectedRows = rawRows.filter((row) => row.status === "REJECT");
const reviewTitleRows = rejectedRows.filter((row) => reviewObject(row).title);
const reviewContentRows = rejectedRows.filter((row) => reviewObject(row).content);
const titleAndContentRows = rejectedRows.filter((row) => reviewObject(row).title && reviewObject(row).content);
const textRows = rejectedRows.map(reviewText).filter(Boolean);
const readyRows = titleAndContentRows.filter((row) => bodyCount(row) > 0);
const createdSince0603Rows = rejectedRows.filter((row) => Date.parse(row.createdAt || "") >= Date.parse("2026-06-03T00:00:00.000Z"));

const signalDefinitions = {
  conceptual_or_general: /概念|概論|宣導|一般性|小品文|籠統|空泛|缺乏具體|故事性描述|情境的描述/,
  platform_scope_mismatch: /平台|宗旨|不適合|不符|訴求|經濟弱勢|家庭經濟|不是我們要|暫不予刊登/,
  needs_specific_numbers_actions: /具體|數字|金額|收入|支出|費用|薪資|月薪|比例|行為調整|財務數字|前後|有效性/,
  oversimplified_complex_context: /簡化|複雜|無法簡單|不能只|過於簡略|似是而非|多樣|差距|原因也很多/,
  duplicate_or_existing_content: /重複|已有|專章|平台上已有|請參考|雷同|改了標題|類似文章/,
  story_or_case_angle_issue: /故事|情境|角色|人物|文字遊戲|情感衝突|家庭人數|同居|接送/,
  accuracy_or_grounding_risk: /錯|不鼓勵|真正的價格|資料|來源|研究|法規|法律|合理性|商榷|拼湊|不符合現實/,
  structure_or_readability_issue: /結構|雜亂|整合|一篇|拆成|標題|主題|內容請調整/,
  too_narrow_or_off_topic: /防詐騙|醫院社工|姿勢|運動|ETF|槓桿|利率|二房東|AA制/,
  missing_depth_or_content: /內容|缺乏|不足|方向|問題|需要|待補|未交代|沒有交代/,
  family_context_required: /家庭|收入|支出|工作|照顧|孩子|長輩|社工|實務|處遇|盤點/,
  policy_locality_required: /政府|補助|中央|地方|縣市|法規|法律|社福|社會局|主管機關/,
  realistic_number_required: /高鐵|客運|最低工資|日薪|看護|房貸|店租|淨收入|成本|元|萬/,
};

const signalCounts = Object.fromEntries(
  Object.entries(signalDefinitions).map(([id, pattern]) => [id, countPattern(textRows, pattern)]),
);

const gateEvidenceMap = {
  "gate-01-platform-fit": ["platform_scope_mismatch", "too_narrow_or_off_topic"],
  "gate-02-non-concept": ["conceptual_or_general", "missing_depth_or_content"],
  "gate-03-numeric-proof": ["needs_specific_numbers_actions", "realistic_number_required"],
  "gate-04-complexity": ["oversimplified_complex_context", "family_context_required"],
  "gate-05-originality-gap": ["duplicate_or_existing_content"],
  "gate-06-story-precision": ["story_or_case_angle_issue", "realistic_number_required"],
  "gate-07-fact-and-policy": ["accuracy_or_grounding_risk", "policy_locality_required"],
  "gate-08-structure": ["structure_or_readability_issue", "missing_depth_or_content"],
  "gate-09-audience-angle": ["family_context_required", "story_or_case_angle_issue"],
  "gate-10-actionability": ["needs_specific_numbers_actions", "missing_depth_or_content"],
  "gate-11-role-integrity": [],
  "gate-12-body-naturalness": ["conceptual_or_general", "structure_or_readability_issue"],
};

const reinforcedRules = [
  {
    id: "rule-20260609-01",
    name: "同題換標題仍算高風險",
    appliesTo: ["gate-05-originality-gap", "gate-08-structure"],
    generationMove:
      "候選題若與既有文章或本週駁回稿相近，先寫出新家庭情境、新數字與新決策順序；只改標題不准進正文。",
  },
  {
    id: "rule-20260609-02",
    name: "數字不能拼湊",
    appliesTo: ["gate-03-numeric-proof", "gate-07-fact-and-policy"],
    generationMove:
      "所有交通、薪資、補助、看護、租金與成本數字要有官方來源、可查資料或清楚假設；不能為了讓算式成立而硬放金額。",
  },
  {
    id: "rule-20260609-03",
    name: "處遇或下一步要先盤點再建議",
    appliesTo: ["gate-04-complexity", "gate-10-actionability"],
    generationMove:
      "涉及家庭重大決策時，先寫收入、支出、債務、照顧、資源與限制條件；沒有盤點前不能直接給單一路線。",
  },
  {
    id: "rule-20260609-04",
    name: "概念文要退回生活機制",
    appliesTo: ["gate-02-non-concept", "gate-12-body-naturalness"],
    generationMove:
      "每段都要回到一個生活機制，例如日期、缺口、月付、收入少掉、支出被鎖住、補助時間差或家人分工。",
  },
  {
    id: "rule-20260609-05",
    name: "假設情境用自然語句，不用審稿語",
    appliesTo: ["gate-11-role-integrity", "gate-12-body-naturalness"],
    generationMove:
      "正文可寫「先看一個假設情境」「把調整前後攤開看」，不可寫「示意前後差異」「本文建議」「對一般民眾版而言」。",
  },
  {
    id: "rule-20260609-06",
    name: "假設性議題先驗證",
    appliesTo: ["gate-01-platform-fit", "gate-07-fact-and-policy"],
    generationMove:
      "題目需有台灣資料、制度、新聞、知識庫缺口或駁回訊號支撐；若證據不足，只能改為家庭盤點型文章，不得寫成普遍現象或趨勢。",
  },
  {
    id: "rule-20260609-07",
    name: "易讀吸引力要可檢查",
    appliesTo: ["gate-08-structure", "gate-09-audience-angle", "gate-12-body-naturalness"],
    generationMove:
      "前 150 字需有生活矛盾或金錢卡點，段落標題需協助掃讀，長段資料需拆成讀者能理解的判斷。",
  },
  {
    id: "rule-20260609-08",
    name: "財務知能要能帶走",
    appliesTo: ["gate-03-numeric-proof", "gate-10-actionability", "gate-12-body-naturalness"],
    generationMove:
      "每篇至少讓讀者練習一個財務判斷能力，例如看現金流、分類支出、比較成本、查證資訊、辨識風險或保留緩衝。",
  },
];

const preGenerationProtocols = {
  discussionUpdatedAt: "2026-06-09T20:30:00+08:00",
  sourceReport: "reports/2026-06-09-agent-discussion-topic-verification-readability-financial-decision.md",
  purpose:
    "Block unverified hypothetical topics before drafting, and require reader appeal plus financial decision support for public-facing articles.",
  appliesBeforeGateIds: [
    "gate-01-platform-fit",
    "gate-02-non-concept",
    "gate-07-fact-and-policy",
    "gate-09-audience-angle",
    "gate-10-actionability",
    "gate-12-body-naturalness",
  ],
  protocols: [
    {
      id: "protocol-01-topic-evidence",
      name: "議題驗證卡",
      severity: "fatal_prewrite",
      reviewerAgent: "topic_evidence_reviewer",
      outputField: "topicEvidenceCard",
    },
    {
      id: "protocol-02-reader-fit",
      name: "易讀與吸引力卡",
      severity: "required_prewrite",
      reviewerAgent: "reader_motivation_reviewer",
      outputField: "readerFitCard",
    },
    {
      id: "protocol-03-financial-decision",
      name: "財務評估與決策幫助卡",
      severity: "required_prewrite",
      reviewerAgent: "financial_decision_reviewer",
      outputField: "financialDecisionCard",
    },
    {
      id: "protocol-04-financial-literacy-transfer",
      name: "財務知能轉移卡",
      severity: "required_prewrite",
      reviewerAgent: "financial_literacy_transfer_reviewer",
      outputField: "financialLiteracyTransfer",
    },
  ],
};

const latestGates = (previousGates.gates || []).map((gate) => {
  const evidenceSignals = gateEvidenceMap[gate.id] || [];
  const evidence = {
    matchedReviewTextRows: evidenceSignals.reduce((sum, signal) => sum + (signalCounts[signal] || 0), 0),
    evidenceSignals: evidenceSignals.map((signal) => ({
      signal,
      count: signalCounts[signal] || 0,
      shareOfReviewTextRows: pct(signalCounts[signal] || 0, textRows.length),
    })),
  };
  const reinforced = reinforcedRules.filter((rule) => rule.appliesTo.includes(gate.id));
  return {
    ...gate,
    evidence,
    reinforcedRules: reinforced.map((rule) => rule.id),
  };
});

const sourceStats = {
  eventTotal: rawRows.length,
  rejectedEvents: rejectedRows.length,
  reviewTitlesFound: reviewTitleRows.length,
  reviewContentsFound: reviewContentRows.length,
  titleAndContentRows: titleAndContentRows.length,
  reviewLearningReadyCards: readyRows.length,
  createdSince20260603Rejects: createdSince0603Rows.length,
  baselineRejectCount: baseline.summary?.rejectCount || baseline.verification?.rejectedRowsFromUi || 0,
  baselineReviewContentsFound:
    baseline.summary?.reviewContentsFound || baseline.reviewFieldCompleteness?.titleAndContent || 0,
  rejectDeltaFromBaseline:
    rejectedRows.length - (baseline.summary?.rejectCount || baseline.verification?.rejectedRowsFromUi || 0),
  reviewContentDeltaFromBaseline:
    reviewContentRows.length -
    (baseline.summary?.reviewContentsFound || baseline.reviewFieldCompleteness?.titleAndContent || 0),
};

const learning = {
  updatedAt: new Date().toISOString(),
  source: "Derived from 2026-06-09 InfoCenter rejection full read-only collection.",
  privacy: {
    rawReviewTextStoredInThisFile: false,
    rawArticleTextStoredInThisFile: false,
    rawEventIdsStoredInThisFile: false,
    privateSourcePath: "work-private/all-review-rejections-raw-2026-06-09.jsonl",
    publicSafeDerivedOnly: true,
  },
  sourceStats,
  signalCounts,
  reinforcedRules,
  generationReadiness: {
    status: readyRows.length >= 8 ? "ready_for_formal_article_pack" : "blocked",
    threshold: 8,
    currentReadyCards: readyRows.length,
    note: "Ready means review title + review content + article body signal were all available for cross-learning.",
  },
  articleGenerationImplications: [
    "正式文章包可以重新生成，但每篇必須先通過 6/9 gate round，不可只沿用 6/3 的 3 張 ready card 結論。",
    "大量退件集中在概念化、數字合理性、重複內容與平台主軸偏離，因此題目規劃要先查既有文章與本週退件主題。",
    "文章可以有假設情境，但情境中的收入、支出、交通、照顧、補助與債務金額要能被台灣生活現實支撐。",
    "結尾要回扣家庭經濟選擇，不可收在寫作建議、抽象鼓勵或內部審稿語。",
  ],
  integrityHash: hashObject({ sourceStats, signalCounts, reinforcedRules }),
};

const qualityGates = {
  ...previousGates,
  updatedAt: learning.updatedAt,
  source: "Derived from InfoCenter rejected review records collected on 2026-06-09.",
  privacy: learning.privacy,
  sourceStats: {
    rejectedEventsOpened: rejectedRows.length,
    reviewTextRows: textRows.length,
    titleAndContentRows: titleAndContentRows.length,
    titleOnlyRows: reviewTitleRows.length - titleAndContentRows.length,
    emptyReviewModalRows: rejectedRows.length - textRows.length,
    reviewLearningReadyCards: readyRows.length,
  },
  signalCounts,
  gates: latestGates,
  preGenerationProtocols,
  latestReinforcedRules: reinforcedRules,
  integrityHash: hashObject({
    sourceStats,
    signalCounts,
    gates: latestGates.map(({ id, name, severity, evidence }) => ({ id, name, severity, evidence })),
    reinforcedRules,
    preGenerationProtocols,
  }),
};

function renderRulebook(data) {
  const gateLines = data.gates
    .map((gate) => {
      const evidence = (gate.evidence?.evidenceSignals || [])
        .map((signal) => `${signal.signal}: ${signal.count}`)
        .join(", ") || "無新增文字訊號，沿用硬性品質規則";
      const reinforced = (gate.reinforcedRules || [])
        .map((id) => reinforcedRules.find((rule) => rule.id === id)?.generationMove)
        .filter(Boolean);
      return `## ${gate.id} ${gate.name}

嚴重度：${gate.severity}

來源訊號：${evidence}

退件條件：
${gate.rejectWhen.map((item) => `- ${item}`).join("\n")}

必備條件：
${gate.mustHave.map((item) => `- ${item}`).join("\n")}

6/9 生成前加嚴：
${reinforced.length ? reinforced.map((item) => `- ${item}`).join("\n") : "- 沿用既有 gate。"}

修正方向：
- ${gate.revisionMove}

負責 reviewer：${gate.reviewerAgents.join(", ")}
`;
    })
    .join("\n");

  return `# 投稿前品質檢查規則庫

更新日期：2026-06-09

這份規則庫由 InfoCenter 審核駁回事件的私有資料衍生而來。公開版只保留規則、統計與檢查方法，不保存事件 ID、審稿原文或文章全文。

## 資料基礎

- 已讀取事件：${sourceStats.eventTotal}
- 審核駁回：${sourceStats.rejectedEvents}
- 有審核標題：${sourceStats.reviewTitlesFound}
- 有審核標題與內容：${sourceStats.titleAndContentRows}
- 可進行 review/comment 交叉學習：${sourceStats.reviewLearningReadyCards}
- 相較 2026-06-03 駁回數增加：${sourceStats.rejectDeltaFromBaseline}

## 使用方式

文章送出前，先由 reviewer agent 依序檢查 fatal gate，再檢查 required gate。只要 fatal gate 未通過，就不能標記為可投稿。

分數判定：
- ${data.scoreModel.approveThreshold} 分以上：可進入 Kevin 核准
- ${data.scoreModel.reviseThreshold} 到 ${data.scoreModel.approveThreshold - 1} 分：修正後再審
- ${data.scoreModel.reviseThreshold - 1} 分以下：退回重寫

## 生成前 protocol：先驗證題目，再寫正文

2026-06-09 代理討論後新增。這不是第 13 個 gate，而是進入 12 gate 前的前置程序。

若前置 protocol 不通過，不應開始寫正文；應先換題、縮小角度、補資料，或把文章從「社會現象」降階成「家庭盤點」。

${preGenerationProtocols.protocols
  .map(
    (protocol) => `### ${protocol.id} ${protocol.name}

嚴重度：${protocol.severity}

負責 reviewer：${protocol.reviewerAgent}

輸出欄位：${protocol.outputField}`
  )
  .join("\n\n")}

${gateLines}
## 6/9 新增生成原則

${reinforcedRules.map((rule) => `- ${rule.name}：${rule.generationMove}`).join("\n")}

## 治理邊界

- 這是 project-local candidate，不是全域 Agent OS 規則。
- 不自動投稿、不自動核准、不取代 Kevin 或總編輯審核。
- 政策、補助、法規與地方方案仍必須查最新台灣官方來源。
`;
}

function renderAgentSpec(data) {
  return `# 投稿前品質檢查 Agent 規格

Agent name：submission_quality_gatekeeper

Domain：好理家在知識庫文章投稿前品質控管

Purpose：在文章進入 Kevin 核准或 InfoCenter 投稿前，檢查是否符合好理家在的內容定位、非概念文要求、台灣脈絡、數值證明與助人工作判讀需求。

Source freshness：規則來源已更新至 2026-06-09，已讀取 ${sourceStats.eventTotal} 筆事件，其中 ${sourceStats.rejectedEvents} 筆為審核駁回，${sourceStats.reviewLearningReadyCards} 筆具備可交叉學習的審核內容與文章訊號。

Allowed actions：
- 評分
- 標出失敗 gate
- 提出修正方向
- 要求補台灣最新資料、前後數值、案例真實性說明或結構重排

Forbidden actions：
- 自動投稿
- 自動核准
- 引用或輸出私有審稿原文
- 虛構案例、數據、補助資格或地方政府規範
- 把假設性議題寫成已驗證的普遍現象
- 把一般理財建議包裝成個案處遇建議
- 把 reviewer 或 agent 討論寫入正文

Output contract：
1. decision: approve / revise / reject
2. score: 0-100
3. failedFatalGates
4. failedRequiredGates
5. topRevisionFocus: 最多 3 項
6. evidenceToAdd: 需要補的數字、台灣來源、情境細節或結構段落
7. readyForKevinApproval: true / false
8. topicEvidenceCard: 題目是否有台灣資料、制度、新聞、知識庫缺口或駁回訊號支撐
9. readerFitCard: 前 150 字、段落節奏、標題掃讀與一般民眾閱讀意願檢查
10. financialDecisionCard: 文章是否幫讀者盤點收支、缺口、風險、選項或可撐時間
11. financialLiteracyTransfer: 讀者能帶走哪一個可重複使用的財務知能

Required discussion：
${preGenerationProtocols.protocols.map((protocol) => `- ${protocol.reviewerAgent}: ${protocol.name}`).join("\n")}
${data.discussionProtocol.map((step) => `- ${step.agent}: ${step.job}`).join("\n")}

6/9 reinforced rules：
${reinforcedRules.map((rule) => `- ${rule.name}: ${rule.generationMove}`).join("\n")}

Verification：
- 讀取 data/submission-quality-gates-2026-06-09.json
- 確認 preGenerationProtocols 已通過
- 確認所有 fatal gate 都通過
- 確認正文超過 2000 字時，仍不是概念堆疊
- 確認政策與補助資訊為最新台灣資料
- 確認輸出為純文字可投稿正文時，不含 SEO/AIO、內部建議或 agent 討論
`;
}

function renderDelta() {
  return `# 2026-06-09 審核駁回學習規則增量

## 本次讀取結果

- 事件總數：${sourceStats.eventTotal}
- 審核駁回：${sourceStats.rejectedEvents}
- 相較 2026-06-03 增加駁回：${sourceStats.rejectDeltaFromBaseline}
- 有審核標題：${sourceStats.reviewTitlesFound}
- 有審核標題與內容：${sourceStats.titleAndContentRows}
- 可進行交叉學習：${sourceStats.reviewLearningReadyCards}

## Agent 討論後的收斂

1. 重複與雷同不只看標題。若只是換標題、加副標或改開頭，仍應退回題目規劃。
2. 數字不是裝飾。金額、交通、薪資、補助、照顧成本必須能支撐家庭經濟判斷。
3. 處遇建議不能似是而非。涉及複雜家庭決策時，先盤點限制，再談可能選項。
4. 文章要從生活機制出發。不要把概念講長，而要讓讀者看見日期、缺口、支出與選擇如何被卡住。
5. 正文禁止內部語。可以自然交代假設情境，不可出現「示意前後差異」或 reviewer 語言。

## 生成端新增硬規則

${reinforcedRules.map((rule) => `- ${rule.name}：${rule.generationMove}`).join("\n")}

## 對本輪重新生成文章的要求

- 預設一般民眾版。
- 每篇正文純文字且非空白字數超過 2000。
- 每篇都要有家庭經濟主軸。
- 每篇都要有至少一組可檢查前後差異或現金流算式。
- 每篇都要先通過 articlePackReviewGate 綠燈。
- 不把 SEO/AIO、來源清單、審稿建議或 agent 討論放進正文。
`;
}

function renderReport() {
  return `# 2026-06-09 日報：大量審核駁回回讀與文章重生前規則調整

## 摘要

本次已重新讀取好理家在文章管理區的事件索引與審核駁回資料。最新事件總數為 ${sourceStats.eventTotal}，其中審核駁回 ${sourceStats.rejectedEvents} 筆；相較 2026-06-03 先前確認的 290 筆，增加 ${sourceStats.rejectDeltaFromBaseline} 筆。完整審核內容從 20 筆提升到 ${sourceStats.titleAndContentRows} 筆，可交叉學習卡從先前不足門檻提升到 ${sourceStats.reviewLearningReadyCards} 筆。

## 重要發現

- 大量駁回並不是單一問題，而是集中在概念化、數字合理性、平台主軸、重複題材與處遇建議不精準。
- 這代表文章生成不能只補數據，也要先判斷題目是否真的服務家庭經濟與台灣生活決策。
- 最新資料已足夠支撐重新生成正式文章包，但每篇仍需先經過 6/9 gate round。

## 已落地調整

- 新增公開安全衍生資料：data/review-rejection-learning-2026-06-09.json
- 新增最新投稿品質 gate：data/submission-quality-gates-2026-06-09.json
- 更新規則文件：docs/submission-quality-gate-rulebook.md
- 更新 agent 規格：docs/submission-quality-gate-agent.md
- 新增規則增量：docs/reviewer-rule-delta-2026-06-09.md

## 下一步

- 依 6/9 gate 重新生成一般民眾版純文字文章包。
- 更新 suggestions.json 的 reviewRejection 指標，移除舊的 3/8 blocker。
- 跑 validator，確認文章包綠燈、字數、角色一致、標題新意與知識庫標題比對。
`;
}

function renderLog() {
  return `# 2026-06-09 審核駁回讀取與學習日誌

- 模式：read-only InfoCenter collection
- 事件索引輸出：work-private/infocenter-events-summary-2026-06-09.json
- 私有 raw 輸出：work-private/all-review-rejections-raw-2026-06-09.jsonl
- 公開衍生輸出：data/review-rejection-learning-2026-06-09.json
- 事件總數：${sourceStats.eventTotal}
- 駁回總數：${sourceStats.rejectedEvents}
- 可交叉學習卡：${sourceStats.reviewLearningReadyCards}
- 隱私檢查：公開檔未保存原始 event id、審稿原文或文章全文。
`;
}

const files = [
  [qualityGatesOutPath, `${JSON.stringify(qualityGates, null, 2)}\n`],
  [learningOutPath, `${JSON.stringify(learning, null, 2)}\n`],
  [ruleDeltaOutPath, renderDelta()],
  [rulebookOutPath, renderRulebook(qualityGates)],
  [agentSpecOutPath, renderAgentSpec(qualityGates)],
  [reportOutPath, renderReport()],
  [logOutPath, renderLog()],
];

for (const [, content] of files) {
  assertNoPrivateLeak(content, rawRows);
}

for (const [filePath, content] of files) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

console.log(
  JSON.stringify(
    {
      wrote: files.map(([filePath]) => path.relative(repoRoot, filePath).replace(/\\/g, "/")),
      sourceStats,
      signalCounts,
      leakCheck: "passed",
    },
    null,
    2,
  ),
);
