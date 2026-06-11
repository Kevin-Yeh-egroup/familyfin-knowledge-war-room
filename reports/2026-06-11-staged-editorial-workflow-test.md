# 2026-06-11 分段 agent 編輯工作流試驗

## 目的

測試文章生成是否能從「一次塞入大量 reviewer」改成分段接力，降低 AI 感與模板句。

## 試驗文章

- 來源：articles/2026-06-09-rejection-learned-pack/01-rent-subsidy-cashflow.txt
- 新稿：articles/2026-06-11-staged-editorial-workflow-test/01-rent-subsidy-date-cashflow-editorial-test.txt
- 字數：2256（非空白）

## 分段工作流

1. topic/source brief：確認 115 年度租金補貼官方資料與撥款時間。
2. resource benefit translation：把資源轉成家庭能得到的好處，不寫成公告布達。
3. reader angle：把主題縮成房租日前後五天的現金流盤點。
4. scenario narrative framing：用日常收支核對增加代入感，不偽裝真實案例。
5. behavior realism：檢查建議行動是否符合台灣一般人的合約、面子與關係壓力。
6. public writer：寫純文字正文。
7. Taiwan body voice editor：改掉抽象詞與翻譯腔。
8. de-AI editor：刪除重複模板轉場。
9. fluency editor：調整段落節奏。
10. ending editor：結尾回到一個具體盤點動作。
11. batch-template risk reviewer：標記若擴大到 10 篇，需檢查整包模板感。

## 初步學習

- 不是所有 gate 都應該在同一個生成 prompt 裡同時出現。
- 「去 AI 化」應是二修階段，而不是最後一句提醒。
- 資源段不能像布達公告，必須先說清楚能替家庭少掉哪一筆、爭取哪幾天、避免哪種債。
- 故事性應用日常收支核對承載數字，讓讀者代入情境，但不能偽裝成真實案例。
- 官方資料只能校正事實與名詞，語感要優先從真實讀者回饋、公共討論、留言與審稿回饋累積。
- 文章建議也要符合台灣日常行為常理；像房租延期這種牽涉合約、面子與信用的行動，不能寫成很容易的技巧。
- 單篇綠燈不足以保證整包自然，之後需要 batch-template risk gate。
