# 2026-06-10 log｜改善計畫與通過稿作者來源修正

## 已做

- 動用 agent 討論 Kevin 新增觀察：文章需說明改善計畫、施行效果、剩餘缺口與打平或求助路徑。
- 將討論結果收斂為 `improvementPlanCard` 與 `readerLoadCard`。
- 使用 Chrome 已登入狀態只讀進入「好理家在文章管理區」事件列表。
- 搜尋劉泰一、李婉仙、蔡思樂。
- 確認李婉仙與蔡思樂在事件列表中有「客戶‑個人」等於本人的審核成功事件。
- 確認劉泰一目前用全名與拆字搜尋未命中。
- 依 Kevin 指示，將 FB 短文與社群導流文排除於通過稿結構學習樣本之外。

## 重要發現

- 李婉仙搜尋結果：102 筆。
- 蔡思樂搜尋結果：47 筆。
- 事件列表目前顯示總量：2101 筆。
- 評論分頁可能只含 FB 分享短文，不能直接當成文章寫作學習素材。
- 若評論內有完整文章連結，後續應開啟完整文章頁抽結構，而不是使用 FB 短文內容。

## 規則變更

- 文章生成標準新增改善計畫與剩餘缺口檢查。
- 品質檢查 agent 新增 `improvement_plan_reviewer`、`reader_load_reviewer`、`approved_author_structure_reviewer`。
- 通過稿作者學習只保存去識別結構卡，不保存全文、事件 ID 或私有審核原文。

## Taiwan tool-fit gate

- Tool：好理家在投稿文章生成與品質檢查工作流。
- Target users：Kevin、文章生成 agent、一般民眾文章審核工作台。
- Taiwan wording fit：pass，使用台灣常見求助語彙，例如社會局處、鄉鎮市區公所社會課、社福中心、1957 福利諮詢專線與主管機關。
- Operational habit fit：pass，保留人工審核與正式上稿前查核，不讓 agent 自動投稿或自動核准。
- Sensitive data boundary：pass，通過稿作者學習只保存去識別結構卡，排除 FB 短文、事件 ID、審核原文與全文。
- Verdict：pass。

## 未做

- 未點擊「匯入至文章」。
- 未修改 InfoCenter 任何事件狀態。
- 未將 FB 短文納入學習。
- 未宣稱已完成劉泰一文章學習。
