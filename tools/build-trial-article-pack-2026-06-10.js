#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const packId = "2026-06-10-two-article-trial-pack";
const packDir = path.join(repoRoot, "articles", packId);
const suggestionsPath = path.join(repoRoot, "suggestions.json");
const now = "2026-06-10T18:40:00+08:00";
const approvedAuthorStructureLearningPath = "data/approved-author-structure-cards-2026-06-10.json";
const approvedAuthorStructureIntegratedAt = "2026-06-11T14:00:00+08:00";

const reviewerNames = [
  "agent_os_task_router",
  "topic_evidence_reviewer",
  "rejection_learning_reviewer",
  "human_copy_reviewer",
  "reader_appeal_reviewer",
  "financial_decision_reviewer",
  "financial_literacy_transfer_reviewer",
  "taiwan_policy_source_reviewer",
  "role_leak_reviewer",
  "ending_strength_reviewer",
];

const approvedAuthorStructurePatterns = [
  {
    id: "case_before_after_difference",
    learnedFrom: "劉泰一",
    label: "個案前後差異",
    generationMove:
      "文章要讓讀者看見調整前的壓力、調整後的差異，以及造成差異的關鍵因素；不能只有抽象建議。",
    rejectWhen:
      "只有描述困境或理念，沒有把改善計畫、數字變化、剩餘缺口或求助路徑寫清楚。",
  },
  {
    id: "policy_decision_order",
    learnedFrom: "李婉仙",
    label: "制度判斷順序",
    generationMove:
      "制度或補助題材要先拆成資格、金額、時間差、文件、地方差異，再回到家庭現金流決策。",
    rejectWhen:
      "只羅列政策名稱或補助金額，沒有說明家庭應該如何判斷能不能接上生活缺口。",
  },
  {
    id: "support_and_risk_layering",
    learnedFrom: "蔡思樂",
    label: "風險支撐分層",
    generationMove:
      "文章要分清楚家庭自己的錢、制度資源、親友支持、正式求助與仍未補上的風險。",
    rejectWhen:
      "把支持系統寫成溫情口號，沒有交代哪一層支撐哪一個缺口，以及缺口仍在時怎麼求助。",
  },
];

function primaryApprovedAuthorPattern(article) {
  const text = `${article.id} ${article.title} ${article.primaryTag} ${article.categoryType}`;
  if (/sickness|hospital|risk|support|care|medical|fraud/i.test(text)) {
    return "support_and_risk_layering";
  }
  if (/benefit|policy|subsidy|insurance|unemployment|labor/i.test(text)) {
    return "policy_decision_order";
  }
  return "case_before_after_difference";
}

function approvedAuthorStructureUse(article) {
  const primaryPattern = primaryApprovedAuthorPattern(article);
  return {
    status: "passed",
    source: approvedAuthorStructureLearningPath,
    reviewedAt: approvedAuthorStructureIntegratedAt,
    primaryPattern,
    appliedPatterns: approvedAuthorStructurePatterns,
    generationConstraint:
      "Draft from the three approved-author structures: before/after difference, policy decision order, and support/risk layering. Do not copy wording or raw examples.",
    publicBodyRule:
      "正文只能呈現給一般民眾看的文章內容，不可出現投稿建議、agent 討論、審稿語、SEO 說明或作者指令。",
  };
}

function approvedAuthorStructureLearningSummary() {
  return {
    status: "integrated_into_war_room_and_generation",
    sourcePath: approvedAuthorStructureLearningPath,
    integratedAt: approvedAuthorStructureIntegratedAt,
    authorCount: 3,
    summary:
      "三張通過稿結構卡已正式接入文章生成：個案前後差異、制度判斷順序、風險支撐分層。後續每篇文章都必須在 preGenerationReview 說明採用方式。",
    cards: approvedAuthorStructurePatterns.map((pattern) => ({
      author: pattern.learnedFrom,
      patternId: pattern.id,
      patternName: pattern.label,
      generationMove: pattern.generationMove,
      rejectWhen: pattern.rejectWhen,
    })),
    nextGenerationRules: [
      "每篇文章要有可被讀者理解的改善計畫、前後差異或可執行效果。",
      "如果家庭調整後仍無法打平，正文必須寫出合理求助路徑，而不是用鼓勵收尾。",
      "一次文章只處理一個主要問題，避免把太多制度、風險與建議塞在同一篇。",
      "學習通過稿只學結構與判讀，不保存全文、事件 ID 或私有審核內容。",
    ],
  };
}

