# 2026-06-11 文章生成 Agent 分組工作流優化

## 本次目的

Kevin 指出目前文章生成需要明確分組，至少包含：

- 題目規劃
- 文章內文生成
- 文章內容檢核
- 台灣語氣及去 AI 敘述檢查
- 用定義角色模擬閱讀提供心得

同時指出目前正文有幾種閱讀怪感：

- 過度使用「不是...而是」
- 常出現「怎麼做比較穩」這類顧問式語句
- 假自問自答轉場，例如「但這個月五號怎麼辦，還是要先處理」

## Agent 討論收斂

Strong signals:

- 現有 gate 不需要重做，但要補整包層級語氣密度。
- 去 AI 不應只放在最後潤稿，應放在二修階段。
- 角色模擬閱讀要結構化，不能變成 persona 戲。
- 不宜新增大量實體 agent；用 stage owner 管子任務比較穩定。

Useful disagreement:

- 「不是...而是」不需要全面禁用，但要管密度、位置與是否只是抽象轉場。
- 「比較穩」不是口語禁詞，但「怎麼做比較穩」「比較穩的做法」在文章裡容易變顧問腔。
- 問號不等於自問自答，應只抓假問句轉場。

Adopt now:

- 新增 `docs/familyfin-article-agent-grouping-workflow-2026-06-11.md`。
- 更新 `.agents` roster，加入 Article Generation Grouping Overlay v2。
- 更新 project skill 的 Article output contract。
- 新增 `readerLoadCard`、`deAiReview`、`readerSimulationReview`。
- 更新 `styleVariationGate`，加入整包密度。
- 更新 validator，不只信 metadata，也會重算 TXT 正文。

Validate next:

- 用 1 到 3 篇小包測試 reader simulation 是否真的抓得到讀者掉線。
- 累積 Kevin 實際閱讀回饋後，更新 rewrite candidates。
- 若退件再出現新句型，轉成 failure mode，而不是只靠人工記憶。

Pause:

- 暫停新增更多抽象禁用詞表。
- 暫停讓每個 reviewer 都變成獨立 agent。
- 暫停自動投稿、自動核准或自動部署。

## 已落地檔案

- `docs/familyfin-article-agent-grouping-workflow-2026-06-11.md`
- `.agents/familyfin-grounded-workflow-agent-roster-2026-06-11.md`
- `.agents/skills/familyfin-grounded-workflow/SKILL.md`
- `docs/submission-quality-gate-agent.md`
- `docs/submission-article-generation-standard-v2.md`
- `docs/taiwan-natural-language-corpus-workflow-2026-06-11.md`
- `tools/build-grounded-12-article-pack-2026-06-11.js`
- `tools/build-article-pack-history.js`
- `tools/validate-war-room-state.js`

## 驗證結果

- `node tools/build-grounded-12-article-pack-2026-06-11.js`：pass
- `node tools/build-article-pack-history.js`：pass
- `node --check tools/build-grounded-12-article-pack-2026-06-11.js`：pass
- `node --check tools/build-article-pack-history.js`：pass
- `node --check tools/validate-war-room-state.js`：pass
- `node tools/validate-war-room-state.js`：pass
- `node tools/audit-article-role-integrity.js articles/2026-06-11-grounded-12-article-pack`：pass，0 matches

## 目前 12 篇語氣統計

- `不是...而是 / 而在 / 而要 / 只是`：整包 0 次，0/12 篇
- `比較穩` 高風險片語：0 次
- 假自問自答轉場：0 次
- `真正`：單篇最多 3 次

## 下一步建議

下一輪文章生成時，先用這套流程跑 2 到 3 篇，不要一開始就跑滿 10 篇。Kevin 讀完後若仍覺得像 AI 或不順，要把實際句子補進 `styleVariationGate` 或 `deAiReview` 的 failure mode。
