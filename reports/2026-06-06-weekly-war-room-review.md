# 2026-06-06 好理家在知識庫每週戰情室檢視

結果：blocked

## 摘要

- 本次完成本地 war room、既有 rejection learning、文章品質 gate 與最新台灣官方資料的 read-only 盤點。
- 本次未能完成新的 InfoCenter `EVENT_REVIEW` / `EVENT_COMMENT` live 讀取，因此沒有新增完整學習卡。
- 本次仍產出可供下次雙週文章生成前使用的 reviewer 規則增量、知識缺口、擴充建議卡與 blocker/checkpoint card。

## 可核准項目

1. 核准將本次 reviewer 規則增量，升級為雙週文章生成前的必查 checklist。
2. 核准下次在 Chrome/browser runtime 穩定後，重新執行 InfoCenter `EVENT_REVIEW` / `EVENT_COMMENT` live read-only 回查。
3. 核准以下 5 個題材進入雙週文章生成候選池，但在 live review/comment 證據恢復前，僅列為 `candidate_pending_live_review_signal`。

## 本次讀取與產出數

- 本次 live 事件讀取數：0
- 本次 live 審核內容讀取數：0
- 本次新增完整學習卡數：0
- 既有完整學習卡基準：3
- 本次新增擴充建議數：5
- 本次 reviewer 討論代理：`review_feedback_miner`、`numeric_proof_reviewer`、`non_concept_reviewer`、`writing_angle_reviewer`、`reader_appeal_reviewer`、`role_leak_reviewer`、`quality_reviewer`

## InfoCenter 狀態與阻塞判定

- `project context` 已確認：本地 event index、Chrome profile、repo 內既有 read-only 工具均存在。
- `login/session missing`：未直接證實。這次沒有拿到 401 或權限拒絕訊號。
- `wrong project context`：未發現證據。
- `target review/comment path unreachable`：本次主 blocker。`node tools/collect-infocenter-review-rejections-readonly.js` 在 read-only 執行時出現 `Execution context was destroyed.`，Node REPL 的最小化 Chrome 診斷也逾時，未成功回收任何新輸出。

## 本週知識缺口

1. `EVENT_REVIEW` 與 `EVENT_COMMENT` 的 live 讀取尚未恢復，無法新增 complete learning。
2. `title_only` 類型的 rejection signal 仍多，不能直接升級成硬性寫作規則。
3. 台灣資料查核規則已完整，但 evidence schema 還不夠結構化，容易知道要查，卻沒有留下可核對欄位。
4. `role_integrity` 與 `body_naturalness` 雖已成 gate，但缺少新的 live rejection evidence 驗證。
5. 低密度但高風險題材仍不足，例如家庭照顧、急難救助時間差、照顧請假與收入損失、假冒公務機關詐騙後的家庭現金流、前置協商前的家庭還款壓力。

## Reviewer 學習發現

### 已可升級的 hard gates

1. 產稿前必做 `claims table`，列出收入、支出、補助、費用、前後差異與每個數字的來源或假設。
2. 個案條件不得漂移，家庭人數、角色、收入來源、照顧責任要前後一致。
3. 每個核心段落至少要有一個具體生活場景、數值變化或行動後結果，不能只停在概念。
4. 沒有 `reviewContentFound=true` 且沒有打開評論文章正文時，不可宣稱完成 rejection learning。

### 仍屬 partial signal 的規則

1. `platform_fit`
2. `finance_focus_alignment`
3. `duplicate_or_existing_content`
4. `editorial_quality_gap`

### 本次 reviewer 規則增量

1. 雙週選題前先過三道題材門：
   - 能不能一句話說出哪個家庭在什麼時間差或支出順序下被卡住。
   - 能不能自然放進至少一組前後差異數字，且數字能翻成生活用途。
   - 能不能留下明確第一個盤點點，例如日期、金額、順序、缺口或支持來源。
2. 標題不可再用單一公式批量生成；同批至少混 3 種入口型態。
3. 正文不得混入作者、編輯、審稿、投稿、知識庫、agent 語言。
4. 台灣資料查核需落成結構化 evidence 欄位，至少含：
   - `applicable_year`
   - `year_type`
   - `authority_name`
   - `authority_level`
   - `canonical_source_url`
   - `effective_region`
   - `local_variation_required`
   - `eligibility_scope`
   - `amount_or_threshold`
   - `deadline_or_period`
   - `check_date`
   - `reader_facing_interpretation`

