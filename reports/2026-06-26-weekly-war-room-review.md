# 2026-06-26 好理家在知識庫每週戰情室檢視

## 摘要

- 本週 InfoCenter live preflight 阻塞，分類為 `proof insufficient`：Codex in-app Browser 無法附著新 webview 分頁，因此沒有讀到 `/me`、正確 project context、事件列表、EVENT_REVIEW、EVENT_COMMENT 或文章正文。
- 本週不新增 InfoCenter learning cards；不得把既有歷史訊號或公開資料升級成審核學習。
- repo 本地健康檢查通過，知識庫標題索引維持 1323 筆。
- 已完成 read-only 替代檢查：低頻缺口盤點 + 台灣官方來源 freshness 查核。
- 本週可交接給雙週文章生成的低頻題材：4 張 `ready-for-brief`、1 張 `pause`。

## 同日交接狀態

- `ready-for-brief`: 普通傷病給付雇主10個工作日確認缺口。
- `ready-for-brief`: 健保欠費分期與就醫權益保護。
- `ready-for-brief`: 公司倒閉欠薪與工資墊償文件準備。
- `ready-for-brief`: 家庭照顧假按小時後的本月收入安排。
- `pause`: 勞退自提節稅與現金流取捨，因標題索引已有 6 筆相關題，稀缺性較弱。

## 需要 Kevin 確認

1. 是否等 in-app Browser proof surface 恢復後再重跑 live InfoCenter learning。
2. 下一次 live run 是否採樣目標維持「先 1 approved + 3 rejected」，但只有公開徵稿且正文、審核標題、審核內容都可讀時才升級。
3. 雙週產稿是否優先使用前 4 張 `ready-for-brief` 題材。

## Readiness Card

- `login_status`: `not_verified`
- `project_context_status`: `not_verified`
- `event_list_status`: `not_verified`
- `public_submission_filter_status`: `not_verified`
- `review_path_status`: `not_verified`
- `comment_path_status`: `not_verified`
- `article_body_path_status`: `not_verified`
- `proof_surface_status`: `blocked_browser_webview_attach_timeout`
- `decision_basis`: in-app Browser new-tab attach timeout happened before InfoCenter page content could be read. Therefore this run stopped live learning at preflight and only completed local/public read-only fallback checks.

## 知識缺口

- 普通傷病給付：整體標題索引 0 hit；缺的是「線上申辦後雇主確認未完成，家庭預期收入延後」的生活化解釋。
- 健保欠費分期：整體標題索引 0 hit；缺的是「欠費不是放棄就醫，而是先查欠費、分期、確認行政狀態」的家庭決策框架。
- 工資墊償：整體標題索引 0 hit；缺的是「倒閉欠薪時先保留哪些文件，讓家庭有機會接回現金」。
- 家庭照顧假小時化：整體標題索引 1 hit；可補「臨時照顧如何影響本月薪資與請假排序」。
- 勞退自提節稅：整體標題索引 6 hit；不是首選缺口，除非要做退休現金流取捨專題。

## 擴充建議

### 1. 住院後只上傳診斷書還不夠：普通傷病給付的10個工作日確認缺口

