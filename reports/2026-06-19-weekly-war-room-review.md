# 2026-06-19 週戰情室檢視：live 路徑恢復後的 read-only 盤點

## 摘要

- 本次已恢復 live read-only 路徑，並在正確 `好理家在文章管理區` 專案上下文下完成 readiness 檢查。
- 本次成功證明：
  - `/me` 可用且已登入
  - 正確切到 `好理家在文章管理區` 後，`/me/event/events` 事件列表可達
  - 事件列表畫面可見 `公開徵稿` 與審核狀態欄
  - 一筆 `公開徵稿` 駁回樣本可同 run 讀到 `EVENT_REVIEW` 非空審核內容並打開 `EVENT_COMMENT` 正文
  - 一筆 `公開徵稿` 核准樣本可讀到 `EVENT_REVIEW` 與 `EVENT_COMMENT` surface
- 因此本次 `decision = proceed`，不再沿用 2026-06-12 的 runtime-lock blocker。

## 同日交接狀態

- live readiness：已恢復，可交接給下次 weekly run 直接從 `/me` -> 組織切換 -> 事件列表 開始。
- learning：本次新增 1 張完整 `rejection_contrast_card`；`approved_reference_card` 本輪沒有新增完整卡，僅補足 path proof。
- suggestions：本次新增 5 張低頻題材卡，其中 4 張 `ready-for-brief`，1 張 `pause`。
- biweekly handoff：本次可交接 4 個題材到雙週產稿前題材池，但不產出完整正文。

## 需要 Kevin 確認事項

1. 是否接受雙週產稿前優先試做以下 4 題：
   - 家庭照顧假 / 彈性育嬰留停銜接
   - 普通傷病給付 10 個工作日卡關
   - 職災後的收入補償順序
   - 國保喪葬給付 vs 遺屬年金
2. 是否要在下一輪 weekly run 擴大為 `1 approved + 3 rejected` 的 live sample，而不是只做最小證明樣本。
3. `信用空白/信用分數` 目前官方來源較舊，本次先標 `pause`；若要繼續做，需補新的台灣銀行端或更即時制度證據。

## Readiness Card

- `login_status`: `pass`
- `project_context_status`: `pass`
- `event_list_status`: `pass`
- `public_submission_filter_status`: `pass`
- `review_path_status`: `pass`
- `comment_path_status`: `pass`
- `article_body_path_status`: `pass`
- `proof_surface_status`: `pass`
- `decision_basis`: 先用 `/me` 明確切到 `好理家在文章管理區`，再開 `/me/event/events`。若直接打事件列表，系統可能落到錯的 project context；本次已證明組織切換後可回到正確事件列表，且最小 live 樣本可完成駁回 cross-check。

## 本週讀取數與產出數

- live 事件列表讀取數：1
- 公開徵稿審核成功文章參考數：
  - 完整 approved reference cards：0
  - approved review/comment path proof：1
- 公開徵稿審核駁回內容讀取數：1
- 公開徵稿駁回正文交叉讀取數：1
- 完整學習卡數：1
- partial signals：1
- 非公開徵稿排除數：0
  - 說明：本次 live 最小樣本全部來自 `公開徵稿`；未重跑全量 event-list 排除盤點
- 擴充建議數：5
- 可交接給雙週文章生成的題材數：4

## 知識缺口

1. 本輪雖然證明核准樣本的 `EVENT_REVIEW` 與 `EVENT_COMMENT` surface 可達，但沒有新增 same-run 的核准稿完整正文結構卡，所以 approved-learning 仍主要依賴 2026-06-10 的三位作者結構卡。
2. 本輪只做最小 live 樣本證明，還沒有重新盤點最近一週所有 `公開徵稿` 駁回列中的非空 review-content 比例。
3. `信用空白/信用分數` 雖是 0-hit gap，但目前能取得的官方解說頁更新日期偏舊，還不夠穩做成 2026 題材卡。
4. 事件列表若未先切正確組織，會落到其他 project context；這代表之後的自動化 preflight 不能省略 org-switch proof。

