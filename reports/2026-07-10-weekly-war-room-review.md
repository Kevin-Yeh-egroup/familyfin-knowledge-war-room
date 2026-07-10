# 2026-07-10 好理家在知識庫每週戰情室檢視

## 摘要

- 本輪一開始停在 `login/session missing`；Kevin 手動登入後，live InfoCenter preflight 已恢復。
- 已證明：登入、`好理家在文章管理區` project context、`/me/event/events` 事件列表、`公開徵稿` 列、`EVENT_REVIEW`、`EVENT_COMMENT`、評論文章正文路徑都可達。
- 本輪新增 1 張去識別化 `approved_reference_card`。
- 本輪抽查 3 筆 `公開徵稿` 駁回樣本：文章正文與審核標題可讀，但嚴格解析後審核內容欄位皆為空，因此只列為 3 筆 partial signal，沒有新增 `rejection_contrast_card`。
- 沒有改寫 InfoCenter、網站後台、GitHub、Vercel 或任何外部系統。

## Readiness Card

- `login_status`: `verified`
- `project_context_status`: `verified_好理家在文章管理區`
- `event_list_status`: `verified_1_to_10_of_2193`
- `public_submission_filter_status`: `verified_visible_rows`
- `review_path_status`: `verified_EVENT_REVIEW`
- `comment_path_status`: `verified_EVENT_COMMENT`
- `article_body_path_status`: `verified_comment_article_body`
- `proof_surface_status`: `browser_readable_authenticated_session`
- `decision_basis`: Kevin manually restored login; same-run browser proof reached the correct project event list and live review/comment/body surfaces. Rejected learning was not upgraded because review-content fields were empty.

## 同日交接狀態

- `approved_reference_card`: 1
- `rejection_contrast_card`: 0
- `partial signal`: 3
- `public_submission_filter_status`: verified
- `ready-for-brief` expansion topics: 5
- `pause` expansion topics: 1
- `handoff_to_automation_15`: may use 5 public-source low-frequency topic candidates plus 1 approved-reference writing pattern; must not claim fresh complete rejection-contrast learning.

## 需要 Kevin 確認事項

1. 下次是否繼續從本次可見列表往後抽查更多 `公開徵稿` 駁回事件，尋找有非空審核內容的樣本。
2. 雙週文章生成是否接受「1 張 approved reference + 3 筆 partial rejection signals + 5 張低頻 public-source 候選」作為選題準備，而不是完整退稿學習基礎。

## 知識缺口與擴充建議

本輪低頻缺口仍沿用 1323 筆公開知識庫標題索引與 2026-07-03 低頻命中盤點，再以 2026-07-10 公開官方來源刷新事實。完整欄位見 `work/war-room-weekly-suggestions-2026-07-10.json`。

1. `ready-for-brief`：住院請假後，家裡現金流先看哪三份證明
   - `indexedTitleCount`: 1323
   - `searchedKeywords`: 傷病給付、住院請假、診斷書、出勤紀錄、薪資替代
   - `titleIndexHitCount`: 0
   - `excludedDenseTopics`: medical-cost-overview, long-term care, emergency buffer
   - `selectionReason`: wage-replacement evidence angle is low-frequency and has current BLI source.

2. `ready-for-brief`：公司倒閉欠薪時，先保住哪些資料才拿得到錢
   - `indexedTitleCount`: 1323
   - `searchedKeywords`: 工資墊償、公司倒閉、欠薪、歇業證明、債權證明
   - `titleIndexHitCount`: 0
   - `excludedDenseTopics`: unemployment, debt, emergency buffer
   - `selectionReason`: document-preservation angle is undercovered and directly affects household cash recovery.

3. `ready-for-brief`：健保費欠繳到不敢就醫時，先把分期資格查清楚
   - `indexedTitleCount`: 1323
   - `searchedKeywords`: 健保費欠費、健保分期、保險對象、行政執行、醫療可近性
   - `titleIndexHitCount`: 1
   - `excludedDenseTopics`: medical-cost-overview, debt, emergency buffer
   - `selectionReason`: installment sub-angle is sparse and tied to immediate medical-access decisions.

