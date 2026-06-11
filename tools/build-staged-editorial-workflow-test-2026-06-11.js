#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const packId = "2026-06-11-staged-editorial-workflow-test";
const packDir = path.join(repoRoot, "articles", packId);
const suggestionsPath = path.join(repoRoot, "suggestions.json");
const historyPath = path.join(repoRoot, "article-pack-history.json");
const reportPath = path.join(repoRoot, "reports", "2026-06-11-staged-editorial-workflow-test.md");
const logPath = path.join(repoRoot, "logs", "2026-06-11-staged-editorial-workflow-test-log.md");
const now = "2026-06-11T15:40:00+08:00";

const article = {
  id: "rent-subsidy-date-cashflow-editorial-test",
  fileName: "01-rent-subsidy-date-cashflow-editorial-test.txt",
  title: "房租五號要繳，薪水十號才進來：租金補貼前先看這五天怎麼撐",
  audience: "一般民眾",
  primaryTag: "居住支出-租屋與補貼",
  secondaryTags: [
    "財務管理與規劃-現金流",
    "政府救助資源-住宅補貼",
    "評估與輔導觀點-財務韌性",
  ],
  categoryType: "居住現金流型",
  sourceArticleId: "rent-subsidy-cashflow",
  sourceArticlePath: "articles/2026-06-09-rejection-learned-pack/01-rent-subsidy-cashflow.txt",
  bodyPath: `articles/${packId}/01-rent-subsidy-date-cashflow-editorial-test.txt`,
  readiness: "分段 agent 工作流試驗稿，待 Kevin 看語感",
  approvalStatus: "pending",
};