## 擴充建議卡

### 建議卡 1

- 建議標題：家人突然住院後，哪一筆錢最先追上來？先看長照自付與照顧工時缺口
- 適用分類：`家庭重大事件-銀髮族照顧`、`主要問題彙編-政府救助資源`
- 來源名稱：衛福部長照專區 1966
- 來源連結：[1966 長照服務申請頁](https://1966.gov.tw/LTC/cp-6533-70777-207.html)
- 來源日期：頁面含 115 年 1 月 1 日與 115 年 7 月 1 日適用說明
- 搜尋日期：2026-06-06
- 可信度：高
- 核心發現：長照對象與給付額度、經濟分級自付比例、外籍看護家庭可用服務都已明確列出，但仍有縣市分區與地方窗口差異。
- 真實案例或數據摘要：第 2 級每月照顧及專業服務額度 10,020 元；第一類全額補助，第二類自付 5% 至 10%，第三類自付 16% 至 30%；交通接送依居住地分區。
- 可延伸觀點：從「家裡有沒有申請長照」改寫成「哪些帳單和少掉的工時會先出現」。
- 建議文章角度：一般民眾版，聚焦出院後 30 天內的家庭收支重排。
- 核心重新框架：長照不是服務清單，而是家庭現金流與照顧時間同時被改寫。
- 需要人工判斷的風險：地方政府部分負擔、交通分區與資源可近性不同，不可寫成全台一致。
- 建議狀態：`candidate_pending_live_review_signal`

### 建議卡 2

- 建議標題：主要收入一停，家裡先撐哪 48 小時？急難紓困不是等所有證明都備齊才開始
- 適用分類：`主要問題彙編-政府救助資源`、`家庭重大事件-就業`
- 來源名稱：衛生福利部急難救助
- 來源連結：[衛福部急難救助](https://www.mohw.gov.tw/cp-88-226-1.html)
- 來源日期：頁面未明示更新日期；HTML metadata `DC.Date` 顯示 2017-01-09
- 搜尋日期：2026-06-06
- 可信度：高
- 核心發現：急難紓困、地方政府急難救助、中央急難救助是不同層次；急難紓困強調 24 小時內訪視與快速發放，不等於所有家庭都直接走中央案。
- 真實案例或數據摘要：符合急迫個案可先發 5,000 元；核定後 24 小時內可發放 1 萬至 3 萬元。
- 可延伸觀點：把急難救助寫成「現金流斷點處理順序」而不是福利介紹。
- 建議文章角度：一般民眾版，聚焦失業、重傷病、主要生計者中斷工作的家庭。
- 核心重新框架：急難救助真正處理的是時間差，不是把所有問題一次解完。
- 需要人工判斷的風險：地方窗口、資格認定與後續中央/地方救助銜接要分開寫。
- 建議狀態：`candidate_pending_live_review_signal`

### 建議卡 3

- 建議標題：孩子生病時，不是每個家庭都能直接請假：照顧假怎麼變成收入風險
- 適用分類：`家庭重大事件-教育`、`評估與輔導觀點-專業知能`
- 來源名稱：勞動部新聞稿
- 來源連結：[勞動部家庭照顧假說明](https://www.mol.gov.tw/1607/1632/1633/90450/)
- 來源日期：2026-05-12
- 搜尋日期：2026-06-06
- 可信度：高
- 核心發現：勞動部最新說明把寄養家庭、親屬安置、類家庭照顧人力納入家庭照顧假適用解釋，並重申雇主不得拒絕或以缺勤不利對待。
- 真實案例或數據摘要：家庭照顧假適用範圍延伸到安置照顧者，並提供證明文件申請表機制。
- 可延伸觀點：把制度延伸解釋翻成「哪些照顧者原本最容易卡在收入和請假中間」。
- 建議文章角度：社工/助人工作版優先，也可轉一般民眾版。
- 核心重新框架：照顧假不是單純勞權條文，而是臨時照顧如何避免家庭現金流再受傷。
- 需要人工判斷的風險：不同工作型態、無薪影響、實際雇主配合度仍需審慎寫法。
- 建議狀態：`candidate_pending_live_review_signal`

### 建議卡 4

- 建議標題：詐騙沒成功也可能讓家裡亂一整天：假冒公務機關為什麼特別容易打進家庭恐慌
- 適用分類：`家庭重大事件-詐騙`、`財務管理與規劃-管理技巧`
- 來源名稱：內政部警政署刑事警察局
- 來源連結：[假冒公務機關詐騙案件升溫](https://www.cib.npa.gov.tw/ch/app/news/view?id=1887&module=news&serno=f896f821-337e-43c8-b652-25d553f7da38)
- 來源日期：114-06-17
- 搜尋日期：2026-06-06
- 可信度：高
- 核心發現：官方公布 114 年 5 月平均每日受理 516 件、平均每日財損約 2 億 8,160 萬元，且假冒公務機關手法會結合視訊、偵查不公開與帳戶監管話術。
- 真實案例或數據摘要：自儀表板上線以來，瀏覽人次突破 183 萬，收錄案例逾 6.3 萬筆。
- 可延伸觀點：不只講防詐，而是寫「當家庭成員突然被要求保密、轉帳、交提款卡時，現金流與信任同時失控」。
- 建議文章角度：一般民眾版，聚焦家庭應對順序。
- 核心重新框架：詐騙風險不只是損失金額，而是讓家庭在短時間內做出錯誤財務動作。
- 需要人工判斷的風險：真實案例敘述要去識別化，不可製造未經查證細節。
- 建議狀態：`candidate_pending_live_review_signal`

### 建議卡 5

- 建議標題：每月都在還，為什麼還是看不到出口？前置協商前先看懂哪些債務能談、哪些不能跳過
- 適用分類：`主要問題彙編-債務`、`政策法規-法規應用`
- 來源名稱：司法院
- 來源連結：[消費者債務清理條例 FAQ](https://www.judicial.gov.tw/tw/cp-1358-2615-d0c8c-1.html)；[前置調解聲請狀](https://www.judicial.gov.tw/tw/cp-1397-4171-1fc8b-1.html)
- 來源日期：FAQ 更新日期 113-01-23；前置調解聲請狀更新日期 115-01-29
- 搜尋日期：2026-06-06
- 可信度：高
- 核心發現：有金融機構債務時，進入更生或清算前原則上要先協商或調解；法院也持續更新前置調解書狀與說明。
- 真實案例或數據摘要：前置調解聲請狀頁面明列消費者債務清理條例第 151 條第 2 項與最新書狀版本。
- 可延伸觀點：把「協商流程」翻成「哪些債務壓力先吞掉家庭生活，什麼情況下不該只靠最低應繳撐下去」。
- 建議文章角度：一般民眾版，避免法律教材口氣。
- 核心重新框架：前置協商不是法律流程背誦，而是家庭還款順序與生活費保留空間的重排。
- 需要人工判斷的風險：法律程序、非金融機構債權、資產管理公司情況要避免過度簡化。
- 建議狀態：`candidate_pending_live_review_signal`

## 雙週文章生成前需要準備的題材

1. 急難紓困時間差與家庭現金流
2. 長照自付比例、工時減少與家庭支出重排
3. 家庭照顧假與臨時照顧造成的收入缺口
4. 假冒公務機關詐騙後的家庭應對順序
5. 前置協商前的生活費保留與還款壓力

## 下一步

1. 先修復或替換本地可用的 browser runtime，恢復 InfoCenter `EVENT_REVIEW` / `EVENT_COMMENT` live read-only 路徑。
2. 將本次 reviewer 規則增量轉成雙週候選題卡的 prewrite checklist。
3. 只在新的 live rejection/comment 證據恢復後，才把以上題材升級為正式雙週 10 題候選。

## 需要 Kevin 核准的事項

1. 是否要在下次手動 run 前，優先處理 browser runtime / Chrome session 診斷。
2. 是否要把本次 5 張建議卡直接列入雙週題庫待選，而不是等待下一次週檢視後再併入。
