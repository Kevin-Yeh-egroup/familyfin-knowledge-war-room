# Chronological Learning Runbook

## 目標

從 InfoCenter 事件管理依時間由舊到新分批讀取文章，建立去識別化學習包，讓 agent 學會好理家在文章寫法與品質標準。

## 已完成

- Batch 001 至 Batch 017 已完成。
- 已掃描事件列表：2026 則。
- 可學文章正文：540 篇。
- 成功樣本：340 篇。
- 退修或駁回樣本：187 篇。

目前狀態：

- `completed = true`
- `nextOffset = 2026`

## 節奏

- 每批掃描 120 則事件
- 每批最多保留 60 篇可學正文
- 每 5 批做一次規則彙整
- raw learning packs 保留在本機，不進公開 repo
- 新增建議的分類必須參考 `docs/article-zone-tag-reference.md`
- 每篇建議至少標 1 個文章受眾與 1 個正式知識庫標籤
- 下一階段重點改為 `Review Contrast Learning Loop`：逐則確認評論中的文章、審核評語、駁回原因與原稿段落是否可交叉對照。
- 若審核評語原文無法從事件列表讀取，需記錄缺口與可行的人工匯出路徑。

## Review Contrast Learning Loop

後續每批不是只讀正文，而是建立可學習配對：

- `event_id`
- `article_id`
- 評論中的文章摘要
- 審核或駁回評語摘要
- 原稿問題段落
- 評語指出的問題
- agent 討論摘要
- 是否升級為下週必查規則

公開 repo 只保存去識別化摘要、統計與規則，不保存 InfoCenter 原文或內部評論全文。

## 公開邊界

可以公開：

- 統計摘要
- 寫作規則
- 去識別化後的學習發現
- 新增建議草稿
- 資料來源連結

不可公開：

- InfoCenter 原始文章全文
- 個案會談資料
- 內部評論全文
- 帳號、token、cookie、內部 API 細節
- 尚未授權或未去識別化案例
