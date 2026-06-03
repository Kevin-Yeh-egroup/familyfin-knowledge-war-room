# Agent 訓練與審查駁回交叉學習規格

建立日期：2026-06-02

## 目的

好理家在知識庫戰情室的 agent 不能只靠一次 prompt 或一次讀全文完成訓練。

真正有用的訓練，需要把「文章內容」「審核狀態」「評論中的文章」「審核或駁回評語」「修正後版本」放在同一個可回查的學習閉環裡。

本規格用來補強兩件事：

1. 讓 agent 能交叉對照評論中的文章與審核評語。
2. 讓不同 reviewer agent 討論差異，並把經驗累積成下次可檢查的規則。

## Websearching 轉成的方法論

### 一、agent 需要可觀察的任務軌跡

OpenAI 的 agent evals 與 trace grading 強調，agent 品質不能只看最後輸出。需要檢查整個流程：有沒有選對工具、是否正確 handoff、是否違反規則、prompt 或 routing 改動是否真的改善結果。

轉成好理家在規則：

- 每篇文章生成都要留下 agent 討論摘要。
- 每次退修或駁回都要形成學習卡。
- 學習卡要能回推：哪個 reviewer 沒有抓到、哪條規則需要升級、下次如何避免。

### 二、agent 工作流要分段，而不是全部塞在一個 prompt

Anthropic 的 effective agents 方法把 agentic system 分成 prompt chaining、routing、parallelization、orchestrator-workers、evaluator-optimizer 等工作流。

轉成好理家在規則：

- 先 routing：預設文章為一般民眾版，再判斷是制度資源型、風險預防型或家庭經濟轉譯型；只有 Kevin 明確指定時才改成社工版。
- 再 chaining：資料查核、角度設定、數值化證明、寫稿、非概念檢查、讀者吸引力檢查、品質判定依序進行。
- 再 evaluator-optimizer：退修或駁回後，不直接重寫全文，而是先指出失敗段落、失敗原因、修正規則，再重寫。

### 三、知識要用 retrieval 與案例庫，而不是只靠模型記憶

Google Agents whitepaper 將 agent 可用資訊分成工具、函式與 data stores，也提到 targeted learning：可用 in-context examples、retrieval-based in-context learning 與 fine-tuning 類方式提供任務知識。

轉成好理家在規則：

- 建立「好文章案例庫」與「退修/駁回案例庫」。
- 每次生成文章前，依標籤、讀者版本、問題類型取回最相關的成功與失敗樣本摘要。
- 失敗樣本不是拿來模仿，而是拿來建立禁止規則。
- 每篇文章先產出 `source plan`，列出必查官方來源、可用新聞案例、不可引用來源與需要即時搜尋的事實。
- 正文前先建立 `claims table`，每個關鍵主張綁定來源、年份、可信度、風險等級與是否需要人工複核。

### 四、guardrail 要放在每個關鍵步驟

OpenAI Agents SDK guardrails 區分 input、output、tool guardrails；若工作流中有多個 agent 或工具，不能只靠最後輸出檢查。

轉成好理家在規則：

- 資料查核步驟要有「最新台灣資料」 guardrail。
- 寫作角度步驟要有「不責備、不教訓」 guardrail。
- 正文輸出步驟要有「角色一致與內部語言隔離」 guardrail，禁止把作者建議、審稿語、讀者版本語、投稿語或 agent 討論寫進正文。
- 數值化步驟要有「示意數字不可冒充真實案例」 guardrail。
- 投稿前要有「純文字、正文 2000 字以上、無 SEO/AIO 顯示」 guardrail。

### 五、human review 是訓練資料，不是例外狀況

OpenAI agent guide 強調 human intervention 可協助找出失敗、邊界案例並建立評估循環。

轉成好理家在規則：

- Kevin 的退修、駁回、核准不是本機狀態而已，應進入學習卡。
- 每次人工審核都要留下「為什麼通過 / 為什麼退修 / 為什麼駁回」。
- 同類問題出現 2 次以上，升級成下週必查門檻。

## 目前訓練狀態稽核

### 已完成

- 已掃描 InfoCenter 事件列表 2026 則。
- 已從最早文章開始分批讀完可學文章正文。
- 已建立成功樣本、退修/駁回樣本、處理中樣本的統計。
- 已初步比較成功文章與退修/駁回文章的群體差異。
- 已建立非概念文、讀者吸引力、數值化證明、書寫角度 reviewer。
- 已建立學習資料庫欄位草案。

### 尚未完整完成

目前公開 repo 沒有足夠證據顯示已經逐則完成：

- 評論中的文章全文。
- 審核中的評語原文。
- 被駁回或退修的具體評論。
- 原稿與評語逐段對照。
- agent 對每一則差異的討論紀錄。

因此不能宣稱「已完成逐則交叉對照學習」。

目前比較接近的是：

