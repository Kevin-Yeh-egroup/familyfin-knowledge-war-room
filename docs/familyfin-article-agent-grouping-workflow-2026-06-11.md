# 好理家在文章生成 Agent 分組工作流 v1

建立日期：2026-06-11

## 目的

這份工作流把文章生成拆成分段接力，而不是把所有要求塞進同一個 writer prompt。

目標是讓文章在產出前後都能被檢查：

- 題目是否成立，且與台灣家庭經濟有關。
- 正文是否有生活帶入、改善計畫、施行效果與剩餘缺口。
- 內容是否不是概念文，也不是政策公告。
- 語氣是否像台灣一般民眾會讀下去的文章。
- 讀者模擬是否能指出「會不會想讀、哪裡掉線、是否知道下一步」。

## Agent Discussion Meeting Card

Discussion purpose:
建立一套可重複使用的文章生成分組流程，讓題目規劃、正文生成、內容檢核、台灣語氣與去 AI、讀者模擬各自有清楚責任。

Required decision:
哪些 stage 必須逐段放行、每段輸出哪些卡片、哪些失敗要退回重寫，而不是只在最後潤稿。

Stop condition:
每篇文章都通過 topic evidence、reader load、improvement plan、style variation、deAiReview、readerSimulationReview、role leak audit 與 validator。

Output format:
- Strong signals
- Useful disagreement
- Adopt now
- Validate next
- Pause
- Proof artifact

Selected agent roles:
`topic_planning_group`, `drafting_group`, `content_quality_group`, `taiwan_voice_ai_reduction_group`, `reader_simulation_group`, `final_packaging_group`

Evidence needed:
台灣最新資料、知識庫缺口、退件學習、通過稿結構卡、一般讀者語氣樣本、家庭收支與改善前後數值。

Not in scope:
自動投稿、自動核准、使用未驗證真實個案、公開審稿文字、把 SEO/AIO 或 agent 討論寫進正文。

Approval gate:
外部投稿、部署、全域 Agent OS 變更、定期自動化調整都需要 Kevin 明確同意。

## Stage 1：題目規劃組

Owner:
`topic_planning_group`

Suggested agents:
`knowledge_gap_mapper`, `tag_mapper`, `topic_evidence_planner`, `title_diversity_reviewer`

輸出欄位：
- `topicEvidenceCard`
- `tagMap`
- `readerPromise`
- `familyEconomyFit`
- `titleDiversityReview`

放行條件：
- 題目不是空想，能對應台灣家庭經濟、制度、新聞、資料或知識庫缺口。
- 單篇只處理一個主要財務問題。
- 標題不能像系列文，也不能大量使用同一個句型。

退回條件：
- 主題只是抽象概念。
- 題目與家庭經濟關聯薄弱。
- 標題像翻譯腔、政策口號或同批模板。

## Stage 2：正文生成組

Owner:
`drafting_group`

Suggested agents:
`public_writer`, `scenario_narrative_editor`, `paragraph_rhythm_editor`, `numeric_decision_writer`

輸出欄位：
- `plainTextBody`
- `readerLoadCard`
- `financialDecisionCard`
- `financialLiteracyTransfer`
- `improvementPlanCard`
- `paragraphRhythmGate`

正文要求：
- 預設只寫一般民眾版。
- 正文超過 2000 字，不含 SEO/AIO、FAQ、meta、slug。
- 可使用「姓名（化名）」或第三人稱生活切片，但不得偽裝真實案例。
- 每篇要有改善計畫、施行效果、剩餘缺口；如果無法打平，要有合理求助路徑。
- 段落要有閱讀脈絡，不能全部短句拆碎。

退回條件：
- 只是在講觀念。
- 數字沒有轉成家庭可判斷的前後差異。
- 文章同時處理太多問題，讀者無法消化。

## Stage 3：內容檢核組

Owner:
`content_quality_group`

Suggested agents:
`non_concept_reviewer`, `improvement_plan_reviewer`, `fact_case_reviewer`, `role_privacy_boundary_reviewer`

輸出欄位：
- `nonConceptReview`
- `improvementPlanReview`
- `resourceBenefitTranslation`
- `behaviorRealismReview`
- `roleIntegrityReview`

檢核重點：
- 資源段先說家庭會得到什麼幫助，再說入口或制度名稱。
- 行動建議要符合台灣常理，包含合約、面子、家人壓力、房東或雇主權力差。
- 不能把審稿建議、投稿建議、agent 討論或社工版視角混進一般民眾正文。

