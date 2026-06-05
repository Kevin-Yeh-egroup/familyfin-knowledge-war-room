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
      "寫出這篇文章對好理家在知識庫的功能：補缺口、更新資料、整理實務判讀，或提供一般民眾可理解的生活整理角度。",
      "寫出家庭經濟主軸：這篇文章要回到收入、支出、債務、照顧成本、居住成本、補助資源、遇到變故時是否撐得住，或家庭分工造成的財務影響。",
      "列出主要標籤與次要標籤，說明與既有文章的差異。",
      "若主題只是一般理財、投資、健康、法律或防詐宣導，或無法說清楚家庭經濟連結，必須改題或放棄。",
      "除非 Kevin 明確要求系列文章，否則同批標題不得大量使用同一公式，例如全部寫成「不是＿＿：＿＿」。",
    ],
    generationMove:
      "先產出 topic fit note，再產出標題與 title diversity check。標題不能先行，避免為了標題硬寫一篇平台不需要的文章；同批標題需混合生活畫面、問題句、數字句、時間壓力、後果句或家庭選擇困境。",
  },
  {
    id: "stage-02-audience-angle",
    name: "先決定讀者與入口角度",
    sourceGates: ["gate-09-audience-angle", "gate-06-story-precision", "gate-11-role-integrity"],
    requiredBeforeDraft: [
      "預設一律設定為一般民眾版；只有 Kevin 明確指定社工版時，才可改成社工版。",
      "一般民眾版需先寫出讀者現在可能正在承受的矛盾感。",
      "未被明確指定社工版時，不得對社工、助人工作者、陪伴者或文章作者發出介入建議。",
      "禁止用課程講義、政策懶人包、投資課或社群貼文語氣開場。",
    ],
    generationMove:
      "先產出 reader entry note 和 role integrity note：讀者是誰、他卡在哪裡、第一段要讓他感覺被理解；同時列出正文不得出現的後台語。",
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
      "正文必須像台灣一般讀者會自然理解的說法，不使用美語直譯、顧問簡報感或過度抽象組合詞。",
      "開頭不要先介紹題目，要先寫出讀者生活裡真正卡住的機制，例如日期準時、收入和照顧同時變少、帳單不會等人。",
      "政策數字和補助金額要轉成生活用途或前後差異，讓讀者看見這筆錢可以撐哪幾天、少哪一次周轉、補哪一段費用。",
      "預設結尾留下一般民眾可以自我盤點的一步；只有 Kevin 明確指定社工版時，才可留下社工評估焦點。",
      "結尾要回扣開頭的生活機制，收成清楚判斷，不用空泛希望、口號或突然新增概念。",
      "正文不得出現對文章、作者、編輯、審稿者或 agent 的建議。",
    ],
    generationMove:
      "依照一般民眾版生成正文。生成時每段都要回扣生活選擇、遇到變故時是否撐得住、支持系統或日常安排；社工介入語言只在 Kevin 明確指定社工版時使用。",
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
      "先說明主題與收入、支出、債務、照顧成本、居住成本、補助資源、家庭分工，或遇到變故時是否撐得住的連結；若連不上家庭經濟，不要進入撰文。",
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
    generationQuestion: "這篇是否依照預設寫給一般民眾？若要寫社工版，Kevin 是否有明確指定？",
    requiredArtifact: "audience_voice_note",
    promptInstruction:
      "預設只寫一般民眾版，用被理解的生活語言；未被明確指定時，不寫社工評估、判讀或介入焦點。",
  },
  "gate-10-actionability": {
    generationQuestion: "讀者看完後，第一個能盤點或判讀的是什麼？",
    requiredArtifact: "next_step_note",
    promptInstruction:
      "結尾留下低門檻盤點問題或社工評估焦點，不做財務承諾或政策承諾。另產出 ending_strength_note：結尾要回扣開頭生活機制，指出讀者最該先整理的日期、金額、順序、支出缺口或支持來源，避免爛尾、空泛希望或詞不達意。",
  },
  "gate-11-role-integrity": {
    generationQuestion: "正文是否只對目標讀者說話，沒有混入作者、編輯、審稿或 agent 的建議？",
    requiredArtifact: "role_integrity_scan",
    promptInstruction:
      "正文禁止出現「這篇文章應」「文章最後也應」「對一般民眾版而言」「如果這篇要投稿」「可以提醒讀者」「建議每篇」「知識庫文章要」等後台語；若出現，必須刪除或重寫。",
  },
  "gate-12-body-naturalness": {
    generationQuestion: "正文是否像台灣一般讀者會自然理解的說法，而不是翻譯腔或顧問簡報？",
    requiredArtifact: "body_naturalness_scan",
    promptInstruction:
      "逐段檢查正文語感。避免「收入空窗」「進帳空窗」「財務止血」「承接風險」「正式資源」「策略可以是」「生活被接住」；改成薪水突然少一段、先讓錢不要再流出去、遇到變故時還撐不撐得住、可以查證的協助管道等生活說法。再用 kevin_editorial_reference_note 檢查開頭是否抓到生活機制、數字是否推動判讀、政策是否被翻成日常用途。",
  },
};

