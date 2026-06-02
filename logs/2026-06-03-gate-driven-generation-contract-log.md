# 2026-06-03 Gate-driven 文章生成合約日誌

## 任務

Kevin 提醒：投稿前 gate 不應只用來打分與退件，更應變成文章生成前的建議與素材規格，讓文章一開始就依照 gate 的要求生成。

## 本次調整

將「投稿前品質檢查規則庫」往前移成「gate-driven generation contract」。

也就是：

- 不是先寫完文章，再被 gate 退件。
- 而是先把 gate 轉成 topic brief、讀者角度、數值證明、台灣資料查核、段落結構與下一步設計。
- 文章生成後才用 gate 做最後檢查。

## 新增產出

- data/gate-driven-article-generation-contract-2026-06-03.json
- docs/gate-driven-article-generation-guide.md
- docs/gate-driven-article-generation-prompt.md
- tools/build-gate-driven-generation-contract.js

## 生成流程

新增 7 個生成階段：

1. 先判斷題目是否值得寫
2. 先決定讀者與入口角度
3. 先定義真正要重新框架的問題
4. 先設計數值與台灣資料怎麼進文章
5. 先設計生活場景，不要虛構誇張案例
6. 再開始生成純文字正文
7. 最後才用 gate 檢查與修正

## 生成前必備 brief

每篇文章開始寫正文前，必須先完成：

- family_economic_fit_note
- topic_fit_note
- audience_voice_note
- knowledge_gap_note
- scene_and_pressure_note
- constraint_matrix
- numeric_proof_plan
- taiwan_source_check_plan
- structure_map
- next_step_note
- gate_self_review

## 追加修正：家庭經濟主軸先於正文

Kevin 補充提醒：好理家在文章不能只做到「非概念」，還必須明確回到家庭經濟。

因此 gate-driven generation contract 已加入家庭經濟硬條件：

- 選題階段先寫 family_economic_fit_note。
- 文章至少要連到收入、支出、債務、照顧成本、居住成本、補助資源、風險承接或家庭分工造成的財務影響。
- 若題目無法說清楚家庭經濟連結，不進入正式撰文，而是輸出需要補資料或換題的原因。

## Agent 使用方式

生成前先由下列 agent 做素材檢查：

1. source_scout
2. knowledge_gap_mapper
3. writing_angle_reviewer
4. numeric_proof_reviewer
5. non_concept_reviewer
6. public_writer_or_social_work_writer
7. quality_reviewer

quality_reviewer 不再只是最後退件，而是把失敗 gate 指回對應生成階段，要求補素材、換角度或重建結構。

## 工作台更新

已更新 suggestions.json：

- 新增 gateDrivenArticleGeneration
- 品質門檻第一條改為「生成前先完成 gate-driven article brief」
- 保留純文字正文、2000 字、非 SEO/AIO 顯示等投稿要求

## 治理邊界

這是 project-local candidate。

不自動投稿、不自動核准、不取代 Kevin 或總編輯審核。

政策、補助、資格、金額、年度與地方方案仍必須查核最新台灣官方來源。
