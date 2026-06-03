# 2026-06-02 首批 10 篇純文字投稿文章包

本目錄保存本週首批投稿草稿。

## 2026-06-03 狀態修正

本批文章已降級為「需重生，不可直接投稿」。

原因：

- 多篇正文混入作者、編輯、agent 或審稿者才應看到的寫作建議。
- 部分一般民眾版文章出現「對一般民眾版而言」「這篇文章若要投稿」「文章最後也應」等後台語。
- 部分文章是社工版，已不符合後續預設全部生成一般民眾版的要求。
- 已新增 `role_leak_reviewer` 與 `tools/audit-article-role-integrity.js`，後續文章包必須通過角色一致與內部語言隔離檢查。

更新重點：

- 文章檔案改為 `.txt`。
- 每篇正文扣除欄位後均超過 2000 字。
- 不再提供 Markdown 版本。
- 不在投稿預覽顯示 SEO、AIO、Meta、Slug、FAQ 或來源清單。
- 來源查核仍保留在內部規則與 suggestions metadata。
- 首批文章需重生，不應作為可投稿初稿使用。

## 文章

1. `01-rent-subsidy-stability.txt`
2. `02-debt-negotiation-not-agency.txt`
3. `03-scam-recovery-social-work.txt`
4. `04-emergency-fund-income-break.txt`
5. `05-long-term-care-family-finance.txt`
6. `06-single-parent-childcare-support.txt`
7. `07-youth-first-job-credit.txt`
8. `08-retirement-medical-scam-risk.txt`
9. `09-reduced-hours-income-risk.txt`
10. `10-resource-access-social-work.txt`

## 審核邊界

這些文章保留為錯誤樣本與流程修正依據，不應投稿、不應核准、不應自動上架到正式知識庫。
