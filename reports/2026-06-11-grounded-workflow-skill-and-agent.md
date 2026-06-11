# 2026-06-11 FamilyFin Grounded Workflow Skill And Agent

## 背景

Kevin 指出，這次討論不只應用在文章寫作。

未來所有好理家在知識庫戰情室工作，包括檢查、工具生成、文章生成、週報、工作台、agent 討論與品質 gate，都需要同一套接地氣判斷：

- 事實要符合台灣現況。
- 語氣要從真實回饋與公共討論學，而不是只模仿官方說明。
- 行動建議要符合一般台灣人的生活習性、面子、合約、關係壓力與真實可行性。
- 工具與工作台也要符合真實使用流程，不只資料結構正確。

## 已建立

1. 專案內 skill：
   - `.agents/skills/familyfin-grounded-workflow/SKILL.md`

2. 專案內 agent roster：
   - `.agents/familyfin-grounded-workflow-agent-roster-2026-06-11.md`

3. 語感與行動常理資料：
   - `docs/taiwan-natural-language-corpus-workflow-2026-06-11.md`
   - `data/taiwan-natural-language-feedback-seeds-2026-06-11.json`
   - `data/taiwan-behavior-realism-feedback-seeds-2026-06-11.json`

## 適用範圍

- 文章生成與修稿。
- 投稿前品質檢查。
- 審核駁回學習。
- 戰情室週報。
- 新增建議工作台。
- 審核台、複製工具、下拉選單、公開/私有資料邊界。
- 自動化與 agent 工作流提案。
- 未來所有和好理家知識庫有關的工具生成。

## 核心流程

route
-> facts
-> real feedback
-> Taiwan habit
-> resource benefit
-> scenario/workflow
-> create
-> voice/usability
-> numeric/decision
-> privacy/role
-> final gate

## 不做什麼

- 不自動投稿。
- 不自動核准。
- 不把私有審稿原文、留言個資或 agent 討論放進公開輸出。
- 不把官方語氣當成自然語氣。
- 不把一般人不太會做的行動寫成簡單技巧。
- 不把工具做成只符合資料結構、但不符合真實使用流程。

## 驗證

- Kevin 已明確同意擴展到全域。
- 已建立全域 Codex skill：`C:\Users\Kevin\.codex\skills\familyfin-grounded-workflow\SKILL.md`
- 已建立全域 Agent OS workflow：`C:\Users\Kevin\Documents\Codex\agent-os-home\codex-os\workflows\familyfin-grounded-staged-workflow.md`
- 已更新 Agent OS roster，新增 FamilyFin grounded work 的預設小組討論分工。
- 外部動作仍維持審批：不自動投稿、不自動核准、不自動部署、不公開私有審稿資訊。
