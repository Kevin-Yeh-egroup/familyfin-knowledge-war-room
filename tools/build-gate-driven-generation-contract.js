#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoRoot = path.resolve(__dirname, "..");
const gatePath = path.join(repoRoot, "data", "submission-quality-gates-2026-06-03.json");
const contractOutPath = path.join(
  repoRoot,
  "data",
  "gate-driven-article-generation-contract-2026-06-03.json",
);
const guideOutPath = path.join(repoRoot, "docs", "gate-driven-article-generation-guide.md");
const promptOutPath = path.join(repoRoot, "docs", "gate-driven-article-generation-prompt.md");

const gateData = JSON.parse(fs.readFileSync(gatePath, "utf8"));

const generationStages = [
  {
    id: "stage-01-topic-fit",
    name: "先判斷題目是否值得寫",
    sourceGates: ["gate-01-platform-fit", "gate-05-originality-gap"],
    requiredBeforeDraft: [
      "寫出這篇文章對好理家在知識庫的功能：補缺口、更新資料、整理實務判讀，或提供一般民眾可理解的生活框架。",
      "寫出家庭經濟主軸：這篇文章要回到收入、支出、債務、照顧成本、居住成本、補助資源、風險承接或家庭分工造成的財務影響。",
      "列出主要標籤與次要標籤，說明與既有文章的差異。",
      "若主題只是一般理財、投資、健康、法律或防詐宣導，或無法說清楚家庭經濟連結，必須改題或放棄。",
    ],
    generationMove:
      "先產出 topic fit note，再產出標題。標題不能先行，避免為了標題硬寫一篇平台不需要的文章。",
  },
  {
    id: "stage-02-audience-angle",
    name: "先決定讀者與入口角度",
    sourceGates: ["gate-09-audience-angle", "gate-06-story-precision"],
    requiredBeforeDraft: [
      "二選一設定：一般民眾版或社工版，不混用語氣。",
      "一般民眾版需先寫出讀者現在可能正在承受的矛盾感。",
      "社工版需先寫出實務現場容易誤判的表面問題。",
      "禁止用課程講義、政策懶人包、投資課或社群貼文語氣開場。",
    ],
    generationMove:
      "先產出 reader entry note：讀者是誰、他卡在哪裡、第一段要讓他感覺被理解或被專業地提醒什麼。",
  },
  {
    id: "stage-03-structural-reframe",
    name: "先定義真正要重新框架的問題",
    sourceGates: ["gate-02-non-concept", "gate-04-complexity", "gate-08-structure"],
    requiredBeforeDraft: [
      "用一句話寫出：表面看起來是什麼，真正卡住的是什麼。",
      "列出至少兩個限制條件：金錢、時間、照顧、制度、關係、工作、地區或資源可近性。",
      "每個主段落都要有一個重新定義問題的短句。",
    ],
    generationMove:
      "把文章大綱做成現象、不能只這樣理解、真正影響因素、生活或介入連結四層，不直接進入建議清單。",
  },
  {
    id: "stage-04-evidence-design",
    name: "先設計數值與台灣資料怎麼進文章",
    sourceGates: ["gate-03-numeric-proof", "gate-07-fact-and-policy"],
    requiredBeforeDraft: [
      "至少規劃兩個具體數值或數值化情境。",
      "至少規劃一組前後差異，例如月餘裕、固定支出比例、債務月付比、預備金月數或照顧支出。",
      "涉及補助、津貼、資格、金額、年度、地方方案或法規，必須先查最新台灣官方來源。",
      "正文只保留必要數據，其他查核留在內部，不讓文章有濃厚引用感。",
    ],
    generationMove:
      "先產出 evidence plan：數值要證明什麼、讀者看完要理解哪個差異、哪些資料必須查官方來源。",
  },
  {
    id: "stage-05-scenario-design",
    name: "先設計生活場景，不要虛構誇張案例",
    sourceGates: ["gate-02-non-concept", "gate-06-story-precision", "gate-04-complexity"],
    requiredBeforeDraft: [
      "案例或情境只能用來幫助理解，不作為文章主體。",
      "若是示意情境，必須標示為示意，不可寫成真實個案。",
      "場景需包含角色、壓力來源、金錢或時間限制、選擇困難。",
    ],
    generationMove:
      "把案例壓成一段示意，接著立刻回到判讀，不讓故事蓋過知識文章。",
  },
  {
    id: "stage-06-draft-contract",
    name: "再開始生成純文字正文",
    sourceGates: ["gate-08-structure", "gate-10-actionability"],
    requiredBeforeDraft: [
      "正文超過 2000 字，不含標題、欄位、SEO/AIO、FAQ 或內部查核紀錄。",
      "輸出純文字，不使用 Markdown 標記。",
      "段落標題要有重新定義問題的效果。",
      "結尾留下可盤點的下一步或社工評估焦點，不收在口號。",
    ],
    generationMove:
      "依照選定讀者版本生成正文。生成時每段都要回扣生活選擇、風險承接、支持系統或實務介入。",
  },
  {
    id: "stage-07-revision-loop",
    name: "最後才用 gate 檢查與修正",
    sourceGates: gateData.gates.map((gate) => gate.id),
    requiredBeforeDraft: [
      "先用 fatal gate 檢查是否需要重寫。",
      "再用 required gate 補強數值、結構、台灣資料、讀者角度與下一步。",
      "修正方向要回到生成前各階段，不只在原文上補幾句。",
    ],
    generationMove:
      "如果文章未過關，回到對應生成階段補素材或換角度，而不是只做文字潤稿。",
  },
];

