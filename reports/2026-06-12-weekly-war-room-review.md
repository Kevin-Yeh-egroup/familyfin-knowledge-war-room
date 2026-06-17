# 2026-06-12 週戰情室檢視：runtime lock 阻塞下的 read-only 盤點

## 摘要

- 本次完成 repo 端戰情室現況、近期駁回時間帶、文章分類缺口與最新台灣官方題材擴充的 read-only 檢視。
- 本次未完成新的 live `EVENT_REVIEW` / `EVENT_COMMENT` 交叉讀取；阻塞點不是 401 或權限錯誤，而是共享 Chrome profile 在 headless 啟動時立即退出，且 profile 目錄存在 `lockfile`。
- 因此本次 `complete learning cards = 0`，所有新觀察都維持在 `partial signal` 或 `expansion suggestion` 層級，不升級成新的 hard rule。

## 可核准項目

1. 是否核准下次為 automation-14 提供獨立的 read-only Chrome runtime，避免共享 profile lock 持續阻塞 `EVENT_REVIEW / EVENT_COMMENT`。
2. 是否在 live review/comment 路徑恢復前，先把本次 5 張擴充建議卡列入雙週產稿前題材預備池，而不是正式候選題。

## 本週檢視結果

### 已完成

- `node tools/validate-war-room-state.js` 通過，代表目前 war-room 主體、12 篇 current pack、title index、approved author structure、writing-form diversity 與 role leak audit 都在乾淨狀態。
- 依 `suggestions.json` 與 validator 現況，repo 基線仍是：
  - indexed published articles: 1320
  - indexed draft articles: 27
  - indexed events: 2086
  - review rejection ready cards baseline: 50
  - current grounded article pack: 12 篇，12/12 綠燈
- 依既有 private raw 檔回看 2026-06-06 至 2026-06-09 的近期駁回時間帶，共 17 筆 reject。
- 補齊本週 5 張台灣官方資料擴充建議卡。

### 阻塞

- live `EVENT_REVIEW / EVENT_COMMENT` 本次無法重開：
  - 12 筆最近 reject 的 click script 全量嘗試逾時且未產出檔案。
  - 3 筆 minimal click probe 也直接結束且未產出檔案。
  - 同一個 shared profile 目錄存在 `lockfile`。
  - `chrome.exe --headless=new --user-data-dir=<shared profile>` 3 秒內退出。
- 目前沒有 401、登入失敗、權限拒絕的直接證據，所以 blocker 分類不是 `login/session missing`，而是 `target review/comment path unreachable`。

## 本週讀取數與產出數

- 既有 private raw 近期 reject 記錄盤點數：17
- live `EVENT_REVIEW` 讀取數：0
- live 審核內容讀取數：0
- live `EVENT_COMMENT` 正文讀取數：0
- 完整學習卡數：0
- partial signals：4
- 擴充建議數：5

## 知識缺口

1. 本週無法重新證明 `EVENT_REVIEW` 與 `EVENT_COMMENT` 在同一 run 內仍可穩定開啟，所以不能新增 complete learning。
2. 2026-06-06 至 2026-06-09 的 17 筆近期 reject 中，從歷史 raw 角度看只有 1 筆帶有非空 review content；但本次沒能 live 重開，所以仍不能當作本週完整學習。
3. 福利題材雖然官方資料已更新，但地方適用差異很大；若不指定縣市，容易把地方規則誤寫成全台通用。
4. 最近 reject 題名持續集中在關係控制、防詐、照顧壓力、住房與債務，但缺少新的 live reviewer wording 來確認究竟是 framing、數字、平台定位還是內容落點出錯。

## 擴充建議

詳細卡片見 `work/war-room-weekly-suggestions-2026-06-12.json`。本輪優先題材：

1. 115年度租金補貼全年受理與資格試算。
2. 115年低收／中低收入戶標準與地方財產門檻差異。
3. 六大社福津貼調升與 115 年 7 月可能上路的家庭現金流過渡期。
4. 長照3.0下的出院後家庭支持、住院整合照護與責任醫療。
5. 165打詐儀錶板 AI 客服與第一時間止損路徑。

## 學習發現

### 本次可列為 partial signal 的觀察

1. 關係控制與家庭自主權題名明顯增多，但沒有 live review content，暫時只能視為「需要更早落到家庭財務決策點」的 watchlist。
2. 防詐題材近期仍多，但沒有新的 live reviewer wording，不能直接下結論說問題一定是 title、內容重複或案例薄弱。
3. 照顧壓力、單親、早療與住房題材仍是高密度區，代表讀者需求面存在，但文章若只停在情緒或概念層，仍然很容易被退。
4. `title-only` 或 `historical-raw-only` 依舊不能升級成新 hard rule，這條邊界本週必須繼續守住。

### reviewer agents 本週維持或加強的規則

- `review_feedback_miner`: 沒有 live review content + comment body，就不新增 hard rule。
- `numeric_proof_reviewer`: 補助與福利題材必須分開寫中央基線、地方規則、家庭效果。
- `non_concept_reviewer`: 關係、照顧、心理與防詐題材都要在前 1/3 落到金錢判斷或行動門檻。
- `writing_angle_reviewer`: 太文學、太隱喻的題名只能當吸引力候選，不能取代清楚的家庭問題。
- `reader_appeal_reviewer`: 第一屏仍需 familiar scene + one number + why now。
- `role_leak_reviewer`: blocker 證據也只能保留 runtime/path/count 級別，不能帶出後台原文。
- `quality_reviewer`: 題材卡必須同時交代 household question、current Taiwan source、action path、human-review risk。

## 雙週文章生成前需要準備的題材

1. 租金補貼：要先決定是寫全年受理時程、資格卡關，還是地方補位。
2. 低收／中低收入戶：必須指定一個縣市做地方差異示範。
3. 六大社福津貼調升：適合做「制度過渡期」題，不宜現在就寫成已全面落地。
4. 長照3.0：適合從出院回家後的家庭重整切入，不要直接寫政策總覽。
5. 165 打詐：要寫成「30 秒先止損」，不要再寫泛泛防詐懶人包。

## blocker-proof / checkpoint

- `last_successful_checkpoint`: 2026-06-09 full read-only collection
- `session_state`: shared profile likely authenticated but current headless runtime unusable
- `project_context_state`: correct FamilyFin repo and recent reject window confirmed
- `exact_blocked_step`: shared-profile headless launch into live `EVENT_REVIEW / EVENT_COMMENT`
- `fallback_checks_completed`: validator, private-raw recount, source-of-truth review, official-source research
- `proof_artifacts`: see `work/war-room-checkpoint-card-2026-06-12.md`
- `decision`: `blocked`
- `next_retry_gate`: retry only after profile lock clears or a dedicated read-only runtime is approved
