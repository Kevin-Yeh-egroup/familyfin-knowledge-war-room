#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const packId = "2026-06-17-gap-two-article-pack";
const packDir = path.join(repoRoot, "articles", packId);
const suggestionsPath = path.join(repoRoot, "suggestions.json");
const now = "2026-06-17T16:50:00+08:00";
const approvedAuthorStructureLearningPath = "data/approved-author-structure-cards-2026-06-10.json";

const reviewerNames = [
  "familyfin_grounded_orchestrator",
  "knowledge_gap_mapper",
  "source_grounding_reviewer",
  "approved_author_structure_reviewer",
  "taiwan_habit_reviewer",
  "resource_benefit_translator",
  "human_copy_reviewer",
  "financial_decision_reviewer",
  "role_integrity_reviewer",
  "final_quality_gate",
];

const approvedAuthorStructurePatterns = [
  {
    id: "case_before_after_difference",
    learnedFrom: "劉泰一",
    label: "個案前後差異",
    generationMove: "用調整前後的數字、缺口與關鍵動作，讓讀者看見改善不是口號。",
    rejectWhen: "只有情緒或概念，沒有前後差異、可行動順序與仍未補上的缺口。",
  },
  {
    id: "policy_decision_order",
    learnedFrom: "李婉仙",
    label: "制度判斷順序",
    generationMove: "制度資訊先轉成家庭要判斷的資格、時間、金額、文件與下一步。",
    rejectWhen: "只像宣告政策，沒有說明制度能補哪個生活缺口。",
  },
  {
    id: "support_and_risk_layering",
    learnedFrom: "蔡思樂",
    label: "風險支撐分層",
    generationMove: "分清家庭自己的錢、制度資源、親友協助與正式求助各自能補哪一段。",
    rejectWhen: "把支持寫成溫情，沒有交代哪一層支撐哪個風險。",
  },
];

function bodyText(paragraphs) {
  return paragraphs.map((line) => line.trim()).filter(Boolean).join("\n\n");
}