退回條件：
- 寫成公告。
- 建議行動一般人不太可能做，卻寫得很容易。
- 文章中出現「這篇文章應該」「可以提醒讀者」「對一般民眾版本來說」等內部語句。

## Stage 4：台灣語氣與去 AI 組

Owner:
`taiwan_voice_ai_reduction_group`

Suggested agents:
`taiwan_natural_voice_reviewer`, `human_copy_reviewer`, `phrase_variation_editor`, `awkward_phrase_reviewer`

輸出欄位：
- `styleVariationGate`
- `deAiReview`
- `taiwanNaturalVoiceReview`
- `rewriteCandidates`
- `selectedCandidate`
- `rejectedReason`

機器檢核：
- `contrast_formula_density`: `不是...而是 / 而在 / 而要 / 只是`
- 單篇最多 3 次。
- 整包總數不得超過文章篇數。
- 使用此句型的文章不得超過整包一半。
- `stable_phrase_ban`: 不得出現「怎麼做比較穩」「比較穩的做法」「比較穩的順序」「比較穩的是」「比較穩，」。
- `fake_qa_transition`: 擋下「但這個月五號怎麼辦，還是要先處理」這類假自問自答轉場。
- `真正` 單篇最多 3 次。

人工檢核：
- 每篇標出最像 AI 的 3 句轉場。
- 每句提供 2 到 3 個更像台灣人會說的替代句。
- 朗讀測試：這句話像不像一般人會在 LINE 裡跟家人說。

退回條件：
- 同一篇或同一包反覆使用同一套轉場。
- 語氣像顧問簡報、政策公告、翻譯中文或 AI 摘要。
- 只做同義詞替換，沒有回到生活句。

## Stage 5：角色模擬閱讀組

Owner:
`reader_simulation_group`

Suggested personas:
- 一般民眾：家庭帳務初學者
- 正在焦慮的照顧者
- 對補助、制度或金融程序不熟的人
- 挑剔但友善的總編輯代理

輸出欄位：
- `readerRole`
- `likelyReaction`
- `whereTheyStopReading`
- `aiOrReportLikeSentence`
- `trustOrShameRisk`
- `decisionAfterReading`
- `missingNextStep`
- `revisionPriority`
- `pass`

固定問題：
- 我會不會想繼續讀到第三段？
- 我是否知道這篇只處理一個主要問題？
- 我是否看懂改善計畫、施行效果與剩餘缺口？
- 我是否知道如果仍打不平，要先求助哪一類可靠窗口？
- 我是否覺得語氣像台灣人會說的話，而不是 AI 或公告？

邊界：
角色模擬是編輯檢查，不是真實使用者研究。不能把模擬心得寫進正文。

## Stage 6：最終包裝組

Owner:
`final_packaging_group`

Suggested agents:
`final_quality_gate`, `approval_packager`, `history_logger`

輸出欄位：
- `articlePackReviewGate`
- `articlePackHistoryRecord`
- `plainTextBodyPath`
- `copyTarget`
- `validationProof`

必跑驗證：
- `node tools/build-grounded-12-article-pack-2026-06-11.js`
- `node tools/build-article-pack-history.js`
- `node tools/validate-war-room-state.js`
- `node tools/audit-article-role-integrity.js articles/2026-06-11-grounded-12-article-pack`

## Adopt Now

- 採用 5 段 stage owner，不新增大量實體 agent。
- 把去 AI 放在二修階段，不只放在最後潤稿。
- 把整包層級句型密度納入 validator。
- 每次純文字文章包都保存 reader load、deAiReview、readerSimulationReview 與 styleVariationGate。

## Validate Next

- 用 1 到 3 篇文章小包測試 reader simulation 是否真的抓得到「不想讀」和「像 AI」。
- 把審核退件文字轉成可機器抓的 failure mode，再補進 gate。
- 觀察 Kevin 實際閱讀回饋，更新 `rewriteCandidates` 規則。

## Pause

- 暫停新增更多抽象禁用詞表。
- 暫停讓每個 reviewer 都變成獨立 agent。
- 暫停自動投稿、自動核准或自動部署。

## Proof Artifact

目前已落地：
- `styleVariationGate`
- `readerLoadCard`
- `deAiReview`
- `readerSimulationReview`
- 整包語氣密度 validator
- 文章包歷史語氣統計

驗證指令以 repo 最新狀態為準。
