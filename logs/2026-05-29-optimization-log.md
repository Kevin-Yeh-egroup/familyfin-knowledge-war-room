# 2026-05-29 操作日誌｜Codex 與知識庫戰情室優化

## 背景

Kevin 詢問本次完整任務有何發現，以及後續 Codex 是否能優化。復盤後確認，任務已形成可重複的內容情報流程：知識庫盤點、外部 websearch、證據包、草稿生成、雙重審稿、Kevin 核准、分類存放與後續上稿。

## 實作紀錄

1. 將新增建議資料抽出為 `suggestions.json`。
2. 更新 `index.html`，前端優先讀取 `suggestions.json`；讀不到時使用頁面內備援資料。
3. 新增資料來源狀態提示，讓使用者知道目前讀到的是 JSON 還是備援資料。
4. 新增內容審稿 Rubric UI，並由資料檔提供量表內容。
5. 在每則建議詳細頁新增審稿評分區塊。
6. 匯出 Markdown 與 JSON 時一併包含 `reviewScores`。
7. 新增日報與操作日誌，保留本次優化與發現。
8. 新增 Codex 優化草案，先作為審核材料，未直接改寫全域 skill 或 automation。

## 決策

- 先做專案級優化，不直接寫入全域 Codex skill。
- 先讓 automation 未來可輸出 `suggestions.json` 結構，但不讓排程自動發布或自動改知識庫。
- 核准狀態暫用 `localStorage`，正式保存方案留待下一輪決策。

## 驗證項目

- `suggestions.json` 必須是合法 JSON。
- `index.html` 內嵌 JavaScript 必須能通過語法檢查。
- 審稿台需要能顯示建議清單、草稿、審稿評分與核准暫存庫。
- Vercel 發布後需確認穩定網址 200 OK、頁面包含審稿台與 JSON 載入提示，且 `noindex` 控制仍有效。

## 待追蹤

- 週報 automation 是否要正式改成輸出 `suggestions.json`。
- 是否將本流程提升為全域 skill：`familyfin-knowledge-war-room`。
- 是否接 GitHub PR 或 Google Sheet 保存核准紀錄。
