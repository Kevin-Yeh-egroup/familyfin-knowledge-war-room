# 2026-06-03 Kevin 修稿樣本學習日誌

## 觸發

Kevin 提供一批人工調整後的文章作為參考，希望後續文章生成能學到更自然、更可投稿的寫作方式。

## 主要發現

- Kevin 的修稿重點不是只讓語句更順，而是讓文章更像在解釋生活裡真正卡住人的機制。
- 好的開頭會先寫出壓力如何發生，而不是先介紹議題。
- 數字要推動判讀，讓讀者看見前後差異、日期壓力、可撐天數或少一次周轉。
- 政策或補助金額要翻成日常用途，不能只是引用年度或月額。
- 短列點可用，但必須回到家庭生活壓力，不可變講義。
- 2026-06-03 追加回饋：正文不應出現「示意前後差異」這類寫給作者看的轉場語。
- 2026-06-03 追加回饋：結尾偏弱會讓文章有爛尾或詞不達意的感覺，需獨立檢查 ending strength。

## 已更新

- `docs/kevin-editorial-reference-learning-2026-06-03.md`
- `docs/submission-article-generation-standard-v2.md`
- `docs/non-concept-article-review-agent.md`
- `tools/build-submission-quality-gates.js`
- `tools/build-gate-driven-generation-contract.js`
- `tools/build-public-article-pack-2026-06-03.js`
- 追加 `ending_strength_reviewer`
- 追加可見轉場語禁用規則

## 驗證項目

- 生成合約應加入 `kevin_editorial_reference_note`。
- 生成合約應加入 `ending_strength_note`。
- 投稿品質 gate 應加入 `kevin_editorial_reference_reviewer`。
- 投稿品質 gate 應加入 `ending_strength_reviewer`。
- 工作台 suggestions 應加入 `kevinEditorialReferencePolicy`。
- 工作台 suggestions 應加入 `endingStrengthPolicy`。

## 注意

本次只萃取可重複的寫作判斷，不直接覆蓋文章包正文，也不 commit / push / deploy。
