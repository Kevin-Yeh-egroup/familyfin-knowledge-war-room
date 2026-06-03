# 2026-06-03 標題多樣性修正日誌

## 背景

Kevin 回饋：文章包中的標題太像，容易讓人感覺是在做系列文章；目前需求不是系列，而是每次產出都要有不同感。

## 問題

上一版 10 篇標題大量使用「不是＿＿：＿＿」的重新框架句型。雖然符合結構判讀語氣，但整批讀起來像同一套模板，會降低新鮮感與主動點閱意願。

## 修正

- 重擬 10 篇標題，改為混合生活畫面、問題句、時間壓力、數字句、後果句與家庭選擇困境。
- 文章包標題改為「2026-06-03 家庭生活壓力與財務缺口候選稿」，減少內部操作感。
- 在 `tools/build-public-article-pack-2026-06-03.js` 新增 title diversity check。
- 在 `docs/submission-article-generation-standard-v2.md`、`docs/gate-driven-article-generation-guide.md`、`docs/gate-driven-article-generation-prompt.md`、`docs/non-concept-article-review-agent.md` 補上標題多樣性規則。
- 在 gate-driven generation contract 補上 `title_diversity_plan` 與 title diversity policy。

## 驗證

- 標題公式分布：
  - colon-scene: 4
  - question: 4
  - plain: 2
- role integrity scan：
  - scannedFiles: 10
  - matches: 0
  - pass: true
- JSON parse：
  - suggestions.json OK
  - gate-driven-article-generation-contract-2026-06-03.json OK

## 後續規則

除非 Kevin 明確要求系列文章，否則每次 10 篇候選稿不可使用同一個標題公式。若標題看起來像模板產生，必須在進入正文前退回重擬。