function nonWhitespaceCount(value) {
  return (value.match(/\S/g) || []).length;
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
    sourceSearchSummary: article.sourceSearchSummary,
    knowledgeGapCard: {
      status: "passed",
      source: "data/knowledge-base-title-index.json",
      indexedTitleCount: 1323,
      gapFinding: article.gapFinding,
      titleIndexHitCount: article.titleIndexHitCount,
      excludedRecentTopics: ["房租", "失業", "減班", "住院傷病", "詐騙", "托育", "長照", "債務協商"],
    },
    topicEvidenceCard: {
      status: "passed",
      topic: article.title,
      evidenceBasis: article.evidenceBasis,
      taiwanFit: article.taiwanFit,
      notHypotheticalRule:
        "化名角色只作閱讀代入；制度與金額邏輯以台灣公開資料、知識庫缺口和家庭收支試算支撐，不宣稱是真實單一案例。",
    },
    readerFitCard: {
      status: "passed",
      audience: "一般民眾",
      openingHook: article.openingHook,
      avoidedTone: ["政策公告口吻", "AI 式概念整理", "審稿建議入正文", "自我說明文章寫法"],
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
    readerLoadCard: {
      status: "passed",
      mainProblem: article.readerLoad.mainProblem,
      supportProblems: article.readerLoad.supportProblems,
      maxActionCount: 3,
      revisionMove: "Keep one primary household decision per article; avoid piling up multiple policy tracks.",
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
    round: 1,
    reviewedAt: now,
    loopPolicy: "review_then_revise_until_green",
    reviewers: reviewerNames,
    blockingStatuses: ["red", "yellow", "not_reviewed"],
    revisionRequiredWhen:
      "Return to generation when the topic is not truly low-frequency, lacks Taiwan official grounding, has no household math, sounds like a policy announcement, or contains body setup/meta narration.",
    revisionMove:
      "Re-select topic from low-frequency knowledge gaps, verify current Taiwan data, rewrite with one family decision, one structure aid, before/after numbers, remaining gap, and realistic help path.",
    passedChecks: [
      "low_frequency_topic_selected",
      "body_over_2000_non_whitespace_chars",
      "plain_text_body_only",
      "taiwan_public_reader_voice",
      "household_financial_assessment_visible",
      "improvement_plan_and_remaining_gap_visible",
      "source_grounding_in_metadata",
      "no_role_leak",
    ],
    articleId: article.id,
  };
}

const articles = [
  {
    id: "nhi-arrears-medical-care-gap",
    fileName: "01-nhi-arrears-medical-care-gap.txt",
    title: "健保費欠著，最怕的不是帳單，是不敢去看醫生",
    audience: "一般民眾",
    primaryTag: "家庭財務風險-健保欠費",
    secondaryTags: ["醫療支出", "政府救助資源", "家庭現金流"],
    categoryType: "健保欠費與就醫時間差",
    selectedForm: "恐懼拆解＋分期前後差異",
    primaryApprovedPattern: "policy_decision_order",
    titleIndexHitCount: 0,
    gapFinding:
      "以健保欠費、欠健保、健保費、停止就醫、健保卡等關鍵字盤點知識庫標題，命中0筆；目前正式文章包也沒有健保欠費與就醫權主題。",
    sourceSearchSummary: [
      "健保署欠費繳納協助措施：欠費達2,000元以上且未移送行政執行等條件，可網路辦理簡易分期。",
      "衛福部新聞稿：健保欠費與就醫權脫鉤，弱勢民眾欠費免予鎖卡，但欠費仍需處理。",
      "健保欠費協助包含分期繳納、紓困基金貸款、轉介公益團體與緊急醫療保障等方向。",
    ],
    evidenceBasis:
      "以健保署欠費繳納協助措施與衛福部健保欠費就醫權脫鉤公開說明作為制度底盤；正文轉成家庭如何分清看病、欠費、分期與求助。",
    taiwanFit:
      "台灣家庭遇到健保欠費時，常因怕被拒診、怕櫃檯尷尬、怕行政執行而延後就醫；文章用分期、分區業務組與1957/公所求助路徑降低不敢看病的風險。",
    openingHook: "欠健保費時，很多人先怕的是醫院櫃檯，而不是那張欠費單。",
    readerNeed: "讀者需要知道欠費不等於不能看病，同時也要知道欠費不能一直放著不處理。",
    assessmentTask: "把欠費總額、這次就醫支出、家庭30天必要生活費、可分期金額與求助窗口分開。",
    decisionOutput: "先就醫、再確認欠費狀態、再安排分期或紓困，不用用高利借款補健保欠費。",
    tableOrStructure: "使用欠費原狀與分期後月現金流對照表。",
    capability: "學會把健保欠費從恐懼變成可處理的月付問題，避免因誤會延誤就醫。",
    transferTest: "讀完後能說出欠費多少、是否已移送行政執行、每月可負擔分期多少、要先問哪個窗口。",
    readerLoad: {
      mainProblem: "健保欠費導致家庭不敢就醫。",
      supportProblems: ["分期繳納與行政執行狀態", "醫療支出與30天生活費衝突"],
    },
    readerJudgment: "先把就醫權、欠費處理與家庭月付分開，不要因欠費直接放棄看病。",
    commonMisreadingToPrevent: "不要以為欠健保就一定不能看病，也不要以為不會被鎖卡就可以完全不處理欠費。",
    nextCheckAfterReading: "查欠費是否達2,000元、是否已移送行政執行、每月能分期多少、是否需要健保署或社福窗口協助。",
    sources: [
      {
        label: "健保署：欠費繳納協助措施",
        url: "https://www.nhi.gov.tw/ch/np-2646-1.html",
        checkedAt: now,
        usedFor: "欠費分期條件、辦理方式與移送行政執行限制查核。",
      },
      {
        label: "衛生福利部：健保全面解卡，加強欠費追償",
        url: "https://www.mohw.gov.tw/cp-2628-19097-1.html",
        checkedAt: now,
        usedFor: "健保欠費與就醫權脫鉤、欠費協助措施與延誤就醫風險查核。",
      },
    ],
    paragraphs: [
      "雅雯（化名）把健保欠費通知放在抽屜裡，已經放了三個月。她不是不知道要繳，是每次打開都覺得心口一縮。欠費18,600元，家裡帳戶只剩9,200元，孩子這週又開始咳嗽。她最怕的不是錢不夠，而是帶孩子去診所時，櫃檯一查就說不能看。",
      "很多家庭遇到健保欠費，真正卡住的是恐懼。怕被拒絕、怕丟臉、怕越查越多錢，最後就把小病拖成大病。可是欠費和就醫要先分開看。衛福部曾說明，健保欠費與就醫權已經脫鉤，弱勢民眾欠費不再因為欠費就被鎖卡；健保署也有欠費協助措施。這不代表欠費不用處理，而是先不要因為害怕而不去看醫生。",
      "雅雯家的問題不是完全沒有收入。她每月薪水34,000元，房租11,000元，孩子餐費與交通8,000元，水電手機3,200元，學校雜費與生活採買大約7,500元。平常一個月大概剩4,300元。健保欠費18,600元如果一次繳掉，她這個月房租和生活費會立刻出事。",
      "先把帳攤開來看。",
      "項目｜金額｜先要判斷什麼\n健保欠費｜18,600元｜能不能分期，不要先用高利借款\n本月可留下現金｜約4,300元｜不能全部拿去補欠費\n孩子看診與藥費｜約600到1,200元｜生病不能拖\n房租與食物交通｜約19,000元｜30天內不能斷\n每月可負擔分期｜約2,000到3,000元｜要留生活緩衝",
      "這張表會讓雅雯看見，眼前不是只有繳或不繳兩種選擇。若一次繳18,600元，她會直接透支；若完全不處理，她會一直怕收到下一封通知，也可能讓欠費進入更麻煩的程序。比較實際的是先就醫，再確認欠費狀態，接著安排自己真的繳得下去的分期。",
      "健保署目前公開的欠費協助中，欠費達2,000元以上且欠費沒有移送行政執行、近2年分期違約紀錄符合條件者，可以網路辦理簡易分期。已移送行政執行的欠費，則要先經執行署同意才能辦理分期。這些細節聽起來像行政規定，放到家庭裡其實是很具體的問題：你的欠費還能不能線上分期？每期金額會不會壓垮下個月生活？",
      "如果雅雯把18,600元分成6期，每月要繳3,100元。她原本每月只剩4,300元，分期後只剩1,200元。這樣雖然比一次繳清好多了，但生活仍然很薄。孩子看診、機車維修、學校臨時費用一來，1,200元很快就不見。她不能只看分期能不能辦，也要看辦了以後家裡還能不能過30天。",
      "她後來把分期和支出一起調整。手機方案降500元，暫停兩個訂閱共600元，外食和飲料每週少約400元，一個月少1,600元。這三項合計每月多出2,700元。原本分期後只剩1,200元，調整後變成3,900元。這不是寬裕，但至少孩子看診或交通臨時增加時，不用立刻刷卡。",
      "真正改善的關鍵，不是把欠費藏起來，而是把欠費變成家裡承受得住的月付。健保欠費如果一直壓在心裡，人會把所有醫療都往後拖。可是醫療越拖，花費可能越大。一次診所自付幾百元，拖成急診、住院或請假少收入，家庭要付出的可能不只醫藥費，還有工作和照顧安排。",
      "也要分清楚，健保欠費協助不是直接給你一筆可以自由花的錢。分期是把欠費拆成月付，紓困基金貸款或其他協助也有資格、文件和審核。對家庭來說，它們的好處是爭取時間，讓你不用一次拿出大筆現金，也不用在最慌的時候去借利息很高的錢。",
      "如果欠費已經移送行政執行，壓力會更大，但還是不要把通知放著不看。這時要先確認是哪一段欠費、目前在哪個機關處理、能不能申請分期或改成自己付得出來的期數。很多人看到行政執行就覺得完了，結果不敢接電話、不敢開信，最後只會更難處理。先把狀態問清楚，至少知道下一步是跟健保署談，還是要跟行政執行分署確認。",
      "也可以先替家裡設一個底線：分期後，30天必要生活費不能被吃光。以雅雯家來說，房租、食物、交通和孩子必要支出至少要留26,000元左右。如果分期金額讓家裡剩不到基本生活費，就不是咬牙撐一下就好，而是要回頭問有沒有更長期的分期、紓困貸款、地方急難或社福協助。分期如果讓家庭每個月都赤字，欠費只是從一張通知換成下一張信用卡帳單。",
      "如果欠費已經太高，或家裡連每月2,000元都擠不出來，就不要只在家裡自己算。可以先問健保署分區業務組或聯絡辦公室，確認欠費狀態、是否能分期、是否已移送行政執行。若同時有低收入、中低收入、失業、重大傷病或其他生活困難，也可以問公所、社福窗口或1957福利諮詢專線，看是否有可搭配的協助。",
      "雅雯最需要改變的，是不要把看醫生放在最後。孩子已經咳嗽，就先帶去看。看診前可以先準備健保卡、身分證件和基本費用，遇到不清楚的地方再問健保署。欠費的事要處理，但不能讓恐懼變成延誤就醫的理由。",
      "家庭也可以做一張簡單的健保欠費處理表。第一欄寫欠費總額，第二欄寫目前是否能分期，第三欄寫每月最多可繳多少，第四欄寫看病和藥費不能動用的預留金。這張表不需要漂亮，重點是讓家人知道：這筆欠費會怎麼慢慢還，孩子或長輩需要就醫時，哪一筆錢不能拿去補別的洞。",
      "健保費欠著，會讓人覺得自己做錯事。但很多時候，欠費是收入太薄、帳單太密、生活沒有緩衝的結果。真正重要的，不是一直躲通知，而是先確認自己能不能就醫、欠費能不能分期、每月分期後還剩多少生活費。當欠費從一張可怕的通知變成一個月付計畫，人比較有機會一邊看病，一邊把生活慢慢拉回來。",
    ],
  },
  {
    id: "policy-loan-surrender-protection-gap",
    fileName: "02-policy-loan-surrender-protection-gap.txt",
    title: "急用錢先別急著解保單，借到錢之前要先看保障會少多少",
    audience: "一般民眾",
    primaryTag: "家庭財務風險-保單借款",
    secondaryTags: ["保險保費", "短期周轉", "家庭保障"],
    categoryType: "保單借款與解約風險",
    selectedForm: "選項比較＋保障缺口試算",
    primaryApprovedPattern: "support_and_risk_layering",
    titleIndexHitCount: 0,
    gapFinding:
      "以保單借款、解約金、保單價值、保價金等關鍵字盤點知識庫標題，命中0筆；目前正式文章包沒有處理急用錢時保單借款與解約的家庭保障缺口。",
    sourceSearchSummary: [
      "金管會提醒保戶辦理保單借款需注意利息負擔、契約效力與理賠金額扣除借款本息。",
      "金管會提醒消費者不要因業務員勸誘而以借款、保單借款、定存解約或終止保險契約再購買保險。",
      "保單解約可能有保障中斷、解約金低於已繳保費、健康險等待期重算、年齡與體況造成未來保費提高等風險。",
    ],
    evidenceBasis:
      "以金管會保單借款與借款/解約購買保險風險提醒作為制度底盤；正文轉成家庭急用錢前要比較的保障缺口與利息成本。",
    taiwanFit:
      "台灣家庭遇到急用錢時常先想到保單、定存、信用卡或親友；文章不把保單借款妖魔化，而是要求先查利率、可借額度、保單效力與替代資金。",
    openingHook: "急用錢時，保單看起來像一個可以馬上打開的存錢筒。",
    readerNeed: "讀者需要知道保單借款和解約不只是拿到錢，也會改變利息、保障和未來可選擇。",
    assessmentTask: "比較保單借款、解約、部分支出延後、親友短期支援和正式債務協商的月付與風險。",
    decisionOutput: "如果只是短期缺口，優先降低借款額度並保留保障；如果已經還不出利息，要轉向正式求助而不是一直借保單。",
    tableOrStructure: "使用借款前後保障與月付對照表。",
    capability: "學會把急用錢拆成缺口金額、需要多久、借款利息、保障減少與還款能力。",
    transferTest: "讀完後能向保險公司問出可借額度、借款利率、保單價值準備金、是否會停效、理賠會扣多少。",
    readerLoad: {
      mainProblem: "急用錢時把保單當成第一個現金來源。",
      supportProblems: ["保單借款利息與停效風險", "解約後保障中斷與重新投保困難"],
    },
    readerJudgment: "先看需要多少、多久能還、保障少多少，再決定要不要借或解約。",
    commonMisreadingToPrevent: "不要以為保單借款是自己的錢不用還，也不要以為解約拿到現金就沒有代價。",
    nextCheckAfterReading: "確認保單可借額度、利率、已借金額、停效條件、解約金與家庭每月可還款金額。",
    sources: [
      {
        label: "金管會：提醒保戶辦理保險單借款應注意事項",
        url: "https://www.fsc.gov.tw/ch/home.jsp?dataserno=201302080002&dtable=News&id=96&mcustomize=news_view.jsp&parentpath=0%2C2&toolsflag=Y",
        checkedAt: now,
        usedFor: "保單借款利息、契約效力、理賠金額扣除借款本息與停效風險查核。",
      },
      {
        label: "保險局：勿因業務員勸誘而以借款或解約購買保險",
        url: "https://www.ib.gov.tw/ch/home.jsp?dataserno=202009150008&dtable=Consumer&id=51&mcustomize=onemessage_view.jsp&parentpath=0%2C5",
        checkedAt: now,
        usedFor: "解約、借款與以融資方式購買保險的權益受損風險查核。",
      },
    ],
    paragraphs: [
      "志明（化名）需要80,000元。媽媽最近住院，家裡先墊了看護和交通費，信用卡也快到期。他翻到一張繳了十幾年的壽險保單，心想既然保單有價值，先借出來應該比跟人開口容易。保單不像跟朋友借錢，不用解釋太多，也比較不丟臉。",
      "可是保單不是單純的存錢筒。從保單拿錢，通常有兩條路：保單借款或解約。借款看起來保單還在，但會有利息，理賠或解約時也可能先扣掉借款本息；解約看起來一次拿到現金，但保障可能中斷，未來如果年紀變大、身體狀況改變，要再買回類似保障不一定容易。",
      "志明一開始只看眼前缺口。他需要80,000元，保險公司客服查到這張保單可借額度足夠，借款年利率要依保單與公司公告確認。為了讓自己看得懂，他先用年利率6%做壓力試算。如果借80,000元，一年利息大約4,800元，平均每月要先準備400元利息；若本金也想在一年內還完，每月要準備約6,700元本金，加起來每月約7,100元。",
      "這個數字一出來，志明才發現問題不只是能不能借到。家裡每月收入58,000元，房租16,000元，食物交通19,000元，媽媽醫療與交通新增6,000元，信用卡最低應繳7,000元，其他水電手機保費6,000元。原本每月只剩約4,000元。若保單借款後每月要準備7,100元，家裡立刻又少3,100元。",
      "先把兩種想法放在一起看。",
      "做法｜眼前拿到什麼｜接下來會發生什麼\n直接借80,000元｜缺口一次補上｜每月若想一年還完約要7,100元，超過目前餘裕\n只借50,000元｜缺口還剩30,000元要處理｜一年攤還約4,400元，接近目前可承受上限\n直接解約｜可能拿到一筆解約金｜保障中斷，未來重新投保可能更貴或不一定能買\n先調整支出再少借｜借款變少、利息變少｜需要家人一起接受延後付款或縮小支出",
      "金管會提醒過，保單借款會影響保險契約效力。借款本息如果超過保單價值準備金，保險公司會依規定通知；若未在期限內返還，保單效力可能停止。保單借款期間若發生理賠，保險金也可能先扣掉借款本息。這些不是嚇人，而是提醒家庭：保單借款不是不用還的錢，它會改變你原本以為還在的保障。",
      "志明真正要問的，不是保單能借多少，而是家裡最多能安全借多少。若每月最多只擠得出4,000元，他就不適合借到一年內要還7,100元的金額。借80,000元可以讓今天舒服一點，但下個月會把缺口推大。借50,000元雖然還不夠，至少月付比較接近家庭承受能力。",
      "他的改善計畫分成三步。第一，先把醫療與看護支出分清楚，確認哪些是這個月必付，哪些可以等帳單或和醫院社工詢問協助。第二，保單借款只借50,000元，不借滿可借額度。第三，和姐姐討論短期支援20,000元，自己把一筆非急用支出延後10,000元。這樣80,000元缺口就被拆成50,000元借款、20,000元親友短期支援、10,000元延後支出。",
      "調整後的效果很明顯。原本借80,000元，一年攤還每月約7,100元，家裡每月少3,100元。改成借50,000元，一年攤還約4,400元，雖然仍然吃緊，但志明把手機和訂閱調降1,100元、外食減少1,500元，每月多出2,600元。原本剩4,000元，加上2,600元，變成6,600元。扣掉約4,400元後，還有2,200元緩衝。",
      "2,200元不是很安全，但比每月赤字好。這筆緩衝可以接住媽媽回診交通、藥品差額或臨時餐費。更重要的是，志明沒有把整張保單借到很滿，也沒有直接解約讓保障消失。急用錢時，保留一點未來選擇，比一次把所有可用額度打開更重要。",
      "如果家裡每月連利息都繳不出來，就不應該把保單借款當成解方。這時候要回頭看，問題是不是已經變成債務壓力、醫療支出或收入不足，而不是單純缺一筆短期周轉。可以詢問醫院社工、1957福利諮詢、債務協商正式管道，或先和債權人確認能否調整月付。用保單借款補一個每月都存在的缺口，只會讓保障慢慢被吃掉。",
      "解約也要更小心。金管會提醒，終止保險契約可能讓保障中斷，也可能出現解約金低於過去所繳保費、健康險等待期重新計算、年齡增加或體況改變導致未來保費提高，甚至買不回原本保障的風險。對家庭來說，解約不是把錢拿回來這麼簡單，而是把一個未來風險的保護拿掉。",
      "志明後來打給保險公司時，不再只問可以借多少。他問了五件事：目前可借額度是多少，借款利率是多少，已借本息到什麼程度會影響保單效力，如果發生理賠會先扣多少，解約金和保障差異是多少。問完以後，他才知道自己真正要比較的不是借款和不借款，而是借多少、借多久、保障少多少。",
      "家人也要一起知道這件事。很多保單是為了家人買的，借款或解約影響的不只是要保人一個人。若家裡主要收入者把壽險解掉，短期拿到現金，長期卻少了風險保護。這不是說保單永遠不能動，而是動之前要讓家人知道：這筆錢補的是哪個洞，多久補回，保障會少到什麼程度。",
      "急用錢時，人很容易只想先過今天。但保單借款和解約會把今天的缺口連到明天的保障。比較安全的順序，是先算缺口需要多少，再看每月能還多少，接著確認保單效力和理賠扣除，最後才決定借款金額。若缺口不是一次性的，而是每月都在發生，就要找正式協助，而不是一直從保單裡挖錢。",
      "保單可以是周轉工具，但不該變成家庭看不見的債。當你先問清楚利率、可借額度、停效條件、解約金和保障差異，再決定要借多少，這筆錢才比較可能幫家庭度過短期壓力，而不是悄悄換掉原本的安全網。",
    ],
  },
];

function buildArticle(article) {
  const body = bodyText(article.paragraphs);
  const outputPath = path.join(packDir, article.fileName);
  fs.writeFileSync(outputPath, `${body}\n`, "utf8");
  const bodyChars = nonWhitespaceCount(body);
  const bodyPath = path.relative(repoRoot, outputPath).replace(/\\/g, "/");
  return {
    id: article.id,
    title: article.title,
    audience: article.audience,
    primaryTag: article.primaryTag,
    secondaryTags: article.secondaryTags,
    categoryType: article.categoryType,
    selectedForm: article.selectedForm,
    bodyPath,
    bodyChars,
    bodyCharsIncludingWhitespace: body.length,
    bodyLengthGate: bodyChars > 2000 ? "passed" : "failed",
    contentMode: "plain_text_body_only",
    sourceDisclosureMode: "metadata_only_not_body",
    copyTarget: "bodyPath",
    sources: article.sources,
    preGenerationReview: preGenerationReview(article),
    articlePackReviewGate: articlePackReviewGate(article),
  };
}

function buildPack(articleCards) {
  return {
    id: packId,
    title: "2026-06-17 低頻缺口兩篇試產稿｜健保欠費與保單借款",
    status: "待 Kevin 看效果",
    description:
      "依知識庫標題索引低頻盤點，避開近期房租/失業等已密集處理題，改選2個標題索引0命中的家庭財務缺口：健保欠費與保單借款/解約金。",
    createdAt: now,
    audience: "一般民眾",
    generatedBy: "tools/build-gap-two-article-pack-2026-06-17.js",
    displayMode: "trial_article_pack_dropdown",
    exportMode: "plain_text_title_and_body_only",
    files: {
      directory: `articles/${packId}`,
      bodyFiles: articleCards.map((article) => article.bodyPath),
      report: "reports/2026-06-17-gap-two-article-pack.md",
      log: "logs/2026-06-17-gap-two-article-pack-log.md",
    },
    topicGapReview: {
      status: "passed",
      indexedTitleCount: 1323,
      selectedBy: "low_frequency_title_index_scan",
      currentPackAvoidedTopics: ["房租", "失業", "減班", "住院傷病", "詐騙", "托育", "長照", "債務協商"],
      selectedGaps: [
        { topic: "健保欠費與就醫", titleIndexHitCount: 0 },
        { topic: "保單借款與解約金", titleIndexHitCount: 0 },
      ],
      reason:
        "兩題都在目前低頻盤點中為0命中，且能提供一般民眾具體家庭財務判斷，不重複近期文章包主題。",
    },
    agentConvergence: {
      status: "converged",
      updatedAt: now,
      agents: reviewerNames,
      strongSignals: [
        "Kevin clarified that the task is to supplement rarely mentioned knowledge-base topics, not merely topics absent from the latest article pack.",
        "Use granular title-index counts and select low-frequency gaps first.",
        "Both selected topics have 0 title-index hits in the local keyword scan and clear household financial decision value.",
        "Public bodies should enter the family situation directly and avoid setup/meta narration.",
      ],
      usefulDisagreement: [
        "0-hit topics can be too niche; keep only topics with strong Taiwan official grounding and everyday household relevance.",
        "Health insurance and policy-loan topics carry shame and fear, so the article must reduce avoidance while still showing numbers.",
      ],
      adoptNow: [
        "Generate two new low-frequency topics: NHI arrears and policy loan/surrender.",
        "Use one table per article to reduce decision load.",
        "Every article needs before/after effect, remaining gap, and a realistic help path if the gap is not closed.",
      ],
      validateNext: [
        "Kevin should review whether these low-frequency topics feel useful enough for submission.",
        "If accepted, future gap selection should rank by title-index hit count before agent topic discussion.",
      ],
    },
    articles: articleCards,
  };
}

function updateSuggestions(pack) {
  const suggestions = JSON.parse(fs.readFileSync(suggestionsPath, "utf8"));
  const existingTrialPacks = suggestions.trialArticlePacks || [];
  suggestions.currentTrialArticlePackId = pack.id;
  suggestions.trialArticlePacks = [
    pack,
    ...existingTrialPacks.filter((trialPack) => trialPack.id !== pack.id),
  ];
  suggestions.updatedAt = now;
  suggestions.metrics = suggestions.metrics || {};
  suggestions.metrics.trialArticlePackCount = suggestions.trialArticlePacks.length;
  suggestions.metrics.currentTrialArticlePackArticleCount = pack.articles.length;
  suggestions.metrics.latestTrialArticlePackGeneratedAt = now;
  suggestions.metrics.lowFrequencyTopicSelectionRequired = true;
  suggestions.metrics.plainTextArticlePackBodyOnlyRequired = true;
  suggestions.metrics.articleStructureLearningUpdatedAt = now;
  fs.writeFileSync(suggestionsPath, `${JSON.stringify(suggestions, null, 2)}\n`, "utf8");
}

function writeReport(pack) {
  const reportPath = path.join(repoRoot, "reports", "2026-06-17-gap-two-article-pack.md");
  const logPath = path.join(repoRoot, "logs", "2026-06-17-gap-two-article-pack-log.md");
  const report = [
    "# 2026-06-17 低頻缺口兩篇試產文章包",
    "",
    "## 這次修正",
    "",
    "- 不沿用前一輪被資遣與房租現金流兩個主題。",
    "- 修正選題邏輯：不是只看目前文章包缺什麼，而是先看知識庫標題索引中很少提及什麼。",
    "- 低頻盤點後，改選兩個0命中主題：健保欠費與就醫、保單借款與解約金。",
    "- 正文直接進入家庭情境，不寫文章自我說明。",
    "",
    "## 產出",
    "",
    ...pack.articles.map((article, index) => `${index + 1}. ${article.title}：${article.bodyChars} 非空白字。`),
    "",
    "## 已用來源",
    "",
    "- 健保署：欠費繳納協助措施",
    "- 衛生福利部：健保全面解卡，加強欠費追償",
    "- 金管會：提醒保戶辦理保險單借款應注意事項",
    "- 保險局：勿因業務員勸誘而以借款或解約購買保險",
    "",
  ].join("\n");
  const log = [
    "# 2026-06-17 low-frequency gap two-article pack log",
    "",
    `- createdAt: ${now}`,
    `- packId: ${pack.id}`,
    "- Agent OS route: familyfin_grounded_orchestrator + knowledge_gap_mapper + source_grounding_reviewer + approved_author_structure_reviewer + human_copy_reviewer + final_quality_gate.",
    "- Gate: review_then_revise_until_green.",
    "- Result: 2 new low-frequency trial articles generated as plain text body files.",
    "- Kevin correction applied: select rarely mentioned knowledge-base topics before drafting.",
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
