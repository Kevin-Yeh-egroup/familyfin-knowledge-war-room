# 2026-06-08 既有知識庫標題索引接入紀錄

## 目的

將「檢核投稿機制」學到的標題相似與內容差異判斷，前移到戰情室正式產稿前。

過去 validator 只能檢查同批候選稿是否標題太像。  
本次新增公開知識庫標題索引後，也能檢查候選稿是否撞到站上既有公開文章標題。

## 已完成

1. 新增 `tools/build-knowledge-base-title-index.js`。
2. 從好理家在公開知識庫文章搜尋 API 讀取公開標題。
3. 輸出 `data/knowledge-base-title-index.json`。
4. 目前索引包含 1323 筆公開知識庫標題。
5. `tools/validate-war-room-state.js` 已接入此索引。

## 隱私邊界

此索引只保存：

- articleId
- 公開文章標題
- 正規化後標題

此索引不保存：

- 文章正文
- InfoCenter 後台評論
- 審核內容
- 作者內部資料
- Cookie、token 或私有 API 回應

## 驗證結果

執行：

- `node tools/build-knowledge-base-title-index.js`
- `node tools/validate-war-room-state.js`

結果：

- 公開標題索引：1323 筆。
- 目前 10 篇候選稿與既有知識庫標題：0 exact match、0 near match、0 warning。
- validator 狀態：`pass_with_warnings`。
- 唯一 warning 仍是 `review learning still below formal 10-article threshold: 3/8 ready cards`。

## 下次產稿前規則

正式產稿前需先執行：

`node tools/build-knowledge-base-title-index.js`

再執行：

`node tools/validate-war-room-state.js`

若 validator 回報與既有標題 exact 或 near duplicate，該題不可直接進正文。  
需先補 `new_reader_value` 與 `content_difference_plan`，或改題。
