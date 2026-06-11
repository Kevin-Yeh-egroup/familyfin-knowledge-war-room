# 2026-06-08 純文字文章包綠燈審核迴圈設計紀錄

## 本次補強原因

Kevin 補充要求：純文字文章包都要先審過一輪，不是綠燈就要直接回到生成端調整，直到綠燈為止。

這代表投稿 gate 不能只當成「投稿前打分與退件」。  
它必須變成文章生成時的建議與限制，讓每篇文章在進入核准工作台前，已經先經過一次完整的生成審核。

## 要保留的原始效果

原本戰情室的效果是：

1. 產出 Kevin 可點開、可複製、可核准的純文字文章包。
2. 將退稿意見、標題相似、非概念化、數字證明、台灣資料查核等規則前移到產稿前。
3. 每次產包或 blocked attempt 都要留下可回查紀錄。

本次優化要保留這三件事，但加上一個硬規則：  
沒有生成審核綠燈的文章，不得出現在「可投稿初稿」工作台。

## Agent 討論後的收斂

### Strong signals

1. 退稿學習最有價值的地方，不是最後判斷好壞，而是讓下一篇文章一開始就不要走錯方向。
2. 「非概念」不能只靠數據堆疊，還要有家庭經濟情境、收支前後差異、改善關鍵與生活選擇。
3. 「角色錯亂」是重大信任風險，所以 agent 討論、審稿建議、SEO/AIO、投稿指示都不能進正文。
4. 審核結果必須可驗證，不應只寫「已討論」「已學習」。

### Useful disagreement

一種做法是產完後才在投稿前 gate 打分。  
另一種做法是把 gate 變成生成迴圈的一部分。

本次採用第二種。原因是 Kevin 要的是可直接投稿的文章，不是讓 Kevin 在工作台替 agent 擋錯稿。

## 採用的流程

每篇純文字文章包進入工作台前，必須有 `articlePackReviewGate`：

1. `status` 必須是 `green`。
2. `round` 必須至少 1。
3. `reviewers` 必須記錄參與檢查的 agent 角色。
4. `revisionRequiredWhen` 必須說明什麼狀況要退回生成端。
5. `revisionMove` 必須說明要改哪裡，不只是寫「請修正」。

若任何一篇是 yellow、red、not_reviewed 或缺欄位，validator 直接 fail。  
處理方式不是送 Kevin 核准，而是回到生成端調整題目、資料、數字、角度、正文或結尾。

## Reviewer 分工

- `pack_review_orchestrator`：負責審核流程與是否放行。
- `source_scout`：查核最新台灣政策、補助、地方規範與來源。
- `title_similarity_screener`：檢查同批與知識庫標題是否過近。
- `content_difference_reviewer`：確認是否有新家庭情境、新數字、新判斷。
- `numeric_proof_reviewer`：檢查收支、缺口、前後差異與改善關鍵。
- `writing_angle_reviewer`：檢查一般民眾角度、台灣語感與不該出現的語句。
- `reader_appeal_reviewer`：檢查是否像真人文章，而不是 AI 筆記或引用拼貼。
- `role_leak_reviewer`：阻擋審稿語、agent 討論、社工版建議與投稿說明混入正文。
- `quality_reviewer`：做最後綠燈、黃燈、紅燈判斷。

## 已落地檔案

1. `tools/build-public-article-pack-2026-06-03.js`
   - 每篇文章新增 `articlePackReviewGate`。
   - `suggestions.json` 新增 `articlePackGreenReviewPolicy`。
   - `exportMode` 加上 `greenReviewRequired` 與 `greenReviewLoopRequired`。

2. `tools/validate-war-room-state.js`
   - 新增 article pack green review 硬檢查。
   - 非綠燈、缺審核輪次、缺 reviewer、缺回修規則都會 fail。

3. `index.html`
   - 文章列表顯示生成審核是否綠燈。
   - 文章詳情顯示 reviewer、輪次與非綠燈處理方式。

4. `article-pack-history.json`
   - 每次純文字文章包都要留下是否通過綠燈審核的批次紀錄。

## Governance 判斷

目前先保留為 project-local workflow。  
原因是這個綠燈迴圈還需要至少跑過一到兩次新的正式產包，才能判斷是否值得升級為全域 skill 或 Agent OS roster。

若下一次雙週產稿證明它能降低退修、避免角色錯亂、提升文章可投稿率，再考慮推進成全域 skill。

## 下一次正式產稿時的停止規則

1. 任何一篇未綠燈，不顯示為可投稿。
2. 若資料查核不足，產 blocker report，不硬寫十篇。
3. 若文章仍像概念文，回修家庭情境、數字與前後差異。
4. 若結尾弱，回修最後一段，不只改一句漂亮話。
5. 若正文出現審稿建議、agent 討論或投稿語，整篇退回重生。
