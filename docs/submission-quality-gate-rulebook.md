# 投稿前品質檢查規則庫

更新日期：2026-06-03

這份規則庫由 InfoCenter 290 筆審核駁回事件的私有資料衍生而來。公開版只保留規則、統計與檢查方法，不保存事件 ID、審稿原文或文章全文。

## 資料基礎

- 已開啟審核彈窗：290
- 可作為文字學習素材：143
- 有審核標題與內容：20
- 只有審核標題：123
- 彈窗開啟但沒有文字：147

## 使用方式

文章送出前，先由 reviewer agent 依序檢查 fatal gate，再檢查 required gate。只要 fatal gate 未通過，就不能標記為可投稿。

分數判定：
- 82 分以上：可進入 Kevin 核准
- 70 到 81 分：修正後再審
- 69 分以下：退回重寫

## gate-01-platform-fit 家庭經濟主軸關卡

嚴重度：fatal

來源訊號：platform_scope_mismatch: 15, too_narrow_or_off_topic: 5

退件條件：
- 主題只是一般投資、健康、法律、關係、反詐或生活提醒，沒有回到家庭經濟與助人工作處境。
- 文章可以放在任何理財或生活平台，缺少好理家在的辨識度。
- 文章只有情緒、觀念或個人選擇，沒有說清楚家庭收入、支出、債務、照顧成本、風險承接或資源取得如何影響生活。

必備條件：
- 明確連到家庭財務壓力、生活風險、服務對象決策、支持系統或助人工作現場。
- 說清楚這篇為何適合好理家在，而不是一般宣導文章。
- 至少呈現一個家庭經濟連結：收入變動、固定支出、債務壓力、照顧成本、托育/長照/醫療支出、居住成本、補助資源、或家庭成員分工造成的財務影響。

修正方向：
- 把主題重新框回家庭經濟困境、風險承接能力、服務現場判讀或一般民眾可理解的生活壓力；若無法連到家庭經濟，就換題。

負責 reviewer：quality_reviewer, tag_mapper

## gate-02-non-concept 非概念文關卡

嚴重度：fatal

來源訊號：conceptual_or_general: 50, missing_depth_or_content: 59

退件條件：
- 全文主要是在說觀念、價值、提醒或口號，缺少場景、數字、決策困難與可辨識的生活壓力。
- 讀者看完只知道應該要重視，卻不知道問題在現實中如何發生。

必備條件：
- 至少一個具體生活場景。
- 至少兩個可檢查的現實細節，例如金額、時間、比例、頻率、角色分工或流程。
- 指出問題從表面現象到結構限制的變化。

修正方向：
- 把抽象句改成生活中的前後差異，例如支出怎麼卡住、收入中斷會如何影響選擇、社工能從哪裡開始盤點。

負責 reviewer：non_concept_reviewer, reader_appeal_reviewer

## gate-03-numeric-proof 數值證明關卡

嚴重度：required

來源訊號：needs_specific_numbers_actions: 23

退件條件：
- 有改善建議，但沒有任何前後數字、比例、金額、時間或可衡量差異。
- 引用資料很多，但沒有把資料轉成讀者看得懂的生活判斷。

必備條件：
- 至少一組前後差異或可比較數值。
- 至少一個改善關鍵因素，例如固定支出降低、緊急預備金月數增加、債務月付比下降。
- 若用假設情境，需標示為示意，避免像真實個案或官方統計。

修正方向：
- 加入一段小型算式或前後對照，讓讀者看到調整後多出多少餘裕、風險少在哪裡。

負責 reviewer：numeric_proof_reviewer, fact_case_reviewer

## gate-04-complexity 複雜處境不可簡化關卡

嚴重度：required

來源訊號：oversimplified_complex_context: 14, family_context_required: 53

退件條件：
- 把照顧、婚姻、托育、債務、買房、工作轉換等複雜處境寫成單一答案。
- 忽略家庭成員、制度限制、資源可近性、關係壓力或時間壓力。

必備條件：
- 列出至少兩個限制條件。
- 說明為什麼不能只從個人努力或單一理財技巧理解。
- 保留不同家庭狀況下的判斷彈性。

修正方向：
- 把建議改成判讀框架：先盤點限制，再看選項，而不是直接告訴讀者該怎麼做。

負責 reviewer：social_work_writer, quality_reviewer

## gate-05-originality-gap 重複與內容缺口關卡

嚴重度：required

來源訊號：duplicate_or_existing_content: 15

退件條件：
- 主題已經有更完整文章，新增稿件沒有新的場景、數據、對象、地區、制度或判讀角度。
- 只是同一篇文章換標題、換故事、換說法。

