# 2026-06-02 Agent 訓練與審查駁回交叉學習優化日誌

## Kevin 需求

Kevin 希望針對 agent 相關訓練法進行 websearching，整理如何提供資訊、累積經驗、尋找資料與建立方法論，並優化目前好理家在知識庫戰情室 agent。

Kevin 也要求確認先前訓練是否做到：

1. 把評論中的文章與審核中的評語交叉對照學習。
2. 用 agent 討論與學習差異，累積相關經驗。

## Agent OS 啟動與路由

已讀取最新共享 Agent OS：

- `STARTUP.md`
- `AGENTS.md`
- `registry/agent-roster.md`
- `workflows/task-start-agent-routing.md`
- `workflows/workflow-review-and-optimization.md`
- `workflows/periodic-governance-check.md`
- `workflows/agent-creation-training-standard.md`

任務分類：

- Agent training
- Workflow optimization
- Knowledge research
- Project-local frontend/data update

治理判斷：

- 本次只更新 `familyfin-knowledge-war-room` 專用規格。
- 不升級成全域 Agent OS 規則。
- 不寫入全域 memory。
- 不修改 InfoCenter 或正式知識庫。

## Websearching 方法論

本次參考：

- OpenAI agent guide：agent 應有 guardrails、handoffs、human intervention。
- OpenAI agent evals / trace grading：應看 workflow trace，不只看最後輸出。
- OpenAI Agents SDK guardrails：input、output、tool guardrails 應放在不同 workflow 邊界。
- Anthropic effective agents：prompt chaining、routing、parallelization、evaluator-optimizer 適合不同任務。
- Google Agents whitepaper：RAG、data stores、retrieval-based in-context learning 與 targeted learning 可提供專門知識。

轉成好理家在規則：

- 不把訓練理解為 prompt 變長。
- 每篇文章要有 `source plan` 與 `claims table`。
- 用成功稿與退修稿建立 retrieval 案例庫。
- 用 trace 紀錄來源、reviewer、guardrail、退修段落與人工審核結果。
- 用 eval cases 檢查 groundedness、source quality、讀者可讀性、品牌語氣、風險合規與非概念文。
- 每次退修、駁回、核准都要形成 learning card。

## 現況稽核結論

目前可以確認已完成：

- 2026 則 InfoCenter 事件列表掃描。
- 540 篇可學文章正文。
- 340 篇成功樣本正文。
- 187 篇退修或駁回樣本正文。
- 成功稿與退修/駁回稿的群體差異學習。
- 非概念文、讀者吸引力、數值化證明、書寫角度 reviewer。
- 學習資料庫欄位草案。

目前不能確認已完成：

- 評論中的文章全文與審核評語原文逐則配對。
- 每則駁回/退修評語與原稿段落逐段對照。
- 每則事件的 agent 討論 trace。

因此本次明確標示：

目前是「文章正文 + 審核狀態」的群體學習已完成；「評論文章 + 審核評語原文 + 修正建議」的逐則交叉學習仍需補齊。

## 本次落地更新

- 新增 `docs/agent-training-and-review-feedback-loop.md`。
- 更新 `suggestions.json`，加入 `agentTrainingOptimization` 與 `Review Contrast Learning Loop`。
- 更新 `index.html`，新增「Agent 訓練閉環」區塊。
- 更新 `docs/chronological-learning-runbook.md`，修正批次完成狀態並加入下一階段交叉學習。
- 更新 `docs/submission-article-generation-standard-v2.md`。
- 更新 `docs/non-concept-article-review-agent.md`。
- 更新 `README.md` 與 `PUBLICATION_CHECKLIST.md`。
- 更新 `automation-14`，下一輪每週五流程會納入 source plan、claims table、trace 摘要、review_event_pairs、review_contrast_cards 與 eval cases。

## 下一步規格

下一輪進入 InfoCenter 事件列表時，優先確認：

- 每則事件是否可讀到評論中的文章。
- 每則事件是否可讀到審核評語或駁回原因。
- 是否可建立去識別化 `review_event_pairs`。
- 是否可產出 `review_contrast_cards`。

若評語原文不可讀，需回報資料缺口，不得宣稱已完成逐則交叉學習。
## Production publish proof

- Commit: `8c0cb6f Add agent training feedback loop`
- GitHub: pushed to `origin/main`
- Vercel production URL: `https://familyfin-knowledge-war-room.vercel.app/`
- Deployment inspect URL: `https://vercel.com/egroup-task3s-projects/familyfin-knowledge-war-room/H99yKYYF9sEU8dRiC2yqoRx2qP2e`
- Verification:
  - `200 OK`
  - `X-Robots-Tag: noindex, nofollow, noarchive`
  - `robots.txt` keeps `Disallow: /`
  - HTML contains `Agent 訓練閉環`
  - HTML contains `人工審核意見 / 退修原因`
  - HTML and `suggestions.json` no longer expose `SEO/AIO` wording in the workbench surface
  - `suggestions.json` contains `agentTrainingOptimization`
  - `suggestions.json` keeps `hasCommentArticleToReviewCommentPairing = false` and `hasPerEventAgentDiscussionTrace = false` until actual per-event review feedback is available
