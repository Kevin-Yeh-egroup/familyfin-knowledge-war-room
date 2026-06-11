# 2026-06-11 三張通過稿結構卡接入文章生成

## 任務

Kevin 要求把劉泰一、李婉仙、蔡思樂三張通過稿文章結構卡的學習結論，用來優化好理家在知識庫戰情室及其文章生成。

## Agent OS 收斂

- `task_router`：本次不是重新寫文章，而是把已完成的通過稿學習變成可執行的生成規則。
- `workflow_designer`：三張卡需同時接入資料層、生成器、validator 與前台顯示，避免只停在報告。
- `human_copy_reviewer`：正文不可出現「通過稿」「作者結構」「agent 學習」「審稿建議」等後台語。
- `taiwan_context_reviewer`：三張卡只能學去識別結構，不保存全文、事件 ID 或私有審核原文。
- `risk_guardian`：缺少三張卡採用紀錄時，文章不得進入 Kevin 核准台。

## 採用的三個結構

1. 個案前後差異
   - 文章要讓讀者看見調整前壓力、調整後結果，以及造成差異的關鍵因素。
   - 若調整後仍有缺口，需寫出合理求助路徑。

2. 制度判斷順序
   - 制度或補助題材要先拆資格、金額、時間差、文件、地方差異。
   - 再回到家庭現金流與下一步決策。

3. 風險支撐分層
   - 文章要分清家庭自己的錢、制度資源、親友支持、正式求助與仍未補上的風險。
   - 支持系統不能只寫成溫情口號。

## 本次調整

- 十篇正式文章包生成器已新增 `approvedAuthorStructureUse`。
- 兩篇試產文章包生成器已新增 `approvedAuthorStructureUse`。
- `suggestions.json` 會輸出 `approvedAuthorStructureLearning`，供戰情室前台顯示。
- validator 已將 `approvedAuthorStructureUse` 納入硬性檢查。
- 前台新增「通過稿結構學習」區塊。
- 正式十篇與兩篇試產稿 detail 頁都會顯示每篇文章的三張卡採用方式。
- 投稿生成規格、品質 gate agent 與 rulebook 已同步更新。

## 驗證標準

文章進入核准台前必須同時符合：

- `preGenerationReview.approvedAuthorStructureUse.status` 為 `passed`。
- 來源必須是 `data/approved-author-structure-cards-2026-06-10.json`。
- `appliedPatterns` 必須覆蓋三種結構。
- `primaryPattern` 必須存在。
- `generationConstraint` 與 `publicBodyRule` 必須存在。

## 下一步

下一輪文章生成時，agent 應先選定每篇文章的主要結構，再檢查三種結構是否都被轉成正文品質約束。若正文只剩概念、沒有前後差異、沒有制度判斷順序、沒有風險支撐分層，就退回生成端重寫。
