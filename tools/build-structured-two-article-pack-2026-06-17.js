#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const packId = "2026-06-17-structured-two-article-pack";
const packDir = path.join(repoRoot, "articles", packId);
const suggestionsPath = path.join(repoRoot, "suggestions.json");
const now = "2026-06-17T15:30:00+08:00";
const editorRejectionLearningAt = "2026-06-17";
const editorRejectionLearningPath = "data/editor-rejection-learning-2026-06-17.json";
const shouldSetAsCurrentTrial = false;
const approvedAuthorStructureLearningPath = "data/approved-author-structure-cards-2026-06-10.json";

const reviewerNames = [
  "familyfin_grounded_orchestrator",
  "source_grounding_reviewer",
  "article_structure_reviewer",
  "taiwan_habit_reviewer",
  "human_copy_reviewer",
  "financial_decision_reviewer",
  "financial_risk_decision_reviewer",
  "role_integrity_reviewer",
  "final_quality_gate",
];

const approvedAuthorStructurePatterns = [
  {
    id: "case_before_after_difference",
    learnedFrom: "劉泰一",
    label: "個案前後差異",
    generationMove:
      "用調整前後的數字、缺口與關鍵動作，讓讀者看見改善不是口號。",
    rejectWhen: "只有情緒或概念，沒有前後差異、可行動順序與仍未補上的缺口。",
  },
  {
    id: "policy_decision_order",
    learnedFrom: "李婉仙",
    label: "制度判斷順序",
    generationMove:
      "制度資訊先轉成家庭要判斷的資格、時間、金額、文件與下一步。",
    rejectWhen: "只像宣告政策，沒有說明制度能補哪個生活缺口。",
  },
  {
    id: "support_and_risk_layering",
    learnedFrom: "蔡思樂",
    label: "風險支撐分層",
    generationMove:
      "分清家庭自己的錢、制度資源、親友協助與正式求助各自能補哪一段。",
    rejectWhen: "把支持寫成溫情，沒有交代哪一層支撐哪個風險。",
  },
];

function text(paragraphs) {
  return paragraphs.map((line) => line.trim()).filter(Boolean).join("\n\n");
}

function nonWhitespaceCount(value) {
  return (value.match(/\S/g) || []).length;
}

function bodyCharsIncludingWhitespace(value) {
  return value.replace(/\s+$/g, "").length;
}

function approvedAuthorStructureUse(primaryPattern) {
  return {
    status: "passed",
    source: approvedAuthorStructureLearningPath,
    reviewedAt: now,
    primaryPattern,
    appliedPatterns: approvedAuthorStructurePatterns,
    generationConstraint:
      "Apply accepted-author structures without copying private text: before/after difference, policy decision order, support/risk layering.",
    publicBodyRule:
      "Body must be plain public-facing Traditional Chinese only; no reviewer language, no SEO/AIO labels, no agent process, no submission notes.",
  };
}

function preGenerationReview(article) {
  return {
    status: "passed_prewrite_protocol",
    reviewedAt: now,
    workflow: "FamilyFin grounded staged workflow",
    sourceSearchSummary: [
      "NN/g: web readers scan; use scannable text, clear headings, concise/objective language.",
      "Taiwan SEO/content-writing sources: article structures need title, intro, body, conclusion, and tables or lists when content has decision steps.",
      "Taiwan official sources: unemployment benefit and 115 rent subsidy facts verified before drafting.",
    ],
    rejectedFeedbackApplied: article.rejectedFeedbackApplied,
    topicEvidenceCard: {
      status: "passed",
      topic: article.title,
      evidenceBasis: article.evidenceBasis,
      taiwanFit: "Uses Taiwan household cashflow, rent timing, public employment service, BLI unemployment benefit, and rent subsidy context.",
      notHypotheticalRule:
        "化名情境只作常見狀況整理；制度與金額邏輯以公開資料與家庭收支試算支撐，不宣稱是真實單一案例。",
    },
    readerFitCard: {
      status: "passed",
      audience: "一般民眾",
      openingHook: article.openingHook,
      avoidedTone: ["政策公告口吻", "AI 式概念整理", "審稿建議入正文", "不合常理的輕鬆建議"],
      readerNeed: article.readerNeed,
    },
    financialDecisionCard: {
      status: "passed",
      assessmentTask: article.assessmentTask,
      decisionOutput: article.decisionOutput,
      tableOrStructure: article.tableOrStructure,
    },
    financialLiteracyTransfer: {
      status: "passed",
      capability: article.capability,
      transferTest: article.transferTest,
    },
    writingFormDiversityCard: {
      status: "passed",
      selectedForm: article.selectedForm,
      variationReason: article.variationReason,
      avoidSamePackFeel:
        "Two articles use different structures: dual-case contrast vs narrative cashflow calendar.",
    },
    readerLoadCard: {
      status: "passed",
      mainProblem: article.readerLoad.mainProblem,
      supportProblems: article.readerLoad.supportProblems,
      maxActionCount: 3,
      revisionMove: "Keep one primary decision per article; use table/list only where it helps the reader choose next step.",
    },
    articleUsefulnessCard: {
      status: "passed",
      readerJudgment: article.readerJudgment,
      commonMisreadingToPrevent: article.commonMisreadingToPrevent,
      nextCheckAfterReading: article.nextCheckAfterReading,
    },
    approvedAuthorStructureUse: approvedAuthorStructureUse(article.primaryApprovedPattern),
  };
}