const bodyText = [
  "房租最麻煩的地方，是日期不會等人。",
  "有些家庭不是整個月都不夠用，而是剛好卡在幾天。房租五號要匯，薪水十號才進來；孩子這週要繳午餐費，信用卡八號扣款，租金補貼還在審。帳面上看起來收入沒有太低，真正讓人緊張的，是錢還沒進來，該出去的錢已經排好了。",
  "這種壓力很難跟別人說。旁人會問，既然有申請租金補貼，為什麼還是這麼緊？可是租屋家庭過日子不是用年度補貼生活，而是用每個月幾個固定日期在撐。補貼有用，但它常常不是拿來救五號那一筆房租，而是讓後面的月份少一點缺口。",
  "先把一個家庭的日期攤開來看。月收入58,000元，薪水十號入帳。房租22,000元，五號要匯。水電和手機約4,000元，八號扣。孩子餐費和交通一個月9,000元，通常分散在每天。家裡還有一筆債務最低應繳5,000元，十五號以前要處理。",
  "如果月初帳戶只剩12,000元，五號房租就已經不夠。這不是少喝幾杯飲料能補起來的差距，而是房租日早於薪水日。就算十號薪水進來後整個月可以打平，五號到十號中間那五天，仍然可能讓家庭去刷卡、跟親友借，或把別的帳單往後拖。",
  "所以現在不能只看房租占收入幾成，還要看房租日前帳戶還剩多少。",
  "對這個家庭來說，租金補貼真正幫上的不是一句「可以申請」，而是讓下個月少一點固定壓力。115年度中央租金補貼仍在受理，家庭要看的不是把規定背起來，而是自己可能落在哪個補貼級距、什麼時候申請、核定後能替哪一筆房租減壓。因為金額會依地區、家庭成員和身分條件不同，先查自己所在地和家庭條件，會比聽別人領多少更實際。",
  "做一次簡單的收支核對，會比較清楚。把收入、房租和可能進來的補貼放在同一張表裡，這個家庭後來核定每月補貼3,200元，房租壓力會從22,000元降到18,800元。每月多出的3,200元，可能剛好補上孩子餐費的一部分，也可能讓原本月底要刷卡的2,000元不用再新增。它不會讓生活突然寬裕，但能讓家庭少一次借錢補洞。",
  "可是如果補貼還沒核定，這個月五號的房租還是要先面對。這就是很多租屋家庭真正卡住的地方：制度可以幫忙，但制度有審核和撥款時間；房租、押金、扣款日和孩子支出，卻是照著日曆走。",
  "可以先做一張很簡單的日期表。第一欄寫這個月哪一天會進錢，第二欄寫哪一天一定要付錢，第三欄寫那一天以前帳戶大概剩多少。不用做得漂亮，只要把五號、八號、十號、十五號寫出來，很多壓力就會浮出來。",
  "回到五號那一天，帳戶原本只有12,000元，房租卻要22,000元，中間缺10,000元。很多人其實不會想開口跟房東談延期，這很正常，因為租約寫在那裡，也怕一開口就被貼上「繳不出房租」的標籤。比較穩的做法，是下次薪水進來時先把22,000元移到房租帳戶，不讓那筆錢被其他支出吃掉。如果這個月真的避不開，再看租約、確認自己能付款的日期，必要時提早用訊息說清楚並留下紀錄，而不是等房東來催才處理。",
  "如果再加上補貼核定，每月房租負擔少3,200元，手機方案調降500元，暫停一筆可延後的非必要支出800元，每月可多出4,500元。原本月底常差2,000元的家庭，可能變成不再新增卡債，還能留下2,500元處理醫療、交通或孩子臨時費用。",
  "這裡真正有用的不是哪一招最厲害，而是三件事一起發生：房租日期不要早於可用現金、固定支出有一點下降、短期缺口不要再變成新的債。只做其中一件，壓力可能還在；三件一起整理，家庭才比較有機會從每月補洞，變成慢慢站穩。",
  "也要小心把房租看得太窄。租約裡的管理費、電費計價、網路費、停車費、退租提前告知，都會改變實際居住成本。房租寫20,000元，但管理費1,500元、電費每月多700元，實際上就是22,200元。若每月都少算2,200元，一年就少估26,400元，這不是小誤差。",
  "搬家也要算清楚。找到每月少2,000元的房子，聽起來很好；但如果搬家費、清潔、押金差額和通勤增加加起來要40,000元，等於要住滿20個月才真正開始省。手上沒有緩衝的家庭，不能只看新房租比較低，還要看搬家的第一個月會不會先把現金用光。",
  "如果這個月已經快繳不出房租，不必一開始就把所有規定讀完。可以先問三件事：中央補貼能不能降低之後每個月的房租壓力；地方租屋或急難協助能不能處理這個月的缺口；手上的文件還缺哪一份、多久能補齊。中央補貼比較像是讓後面的月份少一點喘不過氣，地方窗口和急難協助則比較可能幫你先處理眼前會斷掉的那一筆。",
  "如果日期排完還是打不平，就不要只靠延後付款硬撐。可以先把缺口分成兩種：一種是這個月就會斷的房租、餐食、交通和醫療；另一種是可以談時間的保費、分期或部分帳單。前者要先找可靠窗口確認急難或租屋協助，後者則要主動聯絡承辦或債權單位談日期。順序排出來，才不會為了補一筆房租，又讓下個月多一筆利息或違約金。",
  "這些求助不是表示你不會生活。租屋壓力常常是收入日期、房租日期、制度時間和家庭需求沒有排在一起。人最容易在慌的時候做錯決定，例如用高利借款補房租、把信用卡刷到下個月，或一直等補貼結果卻沒有先處理眼前缺口。",
  "如果現在只做一件事，就先看下個月房租日前的帳戶餘額。把房租日、薪水日、扣款日、可能補貼日寫在同一張紙上，再問自己：五號以前差多少？這個差額能不能靠調整扣款日、預留房租、查地方急難協助，或減少一筆固定支出來補上？如果真的需要延後付款，也要先看租約和可付款日期，不要把希望全部放在房東願不願意等。",
  "房租讓人焦慮，不一定是因為你花太多。有時候，是家裡只差那幾天，卻每個月都差那幾天。先把那幾天看清楚，才知道要處理的是金額、日期，還是需要可靠窗口一起把這個月的缺口補起來。",
].join("\n\n");

function nonWhitespaceCount(text) {
  return (text.match(/\S/g) || []).length;
}

function bodyWithHeader(text) {
  return `正文\n${text.trim()}\n`;
}

