# 2026-06-08 戰情室 Source-of-Truth 對帳

狀態：local reconciliation  
用途：釐清週戰情室、文章包、blocked attempt、automation 記錄與公開衍生資料之間的可信來源。

## 對帳結論

目前應以 repo 可驗證檔案作為戰情室公開與產稿判斷的第一來源。  
若 automation memory 提到的檔案不在 repo 或被 `.gitignore` 排除，不能直接當作公開戰情室已完成證據。

## 來源表

| 項目 | 目前可信來源 | 狀態 | 用途 |
| --- | --- | --- | --- |
| 目前工作台文章包 | `suggestions.json` 的 `articlePack` | 可用，但需 validator 檢查 | 前台審核、複製、核准/退修 |
| 文章包批次紀錄 | `article-pack-history.json` | 可用 | 顯示 current/superseded/blocked attempt |
| 週報與歷次分析 | `analysis-history.json`、`reports/`、`logs/` | 可用 | 前台週報與任務回看 |
| 既有知識庫標題索引 | `data/knowledge-base-title-index.json` | 可用 | 正式產稿前比對候選標題是否撞到既有公開文章 |
| 最新週檢視結果 | `reports/2026-06-06-weekly-war-room-review.md` | blocked | live review/comment 未恢復 |
| 雙週正式產稿狀態 | `reports/2026-06-05-biweekly-article-generation-check.md` | blocked | 不應硬產正式 10 篇 |
| 投稿檢核機制回填 | `reports/2026-06-08-submission-mechanism-chat-review.md` | 可用 | 將標題新意、內容差異與案例數字判斷前移到產稿前 |
| 純文字文章包綠燈審核迴圈 | `reports/2026-06-08-green-review-loop-design.md`、`suggestions.json.articlePack.articles[].articlePackReviewGate` | 可用 | 判斷文章是否可進入 Kevin 核准工作台；非綠燈直接退回生成端 |
| reviewer 規則增量 | `docs/reviewer-rule-delta-2026-06-06.md` | draft delta | 可轉成 prewrite checklist |
| 產稿前 checklist | `docs/biweekly-prewrite-checklist-2026-06-08.md` | draft | 正式產包前檢查用 |
| validator | `tools/validate-war-room-state.js` | local tool | 檢查 JSON、字數、role leak、同批標題新意、既有知識庫標題、history drift |
| 實驗雙週產稿腳本 | `tools/build-biweekly-article-pack-2026-06-05.js` | ignored experiment | 不可當作正式產稿證據 |
| 私有原始學習資料 | `work/`、`work-private/` | ignored/private | 不進公開 repo |

## 現階段 blocking truth

1. `reviewLearningReadyCards` 曾記錄為 3，尚不足以支撐正式 10 題。
2. `EVENT_REVIEW` / `EVENT_COMMENT` live 讀取仍需重新確認。
3. 沒有 `reviewContentFound=true` 且沒有交叉打開評論文章正文時，不可宣稱完成完整 rejection learning。
4. 若 validator 發現文章包字數、role leak、標題新意、綠燈審核或 history drift，正式產稿需停下。
5. 每次正式產稿前需先更新 `data/knowledge-base-title-index.json`，避免用舊索引判斷題目新意。

## 下游規則

每次週戰情室或雙週文章包流程結束時，至少更新或確認：

1. `reports/` 中有本次 report 或 blocker。
2. `analysis-history.json` 有可見摘要。
3. `article-pack-history.json` 有產包或未產出紀錄。
4. 若是正式文章包，`tools/validate-war-room-state.js` 必須通過，且每篇 `articlePackReviewGate.status` 必須是 `green`。
5. 若是 blocked，不得在工作台標示為可投稿。
