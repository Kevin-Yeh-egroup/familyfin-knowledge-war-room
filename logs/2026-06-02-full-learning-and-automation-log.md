# 2026-06-02 全文學習、投稿包與自動化日誌

## 今日完成

- 完成 InfoCenter 最早到最新事件的全文學習批次。
- 建立完整學習統計與品質發現。
- 將「新增建議審核台」改為「10 篇可投稿文章工作台」。
- 新增首批 10 篇可投稿文章草稿。
- 每篇文章均含讀者版本、正式標籤、SEO/AIO、FAQ、來源與全文。
- 每篇正文均通過 2000 字以上檢查。
- 建立每週五 14:00 的自動化任務 `automation-14`。

## Automation

- ID：automation-14
- 名稱：好理家在每週知識庫擴充與投稿文章包
- 時間：每週五 14:00 Asia/Taipei
- 首次執行：2026-06-05 14:00
- 模式：read-only review and draft generation
- 邊界：不自動送審、不自動上架、不修改 InfoCenter。

## 首批 10 篇

1. 租金補貼不是居住穩定
2. 債務協商不是找代辦
3. 詐騙後不是只剩報案
4. 沒有緊急預備金不是不自律
5. 長照不是單一照顧選擇
6. 單親家庭不是只有補助問題
7. 青年第一份工作不只看薪水
8. 退休不只是存款數字
9. 減班休息不是只有少上班
10. 知道政府資源不等於用得到

## 發現與優化

- 字數門檻需要用機器檢查，而不是憑感覺判斷。第一次草稿正文普遍不足 2000 字，經補強後才全數過線。
- 文章應以台灣資料和制度為骨架，案例使用公開來源或綜合情境，避免虛構。
- 審核台要能顯示全文，否則 Kevin 無法判斷是否能直接投稿。
- 核准、退修、駁回紀錄需要保留，讓 agent 後續學習「好理家在什麼樣的文章才算好」。
- FB / Podcast 素材適合學標題與社群切角，但不應直接當成長文品質標準。

## 下一輪建議

- 每週自動化產出後，保留一份 `weekly-pack` 目錄與一份週報。
- Kevin 審核後，將退修原因整理回 `docs/submission-article-generation-standard-v2.md`。
- 若連續 2-3 週同類主題重複，需啟動知識缺口重排，避免變成文章農場。

## 2026-06-02 追加規則

Kevin 補充：參考資料必須使用目前最新資料，尤其歷年補助、計畫、津貼、申請資格、金額與期限，必須確認：

- 是目前最新資訊。
- 是最符合台灣脈絡的資訊。
- 符合台灣中央以及地方政府規範。

已更新：

- `docs/current-taiwan-data-verification-rules.md`
- `docs/submission-article-generation-standard-v2.md`
- `suggestions.json` 品質門檻
- `automation-14` 每週自動化 prompt

## 2026-06-02 追加規格修正：純文字、非概念文與讀者吸引力

Kevin 補充：投稿工作台不需要 Markdown，也不需要把 SEO/AIO 顯示出來；正文門檻是正文本身超過 2000 字，不含 SEO/AIO、來源、FAQ 或審核紀錄。文章目前的問題不是資料不足，而是引用感、AI 感與概念描述太重，讀者不會主動想讀。

本次已調整：

- 文章包改為 `.txt` 純文字投稿稿。
- 工作台新增複製正文、複製標題＋正文、複製審稿版。
- 前台不顯示 SEO/AIO、Meta、Slug、FAQ 或來源清單。
- 新增 `docs/non-concept-article-review-agent.md`，把退修/駁回建議變成下週必查規則。
- 新增 `docs/readability-research-20260602.md`，將 websearch 結論轉為讀者吸引力檢查規則。
- 每週流程加入 `review_feedback_miner`、`non_concept_reviewer`、`reader_appeal_reviewer` 三個討論輸出。

後續每次 Kevin 提供駁回或退修意見時，必須建立學習卡：審核意見、問題段落、問題類型、可檢查規則、修正方向與是否升級為下週必查門檻。

## 2026-06-02 數值化證明與書寫角度規格

Kevin 追加定義：文章不能是概念文，不代表只要增加資料或引用。文章需要能讓讀者看見數值差異，例如收支調整前後、固定支出比例、債務月付差異、可動用餘裕變化，也要指出造成改善的關鍵因素。

本次與 agent 討論後，新增兩個固定 reviewer：

- `numeric_proof_reviewer`：每篇至少檢查 2 個具體數值或數值化情境、1 個前後差異示例、1 到 3 個改善關鍵因素。官方資料必須查核最新台灣版本；示意數字必須標示為假設。
- `writing_angle_reviewer`：一般民眾版從生活壓力、具體選擇與「我為什麼卡住」進入；社工版從實務誤判、評估盲點與介入焦點進入。兩者都避免責備、教訓、政策報告感與 AI 摘要感。

已更新：

- `suggestions.json`
- `index.html`
- `docs/submission-article-generation-standard-v2.md`
- `docs/non-concept-article-review-agent.md`
- `docs/numeric-proof-writing-angle-reviewers.md`
- `docs/readability-research-20260602.md`

治理判斷：本次先保持為 `familyfin-knowledge-war-room` 專用規格，不升級成全域 skill。等累積 2 到 3 次投稿退修/通過回饋後，再評估是否抽成可重用的好理家在文章生成 skill。