const generationPromptContract = {
  outputLanguage: "Traditional Chinese",
  articleFormat: "plain_text_only",
  defaultTargetAudience: "public",
  socialWorkerVersionRequiresExplicitKevinRequest: true,
  minimumBodyCharacters: 2000,
  excludeFromVisibleOutput: [
    "SEO title",
    "meta description",
    "slug",
    "AIO notes",
    "FAQ",
    "source list",
    "internal review notes",
    "article brief",
    "gate self review",
    "editorial advice",
    "agent discussion",
    "revision suggestions",
  ],
  visibleArticleMustInclude: [
    "生活感標題",
    "前言切入一般民眾的生活矛盾",
    "4 到 6 個具判讀效果的段落標題",
    "至少一個家庭經濟主軸連結，例如收入變動、固定支出、債務壓力、照顧成本、居住成本、補助資源或家庭分工造成的財務影響",
    "至少兩個數值或數值化情境",
    "至少一組前後差異或可比較數字",
    "至少一個台灣現況或制度脈絡，若涉及政策需查最新官方資訊",
    "結語回到重新理解自己、保留選擇或承接變動，不收在作者建議或審稿語",
  ],
  visibleArticleMustExclude: [
    "讀者版本",
    "一般民眾版",
    "社工版",
    "這篇文章",
    "本文可以",
    "本文應",
    "文章最後",
    "文章發展",
    "如果這篇要投稿",
    "如果這篇文章要用在知識庫",
    "對一般民眾版而言",
    "對知識庫文章而言",
    "可以提醒讀者",
    "建議每篇",
    "好理家在文章的重要任務",
    "知識文章要做到",
    "審稿",
    "投稿",
    "agent",
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
    "ending_strength_note",
    "title_diversity_plan",
    "role_integrity_scan",
    "body_naturalness_scan",
    "kevin_editorial_reference_note",
    "gate_self_review",
  ],
  titleDiversityPolicy: {
    default: "non_series",
    seriesRequiresExplicitKevinRequest: true,
    maxSameFormulaTitlesPerPack: 2,
    naturalTaiwanChineseRequired: true,
    requiredTitleEntryTypes: [
      "生活畫面",
      "具體問題",
      "數字切入",
      "時間壓力",
      "後果提醒",
      "家庭選擇困境",
    ],
    rejectWhen:
      "同一批標題像系列模板，或大量重複「不是＿＿：＿＿」「先看＿＿」「＿＿不是＿＿」等同一公式；標題出現美語直譯、顧問簡報感或不自然抽象詞也要退回。",
    awkwardExamples: [
      "緊急預備金要先回答收入空窗",
      "家庭要先做的財務止血",
      "風險也每天靠近",
    ],
  },
  editorialReferencePolicy: {
    source: "Kevin edited article samples provided on 2026-06-03",
    status: "project-local learning reference",
    doNotCopySamplesVerbatim: true,
    requiredMoves: [
      "第一句先抓生活機制，不先講背景或定義。",
      "用假設情境把收入、固定支出、日期和缺口放在同一張生活表裡。",
      "政策或補助金額要翻成通勤、診所自費、房租緩衝、少一次刷卡補洞等日常用途。",
      "每篇至少安排一組前後差異，並明說改善關鍵是什麼。",
      "可以用短列點整理三個卡點、三個數字或三個順序，但列點後要回到家庭生活，不寫成講義。",
      "結尾回到生活選擇與可呼吸的空間，不收在口號或雞湯。",
    ],
    endingQualityRules: [
      "最後一段要回扣第一段的生活矛盾。",
      "最後一句要有明確落點，讓讀者知道要先看哪個缺口。",
      "不能用空泛希望感、漂亮話或新概念當結尾。",
      "如果結尾只是在重述全文，必須重寫。",
    ],
    rejectWhen: [
      "開頭像一般主題介紹，沒有讓讀者立刻看見自己的壓力。",
      "數字只像引用資料，沒有變成生活判斷。",
      "文章只是說應該怎麼做，沒有呈現日期、金額、順序、限制與取捨。",
      "結尾弱、爛尾、詞不達意，或沒有收回開頭的生活壓力。",
    ],
  },
  publicAudienceInstruction:
    "一般民眾版要讓讀者覺得自己不是被責備，而是開始看懂壓力怎麼形成。用生活語言寫，不用專業術語堆疊。",
  socialWorkAudienceInstruction:
    "社工版要讓助人工作者看見表面問題背後的結構、評估盲點與介入焦點。語氣專業穩定，但不要寫成學術論文。",
};

