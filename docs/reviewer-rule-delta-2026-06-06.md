# 2026-06-06 reviewer 規則增量摘要

狀態：project-local weekly delta  
來源：2026-06-06 weekly war room review  
邊界：只保存去識別化規則，不保存後台事件識別或原文

## 本次確認可升級為 hard gate 的規則

1. 產稿前必做 `claims table`，列出收入、支出、補助、費用、前後差異與每個數字的來源或假設。
2. 個案條件不得漂移，家庭人數、角色、收入來源、照顧責任要前後一致。
3. 每個核心段落至少要有一個具體生活場景、數值變化或行動後結果，不能只停在概念說明。
4. 沒有 `reviewContentFound=true` 且沒有交叉打開評論文章正文時，不可宣稱完成 rejection learning。

## 本次確認仍屬 partial signal 的規則

1. `platform_fit`
2. `finance_focus_alignment`
3. `duplicate_or_existing_content`
4. `editorial_quality_gap`

## 雙週選題前新增三道題材門

1. 題目能不能一句話說出哪個家庭在什麼時間差或支出順序下被卡住。
2. 題目能不能自然放進至少一組前後差異數字，而且數字能翻成生活用途。
3. 題目能不能留下明確第一個盤點點，例如日期、金額、順序、缺口或支持來源。

## 標題與讀者入口增量

1. 同批標題不可大量重複同一公式。
2. 同批至少混 3 種以上入口型態，例如生活畫面、問題句、數字句、時間壓力、後果句、家庭選擇困境。
3. 開頭先寫生活機制，不先講議題背景或制度定義。

## 角色一致與語感增量

1. 正文不得出現作者、編輯、審稿、投稿、知識庫、agent 語言。
2. 一般民眾版仍為預設，不得未經明示就滑向社工/助人工作者口吻。
3. 翻譯腔、顧問簡報感、內部轉場語仍視為高風險，即使語意可懂也要重寫。

## 台灣資料 evidence schema 增量

每篇涉及政策、補助、法規、統計、地方方案時，至少補齊以下欄位：

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

## 使用方式

1. 週檢視時：先用這份 delta 判斷哪些規則可以直接進 candidate card。
2. 雙週生成前：把三道題材門與 evidence schema 當作 prewrite gate。
3. 若新的 live `EVENT_REVIEW` / `EVENT_COMMENT` 證據恢復，再重新檢查本次 partial signal 是否可升級。