const gateToGenerationMoves = {
  "gate-01-platform-fit": {
    generationQuestion: "這篇為何必須出現在好理家在，且如何回扣家庭經濟，而不是任何理財或生活平台？",
    requiredArtifact: "family_economic_fit_note",
    promptInstruction:
      "先說明主題與收入、支出、債務、照顧成本、居住成本、補助資源、家庭分工或風險承接的連結；若連不上家庭經濟，不要進入撰文。",
  },
  "gate-02-non-concept": {
    generationQuestion: "讀者會在哪個具體生活畫面中遇到這個問題？",
    requiredArtifact: "scene_and_pressure_note",
    promptInstruction:
      "每篇至少準備一個生活場景、兩個現實細節、一次表面問題到結構問題的轉換。",
  },
  "gate-03-numeric-proof": {
    generationQuestion: "文章要用哪組數值讓讀者看見差異？",
    requiredArtifact: "numeric_proof_plan",
    promptInstruction:
      "至少設計兩個數字和一組前後差異，並說明改善的關鍵因素，不要只堆引用。",
  },
  "gate-04-complexity": {
    generationQuestion: "哪些限制讓這件事不能只靠個人努力或單一技巧解決？",
    requiredArtifact: "constraint_matrix",
    promptInstruction:
      "列出至少兩個限制條件，並在正文中保留選擇困難與不同家庭狀況的差異。",
  },
  "gate-05-originality-gap": {
    generationQuestion: "這篇補了知識庫哪個缺口？",
    requiredArtifact: "knowledge_gap_note",
    promptInstruction:
      "生成前先說明與既有文章的差異：新對象、新情境、新台灣資料、新實務判讀或新數值示範。",
  },
  "gate-06-story-precision": {
    generationQuestion: "情境是否支撐判讀，而不是只製造情緒？",
    requiredArtifact: "scenario_validity_note",
    promptInstruction:
      "案例點到即止，必須包含角色限制、金錢流向或時間壓力，並回到判讀。",
  },
  "gate-07-fact-and-policy": {
    generationQuestion: "哪些台灣資料、政策或法規必須查到最新？",
    requiredArtifact: "taiwan_source_check_plan",
    promptInstruction:
      "涉及補助與制度時，先列出中央或地方官方來源查核項目，正文只轉譯讀者需要的限制與流程。",
  },
  "gate-08-structure": {
    generationQuestion: "文章是否有從現象走到結構的遞進？",
    requiredArtifact: "structure_map",
    promptInstruction:
      "每個主段落都用短句重新定義問題，再展開生活結構、壓力累積與選擇影響。",
  },
  "gate-09-audience-angle": {
    generationQuestion: "這篇是寫給一般民眾，還是寫給社工？",
    requiredArtifact: "audience_voice_note",
    promptInstruction:
      "一般民眾版用被理解的生活語言；社工版用評估、判讀、介入焦點，不混用。",
  },
  "gate-10-actionability": {
    generationQuestion: "讀者看完後，第一個能盤點或判讀的是什麼？",
    requiredArtifact: "next_step_note",
    promptInstruction:
      "結尾留下低門檻盤點問題或社工評估焦點，不做財務承諾或政策承諾。",
  },
};

