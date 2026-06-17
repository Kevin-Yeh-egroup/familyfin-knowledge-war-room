# 2026-06-12 reviewer 規則增量

## 本次結論

本輪沒有新增 complete learning card。

原因不是題材不足，而是本次無法進入 InfoCenter 已登入態；因此不能重新讀取 `EVENT_REVIEW` / `EVENT_COMMENT`。

這次新增的是流程邊界與題材前置規則，不是新的審稿原文規則。

## 代理討論摘要

### `review_feedback_miner`

- 本次已直接看到 InfoCenter 登入頁，應把 `login/session missing` 與 `target review/comment path unreachable` 分開。
- 沒有登入態時，只能使用 repo 內既有去識別化學習資料，不可假裝完成新一輪 rejection learning。

### `numeric_proof_reviewer`

- 題目必須先說清楚哪一筆金流先卡住，再放補助、法規或程序。
- 長照、急難、照顧假、詐騙、債務等題目都要先有「前後差異」或「先後順序」。

### `non_concept_reviewer`

- 若題目只剩制度整理、法律摘要或政策名稱，直接退回。
- 至少要有一個家庭壓力點、一個時間差、一組支出或收入變化。

### `writing_angle_reviewer`

- 一般民眾版要從生活矛盾進，不要從制度定義進。
- 同一批題目至少混三種標題入口，避免又變成固定模板。

### `reader_appeal_reviewer`

- 標題要讓人先感覺「這篇跟我家有關」，而不是像查資料筆記。
- 能不能留下第一個可盤點點，是可讀與不可讀的分水嶺。

### `role_leak_reviewer`

- 公開 repo 只保存規則、摘要與去識別化建議卡。
- 不保存審核原文、文章全文、eventId、後台 URL 或可逆推登入後內容。

### `quality_reviewer`

- `candidate_pending_live_review_signal` 只代表題材值得保留。
- 只有評論文章正文、審核標題、審核內容三者同時齊備，才可升級為 complete learning。

## 本次新增硬規則

1. 週檢視第一關先做登入態 preflight；若直接進登入頁，流程改為 fallback review，不重試繞路。
2. 題材前置卡必須回答：哪個家庭在什麼時間差或支出順序下被卡住。
3. 題材前置卡必須至少準備一組台灣當年度數字，並能翻成日常用途。
4. 題材前置卡必須留下第一個讀者可盤點點，例如日期、金額、支出順序、求助窗口。
5. 標題批次需保留多樣入口，不可又回到單一公式批量生成。

## 仍維持不變的 hard gates

1. 沒有 `評論文章正文 + 審核標題 + 審核內容`，不得宣稱 complete learning。
2. 沒有 `claims table`，不得寫家庭金流或制度金額題。
3. 案例人數、收入來源、照顧責任與支出設定不得前後漂移。
4. 台灣制度題必須寫年度、主管機關、適用地區、限制條件與查核日期。
