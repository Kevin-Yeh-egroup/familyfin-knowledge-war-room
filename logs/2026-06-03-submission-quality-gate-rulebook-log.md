# 2026-06-03 投稿前品質檢查規則庫日誌

## 任務

把 290 筆審核駁回事件中，143 筆含審核文字的資料，整理成好理家在文章投稿前品質檢查規則庫。

## 產出

- 公開規則資料：data/submission-quality-gates-2026-06-03.json
- 人可讀規則書：docs/submission-quality-gate-rulebook.md
- Agent 規格：docs/submission-quality-gate-agent.md
- 產生器：tools/build-submission-quality-gates.js
- 工作台資料源更新：suggestions.json

## 規則庫內容

本次建立 10 個投稿前 gate：

1. 家庭經濟主軸關卡
2. 非概念文關卡
3. 數值證明關卡
4. 複雜處境不可簡化關卡
5. 重複與內容缺口關卡
6. 故事與案例精準度關卡
7. 台灣事實與政策正確性關卡
8. 結構清晰關卡
9. 讀者角度關卡
10. 可行下一步關卡

其中 fatal gate 為：

- 家庭經濟主軸關卡
- 非概念文關卡
- 台灣事實與政策正確性關卡

任何 fatal gate 未通過，都不能標記為可投稿。

## 追加修正：家庭經濟必須明文化

Kevin 補充提醒：除了「非概念性」，文章還必須明確和家庭經濟相關。

因此本次把原本較寬的「平台主軸關卡」升級為「家庭經濟主軸關卡」：

- 文章不能只停在情緒、觀念、生活提醒或個人選擇。
- 必須至少回扣一個家庭經濟軸線，例如收入變動、固定支出、債務壓力、照顧成本、托育/長照/醫療支出、居住成本、補助資源或家庭成員分工造成的財務影響。
- 如果主題無法連到家庭經濟，就應改題、補素材或重寫，不應進入可投稿狀態。

## 資料基礎

- 已開啟審核彈窗：290
- 可作為文字學習素材：143
- 有審核標題與內容：20
- 只有審核標題：123
- 彈窗開啟但沒有文字：147

## 防外流檢查

已驗證公開檔案沒有包含：

- eventId
- InfoCenter 事件 URL
- 長段原始審稿文字
- 文章全文

私有原始資料仍只保存在 work-private/。

## Agent 使用方式

投稿包生成後，依序啟動：

1. review_feedback_miner
2. writing_angle_reviewer
3. non_concept_reviewer
4. numeric_proof_reviewer
5. fact_case_reviewer
6. quality_reviewer

輸出需包含：

- approve / revise / reject
- 0-100 分
- failedFatalGates
- failedRequiredGates
- topRevisionFocus
- evidenceToAdd
- readyForKevinApproval

## 治理結論

這是 project-local candidate，不寫入全域 Agent OS，不建立自動化，不自動投稿，也不取代 Kevin 或總編輯審核。
