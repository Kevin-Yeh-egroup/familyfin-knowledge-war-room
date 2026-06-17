const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const sources = [
  {
    id: "2026-06-17-gap-two-article-pack",
    sourcePath: "reports/2026-06-17-gap-two-article-pack.md",
    type: "兩篇試產文章包",
    title: "低頻缺口題：健保欠費與保單借款",
    summary:
      "依 Kevin 指正，修正選題邏輯為先盤點知識庫低頻主題；本輪選出健保欠費與保單借款/解約金兩個0命中主題，查核台灣官方資料後生成一般民眾純文字試產稿。",
    highlights: [
      "不沿用前一輪被資遣與房租現金流兩題。",
      "健保欠費題把就醫權、欠費分期、30天生活費與求助窗口分開。",
      "保單借款題把急用錢、利息、保單效力、理賠扣除與解約後保障缺口分開。"
    ]
  },
  {
    id: "2026-06-17-structured-two-article-pack",
    sourcePath: "reports/2026-06-17-structured-two-article-pack.md",
    type: "兩篇試產文章包",
    title: "退件意見轉成結構化文章流程",
    summary:
      "依 Kevin 提供的兩則退件建議與文章結構化搜尋結果，先生成 2 篇一般民眾純文字試產稿：一篇改成雙情境對照，一篇保留敘事並加入現金流月曆與三種錢的文字表。",
    highlights: [
      "失業給付房租題不再沿用既有房租篇骨架，改分短期時間差與連續收入斷層。",
      "帳戶有錢仍會慌的題目保留故事感，但加入現金流月曆、三種錢與可用現金計算。",
      "新增結構化規則：開頭先回答讀者問題、中段只用一個主要結構工具、結尾留下下一個家庭檢查。"
    ]
  },
  {
    id: "2026-06-12-writing-form-diversity-learning",
    sourcePath: "reports/2026-06-12-writing-form-diversity-learning.md",
    type: "Agent 生成規則優化",
    title: "文體變奏與成功/駁回學習規則",
    summary:
      "依 Kevin 要求，將每次文章生成前的文體選型、成功投稿結構學習、審核駁回正文與評語對照學習，接入文章包生成器、validator、文章包歷史、文件與 agent workflow。",
    highlights: [
      "新增 `writingFormDiversityReview` 與 prewrite `writingFormDiversityCard`。",
      "12 篇正式文章包分配 12 種不同文體，validator 要求 12 篇至少 8 種。",
      "成功稿只學去識別結構，駁回稿只學失敗原因與修正規則，公開 repo 不保存私有全文或審核原文。"
    ]
  },
  {
    id: "2026-06-11-approved-author-learning-generation-optimization",
    sourcePath: "reports/2026-06-11-approved-author-learning-generation-optimization.md",
    type: "Agent 生成規則優化",
    title: "三張通過稿結構卡正式接入戰情室與文章生成",
    summary: "依 Kevin 要求，將劉泰一、李婉仙、蔡思樂三張通過稿結構卡從學習報告推進到正式生成流程，成為每篇文章必須記錄的 approvedAuthorStructureUse。",
    highlights: [
      "三種結構正式成為生成約束：個案前後差異、制度判斷順序、風險支撐分層。",
      "十篇正式文章包與兩篇試產文章包都會輸出 approvedAuthorStructureUse。",
      "validator 已將三張卡採用紀錄升級為硬性檢查，缺少即不得進核准台。"
    ]
  },
  {
    id: "2026-06-10-approved-author-structure-cards",
    sourcePath: "reports/2026-06-10-approved-author-structure-cards.md",
    type: "通過稿作者學習",
    title: "劉泰一、李婉仙、蔡思樂三位作者完整文章結構卡",
    summary: "依 Kevin 要求，從好理家在文章管理區事件列表出發，只收「客戶-個人等於作者本人、審核成功、可讀完整正文」的通過稿樣本，排除 FB 短文與社群導流，整理成去識別化結構卡。",
    highlights: [
      "劉泰一樣本建立個案翻轉型結構卡：時間線、前後收入差異、家庭決策權與支持系統。",
      "李婉仙樣本建立制度整理型結構卡：稅務資格、期限、數值門檻與家庭規劃順序。",
      "蔡思樂樣本建立專業判讀型結構卡：常見誤判、週轉力來源、風險分層與介入時機。"
    ]
  },
  {
    id: "2026-06-10-improvement-plan-gap-author-learning",
    sourcePath: "reports/2026-06-10-improvement-plan-gap-and-author-learning.md",
    type: "Agent 生成規則優化",
    title: "改善計畫、剩餘缺口與通過稿作者學習規則",
    summary: "依 Kevin 新觀察，將文章必須討論改善計畫、施行效果、剩餘缺口、打平或合理求助路徑升級為產稿前 gate；並修正通過稿作者學習來源，只能使用事件列表中客戶-個人等於作者本人的完整文章，排除 FB 短文與社群導流。",
    highlights: [
      "新增 improvementPlanCard：目前缺口、改善行動、施行效果、剩餘缺口、是否打平、未打平時的求助路徑。",
      "新增 readerLoadCard：單篇文章限制為 1 個主問題、最多 2 個支撐問題、最多 3 個行動與 1 個安全提醒。",
      "後續已補齊三位通過稿作者結構卡，並修正劉泰一可用樣本狀態。"
    ]
  },
  {
    id: "2026-06-10-two-article-trial-pack",
    sourcePath: "reports/2026-06-10-two-article-trial-pack.md",
    type: "兩篇試產文章包",
    title: "退件學習後先生成 2 篇一般民眾試產稿",
    summary: "依 Kevin 要求先不補滿一整批，而是用最新 Agent OS 討論後的新 gate，產出 2 篇一般民眾純文字試產稿，並獨立於正式主包呈現。",
    highlights: [
      "兩篇題目均以台灣官方制度作為證據底盤，避免「假設性議題，缺乏驗證」。",
      "來源與查核資訊保存在 metadata，正文只保留生活數字、日期壓力、前後差異與決策順序。",
      "新增 trialArticlePacks 與前端獨立下拉區，不混入正式主包。"
    ]
  },
  {
    id: "2026-06-10-agent-discussion-trial-pack",
    sourcePath: "reports/2026-06-10-two-article-trial-pack-agent-discussion.md",
    type: "Agent 生成規則優化",
    title: "題目驗證、去 AI 感與財務決策幫助的 6/10 收斂",
    summary: "動用 topic evidence、human copy 與 financial decision 三個 agent，將退件學習轉成 verified topic、source-behind-metadata、reader appeal 與 financial literacy transfer 規格。",
    highlights: [
      "已驗證題目需有台灣現實、家庭財務壓力、決策場景、生活數字與限制條件。",
      "不像 AI 的關鍵是生活現場，不是修飾語；開頭三段內要看到具體家庭壓力。",
      "每篇文章至少讓讀者帶走一個財務判斷能力。"
    ]
  },
  {
    id: "2026-06-09-article-pack-regeneration-after-preprotocol",
    sourcePath: "reports/2026-06-09-article-pack-regeneration-after-preprotocol.md",
    type: "文章包重新生成",
    title: "10 篇文章重新套用前置驗證 protocol",
    summary: "依 Kevin 要求重新更新當時 10 篇一般民眾版文章生成，將 topicEvidenceCard、readerFitCard、financialDecisionCard 與 financialLiteracyTransfer 寫入每篇文章 metadata，並讓 validator 檢查前置 protocol。",
    highlights: [
      "保留當時 10 篇主題，重新輸出純文字文章包與 suggestions metadata。",
      "每篇文章新增題目驗證、讀者吸引力、家庭財務評估與財務知能轉移欄位。",
      "validator 新增 article pack pre-generation protocol 檢查，缺卡或未通過會失敗。"
    ]
  },
  {
    id: "2026-06-09-agent-discussion-topic-verification",
    sourcePath: "reports/2026-06-09-agent-discussion-topic-verification-readability-financial-decision.md",
    type: "Agent 生成規則優化",
    title: "假設性議題先驗證，文章要幫讀者做家庭財務判斷",
    summary: "依 Kevin 對大量駁回的追問，動用多代理視角收斂出生成前 protocol：題目證據、讀者易讀吸引力、財務評估幫助與財務知能轉移。",
    highlights: [
      "新增 topicEvidenceCard：題目不能只靠合理想像，需有台灣資料、制度、新聞、知識庫缺口或駁回訊號支撐。",
      "新增 readerFitCard：前 150 字需有生活矛盾、金錢卡點、時間壓力或家庭選擇困難。",
      "新增 financialDecisionCard 與 financialLiteracyTransfer：文章需協助讀者看現金流、分類支出、比較成本、查證資訊或辨識風險。"
    ]
  },
  {
    id: "2026-06-09-review-rejection-learning",
    sourcePath: "reports/2026-06-09-review-rejection-learning.md",
    type: "審核駁回學習",
    title: "大量駁回回讀與 6/9 文章重生規則",
    summary: "重新讀取 InfoCenter 最新 2086 筆事件，確認審核駁回已增至 350 筆，並將 51 筆完整審核內容與 50 張可交叉學習卡轉成產稿前 gate。",
    highlights: [
      "審核駁回從 290 筆增加到 350 筆，完整審核內容從 20 筆增加到 51 筆。",
      "新增 6/9 規則增量：同題換標題、數字拼湊、處遇建議未盤點、概念文與內部審稿語。",
      "重新生成 2026-06-09 一般民眾純文字文章包，解除舊 3/8 ready card blocker。"
    ]
  },
  {
    id: "2026-06-08-knowledge-base-title-index",
    sourcePath: "reports/2026-06-08-knowledge-base-title-index-log.md",
    type: "知識庫標題索引",
    title: "既有知識庫標題索引接入 validator",
    summary: "新增公開知識庫標題索引，讓 validator 可比對候選文章是否撞到站上既有公開文章標題。",
    highlights: [
      "索引只保存公開 articleId、公開標題與正規化標題，不保存正文或後台資料。",
      "目前索引包含 1323 筆公開知識庫標題。",
      "當時 10 篇候選稿與既有標題為 0 exact match、0 near match、0 warning。"
    ]
  },
  {
    id: "2026-06-08-submission-mechanism-chat-review",
    sourcePath: "reports/2026-06-08-submission-mechanism-chat-review.md",
    type: "投稿檢核機制回查",
    title: "把投稿檢核聊天本體回填到產稿前 gate",
    summary: "回查「檢核投稿機制」聊天本體，將標題新意、內容差異、新讀者價值與案例數字判斷，轉成戰情室產稿前規則。",
    highlights: [
      "相似度分數只是審稿訊號，不等於抄襲判定。",
      "標題是第一提醒點，但正文也要逐篇檢查案例、數字、段落順序與核心建議。",
      "戰情室新增 title novelty、content difference 與 new reader value 產稿前 gate。"
    ]
  },
  {
    id: "2026-06-08-green-review-loop-design",
    sourcePath: "reports/2026-06-08-green-review-loop-design.md",
    type: "純文字文章包綠燈審核迴圈",
    title: "純文字文章包先審綠燈，非綠燈直接回修生成",
    summary: "把 Kevin 的最新要求落地為 `articlePackReviewGate`：每篇文章進工作台前必須先通過一輪生成審核；非綠燈不得送核准，需回到題目、資料、數字、角度、正文或結尾重生。",
    highlights: [
      "每篇文章新增 `articlePackReviewGate.status`、`round`、`reviewers` 與 `revisionMove`。",
      "validator 現在會阻擋非綠燈、缺 reviewer、缺回修規則的文章包。",
      "agent 設計收斂為 pack_review_orchestrator 串接 source、title、content difference、numeric proof、reader appeal、role leak 與 final quality reviewer。"
    ]
  },
  {
    id: "2026-06-08-source-of-truth-reconciliation",
    sourcePath: "reports/2026-06-08-source-of-truth-reconciliation.md",
    type: "Source-of-truth 對帳",
    title: "戰情室正式索引與紀錄來源對帳",
    summary: "整理 repo 內目前可作為戰情室正式索引、週報、文章包與 blocker 判斷的資料來源，避免工作流從不同檔案讀到互相矛盾的狀態。",
    highlights: [
      "`suggestions.json` 是目前 review board 與文章包 metadata 的第一來源。",
      "`article-pack-history.json` 記錄每次純文字文章包產出或 blocked attempt。",
      "`analysis-history.json` 將 reports/logs 轉成公開安全的週報與分析紀錄。"
    ]
  },
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
  "2026-06-08": {
    title: "2026-06-08 至 2026-06-14 週報｜正式索引、投稿檢核、駁回學習與文章重生",
    status: "進行中",
    summary: "本週先把戰情室的正式索引、週報來源與投稿檢核機制回填到產稿前流程，接著重新讀取 6/9 大量審核駁回，將最新 350 筆駁回、51 筆完整審核內容與 50 張可交叉學習卡轉成產稿前 gate，並重生一般民眾純文字文章包。6/10 再依「假設性議題，缺乏驗證」、去 AI 感、讀者吸引力與財務決策幫助，動用 Agent OS 收斂新規格，先產出 2 篇一般民眾試產稿。後續依 Kevin 新觀察，新增改善計畫、施行效果、剩餘缺口、打平或求助路徑 gate，並確認通過稿作者學習不得使用 FB 短文。6/11 已將三張通過稿結構卡正式接入生成器、validator 與戰情室前台。",
    outcomes: [
      "完成劉泰一、李婉仙、蔡思樂三位通過稿作者完整文章結構卡，來源限定為客戶-個人等於作者本人、審核成功、可讀完整正文。",
      "將三張通過稿結構卡轉成 `approvedAuthorStructureUse`，接入十篇正式文章包、兩篇試產文章包、validator 與前台展示。",
      "完成 2026-06-10 改善計畫與剩餘缺口 agent 討論，新增 `improvementPlanCard`、`readerLoadCard` 與 `approvedAuthorStructureCard` 來源邊界。",
      "只讀檢查 InfoCenter 事件列表作者來源：李婉仙與蔡思樂有多筆審核成功事件；劉泰一後續已從 live 事件頁補回可讀完整正文的通過樣本；FB 短文已排除於正式學習樣本之外。",
      "完成 2026-06-10 Agent OS 討論：題目驗證、去 AI 感、讀者吸引力與財務決策幫助。",
      "新增 2026-06-10 兩篇一般民眾試產稿，均以台灣官方制度作為證據底盤，正文超過 2000 字。",
      "新增 `trialArticlePacks` 與前端獨立下拉區，讓試產稿和正式主包分開呈現。",
      "完成 2026-06-09 InfoCenter read-only 回讀：2086 筆事件、350 筆審核駁回、51 筆完整審核內容、50 張可交叉學習卡。",
      "新增 6/9 駁回學習衍生資料、投稿品質 gate、規則增量、日報與日誌。",
      "重新生成 2026-06-09 一般民眾純文字文章包，10 篇皆通過生成綠燈。",
      "新增生成前 protocol：topicEvidenceCard、readerFitCard、financialDecisionCard、financialLiteracyTransfer。",
      "重新更新 10 篇文章生成，將前置 protocol 寫入每篇文章 metadata，並新增 validator 檢查。",
      "完成 source-of-truth 對帳，確認 suggestions、article-pack-history、analysis-history 與 reports/logs 的角色。",
      "回查「檢核投稿機制」聊天本體，將標題新意與內容差異轉成戰情室產稿前 gate。",
      "validator 增加同批標題正規化重複、近似與核心題名包含檢查。",
      "新增公開知識庫標題索引，已接入 1323 筆公開文章標題供 prewrite 比對。",
      "新增純文字文章包 `articlePackReviewGate` 綠燈迴圈；非綠燈直接回修生成，不進 Kevin 核准台。"
    ],
    blockers: [
      "公開戰情室仍只保存去識別衍生資料；私有 raw 駁回內容留在 work-private，不進 repo。",
      "正式投稿前仍需人工確認每篇引用的年度補助、地方規範與最新官方資料。",
      "通過稿結構卡已接入生成流程，但下一輪新文章仍需人工看語感、可投稿感與正文是否真正自然。"
    ],
    nextActions: [
      "先讓 Kevin 看 2 篇試產稿的語感、結尾、數字自然度與可投稿感。",
      "下一輪文章生成前，逐篇補 `improvementPlanCard`：若調整後未打平，必須加入具體求助路徑。",
      "下一輪文章生成時，逐篇確認 `approvedAuthorStructureUse` 是否真的影響正文，而不是只停在 metadata。",
      "若 Kevin 接受這兩篇方向，再用同一套 gate 補後續 8 篇。",
      "下一輪正式產稿前，先重跑 InfoCenter rejection learning，確認 ready cards 是否有新增。",
      "每次重生文章包後，逐篇保存 reviewer verdict trace，缺綠燈就回修題目、數字、角度或正文。",
      "若 Kevin 提供新的退稿理由，直接接到 6/9 gate 的 reinforced rules 與文章重生迴圈。",
      "下一輪產稿逐篇保存三張前置卡與財務知能轉移欄位，確認不是假設性議題，且讀者可帶走一個家庭財務判斷能力。",
      "考慮把投稿審核 skill/agent 候選規格升級為 project-local skill，通過 governance 後再全域化。"
    ]
  },
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
