# 2026-07-03 好理家在知識庫每週戰情室檢視

## 摘要

- 本輪 live InfoCenter preflight 停在 `proof insufficient`：Browser 可連線，但 `/me` 開頁逾時，重連後僅看到 InfoCenter 根頁 tab，DOM 讀取再次逾時。
- 因為 login、project context、event list、EVENT_REVIEW、EVENT_COMMENT、article body 都沒有可讀證據，本輪沒有新增 `approved_reference_card` 或 `rejection_contrast_card`。
- 本地 repo validator 通過；知識庫標題索引維持 1323 筆。
- 已完成 read-only 低頻缺口掃描與台灣官方來源刷新，形成 5 張可交接給雙週產稿的 `ready-for-brief` 題材，1 張 `pause` 題材。
- 沒有改寫 InfoCenter、網站後台、GitHub、Vercel 或任何外部系統。

## 同日交接狀態

- `ready-for-brief`: 5
- `pause`: 1
- 可交接給雙週文章生成：普通傷病給付投保單位確認、工資墊償文件保存、健保欠費分期、家庭照顧假小時化收入排序、職災補償支付順序。
- 不交接為本週主題：國保喪葬給付與遺屬年金，因 title index hit count 7，稀缺性弱於本週 ready 題材。

## 需要 Kevin 確認事項

1. 是否要先修復或重啟 in-app Browser proof surface，再重跑 InfoCenter live learning。
2. 下次可讀取 InfoCenter 時，是否優先採樣 1 篇公開徵稿審核成功、3 篇公開徵稿審核駁回，避免一次讀太多造成 proof surface 不穩。
3. 雙週產稿是否直接從本輪 5 張 `ready-for-brief` 中挑題。

## Readiness Card

- `login_status`: `not_verified`
- `project_context_status`: `not_verified`
- `event_list_status`: `not_verified`
- `public_submission_filter_status`: `not_verified`
- `review_path_status`: `not_verified`
- `comment_path_status`: `not_verified`
- `article_body_path_status`: `not_verified`
- `proof_surface_status`: `blocked_browser_page_read_timeout`
- `decision_basis`: Browser proof surface failed before readable InfoCenter page state. Per preflight rule, no live event learning was upgraded.

## 知識缺口

- 普通傷病給付：`titleIndexHitCount = 0`。缺口不在「申請資格」，而是住院後線上申請仍需投保單位 10 個工作日內確認，否則家庭可能誤判替代收入時間。
- 工資墊償：`titleIndexHitCount = 0`。缺口在雇主倒閉或清算時，家庭需要先保留什麼文件來接上基金墊償，而不是只知道「可以申請」。
- 健保欠費分期：`titleIndexHitCount = 1`。缺口在把欠費羞恥感轉成付款順序與就醫可近性判斷。
- 家庭照顧假小時化：`titleIndexHitCount = 3`。缺口在雙薪家庭如何把 56 小時視為收入排序工具，而不是只寫育嬰留停新制摘要。
- 職災補償：`titleIndexHitCount = 3`。缺口在事故後先分清醫療費、原領工資補償、死亡喪葬費與遺屬補償各自解決哪一段家庭現金流。

## 擴充建議

