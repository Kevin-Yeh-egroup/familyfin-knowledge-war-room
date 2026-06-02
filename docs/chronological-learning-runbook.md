# Chronological Learning Runbook

## 目標

從 InfoCenter 事件管理依時間由舊到新分批讀取文章，建立去識別化學習包，讓 agent 學會好理家在文章寫法與品質標準。

## 已完成

- Batch 001：`startOffset = 0`
- Batch 002：`startOffset = 120`
- Batch 003：`startOffset = 240`
- Batch 004：`startOffset = 360`
- Batch 005：`startOffset = 480`

下一批：

- Batch 006：`startOffset = 600`

## 節奏

- 每批掃描 120 則事件
- 每批最多保留 60 篇可學正文
- 每 5 批做一次規則彙整
- raw learning packs 保留在本機，不進公開 repo
- 新增建議的分類必須參考 `docs/article-zone-tag-reference.md`
- 每篇建議至少標 1 個文章受眾與 1 個正式知識庫標籤

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