## 擴充建議

詳細卡片見 `work/war-room-weekly-suggestions-2026-06-19.json`。本輪建議狀態如下：

1. `ready-for-brief`
   - 7天不夠時怎麼撐？把家庭照顧假、事假與彈性育嬰留停排成同一條現金流路線
   - 住院後最容易漏掉的不是診斷書，而是10個工作日：普通傷病給付怎麼避免卡關
   - 家裡有人職災後，不是只有醫藥費：5個月喪葬費、40個月補償與收入中斷誰先補
   - 家人過世後第一筆錢怎麼來？國保喪葬給付與遺屬年金不是同一件事
2. `pause`
   - 信用空白不是沒欠錢就好：為什麼「暫時無法評分」會卡住家庭借款

## 學習發現

### 這輪可列為 complete learning 的發現

1. 駁回 cross-check 仍然把問題收斂到四件事：
   - 財務數字不足
   - 內容太概念
   - 財務角度漂掉
   - 沒有寫出行動前後差異
2. 這代表 `claims table` 仍是高優先 hard gate，尤其是收入、補助、費用、債務或保險給付題材。
3. 只要文章想用照顧、支持、關係修復當主軸，就更要更早落到家庭金錢決策點；否則很容易被 reviewer 判成 concept writing。

### 這輪仍維持 partial 的發現

1. 核准稿 path proof 已回來，但本輪沒有新增完整 approved reference structure card。
2. approved-writing 的可遷移規則仍以既有三張結構卡為主：
   - before/after difference
   - institutional decision order
   - risk judgment path

### reviewer agents 本週維持或加強的規則

- `review_feedback_miner`：沒有同 run 的 review title + review content + article body，不升級成 complete learning。
- `review_contrast_miner`：拒稿主因仍要同時看 reviewer wording 與原文數字配置，不可只看標題。
- `numeric_proof_reviewer`：先列 claims table，再談文章角度。
- `non_concept_reviewer`：第一個 1/3 必須落到金錢問題、期限或 decision checkpoint。
- `writing_angle_reviewer`：情緒或關係切角不能取代家庭經濟主軸。
- `reader_appeal_reviewer`：熟悉場景 + 一個數字 + 為什麼現在要決定，仍是最穩的開頭。
- `role_leak_reviewer`：本輪所有 repo 輸出維持去識別，不保存原始審核文字與正文。
- `quality_reviewer`：低頻缺口門檻已升級成 weekly hard gate。

## 雙週文章生成前需要準備的題材

1. 家庭照顧假 / 彈性育嬰留停：
   - 先定義主角是雙薪家庭、單親，還是隔代照顧
   - 要有實際「哪一段工資先掉下來」的現金流圖
2. 普通傷病給付：
   - 需補住院、扣薪、公司確認三段式情境
   - 不可把病假、普通傷病給付、全薪假混寫
3. 職災補償：
   - 要區分雇主補償、保險給付與家屬第一時間現金需求
4. 國保喪葬給付 / 遺屬年金：
   - 需明確區分一次領與按月領
   - 要指定誰是第一個申請人與順序

## blocker-proof / checkpoint

- `last_successful_checkpoint`: 2026-06-19 live readiness recovery with one complete rejection contrast card
- `session_state`: authenticated Chrome-profile session available for read-only live navigation
- `project_context_state`: correct org verified after explicit switch to `好理家在文章管理區`
- `exact_blocked_step`: none
- `fallback_checks_completed`: validator, correct-org event-list proof, live reject cross-check, live approved path proof, low-frequency title scan, official-source refresh
- `proof_artifacts`: see `work/war-room-checkpoint-card-2026-06-19.md`
- `decision`: `proceed`
- `next_retry_gate`: next run must prove `/me` -> org switch -> `/me/event/events` before any learning extraction; if login or org switch fails, stop at checkpoint mode
