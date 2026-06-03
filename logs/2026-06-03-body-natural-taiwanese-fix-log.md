# 2026-06-03 正文台灣中文語感修正日誌

## 觸發

Kevin 回饋：前一輪已把標題改得比較自然，但這個語感也應該擴展到正文。

本次修正重點不是只替換幾個詞，而是把「讀得懂但不像台灣人會自然這樣說」列為正文品質 gate。

## 發現

- 部分正文仍有翻譯腔或顧問簡報語，例如「收入空窗」「進帳空窗」「財務止血」「承接風險」「正式資源」「策略可以是」「生活被接住」。
- 這類語句意思可懂，但會讓一般民眾讀者覺得不像在談自己的生活。
- 若只修標題，正文仍可能出現同一種抽象腔調，文章會變得像內部訓練材料。

## 修正

- 重寫 6 篇正文中較明顯的語感問題句。
- 在文章包生成器加入 `awkwardBodyPatterns`，正文出現不自然語句會直接失敗。
- 在 `suggestions.json` 加入 `bodyNaturalnessPolicy` 與 `bodyNaturalnessReview`。
- 在投稿品質關卡加入 `gate-12-body-naturalness`。
- 在生成合約加入 `body_naturalness_scan`，要求 agent 生成前後都討論正文語感。
- 更新投稿生成標準與非概念文章審稿 agent 文件。

## 改寫方向

- 「收入空窗」改為「薪水突然少一段」或「一段薪水還沒進來的日子」。
- 「財務止血」改為「先讓錢不要再流出去」。
- 「承接風險」改為「遇到變故時還撐不撐得住」。
- 「正式資源」改為「可以查證的協助管道」或「可以詢問的承辦單位」。
- 「家庭修復」改為「家裡慢慢恢復穩定」。

## 驗證

- `node tools/build-submission-quality-gates.js`
- `node tools/build-gate-driven-generation-contract.js`
- `node tools/build-public-article-pack-2026-06-03.js`
- `node tools/audit-article-role-integrity.js articles/2026-06-03-public-regenerated-pack`

驗證結果：10 篇文章正文皆超過 2000 字，role leak audit 通過，正文台灣中文語感 gate 通過。
