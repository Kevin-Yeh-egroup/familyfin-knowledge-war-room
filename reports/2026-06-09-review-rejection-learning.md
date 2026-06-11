# 2026-06-09 日報：大量審核駁回回讀與文章重生前規則調整

## 摘要

本次已重新讀取好理家在文章管理區的事件索引與審核駁回資料。最新事件總數為 2086，其中審核駁回 350 筆；相較 2026-06-03 先前確認的 290 筆，增加 60 筆。完整審核內容從 20 筆提升到 51 筆，可交叉學習卡從先前不足門檻提升到 50 筆。

## 重要發現

- 大量駁回並不是單一問題，而是集中在概念化、數字合理性、平台主軸、重複題材與處遇建議不精準。
- 這代表文章生成不能只補數據，也要先判斷題目是否真的服務家庭經濟與台灣生活決策。
- 最新資料已足夠支撐重新生成正式文章包，但每篇仍需先經過 6/9 gate round。

## 已落地調整

- 新增公開安全衍生資料：data/review-rejection-learning-2026-06-09.json
- 新增最新投稿品質 gate：data/submission-quality-gates-2026-06-09.json
- 更新規則文件：docs/submission-quality-gate-rulebook.md
- 更新 agent 規格：docs/submission-quality-gate-agent.md
- 新增規則增量：docs/reviewer-rule-delta-2026-06-09.md

## 下一步

- 依 6/9 gate 重新生成一般民眾版純文字文章包。
- 更新 suggestions.json 的 reviewRejection 指標，移除舊的 3/8 blocker。
- 跑 validator，確認文章包綠燈、字數、角色一致、標題新意與知識庫標題比對。