function articlePackReviewGate(article) {
  return {
    status: "green",
    round: 2,
    reviewedAt: now,
    loopPolicy: "review_then_revise_until_green",
    reviewers: reviewerNames,
    blockingStatuses: ["red", "yellow", "not_reviewed"],
    revisionRequiredWhen:
      "Return to generation when body is abstract, repeats an old rent-article skeleton, lacks structure/table, uses unnatural Taiwan phrasing, or fails to give a household financial decision.",
    revisionMove:
      "Regenerate from structure plan: clarify the reader's question, split the household gap into visible categories, add one table or decision list, and rewrite ending around a concrete next check.",
    passedChecks: [
      "body_over_2000_non_whitespace_chars",
      "plain_text_body_only",
      "taiwan_public_reader_voice",
      "structured_article_flow",
      "cashflow_math_visible",
      "source_grounding_in_metadata",
      "no_role_leak",
    ],
    articleId: article.id,
  };
}

const articles = [
  {
    id: "unemployment-benefit-rent-two-cases",
    fileName: "01-unemployment-benefit-rent-two-cases.txt",
    title: "被資遣後第一個月，房租先到、給付還沒進來，家裡先看哪一種缺口",
    audience: "一般民眾",
    primaryTag: "家庭重大事件-失業與收入中斷",
    secondaryTags: [
      "財務管理與規劃-現金流",
      "政府救助資源-就業保險",
      "租屋與居住成本",
    ],
    categoryType: "收入中斷與房租壓力",
    selectedForm: "雙情境對照＋決策順序",
    variationReason:
      "回應退件意見：與房租篇不同，不再只寫單一租屋壓力，而是把被資遣後的房租問題拆成兩種缺口。",
    primaryApprovedPattern: "policy_decision_order",
    rejectedFeedbackApplied: [
      "避免與房租篇同樣結構。",
      "把兩種案型整理成案例對照：短期時間差與連續收入斷層。",
      "把失業給付、房租、生活費與求助順序結構化。",
    ],
    evidenceBasis:
      "失業給付由勞保局/我的E政府公開資料驗證：非自願離職、向公立就業服務機構辦理求職登記、給付標準按退保前6個月平均月投保薪資60%等規則；租金補貼以國土管理署與行政院資料作背景。",
    openingHook: "被資遣後不是只有少一份薪水，而是房租常常比給付更早到。",
    readerNeed: "讀者需要先分辨自己卡的是幾天的時間差，還是接下來幾個月的收入缺口。",
    assessmentTask: "把本月房租、下一筆收入、可能給付、必要生活費與手上現金放在同一張表，判斷缺口類型。",
    decisionOutput: "分成短期時間差、連續收入斷層、立即求助三條路徑。",
    tableOrStructure: "使用兩種家庭情境對照表與30天必付順序。",
    capability: "學會把失業後的壓力拆成日期、金額、期間與求助入口，不用只靠忍耐或借款補洞。",
    transferTest: "讀完後能說出自己缺的是哪幾天、哪幾筆、缺多久，以及該先問就服還是社福。",
    readerLoad: {
      mainProblem: "被資遣後第一個月的房租與生活費缺口。",
      supportProblems: ["失業給付時間差", "連續收入下降"],
    },
    readerJudgment: "先判斷這個月差幾天，還是接下來幾個月都會差。",
    commonMisreadingToPrevent: "不要以為有失業給付就能直接解決這個月房租，也不要把房租溝通寫得太容易。",
    nextCheckAfterReading: "確認房租要繳的日期、求職登記時間、可用現金與30天必付項目。",
    postSubmissionRejection: {
      status: "editor_rejected",
      recordedAt: editorRejectionLearningAt,
      source: editorRejectionLearningPath,
      editorComment: "個案情境及各種資遣條件不一，缺乏參考價值",
      failureType: "high_variation_topic_case_led_low_reference_value",
      requiredGate: "highVariationTopicReview",
      learning:
        "資遣、失業給付、補助與契約條件高度依個別情況變動；不得以一到兩個化名情境作為主要參考。文章也必須讓讀者判斷自己是哪一種財務風險，並選擇符合台灣現況與家庭限制的解法。",
      futureAction:
        "本篇不建議直接投稿。若重做，改為變數盤點、決策表或求助前檢查工具，只用情境作短示意。",
    },
    sources: [
      {
        label: "我的E政府/勞動部勞工保險局：失業給付申請",
        url: "https://www.gov.tw/News_Content_2_389560",
        checkedAt: now,
        usedFor: "失業給付資格、給付標準與辦理入口查核。",
      },
      {
        label: "內政部國土管理署：115年度中央擴大租金補貼公告",
        url: "https://www.nlma.gov.tw/ch/legislation/law%26regunu/7243",
        checkedAt: now,
        usedFor: "115年度租金補貼申請期間與主管機關查核。",
      },
      {
        label: "衛生福利部：1957福利諮詢專線",
        url: "https://www.mohw.gov.tw/fp-16-21130-1.html",
        checkedAt: now,
        usedFor: "生活困難時的福利諮詢與轉介入口。",
      },
    ],
    paragraphs: [
      "被資遣後最慌的，常常不是聽到消息的那一天，而是下一個繳房租的日子。",
      "俊豪（化名）收到資遣通知時，先想到的不是失業給付可以領多少，而是五號房租。他知道公司會結清薪資，也知道自己可以去問失業給付，但那些都不是今天就會進帳的錢。眼前真正壓著他的，是房租比較早到，下一筆錢比較晚到。",
      "他缺的是五號到十號這幾天。",
      "俊豪在月底被公司資遣，原本月薪42,000元。他租屋每月16,000元，房租固定五號匯，孩子安親和餐費約7,500元，交通與手機3,500元，家裡每月基本生活費大約14,000元。離職當天，他帳戶還有21,000元，看起來不是完全沒有錢，可是五號一到，光房租就會拿走16,000元，剩下5,000元要撐到下一筆錢進來。",
      "俊豪不是整個月都沒有收入來源。公司後續還會結清薪資與資遣費，他也準備到公立就業服務機構辦理求職登記，確認自己是否符合失業給付資格。問題是，這些錢不一定會在五號以前進來。家裡真正要處理的不是半年後怎麼辦，而是五號以前能不能付房租，付完以後還能不能吃飯、通勤、照顧孩子。",
      "把俊豪這個月先排出來會更清楚。\n\n項目｜金額｜日期或用途\n帳戶現金｜21,000元｜離職當天可用\n房租｜16,000元｜五號要匯\n五號到十號生活費｜約3,000元｜交通、孩子餐費、基本採買\n十號可能進來的錢｜最後薪資或結清款｜實際日期要跟公司確認",
      "如果房租準時匯出，俊豪會剩5,000元。五號到十號還要花約3,000元，看起來勉強可以過，可是只要孩子臨時看診、機車要加油、或公司結清日期晚幾天，就可能開始刷卡。俊豪的重點不是先做完整理財計畫，而是避免這五天的時間差變成新債。",
      "他的第一個改善計畫，可以先把房租和五天生活費分開。16,000元房租先留住，另外把五號到十號生活費抓3,000元。接著把非必要訂閱與外食先降2,000元，手機方案下修600元，原本打算十號前買的家庭用品先延後。這樣五號後可動用的錢從5,000元拉到7,600元。它不會讓生活突然寬裕，但可以讓俊豪不用為了買菜和交通立刻刷卡。",
      "俊豪也需要確認公司結清日期，而不是只在心裡等。最後薪資、資遣費和相關文件什麼時候給，最好用文字訊息或書面紀錄確認。若十號進帳只是口頭說法，不能把所有安排都押在那一天。這一點很現實，因為房租是照日期走，薪資結清若晚到，家裡就會被迫自己補時間差。",
      "如果俊豪真的連五號房租都差一點，和房東溝通也不能寫得太輕鬆。很多人有合約壓力，也怕丟臉，更怕說出被資遣後被房東貼標籤。比較實際的做法，是先算清楚差幾天、差多少、哪一天能補上，再決定要不要講。若真的需要延幾天，最好把日期、金額和補上的時間說清楚，並留下文字紀錄。也要先想好如果對方不同意，還有哪些低風險選項。",
      "俊豪這種狀況，最怕的是用一筆不透明的借款去補幾天。因為下個月房租還會再來，信用卡最低應繳也會增加。只要這個缺口原本可以靠日期安排、短期支出暫停和確認公司結清款來處理，就不要急著把它變成新的長期債務。",
      "怡君（化名）的壓力拉得更長。她缺的不是幾天，而是接下來幾個月。",
      "怡君和先生租屋，先生被資遣前家庭月收入約72,000元，其中先生薪水38,000元，怡君薪水34,000元。房租18,500元，孩子托育與餐費13,000元，保險、手機、交通與水電約15,000元，還有一筆信貸每月6,000元。原本每月必要支出約52,500元，家庭還能留下19,500元，看起來還算能安排。",
      "先生被資遣後，短期如果只剩怡君34,000元薪水，家庭固定和必要支出仍接近52,500元，每月立刻少18,500元。這就不是五號到十號撐過去就好，而是下個月、下下個月也可能一直少。怡君如果只看帳戶還有多少，很容易低估壓力，因為真正的問題是家庭收入少了一大段。",
      "失業給付對怡君家有幫助，但不能把它想成這個月房租的答案。依目前公開規定，失業給付大致是按離職退保前6個月平均月投保薪資的60%計算，實際仍要看投保薪資、資格和辦理情形。若先生平均月投保薪資是36,000元，給付約21,600元；核定後，家庭可能從每月少18,500元，變成勉強多出3,100元。可是給付還沒核定前，第一個月的缺口仍然存在。",
      "怡君需要先看三個月，不是只看這個月。",
      "她可以先把三個數字寫出來。第一，給付還沒進來前，每月少18,500元。第二，如果給付核定後約進來21,600元，每月可能多3,100元。第三，家裡只要遇到孩子生病、交通增加、保費扣款或信貸不能延，這3,100元很快就會消失。這樣看，怡君的壓力不是沒有救，而是不能只靠等待。",
      "怡君的改善計畫要從固定支出下手。假設先生給付核定後家庭每月多3,100元，但仍擔心突發支出，她可以先把信貸詢問是否能降月付2,000元，保費扣款方式調整出1,000元，托育與餐費核對後少2,000元。三項合計讓每月多出約8,100元，家庭才比較有能力撐過求職期間。",
      "如果這些調整做不到，或給付未核定前已經少18,500元，怡君就不適合只靠自己硬撐。她要同時問三個方向：先生的就業服務與失業給付進度、信貸或信用卡能否用正式方式調整月付、地方社福或1957福利諮詢專線是否有急難、生活或轉介協助。這不是把責任丟出去，而是在收入真的斷掉時，避免家庭用高風險借款補每個月的缺口。",
      "怡君也要跟家人講清楚，缺口不是情緒問題。可以直接說：給付還沒核定前每月少18,500元，給付核定後可能多3,100元，但還要預留醫療、孩子和交通的突發支出。這樣講，家人比較容易知道需要幫的是哪一段，而不是只聽到她說快撐不住。",
      "兩個家庭的差別，到這裡就清楚了。",
      "類型｜看起來像什麼｜真正要處理什麼｜先看哪個數字\n俊豪這種時間差｜房租比薪水或結清款早到｜先撐過五號到下一筆進帳｜繳房租前可用現金還差多少\n怡君這種收入斷層｜未來幾個月收入變少｜讓每月收支不要持續赤字｜給付進來後是否仍打得平\n已經連房租和餐費都不穩｜不是只差幾天，也不是單靠給付能補｜同步問就服、社福和可調整的固定支出｜未來30天最不能斷的金額是多少",
      "這張表的重點，不是把人分類，而是避免用同一種方法處理所有壓力。俊豪要先確認五號以前能不能避開新債；怡君要確認未來三個月家庭是否每月都會赤字。若只是短期時間差，重點是日期和現金；若是連續收入斷層，重點就是失業給付、求職進度、固定支出調整和求助入口。",
      "被資遣後，不要一開始就逼自己想完整年。先把接下來30天一定要付的錢列出來：房租、食物、孩子費用、交通、必要醫療、已經到期的貸款或帳單。再把接下來30天比較可能進來的錢列出來：最後薪資、資遣費、原本薪水、配偶收入、可確認的親友短期支援。注意，是比較可能進來，不是希望會進來。",
      "制度資源也要放進時間表，不要只放在心裡。失業給付要向公立就業服務機構辦理求職登記，並依規定確認資格與等待期間。租金補貼要看年度公告、居住地、家庭成員與實際租金。這些資源都可能有幫助，但它們比較像接住後面幾個月的壓力，不一定剛好接住這個月五號。",
      "被資遣後的房租問題，不只是問這個月有沒有錢繳。真正要問的是：我缺的是五號到十號這幾天，還是接下來三個月每個月都會少？如果只是幾天，先保住現金和日期；如果是連續缺口，就要把給付、工作、固定支出和求助路徑一起排。當家庭先分清楚缺口類型，才不會把所有壓力都丟給信用卡，也才有機會在失業給付還沒進來前，先把這個月穩住。",
    ],
  },
  {
    id: "rent-payment-cashflow-calendar",
    fileName: "02-rent-payment-cashflow-calendar.txt",
    title: "帳戶還有錢，為什麼繳房租那天還是會慌：先把錢分成三種名字",
    audience: "一般民眾",
    primaryTag: "財務管理與規劃-現金流",
    secondaryTags: [
      "租屋與居住成本",
      "家庭收支盤點",
      "財務韌性與預備金",
    ],
    categoryType: "現金流盤點型",
    selectedForm: "故事開場＋現金流月曆＋三欄表",
    variationReason:
      "回應退件意見：保留敘事感，但用現金流表與三欄分類讓文章更結構化。",
    primaryApprovedPattern: "case_before_after_difference",
    rejectedFeedbackApplied: [
      "保留原本敘事優點。",
      "用現金流觀念解決問題。",
      "加入文字表格輔助說明，避免只有感受描述。",
    ],
    evidenceBasis:
      "115年度中央租金補貼資料以行政院與國土管理署公告查核；文章主軸以家庭現金流盤點呈現，不把補助寫成政策公告。",
    openingHook: "帳戶餘額看起來還有錢，但有些錢其實早就被房租和帳單預約走了。",
    readerNeed: "讀者需要看懂帳戶餘額、已預留支出、真正可用現金三者差異。",
    assessmentTask: "把下一次薪水前的固定扣款、房租與生活費列成日期表，算出真正可動用金額。",
    decisionOutput: "判斷本月是可調整、需延後、需正式求助，或已經不能再用信用卡補洞。",
    tableOrStructure: "使用現金流月曆和三種錢的文字表。",
    capability: "學會用日期和用途看錢，而不是只看帳戶餘額。",
    transferTest: "讀完後能把自己的錢分成看得到、已經有用途、真的能動用三類。",
    readerLoad: {
      mainProblem: "帳戶有餘額卻在繳房租前焦慮。",
      supportProblems: ["固定扣款時間", "生活費預留不足"],
    },
    readerJudgment: "先問下一次收入前，這筆錢已經有哪些用途。",
    commonMisreadingToPrevent: "不要把帳戶餘額當成全部可用錢，也不要把補貼想成馬上能救本月房租。",
    nextCheckAfterReading: "寫出下次薪水前所有會扣款的日期和最低生活費。",
    postSubmissionRejection: {
      status: "editor_rejected",
      recordedAt: editorRejectionLearningAt,
      source: editorRejectionLearningPath,
      editorComment: "真正要做的是結構性盤點財務及現金流",
      failureType: "cashflow_article_not_structural_enough",
      requiredGate: "structuralCashflowReview",
      learning:
        "現金流題不能只寫焦慮、故事或表格；正文要帶讀者完成收入日期、固定支出、扣款日、受保護金額、真正可用現金、缺口類型與下一步，並讓讀者知道這個缺口該用哪一種解法處理。",
      futureAction:
        "本篇不建議直接投稿。若重做，主軸改成結構性家庭財務與現金流盤點，敘事只作入口。",
    },
    sources: [
      {
        label: "行政院：300億元中央擴大租金補貼專案計畫",
        url: "https://www.ey.gov.tw/Page/5A8A0CB5B41DA11E/442e67f9-e22e-42c6-9df2-4d3fa9d10666",
        checkedAt: now,
        usedFor: "中央租金補貼金額與加碼方向查核。",
      },
      {
        label: "內政部國土管理署：115年度中央擴大租金補貼公告",
        url: "https://www.nlma.gov.tw/ch/legislation/law%26regunu/7243",
        checkedAt: now,
        usedFor: "115年度租金補貼申請期間、主管機關與核撥規則查核。",
      },
      {
        label: "NN/g：How Users Read on the Web",
        url: "https://www.nngroup.com/articles/how-users-read-on-the-web/",
        checkedAt: now,
        usedFor: "文章結構化：讀者掃讀、小標、清楚段落與可掃描內容。",
      },
    ],
    paragraphs: [
      "雅婷（化名）最不懂的是，帳戶明明還有38,000元，為什麼一想到繳房租那天，心裡還是會發緊。",
      "雅婷的薪水是每月42,000元，月底入帳。她每月房租18,000元，通常五號匯；信用卡12號扣8,000元；保費15號扣3,200元；水電瓦斯和手機大約2,200元；從五號到月底，食物、交通和孩子雜費至少還要13,000元。帳戶看到38,000元那一刻，她以為還能喘一下。可是把日期排出來，答案就完全不同。",
      "帳戶有錢，不代表那些錢都能用。",
      "很多家庭焦慮的原因，不是完全沒有收入，而是每一筆錢其實都有用途。房租要先放一邊，信用卡要扣，孩子這週要繳費，下一次薪水還要等一段時間。當這些日期全部擠在一起，帳戶餘額就像一個看起來很大的數字，實際上裡面很多錢早就被預訂走了。",
      "先把雅婷這個月的現金流排出來。\n\n日期｜會發生什麼｜金額｜對生活的意思\n5日｜房租要匯｜18,000元｜住的地方不能斷\n10日前｜水電瓦斯和手機｜2,200元｜基本生活和聯絡不能斷\n12日｜信用卡扣款｜8,000元｜若扣款失敗，下一期壓力會變大\n15日｜保費扣款｜3,200元｜不一定能立刻取消，也要確認影響\n5日至月底｜食物、交通、孩子雜費｜至少13,000元｜每天都會發生，不是月底才發生\n30日｜下一次薪水｜42,000元｜真正能補上的時間點在月底",
      "這樣一排，38,000元就不是38,000元。它要先付房租18,000元，再預留信用卡8,000元、保費3,200元、水電手機2,200元，還要留下13,000元撐到月底。合計44,400元。也就是說，帳戶看起來有38,000元，實際上到下一次薪水前還少6,400元。",
      "可以把錢分成三種名字。",
      "第一種，是帳戶看得到的錢。雅婷看到的是38,000元。第二種，是已經有用途的錢，也就是房租、扣款、生活費，合計44,400元。第三種，才是真正能動用的錢。38,000元減掉44,400元，答案是負6,400元。這就是她為什麼會慌。不是她太焦慮，而是帳戶餘額沒有說出日期和用途。",
      "把錢分名字，不是為了讓人更緊張，而是讓壓力有形狀。以前雅婷只知道月底容易不夠，卻不知道缺口在哪裡。現在她看見缺口是6,400元，而且不是零散的小錢造成，而是房租、信用卡、保費和生活費一起擠在薪水前。這時候再責怪自己不會省，幫助很有限；比較有用的是先看哪一筆能調整，哪一筆不能動。",
      "第一步，是把房租和最低生活費先分開。",
      "房租18,000元最好不要和日常帳戶混在一起。因為只要放在同一個帳戶，看到餘額還有錢，就容易在不知不覺中拿去補別的支出。雅婷後來改成薪水一進來就把18,000元轉到固定支出帳戶，日常帳戶只留下當週能用的生活費。這個動作沒有讓收入增加，卻讓她不會到五號才發現房租被其他支出吃掉。",
      "第二步，是把生活費改成週來看。",
      "如果一個月食物、交通和孩子雜費至少13,000元，平均一週約3,250元。雅婷以前是看整個月餘額，心情好時就覺得還好，月底才發現不夠。改成每週抓3,250元後，她比較早發現第二週已經多花1,200元，也比較能在第三週先收住，而不是到月底才刷卡補洞。",
      "第三步，是看扣款日期能不能重新排。",
      "這裡不能寫得太輕鬆，因為不是每一筆都能改。房租有合約，保費有規則，信用卡也有銀行限制，很多人也不想一直打電話求人。但如果扣款全擠在薪水前，仍然值得逐一確認。雅婷後來把一筆保費扣款改到薪水後，信用卡則改成固定提醒自己在12號以前先留錢。這不一定省錢，卻少掉帳戶突然被扣空的驚嚇。",
      "做完三步後，雅婷的數字變得比較清楚。原本到月底前少6,400元。她先把一個每月1,200元的訂閱停掉，手機方案降600元，外食和飲料每週少約700元，一個月約2,800元，再把保費扣款挪到薪水後，這個月房租前後的立即缺口從6,400元降到約1,800元。還是沒有完全消失，但已經從一團慌，變成一個可以處理的數字。",
      "如果仍然少1,800元，接下來才看要不要動用預備金或請家人短期支援。這種短期支援要講清楚日期和金額，不要含糊地說最近比較緊。若每個月都少1,800元，就不能一直靠別人補，而要回頭看房租、貸款、保費、托育或工作收入哪一塊需要重新整理。一次性缺口和每月固定缺口，是兩種不同問題。",
      "租金補貼也可以放進這張表裡，但要放在正確位置。",
      "目前中央租金補貼是依年度公告、家庭條件、地區和實際租金等因素核定，行政院公開資料也列出每戶每月2,000到8,000元及部分加碼方向。對家庭來說，重點不是背補貼金額，而是知道如果核定，每月能少掉哪一段固定壓力。假設雅婷符合條件後每月補貼3,000元，原本每月房租壓力18,000元就相當於降到15,000元。這會讓她下一輪的固定缺口明顯變小。",
      "可是補貼不是這個月五號一定會進來的錢。",
      "所以比較實際的排法，是把補貼放在核定後的月份，不要拿來預付眼前這筆房租。若補貼還沒核定，這個月仍要用手上現金、支出調整、正式協商或可靠求助處理。等補貼真的進帳後，再把它放進固定支出表，看看家庭是否從每月少錢變成至少打平。",
      "如果表格算完是負數，也不要急著用信用卡補。",
      "信用卡補的是今天，增加的是下個月的最低應繳。若短缺在3,000元以內，而且只是這一次，可以先看哪些綠燈支出能暫停，或是否有明確日期能補回。若每月固定少3,000元到8,000元，就要看房租、分期、保費、貸款、家用或收入是否有需要調整的地方。若房租、食物或孩子照顧已經要斷，就應該詢問1957、區公所或地方社會福利窗口，而不是等到扣款失敗才找出口。",
      "這張表也能讓家人比較好溝通。",
      "只說我快不行了，家人可能聽不懂；只說帳戶還有錢，自己又會覺得不該焦慮。把38,000元、44,400元和負6,400元放出來，壓力就不再是情緒，而是可以討論的安排。家人如果要幫，也知道是幫這個月房租前後的1,800元，還是要一起處理每月固定缺口。",
      "繳房租那天會慌，不一定是你不會過日子。很多時候，是帳戶餘額沒有把每筆錢的日期和用途說清楚。下一次看到帳戶還有錢，可以先問三個問題：下一次薪水前，哪些錢已經有用途？房租和扣款後，真正能動用的還剩多少？如果答案是負數，這是一次性缺口，還是每個月都會出現？當錢有了名字，家庭才比較知道該先調哪一筆，也比較不會在房租要繳的那天，才發現自己其實早就不夠了。",
    ],
  },
];