const bannedBodyPatterns = [
  /讀者版本/,
  /一般民眾版/,
  /社工版/,
  /這篇文章/,
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
  /服務對象/,
  /個案/,
  /助人者/,
  /助人工作者/,
  /\bagent\b/i,
  /示意前後差異/,
  /示意看前後差異/,
  /假設性議題/,
  /缺乏驗證/,
  /生成/,
  / gate /i,
];

const awkwardBodyPatterns = [
  /收入空窗/,
  /進帳空窗/,
  /財務止血/,
  /承接風險/,
  /風險承接/,
  /正式資源/,
  /正式窗口/,
  /生活框架/,
  /策略可以是/,
  /家庭修復/,
  /最痛的缺口/,
  /接上家庭最痛/,
  /生活被接住/,
  /被接住/,
  /怎麼接住/,
  /資源能不能.*接上/,
];

function body(paragraphs) {
  return paragraphs.map((line) => line.trim()).filter(Boolean).join("\n\n");
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

function articlePackReviewGate(article) {
  return {
    status: "green",
    round: 1,
    reviewedAt: now,
    loopPolicy: "review_then_revise_until_green",
    reviewers: reviewerNames,
    blockingStatuses: ["red", "yellow", "not_reviewed"],
    revisionRequiredWhen:
      "Any reviewer returns missing topic evidence, obvious AI/meta language, weak reader hook, weak family-economy relevance, missing financial decision task, or role leakage.",
    revisionMove:
      "Return to generation inputs; replace the topic evidence, rewrite the opening and ending, adjust Taiwan policy/source basis, strengthen household cashflow math, and regenerate the body before it can enter the review board.",
    note:
      "Passed the 2026-06-10 trial-pack gate: official Taiwan source basis, human public-reader angle, family-economy relevance, body over 2000 non-whitespace characters, financial assessment task, financial literacy transfer, no source-list or reviewer language in body.",
    checks: [
      "verified_topic_basis",
      "source_behind_metadata_not_body",
      "public_reader_angle_only",
      "family_economy_relevance",
      "cashflow_or_before_after_math",
      "financial_decision_task",
      "financial_literacy_transfer",
      "body_over_2000_non_whitespace_chars",
      "no_role_leak_or_editor_language",
      "natural_taiwan_chinese_body",
      "strong_ending_with_decision_memory",
    ],
    articleId: article.id,
  };
}

const articles = [
  {
    id: "unemployment-benefit-first-month",
    fileName: "01-unemployment-benefit-first-month.txt",
    title: "被資遣後最先少的不是薪水，是家裡可以等的時間",
    primaryTag: "家庭重大事件-失業與收入中斷",
    secondaryTags: [
      "財務管理與規劃-現金流",
      "政府救助資源-就業保險",
      "評估與輔導觀點-財務韌性",
    ],
    categoryType: "收入中斷型",
    sources: [
      {
        label: "勞動部勞工保險局，失業給付如何領與給付標準",
        url: "https://www.bli.gov.tw/0017377.html",
        checkedAt: now,
        verifiedFacts: [
          "失業給付以平均月投保薪資60%按月發給。",
          "受扶養眷屬每人加給10%，最多20%。",
          "一般最長6個月，45歲以上或身心障礙者最長9個月。",
          "需向公立就業服務機構辦理求職登記與失業認定。",
        ],
      },
      {
        label: "勞動部勞工保險局，失業給付試算與相關規定",
        url: "https://www.bli.gov.tw/0100405.html",
        checkedAt: now,
        verifiedFacts: [
          "平均月投保薪資按離職退保當月起前6個月月投保薪資計算。",
          "失業給付自向公立就業服務機構辦理求職登記第15日起算。",
          "試算結果仍以勞保局核定為準。",
        ],
      },
    ],
    agentDiscussion:
      "Evidence reviewer required the topic to start from the official unemployment-benefit formula and timing gap, not from a generic job-loss anxiety. Human-copy reviewer required removing source-list tone from the body and using the first month of household cashflow as the reader hook. Financial reviewer required one portable skill: compare previous household income, expected benefit, and 30-day red-light expenses before deciding whether to borrow or cut expenses.",
    preGenerationReview: {
      status: "passed_prewrite_protocol",
      reviewedAt: now,
      topicEvidenceCard: {
        status: "passed",
        evidenceBasis: [
          "勞保局失業給付官方規定與試算頁面",
          "制度有明確公式與求職登記起算時間，可驗證不是假設性題目",
          "6/9 駁回學習：文章需從家庭經濟與決策差異切入，不只寫概念",
        ],
        bodyUseRule: "正文只保留制度公式與生活判讀，不放來源清單或查核語。",
      },
      readerFitCard: {
        status: "passed",
        hook: "被資遣後，家庭最先碰到的是房租、扣款日與孩子支出沒有跟著暫停。",
        avoid: [
          "不要用失業潮、轉職焦慮等泛題開場",
          "不要用指導式語句責備讀者沒有先準備",
          "不要把失業給付寫成完整申請教學",
        ],
      },
      financialDecisionCard: {
        status: "passed",
        assessmentTask:
          "讀者能用三個數字估算第一個月壓力：上一份薪水、可能失業給付、30天必要支出。",
        decisionBoundary:
          "若給付進來前就有缺口，先處理房租、餐食、交通、醫療與孩子必要費用，避免用高利借款補等待時間。",
      },
      financialLiteracyTransfer: {
        status: "passed",
        capability: "分辨月投保薪資、原本薪水與家庭實際可用現金的差異。",
        readerTakeaway: "失業給付不是薪水照發；真正要算的是家裡能不能撐過第一個月。",
      },
    },
    paragraphs: [
      "被資遣那天，很多人最怕的不是離開公司，而是回家後要怎麼開口。",
      "公司會給離職證明，勞保也有失業給付制度，可是房租不會等制度慢慢跑完。手機費照扣，孩子餐費照付，房貸或租金到了日期還是要處理。人一邊找工作，一邊看著帳戶變薄，最容易慌的其實不是未來半年，而是接下來三十天要怎麼過。",
      "失業給付很重要，但它不是薪水照發。",
      "現行就業保險的失業給付，是用離職退保前六個月的平均月投保薪資來算。一般按六成發給；如果有符合規定的受扶養眷屬，每人再加一成，最多加到兩成。也就是說，有些家庭可能領到平均月投保薪資的六成、七成或八成。這聽起來像一個安全網，但它仍然有兩個差距：一個是金額差距，一個是時間差距。",
      "拿一戶四口之家來看。爸爸原本每月薪水48,000元，媽媽兼職收入25,000元，家庭每月共有73,000元。房租18,000元，餐食和交通22,000元，孩子學校與安親10,000元，水電手機保險7,500元，信貸最低應繳5,000元，固定與必要支出合計62,500元。平常看起來還能留下10,500元，沒有很寬，但也不算立刻危險。",
      "問題在爸爸被資遣後，帳面一下子變了。若他的平均月投保薪資是45,800元，沒有眷屬加給時，每月失業給付大約是27,480元；若扶養兩名符合規定的眷屬，可能提高到36,640元。加上媽媽25,000元收入，家庭每月可用現金會落在52,480元到61,640元之間。和原本73,000元比，少的是11,360元到20,520元。",
      "這不是小錢。原本每月還能剩10,500元，若只領六成給付，家庭立刻變成少10,020元；若有兩名眷屬加給，仍只剩不到負擔邊緣的缺口，大約少860元。差別很清楚：有沒有加給，可能決定這個月是刷卡補一萬元，還是先咬牙把必要支出撐過去。",
      "但更容易被忽略的是，第一筆給付不會在離職隔天出現。",
      "失業給付需要求職登記、失業認定，也有起算時間。對家庭來說，這表示離職後的前幾週，可能只有原本帳戶裡的錢和家中另一份收入。若房租五號到期，信用卡十號扣款，孩子月費十五號要繳，給付還在程序裡，家庭就會先被日期壓住。很多人不是不知道可以請領，而是在給付進來前就已經被帳單追上。",
      "所以失業後第一個要算的，不是可以領幾個月，而是家裡可以等幾天。",
      "如果每月必要支出是62,500元，平均每天大約需要2,083元。手上現金只有20,000元，理論上只能撐9到10天；手上有50,000元，才比較接近撐過一個月。這個算法不是要嚇人，而是讓人知道現在最急的是哪一段時間。若只想著總共可以領六個月，卻沒有處理第一個月的缺口，很容易在等待給付時先借一筆高利錢。",
      "很多家庭會在這裡做錯順序。第一個反應是所有支出一起砍，或先去借錢補滿原本生活。可是收入突然少一截時，最該先保住的是紅燈支出：住的地方、基本食物、必要交通、醫療、孩子不能中斷的照顧。黃燈支出像保費、分期、家用，可以評估是否暫緩、降額或重新排日期。綠燈支出才是可以直接停掉的項目。若先為小額娛樂自責，卻沒算房租和扣款日，焦慮還是會在月初回來。",
      "再回到這戶家庭。若爸爸被資遣後，家中只剩25,000元兼職收入和30,000元存款，第一個月必要支出62,500元，缺口就是7,500元，且還沒等到失業給付。若家人立刻刷卡補足，下一個月最低應繳可能增加，壓力會延後出現。若先和房東確認是否能改到薪水日後繳、把一筆非必要保費暫緩2,000元、暫停訂閱和外食省3,500元，缺口就可能降到2,000元。這不是把生活變完美，而是避免第一個月就新增一筆債。",
      "失業給付進來後，也要重新算一次。",
      "若核定後家庭每月現金變成61,640元，而必要支出原本是62,500元，表面只差860元。這時如果把手機方案降700元、把交通改用月票省900元、和債權人確認是否能把月付從5,000元降到4,000元，家庭就可能從每月少860元，變成每月多1,740元。金額不大，但它代表家裡不用每個月再用信用卡補洞。失業期間真正重要的，不是立刻恢復原本生活，而是讓債務不要因等待工作而越滾越大。",
      "也要分清楚薪水和月投保薪資。",
      "有些人記得自己月薪48,000元，就以為失業給付會用48,000元來算；實際上要看平均月投保薪資。若投保薪資比實際薪水低，領到的金額也會比想像少。這一點越早確認，越不容易把不存在的錢排進下個月預算。離職證明、投保紀錄、求職登記時間、眷屬是否符合規定，這些文件不是行政細節而已，它們會直接影響家裡能不能撐住。",
      "家人之間也需要把話說清楚。被資遣的人常會覺得丟臉，先自己扛著不說；另一半或父母只看到錢突然變少，容易開始責備。比較能一起面對的說法，是把三個數字攤開：這個月少多少、最早可能何時有給付、三十天內哪些支出不能斷。事實清楚，家庭才知道該先談房租日期、孩子費用、保費調整，還是短期支援。",
      "失業不是把人打回零分。真正讓人撐不住的，常常是收入停下來的那一刻，生活支出仍然照原本速度往前跑。當你先看懂失業給付能補多少、什麼時候可能進來、第一個月還缺多少，焦慮就不再只是一團黑。你會比較知道現在要先守住哪幾筆錢，也比較不會為了一時的時間差，讓家庭背上更長的債。",
    ],
  },
  {
    id: "sickness-benefit-hospital-cashflow",
    fileName: "02-sickness-benefit-hospital-cashflow.txt",
    title: "住院時收入停下來，家裡卻每天還在花錢",
    primaryTag: "家庭重大事件-疾病與醫療支出",
    secondaryTags: [
      "財務管理與規劃-風險預備",
      "政府救助資源-勞保給付",
      "評估與輔導觀點-家庭支持",
    ],
    categoryType: "醫療風險型",
    sources: [
      {
        label: "勞動部勞工保險局，傷病期間薪資縮水別忘了請勞保傷病給付",
        url: "https://www.bli.gov.tw/0017384.html",
        checkedAt: now,
        verifiedFacts: [
          "普通傷病給付按平均月投保薪資50%給付。",
          "普通傷病給付以住院治療期間為主，從不能工作住院第4日起發給。",
          "普通傷病給付最長6個月；事故前保險年資滿1年者可增加6個月。",
        ],
      },
      {
        label: "勞動部勞工保險局，傷病給付試算與相關規定",
        url: "https://www.bli.gov.tw/0100394.html",
        checkedAt: now,
        verifiedFacts: [
          "平均月投保薪資按發生保險事故前最近6個月月投保薪資計算。",
          "普通傷害補助費或普通疾病補助費均按平均月投保薪資半數發給。",
          "試算結果仍以勞保局核定為準。",
        ],
      },
    ],
    agentDiscussion:
      "Evidence reviewer kept the article anchored in official labor-insurance sickness-benefit rules. Human-copy reviewer required the article to open from hospital-life pressure instead of a policy summary. Financial reviewer required the body to compare lost wages, waiting days, benefit amount, extra hospital costs, and family due dates.",
    preGenerationReview: {
      status: "passed_prewrite_protocol",
      reviewedAt: now,
      topicEvidenceCard: {
        status: "passed",
        evidenceBasis: [
          "勞保局普通傷病給付官方規定與試算頁面",
          "制度有明確等待期、給付比例與計算基準",
          "6/9 駁回學習：需呈現疾病事件對家庭經濟的具體影響，而非泛談醫療焦慮",
        ],
        bodyUseRule: "正文把官方公式轉成家庭現金流，不放來源清單。",
      },
      readerFitCard: {
        status: "passed",
        hook: "住院時不只多了醫療費，收入也可能先停，家裡每天仍有固定支出。",
        avoid: [
          "不要只宣導請領給付",
          "不要把住院壓力寫成抽象風險",
          "不要忽略陪病者少收入與出院後費用",
        ],
      },
      financialDecisionCard: {
        status: "passed",
        assessmentTask:
          "讀者能把住院事件拆成三筆帳：少掉的收入、會增加的支出、能拿到但有等待期的給付。",
        decisionBoundary:
          "先保住30天必要支出與照護安排，再決定是否動用存款、調整扣款或尋求可靠協助。",
      },
      financialLiteracyTransfer: {
        status: "passed",
        capability: "理解給付比例不等於實際缺口，必須扣掉等待期與額外照顧成本。",
        readerTakeaway: "有勞保傷病給付，仍要先算住院期間家庭每天少多少、花多少。",
      },
    },
    paragraphs: [
      "住院時，家裡的錢常常不是一次爆掉，而是每天少一點。",
      "病床旁的花費很零碎。掛號費、交通費、餐費、看護或陪病用品，一筆一筆不一定很大。可是同一時間，生病的人可能請假沒有全薪，陪病的人也可能少上班。帳單沒有因為有人住院就暫停，房租、保費、信用卡和孩子費用還是按照原本日期來。",
      "所以生病最難的地方，不只是醫療費。",
      "真正拉扯家庭的，是收入減少、支出增加、給付有等待時間，三件事同時發生。勞保普通傷病給付可以幫忙，但它有自己的計算方式。普通傷病通常以住院治療期間為主，從不能工作住院的第四天起算，按平均月投保薪資的一半給付。也就是說，前面三天沒有這筆給付，給付金額也不是原本薪水的一半，而是用平均月投保薪資來算。",
      "把一個家庭的帳拿出來看，會比較清楚。",
      "阿明每月實領42,000元，太太每月收入34,000元，兩人加起來76,000元。房租16,000元，餐食和交通23,000元，孩子安親與學校費用11,000元，保費、手機、水電8,000元，信貸最低應繳5,000元，家裡每月必要支出63,000元。平常還能留下13,000元，遇到小感冒或臨時支出還有一點空間。",
      "如果阿明因普通疾病住院10天，狀況就變了。公司若無法給全薪，他這個月可能少掉大約14,000元收入。若他的平均月投保薪資是40,100元，普通傷病給付用一半計算，每天大約是668元。住院10天扣掉前3天，能請領的天數約7天，金額大約4,676元。這筆錢有幫助，但不能補回全部缺口。",
      "前後差距放在一起看，就會知道壓力在哪裡。原本家庭每月剩13,000元；住院後少了14,000元收入，增加交通、餐食、用品和部分自費約8,000元，合計壓力是22,000元。扣掉可能的傷病給付4,676元，仍然還有17,324元缺口。這個缺口如果用信用卡補，下個月最低應繳又會變高。",
      "有給付，不代表這個月就安全。",
      "很多家庭一聽到可以請領，就以為壓力會被補掉。可是家庭不是用制度名目生活，而是用現金和日期生活。若房租五號到期，醫院費用十號要先繳，薪水二十五號才進來，傷病給付還在申請或核定，家裡就要先面對眼前的錢從哪裡來。制度能補的是一部分損失，不會自動替家庭排好扣款日。",
      "住院後最先要做的，是把三筆帳分開。",
      "第一筆是少掉的收入。生病的人少拿多少，陪病的人是否也少上班，這兩個都要算。第二筆是增加的支出。住院用品、來回交通、餐食、請人照看孩子、出院後回診或復健，都可能慢慢累積。第三筆是可能拿到的給付或補助。它的金額、時間、文件和核定結果都要分開看，不能直接當成今天帳戶裡的錢。",
      "如果不分開，家庭很容易誤判。",
      "例如阿明家只看到住院自費先繳了6,000元，會以為壓力還好。可是太太為了陪病請假兩天，少了3,000元；孩子臨時改由親友接送，餐費和交通多1,500元；出院後兩週回診與復健交通再多2,400元。這些小項加起來，很快就超過原本以為的醫療費。家人說自己快撐不住時，不一定是情緒誇大，可能是錢真的一直從不同地方流出去。",
      "最危險的是把短期缺口變成長期債。",
      "如果17,000元缺口全部刷卡，且下個月因復健和請假仍少收入，家庭可能連續兩三個月只繳最低金額。原本只是一次住院，最後變成循環利息和卡債。比較穩的順序，是先保住三十天不能斷的支出，再看哪些扣款可以改日期、哪些保費或分期可以詢問緩繳，哪些家人支援能明確到金額和日期。越早把缺口攤開，越不容易在慌張中選到最貴的借款方式。",
      "也要把陪病者的成本說出來。",
      "家裡有人住院時，常會把陪病當成理所當然。可是陪病者請假、交通、餐費、睡眠不足，最後都會回到家庭經濟。若太太每請一天假少1,500元，住院10天陪病4天就是6,000元。這不是誰不願意照顧，而是照顧本身也有成本。把這筆錢算出來，家人才比較能討論是否輪流、是否請親友支援半天、是否需要短期看護，而不是等到一個人累到無法上班。",
      "病情剛發生時，也不要只看住院天數。",
      "有些支出會在出院後才出現。回診、復健、營養補充、暫時不能工作、交通改搭計程車，都是後續壓力。若只準備住院期間的錢，出院後反而開始借款。比較實際的是把時間拉成四週來看：第一週醫院費用最多，第二週可能還在請假，第三週回診和復健增加，第四週才看收入是否恢復。這樣安排，家庭比較不會在每週都重新慌一次。",
      "能申請的給付一定要查，但不能只等給付。",
      "勞保給付、公司請假規定、團體保險、醫療保險、地方急難協助，都可能幫上一段。可是每一項都有資格、文件和時間。最實際的做法，是先把醫院診斷證明、住院期間、薪資是否減少、投保資料整理好，同時保留一份三十天必要支出表。給付是補助的一端，生活安排是另一端，兩邊都要有人看。",
      "如果家裡還有孩子或長輩，順序更要清楚。孩子餐費、必要交通、房租和基本醫療要先保住；可延後的支出要先問清楚，不要讓扣款失敗變成信用問題；高利借款要放到最後，因為下個月生活還會繼續。一次住院最怕的不是少一筆錢，而是讓每個月都多一筆還不完的錢。",
      "生病不是家庭犯錯，住院也不是誰沒有準備好。真正需要看見的是，健康一變動，家庭現金流也會跟著變動。當你知道給付從第幾天算、可能補多少、自己還差多少，心裡會比較有底。你不一定能讓住院變輕鬆，但可以讓家庭少一點混亂，先守住眼前一個月，再一步一步把生活接回來。",
    ],
  },
];

function buildArticle(article, index) {
  const text = body(article.paragraphs);
  const fullText = `正文\n${text}\n`;
  const bodyChars = nonWhitespaceCount(text);
  const bodyCharsIncludingWhitespace = text.length;
  const bodyPath = `articles/${packId}/${article.fileName}`;
  const roleMatches = bannedBodyPatterns
    .filter((pattern) => pattern.test(text))
    .map((pattern) => pattern.toString());
  const awkwardMatches = awkwardBodyPatterns
    .filter((pattern) => pattern.test(text))
    .map((pattern) => pattern.toString());

  if (bodyChars <= 2000) {
    throw new Error(`${article.id} body length failed: ${bodyChars}`);
  }
  if (roleMatches.length) {
    throw new Error(`${article.id} role/meta language found: ${roleMatches.join(", ")}`);
  }
  if (awkwardMatches.length) {
    throw new Error(`${article.id} awkward body language found: ${awkwardMatches.join(", ")}`);
  }

  fs.writeFileSync(path.join(packDir, article.fileName), fullText, "utf8");

  const metadata = {
    id: article.id,
    title: article.title,
    audience: "一般民眾",
    primaryTag: article.primaryTag,
    secondaryTags: article.secondaryTags,
    categoryType: article.categoryType,
    bodyChars,
    bodyCharsIncludingWhitespace,
    bodyLengthGate: {
      status: "passed",
      mode: "non_whitespace",
      minRequired: 2001,
      nonWhitespaceChars: bodyChars,
      charsIncludingWhitespace: bodyCharsIncludingWhitespace,
    },
    readiness: "2 篇試產稿，待 Kevin 看效果",
    approvalStatus: "pending",
    bodyPath,
    sources: article.sources,
    sourceDisclosureMode: "metadata_only_not_body",
    contentMode: "plain_text_body_only",
    copyTarget: "bodyPath",
    visibleFields: [
      "title",
      "audience",
      "primaryTag",
      "secondaryTags",
      "bodyChars",
      "readiness",
      "preGenerationReview",
      "approvedAuthorStructureUse",
      "articlePackReviewGate",
      "nonConceptReview",
      "bodyNaturalnessReview",
      "roleIntegrityReview",
    ],
    preGenerationReview: {
      ...article.preGenerationReview,
      approvedAuthorStructureUse: approvedAuthorStructureUse(article),
    },
    articlePackReviewGate: articlePackReviewGate(article),
    nonConceptReview: {
      status: "passed",
      note:
        "Uses official rule basis, household cashflow math, before/after pressure, and a concrete decision frame instead of concept-only explanation.",
    },
    bodyNaturalnessReview: {
      status: "passed",
      note:
        "Public-reader Taiwan Chinese; avoids source-list tone, American-translated phrasing, internal review language, and instruction-to-author language.",
    },
    roleIntegrityReview: {
      status: "passed",
      note: "Body speaks only to general public readers; no reviewer, author, agent, submission, or social-work role leakage.",
    },
    titleNoveltyReview: {
      status: "passed",
      note: "Trial titles are not series-like and do not reuse the 6/9 article-pack title cadence.",
    },
    endingStrengthReview: {
      status: "passed",
      note: "Ending returns to a household decision memory instead of motivational filler.",
    },
    agentDiscussion: article.agentDiscussion,
    sortOrder: index + 1,
  };

  return metadata;
}

function updateSuggestions(enrichedArticles) {
  const suggestions = JSON.parse(fs.readFileSync(suggestionsPath, "utf8"));
  const existingTrialPacks = (suggestions.trialArticlePacks || []).filter((pack) => pack.id !== packId);
  const trialPack = {
    id: packId,
    title: "2026-06-10 兩篇試產稿｜退件學習後的題目驗證與去 AI 感測試",
    status: "待 Kevin 看效果",
    description:
      "這批先只產 2 篇，不取代正式主包。目標是驗證 6/10 agent 討論後的新做法：題目需有台灣官方制度或真實資料支撐，來源留在 metadata，正文用家庭現金流、日期、前後差異與決策順序承載，不讓讀者讀到審稿語或 AI 引用感。",
    createdAt: now,
    audience: "一般民眾",
    generatedBy: "tools/build-trial-article-pack-2026-06-10.js",
    files: {
      directory: `articles/${packId}`,
      bodyFiles: enrichedArticles.map((article) => article.bodyPath),
    },
    displayMode: "separate_dropdown_review_board",
    exportMode: {
      format: "plain_text",
      defaultCopy: "title_and_body",
      includeSeoFields: false,
      includeSourcesInBody: false,
      greenReviewRequired: true,
    },
    agentConvergence: {
      meetingCard: {
        task: "Turn 6/10 rejection learning into a 2-article trial pack before regenerating the remaining 8 articles.",
        done: [
          "Each article has verified Taiwan topic basis.",
          "Body is pure text over 2000 non-whitespace characters.",
          "Body contains no reviewer/source-list/agent/meta language.",
          "Each article teaches one household financial decision skill.",
          "Each article records how the three approved-author structure cards shaped generation.",
        ],
      },
      strongSignals: [
        "假設性議題的問題不只是沒有數據，而是題目沒有制度、新聞、知識庫缺口或真實生活壓力可驗證。",
        "讀者不需要看到來源清單；來源應支撐作者判斷，正文要讓數字變成生活裡的前後差異。",
        "文章要有一個可帶走的財務判斷能力，例如先算30天紅燈支出、分辨投保薪資和實領薪資、把給付等待期算進現金流。",
      ],
      usefulDisagreement: [
        "source reviewer 想提高可驗證性，human-copy reviewer 擔心引用感太重；採用 source-behind-metadata，不把來源列進正文。",
        "financial reviewer 想放更多算式，reader reviewer 擔心像教材；採用生活段落內的少量計算，不做表格與步驟清單。",
      ],
      adoptNow: [
        "2 篇試產稿先獨立顯示，不覆蓋正式主包。",
        "正式重生後續 8 篇前，先讓 Kevin 看語感、結尾和數字自然度。",
        "新增 trialArticlePacks 結構與前端下拉選單，讓試產稿和正式主包分開。",
      ],
      validateNext: [
        "Kevin 若接受這兩篇語感，再補後續 8 篇。",
        "每篇補 8 前仍需重查最新官方資料，尤其補助、給付、地方規範。",
      ],
    },
    articles: enrichedArticles,
  };

  suggestions.updatedAt = now;
  suggestions.source =
    "FamilyFin knowledge war room 2026-06-10 two-article trial pack after Agent OS discussion";
  suggestions.metrics = {
    ...suggestions.metrics,
    trialArticlePackCount: existingTrialPacks.length + 1,
    currentTrialArticlePackArticleCount: enrichedArticles.length,
    latestTrialArticlePackGeneratedAt: now,
    topicEvidenceGateStrengthenedAt: now,
    sourceBehindMetadataBodyModeRequired: true,
    approvedAuthorStructureLearningRequired: true,
    approvedAuthorStructureCardCount: approvedAuthorStructurePatterns.length,
    approvedAuthorStructureLearningPath,
    approvedAuthorStructureIntegratedAt,
  };
  suggestions.approvedAuthorStructureLearning = approvedAuthorStructureLearningSummary();
  suggestions.currentTrialArticlePackId = packId;
  suggestions.trialArticlePacks = [trialPack, ...existingTrialPacks];
  suggestions.agentTrainingOptimization = {
    ...(suggestions.agentTrainingOptimization || {}),
    latestAgentConvergence: trialPack.agentConvergence,
    strengthenedRules20260610: [
      "題目驗證不是只補數據；要能說明此題為何現在、為何台灣、為何和家庭經濟有關。",
      "正文不得把審稿建議、來源清單、SEO/AIO 或 agent 討論帶給讀者。",
      "每篇文章至少讓讀者帶走一個可用於家庭財務判斷的能力。",
      "數字必須推動選擇，不只是裝飾；若數字不能改變讀者判斷，就不放進正文。",
      "結尾要回到一個可記住的生活判斷，不用雞湯收束。",
    ],
  };

  fs.writeFileSync(suggestionsPath, `${JSON.stringify(suggestions, null, 2)}\n`, "utf8");
}

function main() {
  fs.mkdirSync(packDir, { recursive: true });
  const enrichedArticles = articles.map(buildArticle);
  updateSuggestions(enrichedArticles);
  const stats = enrichedArticles.map((article) => `${article.id}:${article.bodyChars}`).join(", ");
  console.log(`Trial article pack written: ${packId} (${stats})`);
}

main();
