# 2026-06-09 代理討論：議題驗證、易讀吸引力與家庭財務決策

## Discussion purpose

回應「假設性議題，缺乏驗證」與 Kevin 最新要求，將文章生成從「寫完後檢查」再往前移到「開寫前先驗證題目、讀者價值與財務決策幫助」。

## Required decision

是否需要在現有 12 個投稿品質 gate 前新增生成前 protocol，並讓每篇一般民眾版文章先通過：

- 議題驗證
- 易讀與吸引力檢查
- 家庭財務評估幫助
- 財務知能與決策能力檢查

## Selected agent roles

- 總編判讀 reviewer：確認駁回風險與好理家在平台定位。
- 一般民眾讀者 reviewer：檢查前 150 字是否願意讀下去。
- 家庭財務教練 reviewer：檢查文章是否能協助讀者盤點收支、缺口、風險與選項。
- 台灣資料查核 reviewer：檢查題目是否有台灣資料、政策、新聞或實際生活現象支撐。
- 易讀性編輯 reviewer：檢查段落節奏、白空間、標題與句子是否適合網頁閱讀。
- Agent workflow reviewer：把討論收斂成可重複執行的 protocol，而不是把 prompt 越寫越長。

## Evidence used

- 2026-06-09 InfoCenter 駁回衍生統計：350 筆駁回、51 筆完整審核內容、50 張可交叉學習卡。
- CFPB financial well-being 與 financial decision-making guidance：財務教育不只傳授概念，更要幫人比較成本、辨識資訊缺口、做出符合自身情境的選擇。
- OECD financial literacy guidance：財務素養包含知識、行為與態度，目標是讓人把知識用在真實生活決策。
- Digital.gov / Plain Language web writing guidance：網頁讀者常以掃讀尋找答案，內容需短段落、清楚標題、普通用字、快速回應讀者問題。

## Strong signals

1. 假設情境可以使用，但題目本身不能是假設出來的。
   若題目沒有台灣資料、制度、新聞、知識庫缺口或駁回訊號支撐，就不能寫成普遍現象。

2. 易讀性不是語句簡單而已。
   一般民眾會先判斷「這是不是在講我」。文章前 150 字需要出現生活矛盾、具體壓力或可辨識的金錢卡點。

3. 吸引力不是標題聳動，而是讓讀者覺得讀下去有用。
   文章要在前段讓讀者看到：看完後我可以更懂自己的支出、日期、缺口或下一步。

4. 財務知能不是教一堆理財概念。
   文章要讓讀者練習三種能力：看懂自己的現金流、比較選項差異、知道需要查證哪個資訊。

5. 正確財務決策不是給唯一答案。
   好文章應協助讀者看見限制與取捨，例如先保住房租、避免高利借款、確認補助時間差、分清固定支出與可調整支出。

## Useful disagreement

- 總編 reviewer 主張增加 fatal gate，因為「假設性議題缺乏驗證」會直接造成退件。
- Workflow reviewer 建議不要增加 gate 數量，以免破壞既有 12 gate contract；應新增 pre-generation protocol，掛在現有 gate 前。
- 讀者 reviewer 認為文章可讀性要有硬指標，但不能只用字數或句長判斷；應看前 150 字、段落節奏與是否有生活畫面。
- 財務教練 reviewer 認為「有數字」仍不夠，必須能推動讀者做評估：這筆支出能不能調、這個缺口會持續多久、哪個選項風險比較低。

## Convergence recommendation

採用「不新增 gate 數量、增加生成前 protocol」的做法。

每篇文章開寫前，先生成內部 `topicEvidenceCard`，再生成 `readerFitCard` 與 `financialDecisionCard`。三張卡都通過後，才進入正文生成；若不通過，先換題或改寫角度。

## Adopt now

1. 新增 `preGenerationProtocols` 到 2026-06-09 投稿品質 gate 資料。
2. 更新 `submission_quality_gatekeeper`，新增四個 reviewer：
   - `topic_evidence_reviewer`
   - `reader_motivation_reviewer`
   - `financial_decision_reviewer`
   - `financial_literacy_transfer_reviewer`
3. 更新可投稿文章生成標準，要求每篇正文前置通過：
   - 題目不是空想
   - 前 150 字有生活入口
   - 文章有家庭財務評估任務
   - 讀者能帶走一個可練習的財務知能
4. 更新 `suggestions.json` 與文章包政策，讓戰情室知道這些檢查是目前正式流程的一部分。

## Validate next

- 下一批 10 篇文章生成時，逐篇保存三張內部卡：
  - `topicEvidenceCard`
  - `readerFitCard`
  - `financialDecisionCard`
- 若 Kevin 或總編再次退稿，檢查退稿原因是否本可由三張卡攔下。
- 若文章雖過 gate 但讀起來仍不吸引人，優先回修前 150 字與段落標題。

## Pause

- 不把這些規則升級成全域 Agent OS 規則；目前只作為 `familyfin-knowledge-war-room` project-local 規格。
- 不把 CFPB/OECD/Plain Language 外部框架直接寫進正文，以免文章變成引用感很重的報告。
- 不讓 agent 自動判定讀者的正式財務決策；文章只能協助評估、比較與查證。

## Proof artifact

- `data/submission-quality-gates-2026-06-09.json`：新增生成前 protocol。
- `docs/submission-quality-gate-agent.md`：新增 reviewer 與 output contract。
- `docs/submission-article-generation-standard-v2.md`：新增題目驗證、易讀吸引力與財務決策幫助標準。
- `suggestions.json`：新增本輪 policy，供戰情室與文章包讀取。

## External references

- CFPB: Financial knowledge and decision-making skills  
  https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/financial-knowledge-decision-making-skills/
- CFPB: Explore financial well-being findings  
  https://www.consumerfinance.gov/consumer-tools/educator-tools/financial-well-being-resources/explore-findings/
- OECD: Financial education  
  https://www.oecd.org/finance/financial-education/latestdocuments/
- OECD/INFE 2023 International Survey of Adult Financial Literacy  
  https://www.oecd.org/en/publications/oecd-infe-2023-international-survey-of-adult-financial-literacy_56003a32-en.html
- Digital.gov: Plain Language Web Writing Tips  
  https://digital.gov/resources/plain-language-web-writing-tips/