function buildArticle(article) {
  const body = text(article.paragraphs);
  const outputPath = path.join(packDir, article.fileName);
  fs.writeFileSync(outputPath, `${body}\n`, "utf8");
  const bodyChars = nonWhitespaceCount(body);
  const includingWhitespace = bodyCharsIncludingWhitespace(body);
  return {
    id: article.id,
    title: article.title,
    audience: article.audience,
    primaryTag: article.primaryTag,
    secondaryTags: article.secondaryTags,
    categoryType: article.categoryType,
    bodyPath: path.relative(repoRoot, outputPath).replace(/\\/g, "/"),
    bodyChars,
    bodyCharsIncludingWhitespace: includingWhitespace,
    bodyLengthGate: bodyChars > 2000 ? "passed" : "failed",
    contentMode: "plain_text_body_only",
    sourceDisclosureMode: "metadata_only_not_body",
    copyTarget: "bodyPath",
    sources: article.sources,
    postSubmissionRejectionReview: article.postSubmissionRejection || null,
    submitReadyOverride: article.postSubmissionRejection
      ? {
          status: "not_submit_ready",
          reason:
            "Post-submission editor rejection overrides the internal green gate until the article is rewritten and re-gated.",
          source: editorRejectionLearningPath,
          recordedAt: editorRejectionLearningAt,
        }
      : null,
    preGenerationReview: preGenerationReview(article),
    articlePackReviewGate: articlePackReviewGate(article),
    articleUsefulnessReview: {
      status: "passed",
      usefulness: article.readerJudgment,
      structureAid: article.tableOrStructure,
      decisionMemory: article.nextCheckAfterReading,
    },
    deAiReview: {
      status: "passed",
      checks: [
        "no_role_or_editor_language",
        "no_policy_bulletin_tone",
        "uses_taiwan_daily_speech",
        "keeps_reader_decision_visible",
      ],
    },
    structureReview: {
      status: "passed",
      adoptedRules: [
        "opening answers why this matters now",
        "body uses one visible table or decision list",
        "case or story is followed by cashflow math",
        "ending names the next household check",
      ],
    },
  };
}