const generationPromptContract = {
  outputLanguage: "Traditional Chinese",
  articleFormat: "plain_text_only",
  minimumBodyCharacters: 2000,
  excludeFromVisibleOutput: ["SEO title", "meta description", "slug", "AIO notes", "FAQ", "source list", "internal review notes"],
  visibleArticleMustInclude: [
    "生活感標題",
    "前言切入矛盾或實務誤判",
    "4 到 6 個具判讀效果的段落標題",
    "至少一個家庭經濟主軸連結，例如收入變動、固定支出、債務壓力、照顧成本、居住成本、補助資源或家庭分工造成的財務影響",
    "至少兩個數值或數值化情境",
    "至少一組前後差異或可比較數字",
    "至少一個台灣現況或制度脈絡，若涉及政策需查最新官方資訊",
    "結語回到重新理解自己、保留選擇、承接變動或社工介入焦點",
  ],
  hiddenPlanningMustInclude: [
    "family_economic_fit_note",
    "topic_fit_note",
    "audience_voice_note",
    "knowledge_gap_note",
    "scene_and_pressure_note",
    "constraint_matrix",
    "numeric_proof_plan",
    "taiwan_source_check_plan",
    "structure_map",
    "next_step_note",
    "gate_self_review",
  ],
  publicAudienceInstruction:
    "一般民眾版要讓讀者覺得自己不是被責備，而是開始看懂壓力怎麼形成。用生活語言寫，不用專業術語堆疊。",
  socialWorkAudienceInstruction:
    "社工版要讓助人工作者看見表面問題背後的結構、評估盲點與介入焦點。語氣專業穩定，但不要寫成學術論文。",
};

const articleBriefTemplate = {
  topic: "",
  targetAudience: "public | social_worker",
  primaryTag: "",
  secondaryTags: [],
  familyEconomicFitNote:
    "這篇如何連到家庭收入、支出、債務、照顧成本、居住成本、補助資源、風險承接或家庭分工的財務影響。",
  topicFitNote: "這篇文章對好理家在知識庫的功能。",
  knowledgeGapNote: "相較既有文章，本篇補的缺口。",
  readerEntryNote: "讀者或社工在第一段會被帶進哪個困境。",
  structuralReframe: {
    surfaceProblem: "",
    deeperProblem: "",
    whyNotSimple: "",
  },
  scenarioPlan: {
    isRealCase: false,
    isIllustrative: true,
    roleAndPressure: "",
    moneyOrTimeConstraint: "",
    decisionDifficulty: "",
  },
  numericProofPlan: [
    {
      numberType: "amount | ratio | time | frequency | before_after",
      valueNeeded: "",
      purposeInArticle: "",
      sourceRequirement: "official_current_taiwan | credible_research | clearly_marked_illustration",
    },
  ],
  taiwanSourceCheckPlan: [],
  structureMap: [
    {
      sectionRole: "intro | core | convergence | conclusion",
      reframeHeading: "",
      lifeConnection: "",
    },
  ],
  firstStepOrAssessmentFocus: "",
};