const articleBriefTemplate = {
  topic: "",
  targetAudience: "public",
  socialWorkerVersionAllowedOnlyWhenKevinExplicitlyRequests: true,
  primaryTag: "",
  secondaryTags: [],
  familyEconomicFitNote:
    "這篇如何連到家庭收入、支出、債務、照顧成本、居住成本、補助資源、遇到變故時是否撐得住，或家庭分工的財務影響。",
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
  roleIntegrityScan: {
    bodyAddressesOnlyTargetReader: true,
    noEditorialAdviceInBody: true,
    noArticleMetaLanguageInBody: true,
    noSocialWorkerVoiceUnlessExplicitlyRequested: true,
  },
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
    beforeWriting: "依預設一般民眾版決定入口角度；只有 Kevin 明確指定時才改社工版，並列出不能出現的語氣。",
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
    agent: "public_writer",
    beforeWriting: "預設生成一般民眾純文字正文，正文超過 2000 字，不顯示 SEO/AIO 欄位或內部建議。",
  },
  {
    agent: "role_leak_reviewer",
    beforeWriting: "逐段掃描正文，若出現作者建議、審稿語、讀者版本語、投稿語、知識庫語或社工語氣錯位，退回重寫。",
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
      "每段都回到生活限制、遇到變故時是否撐得住、支持系統或實務判讀。",
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
- audience_voice_note：預設寫給一般民眾，入口角度是什麼；只有 Kevin 明確指定時才改社工版。
- knowledge_gap_note：補知識庫哪個缺口。
- scene_and_pressure_note：具體生活場景與壓力來源。
- constraint_matrix：至少兩個限制條件。
- numeric_proof_plan：至少兩個數值與一組前後差異。
- taiwan_source_check_plan：需要查核的台灣最新資料。
- structure_map：段落如何從現象走到結構。
- next_step_note：一般民眾看完後能先盤點什麼；只有 Kevin 明確指定社工版時才改成社工評估焦點。
- role_integrity_scan：檢查正文是否混入作者建議、審稿語、投稿語、知識庫語、讀者版本說明或社工語氣錯位。

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
11. ending_strength_note
12. title_diversity_plan
13. role_integrity_scan
14. body_naturalness_scan
15. kevin_editorial_reference_note
16. gate_self_review

預設受眾：

- 一律生成一般民眾版。
- 只有 Kevin 明確指定「社工版」時，才可以改用社工專業文章角度。
- 未被明確指定時，不要對社工、助人工作者、陪伴者、作者、編輯或審稿者說話。

正文輸出要求：

- 使用繁體中文。
- 只輸出純文字正文。
- 正文超過 2000 字。
- 不輸出 Markdown。
- 不輸出 SEO/AIO、FAQ、slug、meta description 或來源清單。
- 不輸出內部規劃、article brief、gate 自評、審稿建議、修稿建議或 agent 討論。
- 標題需有生活感與吸引力。
- 標題不得整批使用同一公式。除非 Kevin 明確要求系列文章，否則同批 10 篇要混合生活畫面、問題句、數字句、時間壓力、後果句或家庭選擇困境；「不是＿＿：＿＿」同批最多 1 到 2 篇。
- 標題必須是自然台灣中文，不可像美語直譯或顧問簡報。避免「要先回答收入空窗」「財務止血」「風險也每天靠近」這類意思可懂但不自然的語句。
- 正文也必須是自然台灣中文。避免「收入空窗」「進帳空窗」「財務止血」「承接風險」「正式資源」「策略可以是」「生活被接住」這類像翻譯腔或顧問簡報的語句，改用「薪水突然少一段」「先讓錢不要再流出去」「遇到變故時還撐不撐得住」「可以查證的協助管道」等生活說法。
- 正文不得出現「示意前後差異」「示意看前後差異」這類寫給作者看的轉場語。要改成讀者能自然理解的句子，例如「把減班前後攤開看」「把時間差算進去」「把每月結餘拆開看」。
- 依 Kevin 修稿樣本檢查正文：第一句先抓生活機制，不先講背景；數字要推動判讀，不只當引用；政策或補助金額要翻成日常用途、前後差異、日期順序或少一次周轉。
- 結尾要強。最後一段必須回扣開頭的生活矛盾，最後一句要有明確落點，讓讀者知道要先看日期、金額、順序、支出缺口或支持來源中的哪一個；不能只用抽象鼓勵、漂亮話或新概念收尾。
- 段落標題需有重新定義問題的效果。
- 至少一個家庭經濟主軸連結，例如收入變動、固定支出、債務壓力、照顧成本、居住成本、補助資源或家庭分工造成的財務影響。
- 至少兩個具體數值或數值化情境。
- 至少一組前後差異或可比較數字。
- 若涉及台灣政策、補助、資格、金額、年度或地方方案，必須確認最新官方資訊後再寫。

正文禁止出現的後台語與角色錯亂語：

- 讀者版本
- 一般民眾版
- 社工版
- 這篇文章
- 本文可以
- 本文應
- 文章最後
- 文章發展
- 如果這篇要投稿
- 如果這篇文章要用在知識庫
- 對一般民眾版而言
- 對知識庫文章而言
- 可以提醒讀者
- 建議每篇
- 好理家在文章的重要任務
- 知識文章要做到
- 審稿
- 投稿
- agent

一般民眾版：
${data.generationPromptContract.publicAudienceInstruction}

社工版只有在 Kevin 明確指定時才套用：
${data.generationPromptContract.socialWorkAudienceInstruction}

生成前自問：

${Object.entries(data.gateToGenerationMoves)
  .map(([gateId, move]) => `- ${gateId}：${move.generationQuestion} ${move.promptInstruction}`)
  .join("\n")}

若文章無法回扣家庭經濟、無法維持一般民眾讀者角度，或任何 fatal gate 無法在規劃階段被滿足，請不要硬寫正文，改為輸出「需要補資料或換題」的原因。
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