function buildPack(articleCards) {
  return {
    id: packId,
    title: "2026-06-17 兩篇結構化試產稿｜失業給付房租與繳房租那天的現金流",
    status: "投稿後退件學習，不建議直接投稿",
    description:
      "此包保留為 6/17 投稿後退件學習樣本：現金流題需改為結構性財務與現金流盤點；資遣題因條件高變異，不宜以個案情境作主要參考。",
    createdAt: now,
    audience: "一般民眾",
    generatedBy: "tools/build-structured-two-article-pack-2026-06-17.js",
    displayMode: "trial_article_pack_dropdown",
    exportMode: "plain_text_title_and_body_only",
    files: {
      directory: `articles/${packId}`,
      bodyFiles: articleCards.map((article) => article.bodyPath),
      report: "reports/2026-06-17-structured-two-article-pack.md",
      log: "logs/2026-06-17-structured-two-article-pack-log.md",
    },
    editorRejectionLearning: {
      status: "editor_rejected_after_internal_green",
      recordedAt: editorRejectionLearningAt,
      source: editorRejectionLearningPath,
      submitReady: false,
      packDecision:
        "Retain as rejection-learning evidence. Do not use this pack as a submit-ready article pack unless rewritten and re-gated.",
      derivedGates: [
        "structuralCashflowReview",
        "highVariationTopicReview",
        "financialRiskDecisionReview",
        "postSubmissionOverride",
      ],
    },
    agentConvergence: {
      status: "post_submission_learning_converged",
      updatedAt: now,
      agents: reviewerNames,
      strongSignals: [
        "The cash-flow article did not go far enough: structure must mean a household financial and cash-flow inventory, not just a narrative plus a table.",
        "The severance/unemployment-benefit article has low reference value when led by named cases because conditions vary materially.",
        "Internal green gate must be overridden by later editor rejection learning.",
        "Future drafts should decide whether a topic is better as a checklist, decision table, or tool before forcing it into story article form.",
        "A story or checklist is not enough if the reader cannot judge the financial risk and choose a credible Taiwan-realistic solution.",
      ],
      usefulDisagreement: [
        "Story-led writing can improve readability, but high-variation policy or labor topics need variables and boundaries before story.",
        "Tables help structure, but a table only counts when it lets the reader complete their own inventory or decision.",
      ],
      adoptNow: [
        "Add structuralCashflowReview to rent, bill, salary timing, subsidy timing, and monthly shortfall topics.",
        "Add highVariationTopicReview to severance, unemployment benefit, subsidies, debt, insurance, long-term care, and local-resource topics.",
        "Add financialRiskDecisionReview to all family-finance articles so each draft must map risk signal to household finance consequence and credible solution choice.",
        "Mark this pack as not submit-ready and preserve the failure as a contrast lesson.",
        "Use scenarios as entry points only when variables do not materially change the reader's answer.",
      ],
      validateNext: [
        "A revised cash-flow article must show income timing, fixed commitments, due dates, protected money, usable cash, gap type, and next action.",
        "A revised severance article should become a variable checklist or pre-consultation tool unless fresh official sources and conditions are verified.",
        "Any revised story-led article must show how the story becomes a reusable financial-risk judgment and solution choice.",
      ],
    },
    structureLearning: {
      searchedAt: now,
      adoptedRules: [
        "Use a clear opening that names the reader's practical question.",
        "Use headings, lists, or tables only when they reduce decision load.",
        "Use concise and objective language; avoid promotional or abstract filler.",
        "Put the main answer early, then support with story, numbers, and next-step judgment.",
      ],
      sources: [
        "https://www.nngroup.com/articles/how-users-read-on-the-web/",
        "https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/",
        "https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/tone-of-voice/",
        "https://adbest.com.tw/blog/what-is-seo-article/",
        "https://www.faranie.com/seo-article-structure/",
      ],
    },
    articles: articleCards,
  };
}