- 已完成「文章正文 + 審核狀態」的群體學習。
- 尚需補齊「文章正文 + 評論/評語原文 + 修正建議」的逐則學習。

## 新增工作流：Review Contrast Learning Loop

### Step 1：擷取事件配對

每則事件建立一個配對單位：

- event_id
- article_id
- article_title
- article_body_excerpt
- article_status
- comment_article_excerpt
- review_comment_text
- reviewer_decision
- review_timestamp
- source_location

公開 repo 只保存摘要與規則，不保存未去識別化全文。

### Step 2：建立差異對照

每則退修或駁回至少建立：

- 原稿問題段落。
- 評語指出的問題。
- 問題類型。
- 通過稿是否有相反特徵。
- 可檢查規則。
- 修正後示範句。

### Step 3：召集 reviewer 討論

每則對照至少由這些 reviewer 產出一句判斷：

- `review_feedback_miner`：這則評語要變成哪條規則？
- `article_pattern_miner`：通過稿和退修稿差在哪裡？
- `writing_angle_reviewer`：讀者角度是否錯位？
- `numeric_proof_reviewer`：是否缺少數值差異或改善關鍵？
- `non_concept_reviewer`：是否只是概念描述？
- `reader_appeal_reviewer`：哪裡讓人不想讀？
- `role_leak_reviewer`：哪裡混入作者建議、審稿語、投稿語、知識庫語或角色錯位？
- `quality_reviewer`：下次投稿前要怎麼擋下同類問題？

### Step 4：升級規則

同一問題類型：

- 出現 1 次：保留為學習卡。
- 出現 2 次：下週文章包列入提醒。
- 出現 3 次以上：升級為必查門檻。
- 若問題涉及政策、補助、數字或法規錯誤：立即升級為必查門檻。

### Step 5：建立 trace 與 eval 紀錄

每篇文章至少保存一份 trace 摘要：

- 使用哪些來源。
- 哪些來源被排除，原因是什麼。
- 取回哪些成功樣本與退修樣本。
- 哪些 reviewer 被召集。
- 哪些 guardrail 被觸發。
- 哪些段落被退修。
- 最後狀態與人工審核結果。

每週至少抽樣建立小型 eval：

- 文章是否 grounded。
- 來源是否最新且符合台灣。
- 一般民眾版是否可讀且不責備。
- 是否全部預設一般民眾版；若有社工版，是否有 Kevin 明確指定。
- 正文是否沒有角色錯亂、後台語或內部建議外洩。
- 是否有數值化差異與改善關鍵。
- 是否避免 AI 感、引用感與概念文。

### Step 6：回寫工作台

工作台應顯示：

- 本週新增學習卡數。
- 已完成交叉對照數。
- 尚缺評語原文數。
- 已升級必查規則數。
- 哪些 reviewer 最常抓到問題。
- 哪些 reviewer 漏判，需調整規則。

## 資料表建議

### review_event_pairs

- event_id
- article_id
- title
- status
- article_source
- has_comment_article
- has_review_comment
- has_rejection_reason
- has_revision_suggestion
- learning_ready
- privacy_level

### review_contrast_cards

- card_id
- event_id
- article_id
- original_issue_excerpt
- review_comment_summary
- reviewer_decision
- problem_type
- contrast_with_success_pattern
- checkable_rule
- suggested_rewrite
- promote_level

### agent_learning_discussions

- card_id
- review_feedback_miner_note
- article_pattern_miner_note
- writing_angle_reviewer_note
- numeric_proof_reviewer_note
- non_concept_reviewer_note
- reader_appeal_reviewer_note
- quality_reviewer_note
- final_learning
- next_prompt_update

### eval_trace_records

- run_id
- article_id
- source_plan
- claims_table_status
- input_sources_used
- retrieved_success_examples
- retrieved_rejected_examples
- reviewers_invoked
- guardrails_triggered
- final_status
- human_review_result
- regression_detected

### eval_cases

- case_id
- topic
- audience
- expected_quality
- bad_pattern_to_avoid
- grading_rubric
- source_requirements
- last_run_result

## 成功標準

agent 真的有學到，不是因為它讀過很多文章。

而是因為它能做到：

- 看到一篇新稿時，知道它像哪一類成功稿或退修稿。
- 能指出「這段為什麼會被退修」。
- 能把審核評語轉成下一次可檢查的規則。
- 能用 reviewer 討論留下決策軌跡。
- 能在下次生成前取回相似案例，避免重犯。

## 治理邊界

本規格目前是 `familyfin-knowledge-war-room` 專用流程，不升級成全域 Agent OS 規則。

原因：

- 依賴好理家在 InfoCenter 事件列表、評論欄與文章管理狀態。
- 需要先取得並驗證審核評語原文來源。
- 涉及內部評論與文章全文，公開 repo 只能保存摘要、規則與去識別化學習結果。

若未來連續 2 到 3 次週五流程都能穩定產出 review contrast cards，再評估升級成好理家在文章生成 skill。
