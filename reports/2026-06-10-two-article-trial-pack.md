# 2026-06-10 兩篇試產文章包

## 摘要

本次依 Kevin 最新要求，先不補滿 10 篇，而是根據本週退件學習與 agent 討論，重新生成 2 篇一般民眾純文字試產稿。

兩篇文章分別處理：

- 被資遣後第一個月的家庭現金流。
- 住院期間收入減少與傷病給付時間差。

這兩題都用台灣官方制度作為證據底盤，避免落入「假設性議題，缺乏驗證」。來源與查核資訊保存於 metadata，正文只保留讀者看得懂的生活數字、日期壓力、前後差異與決策順序。

## 文章包

- Pack ID：`2026-06-10-two-article-trial-pack`
- Directory：`articles/2026-06-10-two-article-trial-pack`
- Generator：`tools/build-trial-article-pack-2026-06-10.js`
- Display：獨立於正式主包，以前端下拉選單呈現。
- Audience：一般民眾。

## 文章

1. 被資遣後最先少的不是薪水，是家裡可以等的時間
   - 題目基礎：失業給付官方規定與試算。
   - 財務能力：分辨月投保薪資、原薪水與家庭可用現金，先算 30 天必要支出。
   - 正文非空白字數：2085。

2. 住院時收入停下來，家裡卻每天還在花錢
   - 題目基礎：勞保普通傷病給付官方規定與試算。
   - 財務能力：把住院事件拆成少掉的收入、增加的支出、能拿到但有等待期的給付。
   - 正文非空白字數：2120。

## Gate 結果

- `preGenerationReview`：2/2 passed。
- `articlePackReviewGate`：2/2 green。
- role leak audit：通過。
- body length gate：通過。
- source disclosure mode：metadata only, not body。
- SEO/AIO/source/reviewer/agent language：未放入正文。

## 對舊 10 篇仍顯示的判斷

目前公開站若仍看到舊 10 篇，原因不是這次沒有產出新內容，而是戰情室原本只有 `articlePack` 主包入口，而且近期本地變更尚未推送部署。這次新增 `trialArticlePacks` 與前端獨立下拉區，可以讓試產稿和目前主包分開呈現。後續若 Kevin 核准，再進行 commit、push、deploy，公開站才會看到最新狀態。

## 下一步

- 先請 Kevin 看 2 篇語感、結尾、數字自然度與可投稿感。
- 若可接受，再用同一組 gate 補後續 8 篇。
- 補後續 8 篇前仍需逐題查最新台灣官方資料，尤其年度補助、給付、地方規範與資格條件。
