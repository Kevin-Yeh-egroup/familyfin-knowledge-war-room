#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoRoot = path.resolve(__dirname, "..");
const rawPath = path.join(
  repoRoot,
  "work-private",
  "all-review-rejection-details-ui-raw-2026-06-03.jsonl",
);
const dataOutPath = path.join(repoRoot, "data", "submission-quality-gates-2026-06-03.json");
const docOutPath = path.join(repoRoot, "docs", "submission-quality-gate-rulebook.md");
const agentOutPath = path.join(repoRoot, "docs", "submission-quality-gate-agent.md");

function readJsonl(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function reviewText(row) {
  return `${row.reviewDetail?.title || ""}\n${row.reviewDetail?.content || ""}`.trim();
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

function countPattern(textRows, pattern) {
  return textRows.filter((text) => pattern.test(text)).length;
}

const rows = readJsonl(rawPath);
const textRows = rows.map(reviewText).filter(Boolean);
const collectedTimestamps = rows
  .map((row) => Date.parse(row.collectedAt || row.collectionStartedAt || ""))
  .filter((time) => Number.isFinite(time));
const sourceUpdatedAt =
  collectedTimestamps.length > 0
    ? new Date(Math.max(...collectedTimestamps)).toISOString()
    : "2026-06-03T00:00:00.000Z";

const signalDefinitions = {
  conceptual_or_general: /概念|宣導|一般性|小品文|情境的描述/,
  platform_scope_mismatch: /平台著重|不適合|非概念宣導|不是平台.*重點|無需另寫/,
  needs_specific_numbers_actions: /具體|數字|比例|行為調整|財務數字|實際狀況/,
  oversimplified_complex_context: /簡化|複雜|無法簡單|不能只|過於簡略|差距/,
  duplicate_or_existing_content: /重複|已有|專章|文章/,
  story_or_case_angle_issue: /故事|情境|角色|文字遊戲|情感衝突/,
  accuracy_or_grounding_risk: /不代表|錯|不鼓勵|真正的價格|資料|來源|研究/,
  structure_or_readability_issue: /結構|雜亂/,
  too_narrow_or_off_topic: /防詐騙|醫院社工|姿勢|運動|ETF|槓桿|利率/,
  missing_depth_or_content: /內容|缺乏|不足|方向|問題|需要/,
  family_context_required: /家庭|收入|支出|工作|照顧|孩子|長輩|社工|實務/,
};

const signalCounts = Object.fromEntries(
  Object.entries(signalDefinitions).map(([id, pattern]) => [id, countPattern(textRows, pattern)]),
);

const gates = [
  {
    id: "gate-01-platform-fit",
    name: "家庭經濟主軸關卡",
    severity: "fatal",
    evidenceSignals: ["platform_scope_mismatch", "too_narrow_or_off_topic"],
    reviewerAgents: ["quality_reviewer", "tag_mapper"],
    rejectWhen: [
      "主題只是一般投資、健康、法律、關係、反詐或生活提醒，沒有回到家庭經濟與助人工作處境。",
      "文章可以放在任何理財或生活平台，缺少好理家在的辨識度。",
      "文章只有情緒、觀念或個人選擇，沒有說清楚家庭收入、支出、債務、照顧成本、風險承接或資源取得如何影響生活。",
    ],
    mustHave: [
      "明確連到家庭財務壓力、生活風險、服務對象決策、支持系統或助人工作現場。",
      "說清楚這篇為何適合好理家在，而不是一般宣導文章。",
      "至少呈現一個家庭經濟連結：收入變動、固定支出、債務壓力、照顧成本、托育/長照/醫療支出、居住成本、補助資源、或家庭成員分工造成的財務影響。",
    ],
    revisionMove: "把主題重新框回家庭經濟困境、風險承接能力、服務現場判讀或一般民眾可理解的生活壓力；若無法連到家庭經濟，就換題。",
  },
  {
    id: "gate-02-non-concept",
    name: "非概念文關卡",
    severity: "fatal",
    evidenceSignals: ["conceptual_or_general", "missing_depth_or_content"],
    reviewerAgents: ["non_concept_reviewer", "reader_appeal_reviewer"],
    rejectWhen: [
      "全文主要是在說觀念、價值、提醒或口號，缺少場景、數字、決策困難與可辨識的生活壓力。",
      "讀者看完只知道應該要重視，卻不知道問題在現實中如何發生。",
    ],
    mustHave: [
      "至少一個具體生活場景。",
      "至少兩個可檢查的現實細節，例如金額、時間、比例、頻率、角色分工或流程。",
      "指出問題從表面現象到結構限制的變化。",
    ],
    revisionMove: "把抽象句改成生活中的前後差異，例如支出怎麼卡住、收入中斷會如何影響選擇、社工能從哪裡開始盤點。",
  },
  {
    id: "gate-03-numeric-proof",
    name: "數值證明關卡",
    severity: "required",
    evidenceSignals: ["needs_specific_numbers_actions"],
    reviewerAgents: ["numeric_proof_reviewer", "fact_case_reviewer"],
    rejectWhen: [
      "有改善建議，但沒有任何前後數字、比例、金額、時間或可衡量差異。",
      "引用資料很多，但沒有把資料轉成讀者看得懂的生活判斷。",
    ],
    mustHave: [
      "至少一組前後差異或可比較數值。",
      "至少一個改善關鍵因素，例如固定支出降低、緊急預備金月數增加、債務月付比下降。",
      "若用假設情境，需標示為示意，避免像真實個案或官方統計。",
    ],
    revisionMove: "加入一段小型算式或前後對照，讓讀者看到調整後多出多少餘裕、風險少在哪裡。",
  },
  {
    id: "gate-04-complexity",
    name: "複雜處境不可簡化關卡",
    severity: "required",
    evidenceSignals: ["oversimplified_complex_context", "family_context_required"],
    reviewerAgents: ["social_work_writer", "quality_reviewer"],
    rejectWhen: [
      "把照顧、婚姻、托育、債務、買房、工作轉換等複雜處境寫成單一答案。",
      "忽略家庭成員、制度限制、資源可近性、關係壓力或時間壓力。",
    ],
    mustHave: [
      "列出至少兩個限制條件。",
      "說明為什麼不能只從個人努力或單一理財技巧理解。",
      "保留不同家庭狀況下的判斷彈性。",
    ],
    revisionMove: "把建議改成判讀框架：先盤點限制，再看選項，而不是直接告訴讀者該怎麼做。",
  },
  {
    id: "gate-05-originality-gap",
    name: "重複與內容缺口關卡",
    severity: "required",
    evidenceSignals: ["duplicate_or_existing_content"],
    reviewerAgents: ["knowledge_gap_mapper", "article_pattern_miner"],
    rejectWhen: [
      "主題已經有更完整文章，新增稿件沒有新的場景、數據、對象、地區、制度或判讀角度。",
      "只是同一篇文章換標題、換故事、換說法。",
    ],
    mustHave: [
      "說明新稿與既有知識庫的差異。",
      "新增至少一個新的讀者問題、台灣現況、案例角度或實務判讀點。",
    ],
    revisionMove: "先查知識庫同標籤文章，決定要補缺口、更新資料、或放棄這個題目。",
  },
  {
    id: "gate-06-story-precision",
    name: "故事與案例精準度關卡",
    severity: "required",
    evidenceSignals: ["story_or_case_angle_issue"],
    reviewerAgents: ["writing_angle_reviewer", "reader_appeal_reviewer"],
    rejectWhen: [
      "故事性很強，但案例只是情緒鋪陳，沒有支持核心判讀。",
      "角色關係、責任位置或生活條件不合理。",
    ],
    mustHave: [
      "案例只服務概念，不喧賓奪主。",
      "角色關係與責任位置要符合台灣生活語境與助人工作常識。",
      "故事後必須回到可判讀的結構或可行下一步。",
    ],
    revisionMove: "縮短故事，補上角色限制、金錢流向、壓力來源與選擇困難。",
  },
  {
    id: "gate-07-fact-and-policy",
    name: "台灣事實與政策正確性關卡",
    severity: "fatal",
    evidenceSignals: ["accuracy_or_grounding_risk"],
    reviewerAgents: ["source_scout", "fact_case_reviewer"],
    rejectWhen: [
      "政府補助、地方方案、法規、年度資格或金額沒有確認是最新台灣資訊。",
      "用單一研究、新聞或特殊個案推論所有家庭。",
      "真實案例與示意案例界線不清。",
    ],
    mustHave: [
      "政策與補助類內容以最新中央或地方政府來源為準。",
      "標示資料年份與適用地區。",
      "把資料轉成生活判讀，不讓文章讀起來像引用堆疊。",
    ],
    revisionMove: "先做 current Taiwan source check，再把來源濃縮成讀者需要的資格、限制、流程與風險提醒。",
  },
  {
    id: "gate-08-structure",
    name: "結構清晰關卡",
    severity: "required",
    evidenceSignals: ["structure_or_readability_issue", "missing_depth_or_content"],
    reviewerAgents: ["quality_reviewer", "doc_scribe"],
    rejectWhen: [
      "段落像資料堆疊，讀者看不出問題如何從現象推到結構。",
      "一篇文章同時處理太多議題，沒有主線。",
    ],
    mustHave: [
      "前言直接切入矛盾或實務困境。",
      "核心段落依序呈現現象、不能只這樣理解、真正影響因素、生活或介入連結。",
      "結語回到重新理解自己或實務判讀，不收在口號。",
    ],
    revisionMove: "重排成 4 到 6 個主段，每段只處理一個判讀問題。",
  },
  {
    id: "gate-09-audience-angle",
    name: "讀者角度關卡",
    severity: "required",
    evidenceSignals: ["family_context_required", "story_or_case_angle_issue"],
    reviewerAgents: ["writing_angle_reviewer", "reader_appeal_reviewer"],
    rejectWhen: [
      "一般民眾版像課程講義，社工版像對民眾說教。",
      "語氣讓讀者覺得被責備，或讓助人工作者覺得只是重講常識。",
    ],
    mustHave: [
      "一般民眾版要讓讀者感覺被理解，先看懂處境，再談選擇。",
      "社工版要自然帶出評估、判讀、介入焦點與常見誤判。",
      "同一主題需先決定主要讀者，不要兩種口吻混在一起。",
    ],
    revisionMove: "先寫出這篇要回答的讀者問題，再決定前言角度與段落標題。",
  },
  {
    id: "gate-10-actionability",
    name: "可行下一步關卡",
    severity: "required",
    evidenceSignals: ["needs_specific_numbers_actions", "missing_depth_or_content"],
    reviewerAgents: ["quality_reviewer", "numeric_proof_reviewer"],
    rejectWhen: [
      "文章只有理解，沒有讓讀者或社工知道下一步可以盤點什麼。",
      "建議太大、太正確，卻沒有第一個可操作行動。",
    ],
    mustHave: [
      "一般民眾版至少留下一個可以自我檢查的問題或盤點方向。",
      "社工版至少留下一個評估焦點或提問方向。",
      "下一步不能變成財務建議或政策承諾。",
    ],
    revisionMove: "把結尾從抽象鼓勵改成一個低門檻盤點動作或服務現場提問。",
  },
];

const scoreModel = {
  approveThreshold: 82,
  reviseThreshold: 70,
  fatalRule: "Any failed fatal gate means reject or major rewrite, even if total score is high.",
  scoring: [
    { dimension: "家庭經濟主軸與讀者角度", points: 18, gates: ["gate-01-platform-fit", "gate-09-audience-angle"] },
    { dimension: "非概念與生活具體度", points: 20, gates: ["gate-02-non-concept", "gate-06-story-precision"] },
    { dimension: "數值證明與台灣事實", points: 20, gates: ["gate-03-numeric-proof", "gate-07-fact-and-policy"] },
    { dimension: "結構判讀與複雜性", points: 22, gates: ["gate-04-complexity", "gate-08-structure"] },
    { dimension: "可投稿新意與可行下一步", points: 20, gates: ["gate-05-originality-gap", "gate-10-actionability"] },
  ],
};

const discussionProtocol = [
  {
    step: 1,
    agent: "review_feedback_miner",
    job: "用本規則庫先標出可能退件原因，禁止直接引用私有審稿原文。",
  },
  {
    step: 2,
    agent: "writing_angle_reviewer",
    job: "判斷一般民眾版或社工版的入口角度是否正確。",
  },
  {
    step: 3,
    agent: "non_concept_reviewer",
    job: "檢查文章是否停在概念宣導，是否有場景、數字、限制與決策困難。",
  },
  {
    step: 4,
    agent: "numeric_proof_reviewer",
    job: "檢查至少一組前後數值或可衡量改善，並確認假設與事實界線。",
  },
  {
    step: 5,
    agent: "fact_case_reviewer",
    job: "檢查台灣資料、政策、補助、案例或新聞是否最新且適用。",
  },
  {
    step: 6,
    agent: "quality_reviewer",
    job: "合併評分，輸出核准、修正後核准或退回重寫。",
  },
];

const gateEvidence = Object.fromEntries(
  gates.map((gate) => [
    gate.id,
    {
      matchedReviewTextRows: gate.evidenceSignals.reduce((sum, signal) => sum + (signalCounts[signal] || 0), 0),
      evidenceSignals: gate.evidenceSignals.map((signal) => ({
        signal,
        count: signalCounts[signal] || 0,
        shareOfReviewTextRows: pct(signalCounts[signal] || 0, textRows.length),
      })),
    },
  ]),
);

const output = {
  updatedAt: sourceUpdatedAt,
  source: "Derived from InfoCenter rejected review modals collected on 2026-06-03.",
  privacy: {
    rawReviewTextStoredInThisFile: false,
    rawEventIdsStoredInThisFile: false,
    rawArticleTextStoredInThisFile: false,
    privateSourcePath: "work-private/all-review-rejection-details-ui-raw-2026-06-03.jsonl",
    publicSafeDerivedOnly: true,
  },
  sourceStats: {
    rejectedEventsOpened: rows.filter((row) => row.ok && row.reviewDetail?.opened).length,
    reviewTextRows: textRows.length,
    titleAndContentRows: rows.filter((row) => row.reviewDetail?.title && row.reviewDetail?.content).length,
    titleOnlyRows: rows.filter((row) => row.reviewDetail?.title && !row.reviewDetail?.content).length,
    emptyReviewModalRows: rows.filter(
      (row) => row.ok && row.reviewDetail?.opened && !row.reviewDetail?.title && !row.reviewDetail?.content,
    ).length,
  },
  signalCounts,
  gates: gates.map((gate) => ({
    ...gate,
    evidence: gateEvidence[gate.id],
  })),
  scoreModel,
  discussionProtocol,
  articleDecisionOutputs: [
    "decision: approve | revise | reject",
    "failedFatalGates: gate ids",
    "score: 0-100",
    "topRevisionFocus: max 3 items",
    "requiredEvidenceToAdd: numbers, Taiwan sources, scenario details, structure fixes",
    "copyReadyPlainText: true only after all fatal gates pass",
  ],
  governance: {
    maturityLevel: "project-local candidate",
    ownerAgent: "quality_reviewer",
    trigger: "Before any generated article is shown as ready for Kevin approval or InfoCenter submission.",
    doNotUseFor: [
      "Do not auto-submit articles.",
      "Do not expose private review text.",
      "Do not decide legal, financial, medical, or welfare eligibility for readers.",
      "Do not replace human editorial approval.",
    ],
    verification: [
      "Generated JSON parses.",
      "No raw event ids or long raw review comments appear in public files.",
      "Every gate has reviewer agents, reject conditions, must-have checks, and revision moves.",
    ],
  },
  integrityHash: crypto
    .createHash("sha256")
    .update(JSON.stringify({ signalCounts, gates: gates.map(({ id, name, severity }) => ({ id, name, severity })) }))
    .digest("hex"),
};

function assertNoPrivateLeak(publicText) {
  for (const row of rows) {
    if (row.eventId && publicText.includes(row.eventId)) {
      throw new Error(`Private event id leaked: ${row.eventId}`);
    }
    const raw = reviewText(row).replace(/\s+/g, " ").trim();
    if (raw.length >= 16 && publicText.includes(raw)) {
      throw new Error("Long raw review comment leaked into public output.");
    }
  }
}

function renderRulebook(data) {
  const gateLines = data.gates
    .map((gate) => {
      const evidence = gate.evidence.evidenceSignals
        .map((signal) => `${signal.signal}: ${signal.count}`)
        .join(", ");
      return `## ${gate.id} ${gate.name}

嚴重度：${gate.severity}

來源訊號：${evidence}

退件條件：
${gate.rejectWhen.map((item) => `- ${item}`).join("\n")}

必備條件：
${gate.mustHave.map((item) => `- ${item}`).join("\n")}

修正方向：
- ${gate.revisionMove}

負責 reviewer：${gate.reviewerAgents.join(", ")}
`;
    })
    .join("\n");

  return `# 投稿前品質檢查規則庫

更新日期：2026-06-03

這份規則庫由 InfoCenter 290 筆審核駁回事件的私有資料衍生而來。公開版只保留規則、統計與檢查方法，不保存事件 ID、審稿原文或文章全文。

## 資料基礎

- 已開啟審核彈窗：${data.sourceStats.rejectedEventsOpened}
- 可作為文字學習素材：${data.sourceStats.reviewTextRows}
- 有審核標題與內容：${data.sourceStats.titleAndContentRows}
- 只有審核標題：${data.sourceStats.titleOnlyRows}
- 彈窗開啟但沒有文字：${data.sourceStats.emptyReviewModalRows}

## 使用方式

文章送出前，先由 reviewer agent 依序檢查 fatal gate，再檢查 required gate。只要 fatal gate 未通過，就不能標記為可投稿。

分數判定：
- ${data.scoreModel.approveThreshold} 分以上：可進入 Kevin 核准
- ${data.scoreModel.reviseThreshold} 到 ${data.scoreModel.approveThreshold - 1} 分：修正後再審
- ${data.scoreModel.reviseThreshold - 1} 分以下：退回重寫

${gateLines}
## Agent 討論順序

${data.discussionProtocol.map((step) => `${step.step}. ${step.agent}：${step.job}`).join("\n")}

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

Source freshness：規則來源為 2026-06-03 已完成蒐集的 290 筆審核駁回事件，其中 143 筆含可學習文字。

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
- 把一般理財建議包裝成個案處遇建議

Output contract：
1. decision: approve / revise / reject
2. score: 0-100
3. failedFatalGates
4. failedRequiredGates
5. topRevisionFocus: 最多 3 項
6. evidenceToAdd: 需要補的數字、台灣來源、情境細節或結構段落
7. readyForKevinApproval: true / false

Required discussion:
${data.discussionProtocol.map((step) => `- ${step.agent}: ${step.job}`).join("\n")}

Verification:
- 讀取 data/submission-quality-gates-2026-06-03.json
- 確認所有 fatal gate 都通過
- 確認正文超過 2000 字時，仍不是概念堆疊
- 確認政策與補助資訊為最新台灣資料
- 確認輸出為純文字可投稿正文時，不含 SEO/AIO 額外欄位
`;
}

const publicJson = JSON.stringify(output, null, 2);
const rulebook = renderRulebook(output);
const agentSpec = renderAgentSpec(output);
assertNoPrivateLeak(publicJson);
assertNoPrivateLeak(rulebook);
assertNoPrivateLeak(agentSpec);

fs.mkdirSync(path.dirname(dataOutPath), { recursive: true });
fs.mkdirSync(path.dirname(docOutPath), { recursive: true });
fs.writeFileSync(dataOutPath, publicJson, "utf8");
fs.writeFileSync(docOutPath, rulebook, "utf8");
fs.writeFileSync(agentOutPath, agentSpec, "utf8");

console.log(
  JSON.stringify(
    {
      wrote: [
        path.relative(repoRoot, dataOutPath),
        path.relative(repoRoot, docOutPath),
        path.relative(repoRoot, agentOutPath),
      ],
      sourceStats: output.sourceStats,
      gateCount: output.gates.length,
      leakCheck: "passed",
    },
    null,
    2,
  ),
);