1. 住院後線上申請傷病給付，為什麼還要盯投保單位10個工作日
   - 分類：醫療缺工收入 / 家庭現金流
   - 來源：[勞保局請領手續](https://www.bli.gov.tw/0004850.html)、[線上申辦QA](https://www.bli.gov.tw/0109708.html)
   - 來源日期：2026-06；搜尋日期：2026-07-03；可信度：high
   - `indexedTitleCount`: 1323；`searchedKeywords`: 普通傷病、傷病給付、住院、雇主確認、投保單位確認；`titleIndexHitCount`: 0
   - `excludedDenseTopics`: medical-cost-overview, long-term care, emergency buffer
   - `selectionReason`: 0 hit 且官方流程新，具備家庭現金流延遲價值。
   - 核心發現：個人線上申辦後，投保單位仍須在 10 個工作日內確認，否則不予受理。
   - 建議狀態：`ready-for-brief`

2. 公司倒閉欠薪時，先保留哪些資料才有機會接上工資墊償
   - 分類：勞動收入中斷 / 家庭急用現金
   - 來源：[勞保局工資墊償懶人包](https://www.bli.gov.tw/0109840.html)
   - 來源日期：2026-04-24；搜尋日期：2026-07-03；可信度：high
   - `indexedTitleCount`: 1323；`searchedKeywords`: 積欠工資、工資墊償、欠薪、薪資沒發、雇主倒閉；`titleIndexHitCount`: 0
   - `excludedDenseTopics`: unemployment, debt, emergency buffer
   - `selectionReason`: 0 hit；官方資料有明確文件與數據，家庭決策價值高。
   - 核心發現：截至 2025 年底，基金已墊付 86 億 2,902 萬餘元、協助 87,444 名勞工。
   - 建議狀態：`ready-for-brief`

3. 健保欠費不是只能拖著怕，先看能不能分期保住就醫路
   - 分類：健保保費 / 醫療可近性 / 家庭付款順序
   - 來源：[健保署分期繳納](https://www.nhi.gov.tw/ch/np-2652-1.html)
   - 來源日期：current public page；搜尋日期：2026-07-03；可信度：high
   - `indexedTitleCount`: 1323；`searchedKeywords`: 健保欠費、保費分期、健保分期、欠費、全民健保；`titleIndexHitCount`: 1
   - `excludedDenseTopics`: medical-cost-overview, debt, emergency buffer
   - `selectionReason`: 只有 1 筆廣義欠費命中，健保分期與就醫可近性的家庭決策角度不足。
   - 核心發現：欠費達 2,000 元以上且符合條件時，可處理簡易分期；移送行政執行者另有限制。
   - 建議狀態：`ready-for-brief`

4. 孩子臨時要照顧時，56小時家庭照顧假怎麼排才不讓薪水斷太快
   - 分類：照顧請假 / 工資連續性 / 雙薪家庭
   - 來源：[勞動部育嬰留停照顧彈性化Q&A](https://www.mol.gov.tw/1607/28162/28166/28284/28294/84873/post)
   - 來源日期：2026-03；搜尋日期：2026-07-03；可信度：high
   - `indexedTitleCount`: 1323；`searchedKeywords`: 家庭照顧假、育嬰留停、小時請假、照顧假、育嬰；`titleIndexHitCount`: 3
   - `excludedDenseTopics`: childcare, rent, debt, long-term care
   - `selectionReason`: 3 hits 仍偏低；小時化規則有具體收入連續性決策價值。
   - 核心發現：家庭照顧假可按小時計；標準 8 小時工作日下 7 日為 56 小時，工時不同時計算不同。
   - 建議狀態：`ready-for-brief`

5. 職災後家裡先看哪筆錢：醫療、原領工資、喪葬與死亡補償不要混在一起
   - 分類：職災風險 / 家庭收入中斷 / 補償順序
   - 來源：[勞動部職災補償及抵充](https://www.mol.gov.tw/1607/28162/28166/82050/82061/82280/)、[雇主職災補償責任](https://www.mol.gov.tw/1607/28690/2282/2284/2296/7286/post)
   - 來源日期：2026-03 to 2026-06；搜尋日期：2026-07-03；可信度：high
   - `indexedTitleCount`: 1323；`searchedKeywords`: 職災、職業災害、雇主補償、職業傷病、工傷；`titleIndexHitCount`: 3
   - `excludedDenseTopics`: debt, scam, childcare, rent
   - `selectionReason`: 3 hits 仍低；官方來源有明確補償順序與金額倍數，可轉為家庭現金流判斷。
   - 核心發現：死亡案件包含 5 個月平均工資喪葬費與 40 個月平均工資死亡補償，醫療中不能工作另有原領工資補償。
   - 建議狀態：`ready-for-brief`

6. 國保喪葬給付和遺屬年金，不是一筆錢解決同一個問題
   - 分類：喪葬支出 / 遺屬收入 / 國民年金
   - 來源：[勞保局國民年金115年調整](https://www.bli.gov.tw/0109476.html)、[請領勞保老年給付對國保權益影響](https://www.bli.gov.tw/0108917.html)
   - 來源日期：2026-03；搜尋日期：2026-07-03；可信度：high
   - `indexedTitleCount`: 1323；`searchedKeywords`: 國民年金、喪葬給付、遺屬年金、喪葬、遺屬；`titleIndexHitCount`: 7
   - `excludedDenseTopics`: debt, rent, scam, childcare
   - `selectionReason`: 官方資料新且有家庭價值，但 7 hits 讓稀缺性弱於本週 ready 題。
   - 建議狀態：`pause`

## 學習發現

- `approved_reference_card`: 0
- `rejection_contrast_card`: 0
- `partial signal`: 0
- 本週無法從 InfoCenter 新增成功文章寫法或駁回對照學習；所有新規則僅能作為官方來源擴充建議，不可升級為審稿 learning。

## 雙週文章生成前需要準備

- 優先挑題順序：普通傷病給付、工資墊償、健保欠費分期、家庭照顧假小時化、職災補償。
- 每題草稿前要補：一個家庭現金流前後差異、至少一個限制條件、讀者第一步查核動作。
- 不要把官方 Q&A 改寫成公告文；要轉成「家庭下一筆錢或下一個期限怎麼判斷」。

## 本週讀取數

- live InfoCenter event：0
- 公開徵稿審核成功文章參考數：0
- 公開徵稿審核駁回內容讀取數：0
- 完整學習卡數：0
- 非公開徵稿排除數：0
- 擴充建議數：6
- 可交接給雙週文章生成題材數：5

## Blocker-Proof / Checkpoint Card

- `last_successful_checkpoint`: 2026-06-19 live readiness recovery with correct-org event-list proof, one complete rejection contrast card, and refreshed low-frequency suggestion pack
- `session_state`: in-app Browser runtime connected, but InfoCenter page content was not readable; `/me` navigation timed out and later root-tab DOM inspection also timed out
- `project_context_state`: not verified this run; correct-org switch could not be attempted
- `exact_blocked_step`: InfoCenter preflight step 1, `/me` login-state verification, blocked by browser page-read timeout before readable page state
- `fallback_checks_completed`: repo validator, knowledge-base title index scan, low-frequency candidate scan, current Taiwan official-source refresh, no live learning promotion
- `proof_artifacts`: `work/war-room-learning-cards-2026-07-03.json`, `work/war-room-weekly-suggestions-2026-07-03.json`, `work/war-room-quality-rules-2026-07-03.md`, `logs/2026-07-03-weekly-war-room-review-log.md`
- `decision`: `blocked`
- `next_retry_gate`: retry only after Codex in-app Browser can attach and read a page; then prove `/me` authenticated state, explicit switch to `好理家在文章管理區`, `/me/event/events`, visible `公開徵稿` rows, EVENT_REVIEW, EVENT_COMMENT, and article body path before extracting learning