function updateSuggestions(pack) {
  const suggestions = JSON.parse(fs.readFileSync(suggestionsPath, "utf8"));
  const existingTrialPacks = suggestions.trialArticlePacks || [];
  if (shouldSetAsCurrentTrial) {
    suggestions.currentTrialArticlePackId = pack.id;
  }
  suggestions.trialArticlePacks = [
    pack,
    ...existingTrialPacks.filter((trialPack) => trialPack.id !== pack.id),
  ];
  suggestions.updatedAt = now;
  suggestions.metrics = suggestions.metrics || {};
  suggestions.metrics.trialArticlePackCount = suggestions.trialArticlePacks.length;
  if (shouldSetAsCurrentTrial) {
    suggestions.metrics.currentTrialArticlePackArticleCount = pack.articles.length;
    suggestions.metrics.latestTrialArticlePackGeneratedAt = now;
  }
  suggestions.metrics.structuredArticleFlowRequired = true;
  suggestions.metrics.plainTextArticlePackBodyOnlyRequired = true;
  suggestions.metrics.editorRejectionLearningUpdatedAt = editorRejectionLearningAt;
  fs.writeFileSync(suggestionsPath, `${JSON.stringify(suggestions, null, 2)}\n`, "utf8");
}

function writeReport(pack) {
  const reportPath = path.join(repoRoot, "reports", "2026-06-17-structured-two-article-pack.md");
  const logPath = path.join(repoRoot, "logs", "2026-06-17-structured-two-article-pack-log.md");
  const report = [
    "# 2026-06-17 兩篇結構化試產文章包",
    "",
    "## 投稿後退件學習",
    "",
    "- `帳戶還有錢，為什麼繳房租那天還是會慌`：總編回饋為「真正要做的是結構性盤點財務及現金流」。這代表故事感與表格不足以通過，文章主軸必須帶讀者完成收入、支出、日期、受保護金額、可用現金與缺口類型盤點。",
    "- `被資遣後第一個月，房租先到、給付還沒進來，家裡先看哪一種缺口`：總編回饋為「個案情境及各種資遣條件不一，缺乏參考價值」。這代表高變異條件題材不能由化名案例承擔主要解法，應改成變數清單、決策表或工具型內容。",
    "",
    "## 新增必查 gate",
    "",
    "- `structuralCashflowReview`：房租、帳單、薪水、補貼、月底缺口題材，必須呈現收入時間、固定承諾、扣款日、受保護金額、真正可用現金、缺口類型與下一步。",
    "- `highVariationTopicReview`：資遣、失業給付、補助、債務、長照、保險、地方資源題材，若資格或條件差異會大幅改變答案，不得以個案情境當主要參考。",
    "- `financialRiskDecisionReview`：文章不能只說故事或列項目，必須協助讀者判斷家庭財務風險、理解風險造成的財務後果，並選擇符合台灣現況且不牽強的解決方法。",
    "- `postSubmissionOverride`：內部生成 gate 通過後若收到總編退件，必須保留退件診斷並把該稿標為不建議直接投稿。",
    "",
    "## 本包處理決定",
    "",
    "- 狀態：投稿後退件學習，不建議直接投稿。",
    "- 現金流篇：若重做，應改為結構性財務與現金流盤點文章或檢查表。",
    "- 資遣篇：若重做，應改為高變異條件變數清單、決策表或求助前盤點工具。",
    "- 正文保留為退件對照樣本；後續生成不得把這兩篇當作成功稿學習。",
    "",
    "## 原始產出",
    "",
    ...pack.articles.map((article, index) => `${index + 1}. ${article.title}：${article.bodyChars} 非空白字，post-submission status=${article.postSubmissionRejectionReview?.status || "none"}。`),
    "",
    "## 已用來源",
    "",
    "- NN/g：How Users Read on the Web",
    "- NN/g：Concise, Scannable, and Objective",
    "- GOV.UK：Tone of voice / clear structure and language",
    "- ADBest / Faranie：SEO article structure and table/list presentation",
    "- `data/editor-rejection-learning-2026-06-17.json`",
    "- 我的E政府/勞動部勞工保險局：失業給付申請",
    "- 內政部國土管理署、行政院：115年度租金補貼資訊",
    "- 衛生福利部：1957福利諮詢專線",
    "",
  ].join("\n");
  const log = [
    "# 2026-06-17 structured two-article pack log",
    "",
    `- createdAt: ${now}`,
    `- packId: ${pack.id}`,
    "- Agent OS route: familyfin_grounded_orchestrator + source_grounding_reviewer + article_structure_reviewer + human_copy_reviewer + final_quality_gate.",
    "- Gate: review_then_revise_until_green.",
    "- Initial result: 2 trial articles generated as plain text body files.",
    "- Post-submission editor result: rejected.",
    "- Rejection learning source: data/editor-rejection-learning-2026-06-17.json.",
    "- Pack status updated: not submit-ready; retained as rejection-learning evidence.",
    "- New gates: structuralCashflowReview, highVariationTopicReview, financialRiskDecisionReview, postSubmissionOverride.",
    "",
  ].join("\n");
  fs.writeFileSync(reportPath, report, "utf8");
  fs.writeFileSync(logPath, log, "utf8");
}

function main() {
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reports"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "logs"), { recursive: true });
  const articleCards = articles.map(buildArticle);
  const pack = buildPack(articleCards);
  updateSuggestions(pack);
  writeReport(pack);
  console.log(
    JSON.stringify(
      {
        status: "ok",
        packId,
        articles: articleCards.map((article) => ({
          id: article.id,
          bodyChars: article.bodyChars,
          path: article.bodyPath,
        })),
      },
      null,
      2,
    ),
  );
}

main();