必備條件：
- 說明新稿與既有知識庫的差異。
- 新增至少一個新的讀者問題、台灣現況、案例角度或實務判讀點。

修正方向：
- 先查知識庫同標籤文章，決定要補缺口、更新資料、或放棄這個題目。

負責 reviewer：knowledge_gap_mapper, article_pattern_miner

## gate-06-story-precision 故事與案例精準度關卡

嚴重度：required

來源訊號：story_or_case_angle_issue: 8

退件條件：
- 故事性很強，但案例只是情緒鋪陳，沒有支持核心判讀。
- 角色關係、責任位置或生活條件不合理。

必備條件：
- 案例只服務概念，不喧賓奪主。
- 角色關係與責任位置要符合台灣生活語境與助人工作常識。
- 故事後必須回到可判讀的結構或可行下一步。

修正方向：
- 縮短故事，補上角色限制、金錢流向、壓力來源與選擇困難。

負責 reviewer：writing_angle_reviewer, reader_appeal_reviewer

## gate-07-fact-and-policy 台灣事實與政策正確性關卡

嚴重度：fatal

來源訊號：accuracy_or_grounding_risk: 8

退件條件：
- 政府補助、地方方案、法規、年度資格或金額沒有確認是最新台灣資訊。
- 用單一研究、新聞或特殊個案推論所有家庭。
- 真實案例與示意案例界線不清。

必備條件：
- 政策與補助類內容以最新中央或地方政府來源為準。
- 標示資料年份與適用地區。
- 把資料轉成生活判讀，不讓文章讀起來像引用堆疊。

修正方向：
- 先做 current Taiwan source check，再把來源濃縮成讀者需要的資格、限制、流程與風險提醒。

負責 reviewer：source_scout, fact_case_reviewer

## gate-08-structure 結構清晰關卡

嚴重度：required

來源訊號：structure_or_readability_issue: 6, missing_depth_or_content: 59

退件條件：
- 段落像資料堆疊，讀者看不出問題如何從現象推到結構。
- 一篇文章同時處理太多議題，沒有主線。

必備條件：
- 前言直接切入矛盾或實務困境。
- 核心段落依序呈現現象、不能只這樣理解、真正影響因素、生活或介入連結。
- 結語回到重新理解自己或實務判讀，不收在口號。

修正方向：
- 重排成 4 到 6 個主段，每段只處理一個判讀問題。

負責 reviewer：quality_reviewer, doc_scribe

## gate-09-audience-angle 讀者角度關卡

嚴重度：required

來源訊號：family_context_required: 53, story_or_case_angle_issue: 8

退件條件：
- 一般民眾版像課程講義，社工版像對民眾說教。
- 語氣讓讀者覺得被責備，或讓助人工作者覺得只是重講常識。

必備條件：
- 一般民眾版要讓讀者感覺被理解，先看懂處境，再談選擇。
- 社工版要自然帶出評估、判讀、介入焦點與常見誤判。
- 同一主題需先決定主要讀者，不要兩種口吻混在一起。

修正方向：
- 先寫出這篇要回答的讀者問題，再決定前言角度與段落標題。

負責 reviewer：writing_angle_reviewer, reader_appeal_reviewer

## gate-10-actionability 可行下一步關卡

嚴重度：required

來源訊號：needs_specific_numbers_actions: 23, missing_depth_or_content: 59

退件條件：
- 文章只有理解，沒有讓讀者或社工知道下一步可以盤點什麼。
- 建議太大、太正確，卻沒有第一個可操作行動。

必備條件：
- 一般民眾版至少留下一個可以自我檢查的問題或盤點方向。
- 社工版至少留下一個評估焦點或提問方向。
- 下一步不能變成財務建議或政策承諾。

修正方向：
- 把結尾從抽象鼓勵改成一個低門檻盤點動作或服務現場提問。

負責 reviewer：quality_reviewer, numeric_proof_reviewer

## Agent 討論順序

1. review_feedback_miner：用本規則庫先標出可能退件原因，禁止直接引用私有審稿原文。
2. writing_angle_reviewer：判斷一般民眾版或社工版的入口角度是否正確。
3. non_concept_reviewer：檢查文章是否停在概念宣導，是否有場景、數字、限制與決策困難。
4. numeric_proof_reviewer：檢查至少一組前後數值或可衡量改善，並確認假設與事實界線。
5. fact_case_reviewer：檢查台灣資料、政策、補助、案例或新聞是否最新且適用。
6. quality_reviewer：合併評分，輸出核准、修正後核准或退回重寫。

## 治理邊界

- 這是 project-local candidate，不是全域 Agent OS 規則。
- 不自動投稿、不自動核准、不取代 Kevin 或總編輯審核。
- 政策、補助、法規與地方方案仍必須查最新台灣官方來源。
