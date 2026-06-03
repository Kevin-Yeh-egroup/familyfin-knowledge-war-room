# 2026-06-03 一般民眾文章包重生日誌

## 背景

Kevin 發現先前生成稿件把「給作者或審稿者的建議」混進正文，造成角色錯亂。這會讓一般讀者看見後台痕跡，影響信任，因此本次改為整批重生。

## 修正方向

- 預設讀者一律為一般民眾。
- 社工版只有 Kevin 明確要求時才生成。
- TXT 檔只保留 `正文` 標記與可複製正文。
- SEO/AIO、來源、檢核、討論與審核資訊只放在 `suggestions.json`。
- 正文不得出現「這篇文章」「文章最後」「對一般民眾版而言」「可以提醒讀者」「投稿」「agent」「社工」「服務對象」「個案」等後台語或角色錯位語。

## 本次產出

- 新增文章包：`articles/2026-06-03-public-regenerated-pack`
- 文章數：10
- 每篇正文：均超過 2000 字
- 內容方向：租金補貼、單親托育、債務協商、緊急預備金、長照、詐騙、青年就業、減班休息、特殊境遇家庭扶助、退休高齡風險

## 驗證

- `node tools/build-public-article-pack-2026-06-03.js`
  - 10 篇成功產出
  - 正文字數範圍：2017 到 2111 字
- `node tools/audit-article-role-integrity.js articles/2026-06-03-public-regenerated-pack`
  - scannedFiles: 10
  - matches: 0
  - pass: true
- 角色錯亂禁語掃描
  - 結果：NO_MATCHES
- 私有資料外洩掃描
  - rawRows: 290
  - publicFilesScanned: 70
  - idLeaks: 0
  - longTextLeaks: 0

## 後續規則

每次生成可審核文章包前，必須先讓 role leak gate 進入生成前規劃，而不是寫完才人工檢查。若正文出現後台語氣，該篇不得進入 Kevin 核准清單。