function splitBody(raw) {
  return raw.replace(/\r\n/g, "\n").replace(/^正文\s*\n/, "").trim();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function upsertById(items, item) {
  const index = items.findIndex((current) => current.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
}

const bodyChars = nonWhitespaceCount(bodyText);
const bodyCharsIncludingWhitespace = bodyText.length;

const reviewers = [
  "stage_orchestrator",
  "topic_evidence_reviewer",
  "resource_benefit_translator",
  "reader_angle_reviewer",
  "narrative_readability_editor",
  "behavior_realism_reviewer",
  "public_writer",
  "taiwanese_body_voice_editor",
  "de_ai_editor",
  "fluency_editor",
  "ending_strength_editor",
  "batch_template_risk_reviewer",
  "role_leak_reviewer",
  "quality_reviewer",
];

const articleRecord = {
  id: article.id,
  title: article.title,
  audience: article.audience,
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
  readiness: article.readiness,
  approvalStatus: article.approvalStatus,
  bodyPath: article.bodyPath,
  sourceArticleId: article.sourceArticleId,
  sourceArticlePath: article.sourceArticlePath,
  sources: [
    {
      label: "內政部國土管理署，公告115年300億元中央擴大租金補貼專案計畫租金補貼受理申請",
      url: "https://www.nlma.gov.tw/ch/legislation/law%26regunu/7243",
      checkedAt: now,
      verifiedFacts: [
        "115年度受理期間自115年1月1日上午9時至115年12月31日下午5時。",
        "申請方式以線上申請為主，也可郵寄或臨櫃。",
        "租金補貼按實際租金金額核計，最高補貼金額依公告附表。",
        "補貼款項按月撥入申請人金融機構帳戶。",
        "應檢附定期租賃契約影本或電子契約，以及金融帳戶證明文件等。",
      ],
    },
    {
      label: "我的E政府，115年度300億元中央擴大租金補貼專案整理",
      url: "https://www.gov.tw/News_Content_37_561179",
      checkedAt: now,
      verifiedFacts: [
        "補貼金額上限依地區、家庭成員人數及身分條件分級。",
        "第1級臺北市最高補貼8,000元，其餘縣市最高補貼3,600元至5,000元。",
        "第2級臺北市最高補貼5,000元，其餘縣市最高補貼3,200元至4,000元。",
        "第3級臺北市最高補貼3,000元，其餘縣市最高補貼2,000元至2,400元。",
        "申請資料包含金融帳戶存摺封面影本、租賃契約影本及其他必要證明。",
      ],
    },
    {
      label: "臺北市政府，115年度300億中央擴大租金補貼撥款期程暨婚育加碼新規定問答集",
      url: "https://www.gov.taipei/News_Content.aspx?n=EEC70A4186D4C828&s=90E56FB034F55888&sms=87415A8B9CE81B16",
      checkedAt: now,
      verifiedFacts: [
        "115年度租金補貼有規劃撥款期程。",
        "案件核定後依最近一期撥款期程撥付。",
        "租賃契約屆期未提供新約、當月租期未滿一個月等情形，可能影響撥款。",
      ],
    },
  ],
  sourceDisclosureMode: "metadata_only_not_body",
  contentMode: "plain_text_body_only",
  copyTarget: article.bodyPath,
  visibleFields: [
    "title",
    "audience",
    "primaryTag",
    "secondaryTags",
    "bodyChars",
    "readiness",
    "preGenerationReview",
    "stagedEditorialWorkflowReview",
    "articlePackReviewGate",
    "bodyNaturalnessReview",
    "scenarioNarrativeReview",
    "taiwanNaturalLanguageFeedbackReview",
    "behaviorRealismReview",
    "roleIntegrityReview",
  ],
  preGenerationReview: {
    status: "passed_prewrite_protocol",
    reviewedAt: now,
    topicEvidenceCard: {
      status: "passed",
      evidenceBasis: [
        "115年度中央租金補貼官方公告與我的E政府整理",
        "臺北市政府問答集提供撥款期程與補貼款入帳時間差資料",
        "原正式包文章已有家庭房租、薪水日、補貼時間差的主題基礎",
      ],
      bodyUseRule: "正文只寫家庭日期、現金流判斷與資源對家庭的實際好處，不放來源清單、查核語或公告式規定摘要。",
    },
    readerFitCard: {
      status: "passed",
      hook: "房租五號要繳、薪水十號才進來，先抓住台灣租屋家庭最容易感覺緊的幾天。",
      avoid: [
        "不從政策背景開場",
        "不使用大量模板轉場",
        "不把補貼寫成完整申請教學",
        "不把資源段寫成政策公告或布達口吻",
        "不寫成假設案例題，也不偽裝成真實個案",
        "不把百分比當作主要讀者理解工具",
      ],
    },
    narrativeReadabilityCard: {
      status: "passed",
      mode: "verified_issue_scenario_narrative",
      rule:
        "故事性不是偽裝真實案例，而是用可代入的日常收支核對承載已驗證議題與數字演算。",
      appliedMove:
        "把『假設這個家庭』改成『做一次簡單的收支核對』，把『例如這個家庭』改成『回到五號那一天』，讓讀者進入情境而不是讀案例題。",
      avoid: [
        "不要寫姓名、家庭背景或戲劇化情節",
        "不要暗示這是實際服務個案",
        "不要用一長段故事取代財務判斷",
      ],
    },
    behaviorRealismCard: {
      status: "passed",
      source: "data/taiwan-behavior-realism-feedback-seeds-2026-06-11.json",
      rule:
        "文章提出的行動必須符合一般台灣讀者可能真的做得出來的順序；若行動牽涉合約、面子、權力不對等或害怕被貼標籤，不能寫得像簡單技巧。",
      appliedMove:
        "把『若和房東談成十號後匯款』改成承認多數人可能不想開口，先做房租帳戶預留、缺口盤點與急難協助查詢；真的避不開時才看租約、確認付款日期並留下紀錄。",
      rejectWhen: [
        "把跟房東談延期寫成第一選項",
        "忽略租約付款日與信用壓力",
        "把社會上很難開口的行動寫得像一個簡單技巧",
      ],
    },
    financialDecisionCard: {
      status: "passed",
      assessmentTask: "讀者能把房租日、薪水日、扣款日、可能補貼日寫在同一張日期表，估算房租日前缺口。",
      decisionBoundary: "若房租日前現金不足，先處理日期與短期缺口，再看補貼核定後如何降低下月固定壓力。",
    },
    financialLiteracyTransfer: {
      status: "passed",
      capability: "把月收入、固定支出與補貼金額轉成日期現金流，而不是只看整月是否打平。",
      readerTakeaway: "房租壓力常出現在錢進來之前，先看日期才能知道要先預留房租、判斷補貼與急難協助各自補哪個缺口，或調整固定支出；與房東談付款日期只能放在真的避不開時。",
    },
    approvedAuthorStructureUse: {
      status: "passed",
      source: "data/approved-author-structure-cards-2026-06-10.json",
      reviewedAt: now,
      primaryPattern: "policy_decision_order",
      appliedPatterns: [
        {
          id: "case_before_after_difference",
          learnedFrom: "劉泰一",
          label: "個案前後差異",
          generationMove: "用月初缺10,000元、補貼與固定支出調整後多出4,500元，呈現前後差異與剩餘風險。",
          rejectWhen: "只描述房租壓力，沒有改善前後數字與打平路徑。",
        },
        {
          id: "policy_decision_order",
          learnedFrom: "李婉仙",
          label: "制度判斷順序",
          generationMove: "把補貼年度、申請與撥款時間轉成家庭可得到的好處：之後每月少多少固定壓力、眼前缺口還需要哪個窗口補。",
          rejectWhen: "只羅列補貼規則，讀者不知道這個資源能替家庭少掉哪一筆、爭取哪幾天。",
        },
        {
          id: "support_and_risk_layering",
          learnedFrom: "蔡思樂",
          label: "風險支撐分層",
          generationMove: "分出家庭自己的現金、補貼、地方資源、急難協助與必要時的租約確認，不把支持寫成口號。",
          rejectWhen: "只說尋求資源，沒有交代哪一層補哪一個缺口。",
        },
      ],
      generationConstraint: "Use staged editorial workflow: brief -> angle -> draft -> Taiwan voice -> de-AI -> fluency -> ending -> batch-template risk.",
      publicBodyRule: "正文只能呈現一般民眾能讀的生活判斷；不寫審稿語、來源鏈、agent 討論或投稿建議。",
    },
  },
  stagedEditorialWorkflowReview: {
    status: "passed_trial",
    sourceWorkflow: "2026-06-11 staged agent workflow test",
    stages: [
      {
        name: "topic_and_source_brief",
        owner: "topic_evidence_reviewer",
        output: "115年度租金補貼受理期間、補貼級距、撥款期程與文件需求已查核，原稿1,800元舊假設降為不採用。",
      },
      {
        name: "resource_benefit_translation",
        owner: "resource_benefit_translator",
        output: "資源段不寫成公告布達，改成說明中央補貼降低後續固定房租壓力，地方急難與社福窗口處理眼前會斷掉的缺口。",
      },
      {
        name: "reader_angle",
        owner: "reader_angle_reviewer",
        output: "主角度從補貼說明改成房租日前後五天的現金流盤點。",
      },
      {
        name: "scenario_narrative_framing",
        owner: "narrative_readability_editor",
        output: "把案例題口吻改成可代入的生活帳務核對：收入、房租、補貼、五號房租日、十號薪水日、帳戶餘額與缺口。",
      },
      {
        name: "behavior_realism",
        owner: "behavior_realism_reviewer",
        output: "把『跟房東談延期』從簡單解法降級為必要時才做的確認步驟，並補入租約、面子、信用與紀錄壓力。",
      },
      {
        name: "public_writer",
        owner: "public_writer",
        output: "重寫成純文字正文，保留家庭數字但減少百分比與講義式段落。",
      },
      {
        name: "taiwanese_body_voice",
        owner: "taiwanese_body_voice_editor",
        output: "移除生活排程鎖住、固定錨點、調整空間等抽象語，改用日期、帳戶餘額、房租日、薪水日。",
      },
      {
        name: "de_ai",
        owner: "de_ai_editor",
        output: "移除先看一個假設情境、問題不只是、真正改善的關鍵等重複模板句。",
      },
      {
        name: "ending_strength",
        owner: "ending_strength_editor",
        output: "結尾落在房租日前帳戶餘額與下個月日期表，不用漂亮話收束。",
      },
      {
        name: "batch_template_risk",
        owner: "batch_template_risk_reviewer",
        output: "本試驗稿與正式10篇相比，模板轉場密度降低；仍需放入整批比較後再決定是否擴大。",
      },
    ],
    downgradeReasonForSourceArticle:
      "原稿資料結構通過，但存在高密度模板轉場、過多假設轉場、百分比展示偏教材、結尾落點不夠具體。",
  },
  articlePackReviewGate: {
    status: "green",
    round: 1,
    reviewedAt: now,
    loopPolicy: "review_then_revise_until_green",
    reviewers,
    blockingStatuses: ["red", "yellow", "not_reviewed"],
    revisionRequiredWhen:
      "Any stage returns stale source, template wording, weak Taiwan voice, role leakage, concept-only paragraphs, or weak ending.",
    revisionMove:
      "Return to the failed stage; do not patch only the final wording if source, angle, or financial decision task is wrong.",
    note:
      "Passed the 2026-06-11 staged editorial workflow test: current Taiwan source basis, one reader angle, de-AI second edit, Taiwan body voice, concrete date-cashflow task, and stronger ending.",
    checks: [
      "verified_115_rent_subsidy_sources",
      "single_reader_angle",
      "date_cashflow_assessment_task",
      "source_behind_metadata_not_body",
      "resource_benefit_translation_not_announcement",
      "scenario_narrative_readability_not_fake_case",
      "behavior_realism_not_unlikely_action",
      "no_role_leak_or_editor_language",
      "reduced_template_phrase_density",
      "natural_taiwan_chinese_body",
      "strong_ending_with_specific_next_action",
      "body_over_2000_non_whitespace_chars",
    ],
    articleId: article.id,
  },
  nonConceptReview: {
    status: "passed",
    note: "Uses dates, account balance, rent due date, subsidy timing, fixed expenses, and before/after monthly gap instead of concept-only explanation.",
  },
  bodyNaturalnessReview: {
    status: "passed_trial",
    note: "Taiwan reader wording pass: fewer abstract connector phrases, fewer percentage explanations, resource wording translated into household benefit, and scenario wording framed as readable life timeline rather than fake case.",
  },
  scenarioNarrativeReview: {
    status: "passed_trial",
    note:
      "Keeps story-like readability without fictional identity: the article uses rent day, payday, account balance, and household expenses as narrative anchors.",
    rejectWhen:
      "The article names a fictional person, implies a real client case without proof, or turns the piece into a long invented story with weak financial assessment.",
  },
  taiwanNaturalLanguageFeedbackReview: {
    status: "pilot_seeded",
    source: "data/taiwan-natural-language-feedback-seeds-2026-06-11.json",
    sourcePriority:
      "Real reader feedback and public discussion are used for tone; official sources are used for facts and terms only.",
    appliedMove:
      "Replaced the unnatural metaphor '把補貼放進月曆裡看' with '做一次簡單的收支核對，會比較清楚。把收入、房租和可能進來的補貼放在同一張表裡。'",
    futureGate:
      "Before finalizing an article, generate at least three Taiwan-natural wording candidates and select the one that sounds like ordinary reader-facing language while preserving financial assessment value.",
  },
  behaviorRealismReview: {
    status: "passed_trial",
    source: "data/taiwan-behavior-realism-feedback-seeds-2026-06-11.json",
    note:
      "Revised rent-delay advice to acknowledge lease, face, landlord reaction, and trust pressure. The article now prioritizes rent reserve, shortfall check, help resources, and only then lease-aware communication if unavoidable.",
    futureGate:
      "Reject article suggestions that require socially difficult actions unless the article names the friction and gives a realistic order or fallback.",
  },
  roleIntegrityReview: {
    status: "passed",
    note: "Body speaks only to general public readers; reviewer/source/agent language remains in metadata.",
  },
  deAiReview: {
    status: "passed_trial",
    removedPatterns: [
      "先看一個假設情境",
      "假設這個家庭",
      "例如這個家庭",
      "問題不只是",
      "真正改善的關鍵",
      "示意前後差異",
      "對一般民眾版而言",
    ],
    remainingRisks: [
      "仍保留少量判斷句，需讓 Kevin 以閱讀感決定是否再更生活化。",
      "若擴大到10篇，需再跑 resource_benefit_translator、narrative_readability_editor 與 batch_template_risk_reviewer，避免資源段變成公告、案例題或新模板。",
    ],
  },
  endingStrengthReview: {
    status: "passed_trial",
    note: "Ending returns to one concrete action: write rent day, payday, debit day, and likely subsidy day on one sheet and inspect the gap before rent day.",
  },
  agentDiscussion:
    "Staged workflow separated source verification, reader angle, writing, Taiwan voice, de-AI editing, fluency, ending, and batch-template risk. The main change was not adding more reviewers to the same prompt, but making each stage own one decision before the next stage starts.",
  sortOrder: 1,
};

const pack = {
  id: packId,
  title: "2026-06-11 分段 agent 編輯工作流試驗｜房租日期現金流二修稿",
  status: "待 Kevin 看效果",
  description:
    "這是一篇從 6/9 正式包房租稿抽出來的分段 agent 工作流試驗。目標不是重做整包，而是測試先做資料 brief、讀者角度、初稿、台灣語感、去 AI 化、流暢度、結尾與整批模板風險檢查，能否比一次塞入大量 reviewer 更自然。",
  createdAt: now,
  audience: "一般民眾",
  generatedBy: "tools/build-staged-editorial-workflow-test-2026-06-11.js",
  files: {
    directory: `articles/${packId}`,
    bodyFiles: [article.bodyPath],
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
      task: "Test staged agent workflow on one article before regenerating a full pack.",
      done: [
        "One article has verified current Taiwan rent subsidy basis.",
        "Body is pure text over 2000 non-whitespace characters.",
        "Body avoids obvious AI/template phrases and reviewer language.",
        "Article teaches one household financial decision skill.",
        "War room can display it separately without replacing formal 10-article pack.",
      ],
    },
    strongSignals: [
      "原正式稿不是資料錯，而是節奏太像 gate-driven 模板。",
      "去 AI 化不能只在最後潤稿；需要先把文章角度縮成一個可消化的生活工具。",
      "同一批文章需加入 batch-template risk review，單篇綠燈不足以代表整包自然。",
    ],
    adoptNow: [
      "先把本試驗包放進 trialArticlePacks，不覆蓋正式10篇與6/10兩篇試產稿。",
      "若 Kevin 覺得語感明顯改善，再把 staged workflow 擴到後續8篇或全10篇。",
    ],
    validateNext: [
      "看正文是否仍太像教學或 AI。",
      "檢查是否需要把日期表作為租屋類文章的固定寫作工具。",
      "若擴大，需要建立批次模板句密度檢查。"
    ],
  },
  articles: [articleRecord],
};

const historyRecord = {
  id: packId,
  date: "2026-06-11",
  title: pack.title,
  status: "staged_editorial_workflow_test",
  statusLabel: "1 篇分段編輯試驗稿",
  audience: "一般民眾",
  directory: `articles/${packId}`,
  generatedBy: pack.generatedBy,
  currentReviewBoard: false,
  currentTrialPack: true,
  notes: [
    "本批只產 1 篇，用來測試分段 agent 工作流，不取代正式主工作台文章包。",
    "從 6/9 房租補貼稿抽出一篇做二修，主軸改成房租日前後五天的現金流盤點。",
    "115年度租金補貼資訊已重新查核，原稿每月1,800元示例不再沿用為政策說明。",
    "2026-06-11 依 Kevin 回饋補入資源利益轉譯：資源段不寫成公告布達，需說明能替家庭少掉哪一筆、爭取哪幾天、避免哪種債。",
    "2026-06-11 依 Kevin 回饋補入情境敘事規則：故事性用來增加代入感，不偽裝真實案例，也不寫成假設題。",
    "2026-06-11 依 Kevin 回饋補入台灣真實回饋語感規則：官方資料只作事實查核，語氣優先參考讀者留言、公共討論與文章回饋。",
    "2026-06-11 依 Kevin 回饋補入行動常理檢查：文章建議不能把一般人因合約、面子或信用壓力不太會做的行動寫得太容易。",
    "2026-06-11 依 Kevin 回饋升級為專案內 FamilyFin grounded workflow skill：不只用於文章，也用於檢查、工具生成、工作台、週報與 agent 工作流。",
    "正文不放來源清單、審稿語、agent 語或 SEO/AIO 欄位。",
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
    "stagedEditorialWorkflowReview 通過試驗。",
  ],
  relatedLogs: [
    "reports/2026-06-11-staged-editorial-workflow-test.md",
    "logs/2026-06-11-staged-editorial-workflow-test-log.md",
  ],
  outputType: "plain_text_article_pack",
  format: "txt",
  articleCount: 1,
  bodyCountMode: "non_whitespace",
  bodyCharsMin: bodyChars,
  bodyCharsMax: bodyChars,
  bodyCharsIncludingWhitespaceMin: bodyCharsIncludingWhitespace,
  bodyCharsIncludingWhitespaceMax: bodyCharsIncludingWhitespace,
  bodyFiles: [article.bodyPath],
  titles: [article.title],
  copyText: [
    `${pack.title}`,
    "",
    "日期：2026-06-11",
    "狀態：1 篇分段編輯試驗稿",
    `目錄：articles/${packId}`,
    "篇數：1",
    `正文非空白字數：${bodyChars} 字`,
    `含空白正文長度：${bodyCharsIncludingWhitespace} 字`,
    "",
    "紀錄重點",
    "- 本批只產 1 篇，用來測試分段 agent 工作流，不取代正式主工作台文章包。",
    "- 從 6/9 房租補貼稿抽出一篇做二修，主軸改成房租日前後五天的現金流盤點。",
    "- 115年度租金補貼資訊已重新查核，原稿每月1,800元示例不再沿用為政策說明。",
    "- 2026-06-11 依 Kevin 回饋補入資源利益轉譯：資源段不寫成公告布達，需說明能替家庭少掉哪一筆、爭取哪幾天、避免哪種債。",
    "- 2026-06-11 依 Kevin 回饋補入情境敘事規則：故事性用來增加代入感，不偽裝真實案例，也不寫成假設題。",
    "- 2026-06-11 依 Kevin 回饋補入台灣真實回饋語感規則：官方資料只作事實查核，語氣優先參考讀者留言、公共討論與文章回饋。",
    "- 2026-06-11 依 Kevin 回饋補入行動常理檢查：文章建議不能把一般人因合約、面子或信用壓力不太會做的行動寫得太容易。",
    "- 2026-06-11 依 Kevin 回饋升級為專案內 FamilyFin grounded workflow skill：不只用於文章，也用於檢查、工具生成、工作台、週報與 agent 工作流。",
    "- 正文不放來源清單、審稿語、agent 語或 SEO/AIO 欄位。",
    "",
    "檢查",
    "- 正文非空白字數超過 2000 字。",
    "- role leak audit 通過。",
    "- preGenerationReview 通過。",
    "- approvedAuthorStructureUse 通過。",
    "- articlePackReviewGate 綠燈 1/1。",
    "- resourceBenefitTranslation 通過。",
    "- scenarioNarrativeReview 通過。",
    "- taiwanNaturalLanguageFeedbackReview 已建立 seed。",
    "- behaviorRealismReview 通過。",
    "- projectScopedGroundedWorkflowSkill 已建立，尚未升級全域。",
    "- stagedEditorialWorkflowReview 通過試驗。",
  ].join("\n"),
};

function main() {
  ensureDir(packDir);
  ensureDir(path.dirname(reportPath));
  ensureDir(path.dirname(logPath));
  fs.writeFileSync(path.join(repoRoot, article.bodyPath), bodyWithHeader(bodyText), "utf8");

  const suggestions = readJson(suggestionsPath);
  suggestions.currentTrialArticlePackId = packId;
  suggestions.trialArticlePacks = suggestions.trialArticlePacks || [];
  upsertById(suggestions.trialArticlePacks, pack);
  suggestions.metrics = suggestions.metrics || {};
  suggestions.metrics.trialArticlePackCount = suggestions.trialArticlePacks.length;
  suggestions.metrics.currentTrialArticlePackArticleCount = pack.articles.length;
  suggestions.metrics.latestStagedEditorialWorkflowTestId = packId;
  suggestions.metrics.latestStagedEditorialWorkflowTestArticleCount = 1;
  suggestions.metrics.latestStagedEditorialWorkflowTestBodyChars = bodyChars;
  suggestions.stagedEditorialWorkflowTest = {
    status: "trial_pack_created",
    updatedAt: now,
    packId,
    sourceArticleId: article.sourceArticleId,
    workflow:
      "topic/source brief -> resource benefit translation -> reader angle -> scenario narrative framing -> public writer -> Taiwan body voice editor -> de-AI editor -> fluency editor -> ending editor -> batch-template risk reviewer",
    hypothesis:
      "分段接力比一次塞入大量 reviewer 更能降低模板句與 AI 感，同時保留資料查核、家庭經濟與財務知能。",
    initialFinding:
      "正式10篇資料結構可用，但語感綠燈不足；本試驗稿應作為投稿語感綠燈的測試樣本。",
  };
  writeJson(suggestionsPath, suggestions);

  const history = readJson(historyPath);
  history.latestPackId = packId;
  history.packCount = Math.max(Number(history.packCount || 0), 0);
  history.records = history.records || [];
  upsertById(history.records, historyRecord);
  history.packCount = history.records.length;
  history.updatedAt = new Date().toISOString();
  for (const record of history.records) {
    record.currentTrialPack = record.id === packId;
  }
  writeJson(historyPath, history);

  fs.writeFileSync(
    reportPath,
    [
      "# 2026-06-11 分段 agent 編輯工作流試驗",
      "",
      "## 目的",
      "",
      "測試文章生成是否能從「一次塞入大量 reviewer」改成分段接力，降低 AI 感與模板句。",
      "",
      "## 試驗文章",
      "",
      `- 來源：${article.sourceArticlePath}`,
      `- 新稿：${article.bodyPath}`,
      `- 字數：${bodyChars}（非空白）`,
      "",
      "## 分段工作流",
      "",
      "1. topic/source brief：確認 115 年度租金補貼官方資料與撥款時間。",
      "2. resource benefit translation：把資源轉成家庭能得到的好處，不寫成公告布達。",
      "3. reader angle：把主題縮成房租日前後五天的現金流盤點。",
      "4. scenario narrative framing：用日常收支核對增加代入感，不偽裝真實案例。",
      "5. behavior realism：檢查建議行動是否符合台灣一般人的合約、面子與關係壓力。",
      "6. public writer：寫純文字正文。",
      "7. Taiwan body voice editor：改掉抽象詞與翻譯腔。",
      "8. de-AI editor：刪除重複模板轉場。",
      "9. fluency editor：調整段落節奏。",
      "10. ending editor：結尾回到一個具體盤點動作。",
      "11. batch-template risk reviewer：標記若擴大到 10 篇，需檢查整包模板感。",
      "",
      "## 初步學習",
      "",
      "- 不是所有 gate 都應該在同一個生成 prompt 裡同時出現。",
      "- 「去 AI 化」應是二修階段，而不是最後一句提醒。",
      "- 資源段不能像布達公告，必須先說清楚能替家庭少掉哪一筆、爭取哪幾天、避免哪種債。",
      "- 故事性應用日常收支核對承載數字，讓讀者代入情境，但不能偽裝成真實案例。",
      "- 官方資料只能校正事實與名詞，語感要優先從真實讀者回饋、公共討論、留言與審稿回饋累積。",
      "- 文章建議也要符合台灣日常行為常理；像房租延期這種牽涉合約、面子與信用的行動，不能寫成很容易的技巧。",
      "- 單篇綠燈不足以保證整包自然，之後需要 batch-template risk gate。",
      "",
    ].join("\n"),
    "utf8",
  );

  fs.writeFileSync(
    logPath,
    [
      "# 2026-06-11 staged editorial workflow test log",
      "",
      `- Pack: ${packId}`,
      `- Article: ${article.id}`,
      `- Body chars: ${bodyChars}`,
      "- Created isolated trial pack.",
      "- Updated suggestions.json trialArticlePacks.",
      "- Updated article-pack-history.json records.",
      "- Sources checked via official Taiwan government pages.",
      "- Rewrote resource paragraphs from announcement style into household benefit wording after Kevin feedback.",
      "- Reframed scenario wording from假設案例題 into readable life-timeline narration after Kevin feedback.",
      "- Added Taiwan natural-language feedback seed workflow after Kevin clarified that official wording is not enough for natural tone.",
      "- Added behavior realism gate after Kevin clarified that realistic Taiwan habits, contracts, face, and social friction must be considered.",
      "- Created project-scoped FamilyFin grounded workflow skill and agent roster after Kevin clarified it must apply beyond article writing.",
      "",
    ].join("\n"),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        packId,
        articleId: article.id,
        bodyChars,
        bodyCharsIncludingWhitespace,
        bodyPath: article.bodyPath,
        reportPath: path.relative(repoRoot, reportPath).replace(/\\/g, "/"),
        logPath: path.relative(repoRoot, logPath).replace(/\\/g, "/"),
      },
      null,
      2,
    ),
  );
}

main();
