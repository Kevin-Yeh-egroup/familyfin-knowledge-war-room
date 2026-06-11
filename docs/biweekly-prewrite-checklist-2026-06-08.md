# 雙週可投稿文章包產稿前 Checklist

建立日期：2026-06-08

狀態：project-local active checklist
來源：2026-06-06 reviewer 規則增量、2026-06-09 最新駁回學習、投稿品質 gate、Kevin 人工修稿回饋
用途：正式產出 10 篇純文字可投稿文章包前，先判斷題目、資料、數字與寫作角度是否足夠。

## 使用原則

這份 checklist 放在「寫正文之前」。

若前置條件不通過，不應硬寫 10 篇文章。  
此時應產出 blocker report、候選題卡或 3 題小批次試作，而不是標示為可投稿包。

## 一、整批 preflight

正式 10 篇文章包產出前，必須全部通過：

1. `suggestions.json` 可解析。
2. `article-pack-history.json` 可解析。
3. `analysis-history.json` 可解析。
4. 本週週戰情室 report 或 checkpoint 已存在。
5. `data/knowledge-base-title-index.json` 已由 `node tools/build-knowledge-base-title-index.js` 更新。
6. `reviewLearningReadyCards` 足以支撐正式產稿；建議門檻為至少 8 張，目前 2026-06-09 最新值為 50 張。
7. 最新 `EVENT_REVIEW` / `EVENT_COMMENT` 讀取狀態已明確記錄；目前最新公開安全摘要為 `data/review-rejection-learning-2026-06-09.json`。
8. 若 live review/comment 仍 blocked，只能產候選題卡或 blocker report。
9. 每篇文章皆預設一般民眾版；社工版需 Kevin 明確指定。
10. 正文輸出只允許純文字，不顯示 SEO/AIO、FAQ、來源清單、gate 自評或 agent 討論。
11. 每篇純文字文章進入工作台前，必須先有 `articlePackReviewGate.status = green`。

## 二、每題三道題材門

每個候選題目進入搜尋與寫稿前，先回答：

1. 這是哪一種家庭，在什麼日期、時間差或支出順序下被卡住？
2. 這個題目能不能自然放進至少一組前後差異數字，而且數字能翻成生活用途？
3. 讀者看完後，第一個要先盤點的是日期、金額、順序、支出缺口或支持來源中的哪一個？

若三題答不出來，題目需重想，不進正文。

## 三、每篇必填 claims table

每篇文章在寫正文前，必須建立 claims table。  
至少包含以下欄位：

- `claim_id`
- `claim_text`
- `claim_type`: official_policy / official_statistic / news_case / illustrative_scenario / calculation
- `amount_or_value`
- `before_after_role`
- `source_or_assumption`
- `applicable_year`
- `year_type`
- `year_calendar_system`
- `authority_name`
- `authority_level`
- `issuing_unit`
- `canonical_source_url`
- `official_page_type`
- `effective_region`
- `local_variation_required`
- `local_authority_url`
- `eligibility_scope`
- `amount_or_threshold`
- `deadline_or_period`
- `check_date`
- `claim_supported`
- `applies_to_population`
- `exclusion_or_limit_note`
- `reader_facing_interpretation`
- `scenario_type`
- `assumption_basis`
- `non_official_values`
- `misread_risk_note`

沒有 claims table，不得標示為可投稿。

## 四、每篇正文 hard gates

正文完成後，至少要通過：

1. 非空白正文超過 2000 字。
2. 正文不得混入作者、編輯、審稿、投稿、知識庫、agent 語言。
3. 正文不得未經指定滑向社工或助人工作者口吻。
4. 每個核心段落至少要有生活場景、數值變化或行動後結果中的一項。
5. 至少兩個具體數值或數值化情境。
6. 至少一組前後差異。
7. 至少一到三個改善關鍵因素。
8. 官方政策、補助、法規、年度、地方方案必須查核最新台灣來源。
9. 假設情境必須明確是示意，不可偽裝成真實案例。
10. 結尾需回扣開頭生活機制，最後一句要落在一個具體盤點點。
11. `articlePackReviewGate` 必須記錄審核輪次、reviewer、非綠燈條件與回修方式。

若任何一項未通過，不應送到 Kevin 核准台。
處理方式是回到生成端調整題目、數字、角度、正文或結尾，再跑下一輪審核。

## 五、同批標題 gate

同批 10 篇需符合：

1. 不可大量重複同一公式。
2. 至少混合 3 種入口型態：生活畫面、問題句、數字句、時間壓力、後果句、家庭選擇困境。
3. 「不是＿＿」或同類重新框架公式同批最多 1 到 2 篇。
4. 標題需像台灣自然中文，不用美語直譯、顧問簡報感或抽象組合詞。
5. 同批標題正規化後不得相同、不得高度近似，也不得把另一篇核心題名完整包進長副標。
6. 必須比對 `data/knowledge-base-title-index.json`；若題目與既有知識庫文章相近，必須先寫出新情境、新數字、新判斷；答不出來就換題。

## 六、投稿檢核機制回填 gate

來源：2026-06-06「檢核投稿機制」聊天本體與夥伴檢視報告。

此 gate 不是投稿後退件用，而是放在文章生成前，避免產出「看似不同、其實沒有新讀者價值」的文章。

每篇候選題在開寫前，需補上：

1. `similar_existing_topic`：最相近的既有知識庫題目或同批候選題。
2. `title_risk`：同標題、近似標題、包含既有核心題名、或未命中。
3. `new_reader_value`：這篇和既有文章相比，新增哪一個家庭情境、數字差異、決策順序或生活判斷。
4. `content_difference_plan`：正文將如何避免只沿用既有文章的段落順序、核心建議與結尾。
5. `case_number_decision_plan`：本文的角色、金額/比例/時間、前後差異與改善關鍵。

判斷原則：

1. 相似度分數只是提醒，不等於抄襲判定。
2. 標題是第一提醒點，但內容也必須逐篇檢查。
3. 同題可以寫，但不能只是加副標、換說法或補一段數字。
4. 數字要支撐財務判斷，不只是日期、步驟、法條或一般比例。
5. 若缺具體家庭情境、缺金額/計算、缺決策取捨，不能標示為可投稿。
6. 若產出與既有文章的差異只剩語氣或架構，應退回題目規劃，不進正文。

## 七、輸出與紀錄

正式產包時，需同時留下：

1. 純文字文章檔。
2. `suggestions.json` 工作台資料。
3. `article-pack-history.json` 文章包紀錄。
4. 每篇 claims table 或至少 claims table 摘要。
5. validator 執行結果。
6. 若被 blocked，留下 blocker report，不產正式 10 篇。
7. 每篇 `new_reader_value` 與 `content_difference_plan` 摘要，方便後續退修或核准時回查。
8. `data/knowledge-base-title-index.json` 更新時間與 validator 中的 knowledge-base title index 檢查結果。
9. 每篇 `articlePackReviewGate` 綠燈紀錄；非綠燈時，改存 blocker 或 revision log，不存成可投稿文章包。

## 八、目前判斷

截至 2026-06-09，live rejection/comment learning 已恢復到可支撐正式產稿的門檻。
正式 10 篇雙週文章包仍需每次重跑最新駁回學習、官方資料查核、知識庫標題索引與 validator；若任一 gate 退回 blocker，才停止產稿。