const agentDiscussionFlow = [
  {
    agent: "source_scout",
    beforeWriting: "列出台灣現況、政策、補助、新聞或資料查核需求；不確定就標示待查，不可硬寫。",
  },
  {
    agent: "knowledge_gap_mapper",
    beforeWriting: "比對知識庫標籤與既有主題，決定本篇補缺口或更新資料的理由。",
  },
  {
    agent: "writing_angle_reviewer",
    beforeWriting: "決定一般民眾版或社工版入口角度，列出不能出現的語氣。",
  },
  {
    agent: "numeric_proof_reviewer",
    beforeWriting: "要求至少兩個數值、一組前後差異、一到三個改善關鍵因素。",
  },
  {
    agent: "non_concept_reviewer",
    beforeWriting: "確認場景、限制、壓力累積與生活選擇已經準備好，才允許開始寫正文。",
  },
  {
    agent: "public_writer_or_social_work_writer",
    beforeWriting: "依讀者版本生成純文字正文，正文超過 2000 字，不顯示 SEO/AIO 欄位。",
  },
  {
    agent: "quality_reviewer",
    beforeWriting: "生成後只做最後 gate 檢查；若未過關，回到對應生成階段補素材。",
  },
];

const output = {
  updatedAt: gateData.updatedAt,
  source: "Derived from submission quality gates; moves editorial gates from post-draft review into pre-draft article generation.",
  privacy: {
    rawReviewTextStoredInThisFile: false,
    rawEventIdsStoredInThisFile: false,
    usesOnlyPublicDerivedGateData: true,
  },
  purpose:
    "讓文章生成一開始就依照好理家在審核駁回規則設計題目、角度、數值、台灣資料、結構與下一步，而不是寫完才被 gate 退件。",
  generationStages,
  gateToGenerationMoves,
  generationPromptContract,
  articleBriefTemplate,
  agentDiscussionFlow,
  workflowPlacement: {
    beforeWebSearch: [
      "先做 topic fit note 和 knowledge gap note，避免漫無目的搜尋。",
      "列出需要查核的台灣政策、補助、新聞或統計項目。",
    ],
    beforeDrafting: [
      "完成 articleBriefTemplate。",
      "source_scout、writing_angle_reviewer、numeric_proof_reviewer、non_concept_reviewer 先各自通過。",
    ],
    duringDrafting: [
      "段落依 structureMap 生成。",
      "每段都回到生活限制、風險承接、支持系統或實務判讀。",
    ],
    afterDrafting: [
      "quality_reviewer 只做最後把關。",
      "未通過時回到對應 stage 補素材，不只潤稿。",
    ],
  },
  integrityHash: crypto
    .createHash("sha256")
    .update(JSON.stringify({ generationStages, gateToGenerationMoves, generationPromptContract }))
    .digest("hex"),
};

