# 2026-06-12 文體變奏與成功/駁回學習規則

## 任務

Kevin 希望每次文章生成不要都長得一樣。每週更新與文章生成時，agent 應先討論本次要用哪些不同寫法與文體，並持續從事件列表中的成功投稿文章、審核駁回文章正文與審核內容中累積經驗。

## Agent OS 收斂

- `familyfin_grounded_orchestrator`：本次不是重寫正文，而是把「文體變奏」變成生成前必過流程。
- `real_feedback_miner`：成功稿只學去識別結構，駁回稿只學失敗原因與修正規則。
- `review_contrast_miner`：要求將評論中的文章、審核內容、駁回原因與成功稿特徵交叉對照。
- `writing_form_variety_reviewer`：每篇文章需先選定不同敘事形式，再進入正文生成。
- `human_copy_reviewer`：若一包文章讀起來像同一個模板，不能只改句子，要回到題目切角與文體選型。
- `role_privacy_boundary_reviewer`：公開 repo 只保存去識別學習結論，不保存 InfoCenter 私有全文、審核原文、事件 ID 或個資。

## 本次新增規則

每篇文章新增 `writingFormDiversityReview`，必須記錄：

- `selectedForm`：本篇使用的文體或敘事形式。
- `articleMove`：本篇如何推進，不只是主題名稱。
- `agentDiscussionStages`：需包含成功稿結構、駁回對照、文體變奏、台灣語氣與 final gate。
- `learningSources`：需包含通過稿結構卡、駁回學習資料與對照卡。
- `revisionMove`：若文章讀起來和同包其他稿件太像，退回題目規劃與文體選型重生。

同一包 12 篇文章至少要使用 8 種不同文體。本次正式文章包已分配 12 種：

1. `calendar_pressure_story`
2. `day_schedule_conflict`
3. `ledger_repayment_reveal`
4. `red_yellow_green_sorting`
5. `hidden_cost_accumulation`
6. `thirty_day_recovery_map`
7. `paycheck_split_scene`
8. `fixed_bills_warning`
9. `three_month_stabilization_path`
10. `risk_layering_family_talk`
11. `reader_question_problem_solver`
12. `hospital_to_home_cashflow`

## 已接入的檔案

- `tools/build-grounded-12-article-pack-2026-06-11.js`
- `tools/validate-war-room-state.js`
- `tools/build-article-pack-history.js`
- `suggestions.json`
- `article-pack-history.json`
- `docs/submission-article-generation-standard-v2.md`
- `.agents/familyfin-grounded-workflow-agent-roster-2026-06-11.md`
- `.agents/skills/familyfin-grounded-workflow/SKILL.md`

## 驗證結果

- `node tools/build-grounded-12-article-pack-2026-06-11.js`：通過，12 篇正文皆超過 2000 字。
- `node tools/build-article-pack-history.js`：通過，文章包歷史保留文體統計。
- `node tools/validate-war-room-state.js`：通過。
- validator 顯示 `article pack writing form diversity`：12 unique forms / 12 articles。
- validator 顯示 `article-pack-history writing form diversity`：12 unique forms / 12 articles。

## 下一步

下次週報若取得新的成功投稿或審核駁回資料，需新增「文體與退件學習」摘要，說明下次文章包要如何調整：

- 題目切角
- 開頭方式
- 敘事形式
- 改善計畫
- 結尾收束
- 避免同質化的具體做法
