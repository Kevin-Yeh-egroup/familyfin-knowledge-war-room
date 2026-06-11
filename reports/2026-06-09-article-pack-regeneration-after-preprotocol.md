# 2026-06-09 文章包重新生成：前置驗證 protocol 版

## 摘要

依 Kevin 要求，已重新更新目前 10 篇一般民眾版文章生成。這次不是另開新系列，而是在 `2026-06-09-rejection-learned-pack` 上重跑生成器，將 6/9 大量駁回學習與後續代理討論新增的前置驗證 protocol 套到每一篇文章。

## 本次生成狀態

- 文章包：`2026-06-09-rejection-learned-pack`
- 文章數：10
- 讀者版本：一般民眾
- 輸出格式：純文字正文
- 正文門檻：每篇非空白字數超過 2000
- 內部檢查：SEO/AIO、來源、審稿建議與 agent 討論不進正文

## 新增套用的前置 protocol

每篇文章已新增：

- `topicEvidenceCard`：確認題目有台灣資料、制度、新聞、知識庫缺口或駁回訊號支撐。
- `readerFitCard`：確認前 150 字有生活矛盾、金錢卡點、時間壓力或家庭選擇困難。
- `financialDecisionCard`：確認文章能協助讀者做一個低門檻家庭財務評估。
- `financialLiteracyTransfer`：確認讀者能帶走一個可重複使用的財務知能。

## 重新生成的 10 篇

1. 房租五號到期，補貼還沒進來：租屋家庭最容易卡住的時間差
2. 一個人接孩子，也一個人接帳單：單親家庭的托育費為什麼常變成收入缺口
3. 每月都在繳，債卻沒變少：債務協商前先看懂家庭還款壓力
4. 手上只剩一萬元，能撐到下次薪水嗎？先把緊急預備金換成天數看
5. 爸爸出院後，家裡多了哪些帳單？長照成本常從看不見的地方開始
6. 錢被騙走以後，這個月怎麼過？先把房租、吃飯和帳單排出來
7. 第一份薪水進來前，房租和家用已經排隊：青年獨立的第一張收支表
8. 減班休息先看三筆錢，收入少一截時帳單不會跟著少
9. 變故後的三個月怎麼撐？特殊境遇家庭扶助要接住的是生活缺口
10. 退休金每月都有進來，為什麼醫療、照顧和詐騙還是會讓家裡緊張

## 生成器層級變更

- `tools/build-public-article-pack-2026-06-09.js` 已加入四個前置 reviewer。
- `articleRecord` 現在輸出 `preGenerationReview`。
- 生成器會阻擋缺少前置卡或財務評估任務的文章。
- `tools/validate-war-room-state.js` 現在會檢查每篇文章是否通過前置 protocol。
- `article-pack-history.json` 已標示此包為「駁回學習與前置驗證後重生文章包」。

## 驗證

本次生成後需通過：

- `node tools/validate-war-room-state.js`
- `node tools/audit-article-role-integrity.js articles/2026-06-09-rejection-learned-pack`

正式投稿前仍需人工確認每篇文章涉及的補助、地方規範、申請資格與年度資料是否為最新版本。
