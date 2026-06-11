# 2026-06-10 Agent 討論｜退件學習後的題目驗證、去 AI 感與財務決策幫助

## 任務

Kevin 要求使用最新 Agent OS，動用 agent 討論以下問題：

- 如何解決總編輯駁回內容「假設性議題，缺乏驗證」。
- 如何讓文章閱讀觀感不會覺得很 AI。
- 如何吸引人閱讀。
- 是否能幫助一般民眾做財務評估。
- 是否能增加一般民眾的財務知能。
- 是否能協助正確財務決策。

本次討論只產一般民眾文章，不預設社工版。

## Agent 分工

- topic evidence reviewer：判斷什麼題目才算已驗證。
- human copy reviewer：檢查標題、開頭、段落、結尾是否像真人文章。
- financial decision reviewer：檢查文章是否提供家庭財務判斷能力。
- Taiwan policy source reviewer：確認政策、給付、補助資料需以台灣最新官方來源為主。
- role leak reviewer：阻擋審稿語、agent 語、投稿語或作者提醒進正文。

## Strong Signals

1. 「假設性議題」不是只有缺數據。
   題目需要同時有台灣現實、家庭財務壓力、決策場景、生活數字與限制條件。只有少子化、高齡化、金融素養不足、青年租屋困難這種大概念，不能直接進入正文。

2. 來源要留在作者背後，不要變成讀者看到的引用感。
   官方頁面、政策、新聞案例、制度公式必須先被轉成家庭帳本語言，例如月付、等待期、可撐天數、前後差異、哪一天扣款、補助何時才算真正進帳。正文不寫來源清單，也不寫「根據資料指出」。

3. 不像 AI 的關鍵是生活現場，不是修飾語。
   開頭三段內要讓讀者看到房租、扣款日、孩子費用、住院餐費、薪水少掉等具體壓力。禁用「本文將探討」「首先其次最後」「綜上所述」「值得注意的是」等 AI 腳手架語。

4. 財務知能不是多塞理財名詞。
   每篇至少讓讀者帶走一個判斷能力，例如分辨實領薪資與月投保薪資、理解資格通過不等於錢已入帳、先算 30 天紅燈支出、辨識高成本借款風險。

## Useful Disagreement

- source reviewer 要提高可驗證性，human copy reviewer 擔心文章變成引用摘要。
  收斂做法：來源保存在 metadata，正文只呈現已轉譯的生活數字與判斷，不列來源清單。

- financial reviewer 想放更多算式，reader reviewer 擔心像教材。
  收斂做法：每篇保留 3 到 5 個核心數字，讓數字推動選擇，不做表格或公式堆疊。

- gate reviewer 想嚴格退件，generation reviewer 擔心難以產出。
  收斂做法：先做 2 篇試產稿，不急著把後續 8 篇補滿，讓 Kevin 先看語感與可投稿感。

## Adopt Now

- 新增 `trialArticlePacks`，讓 2 篇試產稿和目前 10 篇主包分開。
- 前端新增「2 篇試產文章包」下拉選單，像週報一樣可選批次與文章。
- 每篇試產稿必須通過：
  - verified topic basis
  - source behind metadata, not body
  - public reader angle only
  - family economy relevance
  - cashflow or before-after math
  - financial decision task
  - financial literacy transfer
  - body over 2000 non-whitespace characters
  - no role leak or editor language
  - natural Taiwan Chinese body
  - strong ending with decision memory

## Pause

- 不一次補完後續 8 篇。
- 不把 SEO/AIO、來源清單、審稿建議、agent 討論放進正文。
- 不把社工視角預設帶入一般民眾文章。

## Proof Artifact

- `tools/build-trial-article-pack-2026-06-10.js`
- `articles/2026-06-10-two-article-trial-pack/`
- `suggestions.json#trialArticlePacks`
- `article-pack-history.json`
- `analysis-history.json`