4. `ready-for-brief`：家庭照顧假改用小時計，誰先請才不打亂月現金流
   - `indexedTitleCount`: 1323
   - `searchedKeywords`: 家庭照顧假、小時申請、育嬰留停、雙薪家庭、照顧現金流
   - `titleIndexHitCount`: 3
   - `excludedDenseTopics`: childcare, rent, debt, long-term care
   - `selectionReason`: hourly leave rule creates a concrete income-continuity decision.

5. `ready-for-brief`：職災後家裡缺錢，先分清醫療費、工資補償與保險給付
   - `indexedTitleCount`: 1323
   - `searchedKeywords`: 職業災害、醫療費用、工資補償、死亡補償、支付來源
   - `titleIndexHitCount`: 3
   - `excludedDenseTopics`: debt, scam, childcare, rent
   - `selectionReason`: payment-source sorting remains low-frequency and highly decision-relevant.

6. `pause`：國保喪葬給付調高後，家屬要分清一次錢與每月支持
   - `indexedTitleCount`: 1323
   - `searchedKeywords`: 國民年金、喪葬給付、遺屬年金、月投保金額、身故支出
   - `titleIndexHitCount`: 7
   - `excludedDenseTopics`: debt, rent, scam, childcare
   - `selectionReason`: current source is useful, but scarcity is weaker than the ready cards.

## 學習發現

- `approved_reference_card`: successful public-submission article can be learned as structure only. Transferable pattern: concrete risk boundary -> recognizable scenario -> decision order -> explicit reader takeaway.
- `partial rejection signal`: three rejected public-submission samples had article bodies and review titles, but no non-empty review content field. Do not turn these into complete contrast learning.
- `review_feedback_miner`: approved learning can guide writing-pattern rules; rejected rows remain caution notes only.
- `review_contrast_miner`: no complete rejection contrast without non-empty review content.
- `numeric_proof_reviewer`: rejected bodies may still contain numbers and tables; numbers alone are insufficient if the family interaction or scenario is hypothetical/oversimplified.
- `non_concept_reviewer`: avoid hypothetical family interaction and generic financial education when the article needs a realistic household decision.
- `writing_angle_reviewer`: risk-boundary topics should begin with the line the reader might accidentally cross.
- `reader_appeal_reviewer`: use concrete scenario and decision sequence before broader principle.
- `role_leak_reviewer`: no backend identifiers, private review text, event URLs, cookies, tokens, or full article bodies were saved.
- `quality_reviewer`: this run is partial live learning plus public-source handoff, not complete rejection-learning renewal.

## 雙週文章生成前準備

- Automation-15 may inherit a stronger upstream checkpoint than the initial blocked state: live route now works after manual login.
- It still must not claim fresh complete rejection-contrast learning.
- The 5 `ready-for-brief` cards can seed topic planning as public-source low-frequency candidates.
- The approved-reference pattern can guide structure for risk-boundary articles.
- Before actual drafting, re-check official source pages and confirm title-index counts if the knowledge-base index is refreshed.

## Blocker-Proof / Checkpoint Card

- `last_successful_checkpoint`: 2026-07-10 post-login live preflight; correct project context, event list, public-submission rows, EVENT_REVIEW, EVENT_COMMENT, and comment article body were reachable
- `session_state`: authenticated in-app Browser session verified after Kevin manually logged in
- `project_context_state`: verified `好理家在文章管理區`
- `exact_blocked_step`: rejected public-submission contrast learning stopped at non-empty review-content requirement; three rejected samples had visible review titles and article bodies, but empty review-content fields
- `fallback_checks_completed`: local title-index count reviewed; official-source topic facts refreshed; one approved public-submission reference sample converted into a de-identified card; three rejected samples kept as partial signals only
- `proof_artifacts`: `work/war-room-learning-cards-2026-07-10.json`, `work/war-room-weekly-suggestions-2026-07-10.json`, `work/war-room-quality-rules-2026-07-10.md`, `work/war-room-checkpoint-card-2026-07-10.md`, `logs/2026-07-10-weekly-war-room-review-log.md`
- `decision`: `proceed`
- `next_retry_gate`: next weekly run should start from the now-proven chain `/me` -> `好理家在文章管理區` -> `/me/event/events`; for rejected learning, continue only when the opened rejection row contains both review title and non-empty review content
