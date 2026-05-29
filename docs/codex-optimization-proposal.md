# Codex 優化草案｜FamilyFin Knowledge War Room

## 建議資產

Asset name: `familyfin-knowledge-war-room`

Asset type: staged skill / workflow draft

Owner agents:

- `task_router`
- `context_scout`
- `workflow_designer`
- `automation_auditor`
- `governance_auditor`

## 觸發條件

當 Kevin 提到以下任一需求時啟用：

- 好理家在知識庫盤點
- 社工知識庫文章擴充
- FamilyFinHealth content war room
- 定期 websearch 找可新增文章
- 一般民眾版或社工版文章草稿
- 文章需要台灣資料、真實案例、證據包、審稿或核准流程

## 標準流程

```text
intake -> knowledge-base inventory -> gap analysis -> Taiwan websearch
-> evidence package -> draft generation -> fact/case review
-> prompt-fit review -> Kevin approval -> categorized storage/export
```

## Done 條件

- 已確認知識庫可見範圍與登入態。
- 已盤點分類、受眾、近期文章與可疑缺口。
- 每則新增建議有分類、受眾、優先級、證據包、案例註記、草稿、下一步。
- 草稿使用 Kevin 的一般民眾版或社工版 prompt 精神。
- 每則建議通過審稿 Rubric 或標示需補證。
- 不自動發布、不自動改知識庫。
- 產出可被審稿台讀取的 `suggestions.json`，或輸出 Markdown/JSON 交給 Kevin 審核。

## 不可做的事

- 不可虛構案例、數字、制度條件或當事人對話。
- 不可把單一新聞案例寫成整體趨勢。
- 不可在未核准時自動發布到知識庫。
- 不可在排程中自動推送、改 repo、改後台或對外發送。
- 不可把暫時觀察直接寫成全域記憶或全域規則。

## 審稿 Rubric

1. 來源可信度：至少一個台灣官方、法規、制度、統計或可靠機構來源。
2. 台灣情境具體度：能落到台灣制度、生活場景、申請窗口或社工實務。
3. 案例治理：真實案例需可查證、去識別化；模擬情境需清楚標示。
4. Prompt 符合度：一般民眾版能重新理解處境；社工版能轉成判讀與介入。
5. 可行動下一步：每篇都要有檢查清單、窗口、電話、流程、文件或評估問題。

## automation 建議邊界

短期保守模式：

- 每週只產出報告與 `suggestions.json` 草案。
- 不修改正式知識庫。
- 不自動發布文章。
- 不自動推送 repo，除非 Kevin 在該次任務明確核准。

升級條件：

- 至少 2 至 3 次週報證明有用。
- Kevin 確認審稿台資料格式穩定。
- 有明確正式紀錄位置，例如 GitHub PR、Google Sheet 或知識庫 API。

## 推薦下一步

先觀察目前專案級流程。若下次週報仍需要同樣步驟，再把此草案提升為全域 Codex skill，並通過 Agent OS expansion review card。
