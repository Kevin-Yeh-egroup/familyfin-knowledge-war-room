# 2026-06-11 FamilyFin grounded workflow 重生 12 篇文章包

## 任務

將先前 6/9 正式 10 篇與 6/10 試產 2 篇合併，依照全域 FamilyFin grounded workflow 重新討論並生成。

## 分段討論收斂

- `source_grounding_reviewer`：每篇保留台灣官方或可靠來源作 metadata，不把來源清單塞進正文。
- `real_feedback_miner`：正文使用一般讀者會說的收支、帳單、請假、補件、扣款與家用語氣。
- `taiwan_habit_reviewer`：避免把跟房東、雇主、家人、銀行或政府窗口互動寫成很容易。
- `resource_benefit_translator`：資源段說清楚能少哪筆錢、爭取幾天、避免哪種債。
- `scenario_or_workflow_mapper`：每篇可用「姓名（化名）」作為情境載體，讓讀者先進入生活，再回到收支表與決策。
- `human_copy_reviewer`：依外部閱讀研究與 Kevin 回饋，將過短提示段合併成較完整的敘述段，避免讀起來像卡片條列。
- `numeric_decision_reviewer`：每篇都有改善前後差異、施行效果與仍未打平時的求助路徑。
- `role_privacy_boundary_reviewer`：正文不得出現審稿語、投稿語、agent、社工版、SEO/AIO 或來源清單。

## 輸出

- 文章包：articles/2026-06-11-grounded-12-article-pack
- 篇數：12
- 正文非空白字數：2257 到 2389
- 段落數：18 到 21
- 平均段落字數：108 到 126
- 過短段落：0
- 語氣變奏：不是...而是最多 0 次，整包 0 次／0 篇；比較穩 0 次，自問自答最多 0 次，真正最多 3 次
- 故事帶入規則：每篇使用「姓名（化名）」與生活切片開場，不宣稱真實案例，並在 2-4 段內回到數字與判斷。
- 段落節奏規則：保留可掃讀性，但把短提示句合併到前後脈絡，讓情境、數字和改善計畫讀起來更連續。

## 外部閱讀資料參考

- Nielsen Norman Group `How Users Read on the Web`：網頁讀者多半掃讀，因此文章仍需可掃讀、重點前置。https://www.nngroup.com/articles/how-users-read-on-the-web/
- GOV.UK content principles：重要資訊應前置，短網頁與短段落有助理解，但仍需清楚組織。https://www.gov.uk/government/publications/govuk-content-principles-conventions-and-research-background/govuk-content-principles-conventions-and-research-background
- GCA style guide paragraph length：段落約 5 行、1 個重點較容易讀。https://www.gca.gov.uk/government-commercial-agency-style-guide/formatting
- Poynter：短句、短段與留白能降低視覺壓力，本次採用的是合併過短提示段，不是拉成大塊文字。https://www.poynter.org/reporting-editing/2019/please-please-please-shorter-sentences-shorter-paragraphs-more-white-space/

## 文章

1. 房租日比薪水早到，租金補貼要先放進收支表裡看
2. 一個人接孩子也接帳單，單親家庭要先算托育和工時能不能配合
3. 每月都有還錢，為什麼債務還是沒降下來
4. 緊急預備金不用先想六個月，先看家裡能撐幾天
5. 長照不是只有看護費，家裡少掉的工時也要一起算
6. 被騙後先別急著補回全部損失，先保住接下來30天
7. 第一份薪水不是全部都能花，先看房租、家用和學貸剩多少
8. 公司開始減班，家裡先看房貸、保費和孩子費用
9. 家庭突然少一個支撐，前三個月要先保住哪些支出
10. 退休金每月都有進來，還是要把醫療、照顧和詐騙分開算
11. 被資遣後第一個月，先算家裡能不能等到給付進來
12. 住院時薪水少了，家裡還要先撐過哪幾筆錢

## 驗證

- 生成腳本內部檢查：字數、標題重複、角色洩漏、翻譯腔常見詞。
- 段落節奏檢查：每篇 18-24 段、無 45 字以下提示段、平均段落不低於 100 字、最長段落不超過 240 字。
- 外部驗證指令：`node tools/validate-war-room-state.js`、`node tools/audit-article-role-integrity.js articles/2026-06-11-grounded-12-article-pack`。