- 適用分類：勞保給付 / 醫療後家庭現金流
- 來源：[勞保局請領手續](https://www.bli.gov.tw/0004850.html)、[普通傷病給付線上申辦QA](https://www.bli.gov.tw/0109708.html)
- 來源日期：2026-06；搜尋日期：2026-06-26；可信度：high
- `indexedTitleCount`: 1323
- `searchedKeywords`: 普通傷病給付、傷病給付、住院、雇主確認
- `titleIndexHitCount`: 0
- `excludedDenseTopics`: medical-cost-overview, long-term care, emergency buffer
- `selectionReason`: 0 hit 且官方流程有明確 10 個工作日確認門檻，具家庭收入延遲風險。
- 核心重新框架：醫療缺勤後的風險不是只在醫療費，而是替代收入卡在確認流程。
- 建議狀態：`ready-for-brief`

### 2. 健保欠費不是先忍著不看病：先分期、查欠費，再守住就醫權益

- 適用分類：健保費 / 家庭醫療支出
- 來源：[健保署分期繳納](https://www.nhi.gov.tw/ch/np-2652-1.html)、[健康存摺APP功能](https://www.nhi.gov.tw/ch/np-4107-1.html)
- 來源日期：current public page；搜尋日期：2026-06-26；可信度：high
- `indexedTitleCount`: 1323
- `searchedKeywords`: 健保欠費、健保費、就醫權益、分期繳納
- `titleIndexHitCount`: 0
- `excludedDenseTopics`: medical-cost-overview, debt, emergency buffer
- `selectionReason`: 0 hit；家庭常把欠費當成羞恥或逃避題，但它其實是支付排序與行政狀態問題。
- 核心重新框架：第一步不是硬撐，而是把不清楚的欠費變成可管理的付款路線。
- 建議狀態：`ready-for-brief`

### 3. 公司倒閉欠薪時，家庭要先保留哪些證明才能申請工資墊償？

- 適用分類：勞動權益 / 欠薪家庭現金流
- 來源：[勞保局公司倒閉欠薪說明](https://www.bli.gov.tw/0109840.html)
- 來源日期：2026-04-24；搜尋日期：2026-06-26；可信度：high
- `indexedTitleCount`: 1323
- `searchedKeywords`: 工資墊償、欠薪、積欠工資、墊償基金
- `titleIndexHitCount`: 0
- `excludedDenseTopics`: unemployment, debt, emergency buffer
- `selectionReason`: 0 hit；官方資料有最新文件準備與累計墊付數據，能轉成家庭第一週行動清單。
- 核心重新框架：薪水消失時，文件就是從恐慌接回可回收現金的橋。
- 建議狀態：`ready-for-brief`

### 4. 孩子臨時需要照顧時，家庭照顧假按小時請怎麼改變本月收入安排？

- 適用分類：照顧與工作 / 收入中斷
- 來源：[勞動部育嬰留停照顧彈性化Q&A](https://www.mol.gov.tw/1607/28162/28166/28284/28294/84873/post)
- 來源日期：2026-03；搜尋日期：2026-06-26；可信度：high
- `indexedTitleCount`: 1323
- `searchedKeywords`: 家庭照顧假、照顧假、育嬰留停、親職假、小時
- `titleIndexHitCount`: 1
- `excludedDenseTopics`: childcare, rent, debt, long-term care
- `selectionReason`: 只有 1 hit；新制與家庭本月薪資連續性高度相關。
- 核心重新框架：照顧時間也是收入時點決策。
- 建議狀態：`ready-for-brief`

### 5. 勞退自提可以節稅，但本月現金流撐得住嗎？

- 適用分類：退休準備 / 現金流取捨
- 來源：[勞保局勞退自提可節稅](https://www.bli.gov.tw/0109842.html)
- 來源日期：2026-04-24；搜尋日期：2026-06-26；可信度：medium
- `indexedTitleCount`: 1323
- `searchedKeywords`: 勞工退休金自願提繳、自願提繳、退休金提繳、勞退
- `titleIndexHitCount`: 6
- `excludedDenseTopics`: retirement-overview, investment, tax-only
- `selectionReason`: 相關標題已有 6 筆，稀缺性較弱；只有「節稅 vs 本月流動性」角度仍可保留。
- 核心重新框架：節稅選擇仍是家庭流動性選擇。
- 建議狀態：`pause`

## 學習發現

- 本週無 `approved_reference_card`。
- 本週無 `rejection_contrast_card`。
- 本週無 partial signal。
- 可保留的規則只有既有規則 reinforcement：沒有同次正文、審核標題、審核內容三者，不得新增 hard rule。

## 雙週文章生成前準備

- 先從 4 張 `ready-for-brief` 中選題。
- 每題產稿前補上當次最新來源截點與限制條件。
- 文章不能寫成政策懶人包；必須寫成家庭現金流、時間差、文件順序或收入替代判斷。

## 本週數字

- 本週讀取 InfoCenter live event：0
- 公開徵稿審核成功文章參考數：0
- 公開徵稿審核駁回內容讀取數：0
- 完整學習卡數：0
- 非公開徵稿排除數：0
- 擴充建議數：5
- 可交接給雙週文章生成題材數：4

## Blocker-Proof / Checkpoint Card

- `last_successful_checkpoint`: 2026-06-19 live readiness recovery with correct-org event-list proof, one complete rejection contrast card, and refreshed low-frequency suggestion pack
- `session_state`: in-app Browser proof surface unavailable; new tab creation timed out waiting for webview attach before InfoCenter page state could be read
- `project_context_state`: not verified this run; correct-org switch could not be attempted
- `exact_blocked_step`: InfoCenter preflight step 1, `/me` login-state verification, blocked by browser webview attach timeout
- `fallback_checks_completed`: repo validator, knowledge-base title index scan, low-frequency scan, official-source refresh, no live learning promotion
- `proof_artifacts`: `work/war-room-learning-cards-2026-06-26.json`, `work/war-room-weekly-suggestions-2026-06-26.json`, `work/war-room-quality-rules-2026-06-26.md`, `logs/2026-06-26-weekly-war-room-review-log.md`
- `decision`: `blocked`
- `next_retry_gate`: retry only after Codex in-app Browser can attach a page; then prove `/me` authenticated state, explicit switch to `好理家在文章管理區`, `/me/event/events`, visible `公開徵稿` rows, EVENT_REVIEW, EVENT_COMMENT, and article body path before extracting learning