function renderGuide(data) {
  return `# Gate-driven 文章生成指南

更新日期：2026-06-03

這份指南把投稿前品質 gate 往前移，變成文章生成前的素材規格與寫作設計。目標不是等文章寫完再打分退件，而是讓每篇文章一開始就符合好理家在的審稿期待。

## 核心改變

舊流程：生成文章 -> gate 打分 -> 退件或修正。

新流程：gate 轉成生成需求 -> 建立 article brief -> agent 討論素材是否足夠 -> 生成正文 -> 最後檢查。

## 生成前必備 brief

每篇文章開始寫正文前，必須先完成：

- topic_fit_note：這篇為何適合好理家在。
- audience_voice_note：寫給一般民眾或社工，入口角度是什麼。
- knowledge_gap_note：補知識庫哪個缺口。
- scene_and_pressure_note：具體生活場景與壓力來源。
- constraint_matrix：至少兩個限制條件。
- numeric_proof_plan：至少兩個數值與一組前後差異。
- taiwan_source_check_plan：需要查核的台灣最新資料。
- structure_map：段落如何從現象走到結構。
- next_step_note：讀者或社工看完後能盤點什麼。

## 七階段生成流程

${data.generationStages
  .map(
    (stage) => `### ${stage.id} ${stage.name}

來源 gate：${stage.sourceGates.join(", ")}

生成前要求：
${stage.requiredBeforeDraft.map((item) => `- ${item}`).join("\n")}

生成動作：
- ${stage.generationMove}
`,
  )
  .join("\n")}

## Agent 討論順序

${data.agentDiscussionFlow.map((item) => `- ${item.agent}：${item.beforeWriting}`).join("\n")}

## 輸出限制

- 正文純文字。
- 正文超過 2000 字。
- 不顯示 SEO/AIO、FAQ、slug、meta description、內部查核欄位。
- 政策、補助、資格、金額與地方方案必須查最新台灣官方來源。
- 示意案例必須標示為示意，不可寫成真實個案。
`;
}

function renderPrompt(data) {
  return `# Gate-driven 文章生成 Prompt

你不是先自由寫文章，再等待品質 gate 退件。
你要先把品質 gate 轉成文章設計條件，再開始生成正文。

請依序完成內部規劃，但不要把內部規劃輸出給讀者：

1. family_economic_fit_note
2. topic_fit_note
3. audience_voice_note
4. knowledge_gap_note
5. scene_and_pressure_note
6. constraint_matrix
7. numeric_proof_plan
8. taiwan_source_check_plan
9. structure_map
10. next_step_note
11. gate_self_review

正文輸出要求：

- 使用繁體中文。
- 只輸出純文字正文。
- 正文超過 2000 字。
- 不輸出 Markdown。
- 不輸出 SEO/AIO、FAQ、slug、meta description 或來源清單。
- 標題需有生活感與吸引力。
- 段落標題需有重新定義問題的效果。
- 至少一個家庭經濟主軸連結，例如收入變動、固定支出、債務壓力、照顧成本、居住成本、補助資源或家庭分工造成的財務影響。
- 至少兩個具體數值或數值化情境。
- 至少一組前後差異或可比較數字。
- 若涉及台灣政策、補助、資格、金額、年度或地方方案，必須確認最新官方資訊後再寫。

一般民眾版：
${data.generationPromptContract.publicAudienceInstruction}

社工版：
${data.generationPromptContract.socialWorkAudienceInstruction}

生成前自問：

${Object.entries(data.gateToGenerationMoves)
  .map(([gateId, move]) => `- ${gateId}：${move.generationQuestion} ${move.promptInstruction}`)
  .join("\n")}

若文章無法回扣家庭經濟，或任何 fatal gate 無法在規劃階段被滿足，請不要硬寫正文，改為輸出「需要補資料或換題」的原因。
`;
}

const contractText = JSON.stringify(output, null, 2);
const guide = renderGuide(output);
const prompt = renderPrompt(output);

const privateDetailPattern = new RegExp(
  "eventId|reviewDetail|chosenReviewRowId|egroup-infocenter\\.com/me/event/events",
);
for (const text of [contractText, guide, prompt]) {
  if (privateDetailPattern.test(text)) {
    throw new Error("Potential private implementation detail leaked.");
  }
}

fs.writeFileSync(contractOutPath, contractText, "utf8");
fs.writeFileSync(guideOutPath, guide, "utf8");
fs.writeFileSync(promptOutPath, prompt, "utf8");

console.log(
  JSON.stringify(
    {
      wrote: [
        path.relative(repoRoot, contractOutPath),
        path.relative(repoRoot, guideOutPath),
        path.relative(repoRoot, promptOutPath),
      ],
      stages: output.generationStages.length,
      gateMoves: Object.keys(output.gateToGenerationMoves).length,
      leakCheck: "passed",
    },
    null,
    2,
  ),
);
