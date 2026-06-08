# 好理家在知識庫戰情室

這個 repo 是好理家在知識庫戰情室的公開 review package。

目前用途：

- 盤點好理家在知識庫與 InfoCenter 文章管理結果。
- 讓 Codex / agent 從文章全文、狀態、標籤與退修意見中學習好文章標準。
- 每週產出知識庫擴充建議與 10 篇可投稿文章草稿。
- 以週報方式回看上一次與歷次任務的分析整理、執行日誌、阻擋原因與下一步。
- 記錄每次純文字文章包的產出批次、狀態、篇數、字數範圍、檢查結果與未產出原因。
- 以 validator 檢查工作台資料、文章包紀錄、非空白正文 2000 字 gate、role leak 與 history drift。
- 提供 Kevin 可點選全文、複製純文字、核准、退修、駁回、分類存放的審核台。
- 透過 GitHub + Vercel Production 提供穩定 public review URL。

## 目前狀態

- 正式索引已發布文章：1320
- 草稿文章：27
- InfoCenter 事件列表：2026
- 已完成全文學習批次：17
- 可學文章正文：540
- 成功樣本：340
- 退修/駁回樣本：187
- 首批純文字投稿草稿：10

## 本次規則升級

- 工作台不再顯示 Markdown、SEO、AIO、Meta、Slug 或 FAQ 欄位。
- 投稿預覽與複製輸出改為純文字 TXT。
- 字數門檻改為正文超過 2000 字，不含平台欄位與審核紀錄。
- 新增「非概念文檢查 agent」與 `reader_appeal_reviewer`，每週投稿包都要檢查文章是否太概念、引用感太重、AI 感太強或不吸引讀者。
- 新增 `numeric_proof_reviewer`，把「不要概念文」拆成可檢查的數值化證明：每篇至少要有具體數值、前後差異示例與改善關鍵因素。
- 新增 `writing_angle_reviewer`，分開檢查一般民眾版與社工版的切入角度，避免責備、教訓、政策報告感或 AI 摘要感。
- 新增學習資料庫欄位規格，用來累積文章角度、數值證明、退修意見、禁用語句與 agent 討論紀錄。
- 新增 Agent 訓練閉環規格：將評論文章、審核評語、退修差異、agent 討論與學習卡串成 `Review Contrast Learning Loop`。
- 目前可確認已完成「文章正文＋審核狀態」的群體學習；尚未能確認已逐則完成「評論文章全文＋審核評語原文」的交叉對照，下一輪流程會優先補齊。
- 退修/駁回建議會優先轉成下週必查規則。
- 正文長度以「非空白字數」作為硬性 gate；低於或等於 2000 不得標示為可投稿。
- 標題新意與內容差異已納入產稿前 gate：同批標題不得正規化重複、近似或互相包含核心題名；與既有題目相近時，必須先寫出新情境、新數字與新判斷。
- 既有知識庫標題索引已接入 validator；正式產稿前需先更新 `data/knowledge-base-title-index.json`，再檢查候選題是否撞到站上既有標題。
- 雙週正式 10 篇文章包產出前，需先通過 prewrite checklist 與 validator；若 live review/comment learning 不足，應產 blocker report，不硬湊文章。

## 每週自動化

- Automation ID：`automation-14`
- 名稱：好理家在每週知識庫擴充與投稿文章包
- 時間：每週五 14:00 Asia/Taipei
- 邊界：只產出草稿包與擴充建議，不自動上架、不自動送審、不修改 InfoCenter。

## 主要檔案

- `index.html`：10 篇純文字投稿文章工作台。
- `suggestions.json`：學習統計、品質門檻、文章 metadata、非概念檢查 agent 規則。
- `analysis-history.json`：公開安全的週報紀錄與歷次分析紀錄，可在首頁展開與複製。
- `article-pack-history.json`：純文字文章包產出紀錄，包含已產出文章包與 blocked 未產出紀錄。
- `data/knowledge-base-title-index.json`：公開知識庫文章標題索引，只保存公開標題與正規化標題，不保存正文。
- `tools/build-analysis-history.js`：從 `reports/` 與 `logs/` 重建週報與分析紀錄資料檔。
- `tools/build-article-pack-history.js`：從 `articles/`、`suggestions.json` 與日誌重建文章包產出紀錄。
- `tools/build-knowledge-base-title-index.js`：從好理家在公開知識庫 API 更新既有文章標題索引。
- `tools/validate-war-room-state.js`：檢查 JSON、目前文章包非空白字數、role leak、gate count 與文章包 history drift。
- `reports/2026-06-08-submission-mechanism-chat-review.md`：回查「檢核投稿機制」聊天本體後，轉成戰情室產稿前標題新意與內容差異 gate 的紀錄。
- `articles/2026-06-02-weekly-pack/`：首批 10 篇純文字文章。
- `docs/biweekly-prewrite-checklist-2026-06-08.md`：雙週正式產稿前的題材、claims table、標題、正文與紀錄 checklist。
- `reports/2026-06-08-source-of-truth-reconciliation.md`：repo、history、report、automation/experiment 邊界對帳。
- `docs/submission-article-generation-standard-v2.md`：可投稿文章生成標準 v3。
- `docs/non-concept-article-review-agent.md`：非概念文檢查 agent 規格。
- `docs/agent-training-and-review-feedback-loop.md`：Agent 訓練方法與審查駁回交叉學習規格。
- `docs/label-review-rejection-learning-audit.md`：標籤審核駁回學習稽核，記錄審核內容需點開審核狀態列才可讀取。
- `docs/numeric-proof-writing-angle-reviewers.md`：數值化證明與寫作角度 reviewer 規格。
- `docs/readability-research-20260602.md`：知識型文章可讀性研究摘要。
- `docs/current-taiwan-data-verification-rules.md`：台灣最新資料與補助規範查核規則。
- `reports/2026-06-02-full-learning-summary.md`：全文學習總結。
- `logs/2026-06-02-full-learning-and-automation-log.md`：學習與 automation 日誌。

## 安全邊界

- 本 repo 不保存 InfoCenter 原始全文學習包。
- 本 repo 不保存內部評論原文、Cookie、Token、私有 API 回應或未匿名個案資料。
- `noindex` 不是隱私保護；目前僅用於 review 階段避免搜尋收錄。
- 核准後的文章仍需 Kevin 或文章管理端確認，才可進入正式知識庫上架流程。

## Production

Stable URL：<https://familyfin-knowledge-war-room.vercel.app/>
