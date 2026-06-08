# 2026-06-08 投稿檢核機制聊天本體回查與戰情室優化紀錄

## 回查範圍

- 來源：Codex thread「檢核投稿機制」
- 回查重點：投稿審核流程、標題相似、正文差異、案例數字、agent / skill 候選規格
- 本報告只記錄公開安全的流程學習，不保存內部作者姓名、事件 ID、評論正文或審稿原文。

## 本次讀到的關鍵發現

1. 投稿問題不只是「抄襲」或「內文相似度」。
   更常見的風險是沿用既有成功題名、加長副標、同批重複題目，或正文雖然沒有大量逐字重疊，但沒有提供新的案例、數字與判斷。

2. 標題是第一提醒點，但不能只看標題。
   需要同時看標題、正文內容、案例角色、金額/比例/時間、段落順序、核心建議與結尾判斷。

3. 相似度分數只是訊號，不是判決。
   機器分數用來提示風險，agent 要補上「哪裡相同、哪裡不同、是否真的新增讀者價值」，最後仍需人工審稿決定。

4. 「缺案例數字」要拆得更細。
   不是文章有日期、法條、步驟或泛泛的百分比就算有數字。數字要能支撐家庭財務判斷，例如收支前後差異、月付壓力、缺口大小、時間差或改善關鍵。

5. 投稿審核的學習應該前移到產稿前。
   戰情室不應只在文章產完後打分退件，而要在題目規劃時先檢查：是否和既有文章太像、是否有新情境、新數字、新決策過程。

## 已落地調整

1. `tools/validate-war-room-state.js`
   - 新增同批標題新意檢查。
   - 阻擋正規化後相同標題。
   - 阻擋 90% 以上近似標題。
   - 阻擋核心題名被完整包進另一個長副標的情形。
   - 輸出 title novelty 統計到 validator 結果。

2. `tools/build-public-article-pack-2026-06-03.js`
   - 新增標題正規化與相似度 gate。
   - 每篇文章 metadata 加入 `titleNoveltyReview`。
   - `suggestions.json` 會記錄 `titleNoveltyGateRequired`、`contentDifferenceReviewRequired`、`submissionSimilarityMethodologyIntegrated`。
   - 新增 `submissionSimilarityLearningPolicy`，把投稿檢核的學習轉成產稿前規則。

3. `docs/biweekly-prewrite-checklist-2026-06-08.md`
   - 新增「投稿檢核機制回填 gate」。
   - 每篇候選題開寫前需補 `similar_existing_topic`、`title_risk`、`new_reader_value`、`content_difference_plan`、`case_number_decision_plan`。
   - 明確要求同題可以寫，但必須有新家庭情境、新數字、新判斷。

## Agent 討論後的操作原則

### 題目規劃

每篇候選題要先回答一句話：

這篇和既有知識庫文章相比，新增給讀者的價值是什麼？

若答案只是「寫得更白話」「換一個角度」「補一些數字」，還不夠。  
需要具體到家庭情境、數字缺口、前後差異或決策順序。

### 正文生成

正文不能只把資料排進文章。  
每篇至少要呈現：

- 一個具體家庭或生活情境。
- 一組收入、支出、缺口、時間差或風險數字。
- 一段調整前後差異。
- 一到三個改善關鍵。
- 一個回到生活選擇的結尾。

### 審核輸出

若未來做投稿審核報告，不再使用「優先處理稿件」作為主要呈現。  
應改為逐篇列出：

- 標題提醒。
- 內容相似與差異。
- 案例數字狀態。
- 決策歷程是否足夠。
- 建議處置。

## 待補事項

1. 最新知識庫題名索引已完成第一版接入；後續正式產稿前仍需先執行 `node tools/build-knowledge-base-title-index.js` 取得最新公開標題。
2. 若 InfoCenter live review/comment 仍未完成交叉對照，正式文章包應維持 blocked 或小批次試產。
3. 投稿審核 skill / agent 候選規格目前仍停在另一個專案輸出資料夾，尚未升級為全域 skill 或 Agent OS roster。
4. 若要升級，需先做 governance review，確認資料權限、人工覆核、證據格式與 no-op 規則。
