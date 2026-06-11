# Publication Checklist

- [x] Public-report package prepared.
- [x] Local private paths and account emails removed from public page.
- [x] InfoCenter raw article bodies are excluded from the public repo.
- [x] Case/interview traces are summarized only as risk boundaries, not published as source text.
- [x] HTML meta robots set to `noindex,nofollow,noarchive`.
- [x] `robots.txt` blocks crawling.
- [x] `vercel.json` sets `X-Robots-Tag`.
- [x] GitHub public repo created: `Kevin-Yeh-egroup/familyfin-knowledge-war-room`.
- [x] Vercel project connected to GitHub repo.
- [x] 2026-06-02 Production deployment verified after commit.
- [x] Stable public URL verified after commit.

Current package:

- Learning milestone: `reports/2026-06-02-learning-milestone-001.md`
- Full learning summary: `reports/2026-06-02-full-learning-summary.md`
- Article generation standard: `docs/submission-article-generation-standard-v2.md`
- First submission pack: `articles/2026-06-02-weekly-pack/`
- Suggestions data: `suggestions.json`
- Weekly report and analysis history data: `analysis-history.json`
- Plain-text article pack history data: `article-pack-history.json`
- Public knowledge-base title index: `data/knowledge-base-title-index.json`
- War room state validator: `tools/validate-war-room-state.js`
- Biweekly prewrite checklist: `docs/biweekly-prewrite-checklist-2026-06-08.md`
- Source-of-truth reconciliation: `reports/2026-06-08-source-of-truth-reconciliation.md`
- Submission mechanism chat review: `reports/2026-06-08-submission-mechanism-chat-review.md`
- Plain-text article pack green review loop: `reports/2026-06-08-green-review-loop-design.md`
- 2026-06-09 rejection learning report: `reports/2026-06-09-review-rejection-learning.md`
- Current rejection-learned article pack: `articles/2026-06-09-rejection-learned-pack/`

2026-06-02 update:

- [x] Full chronological learning completed through all 2026 events.
- [x] Weekly Friday 14:00 automation created as `automation-14`.
- [x] Review board updated from suggestion ideas to 10 submission-ready drafts.
- [x] Each draft body checked as 2000+ non-whitespace characters.
- [x] Public repo still excludes raw InfoCenter learning packs and private review text.
- [x] Plain-text workbench added: no Markdown preview, SEO/AIO hidden, copy body/title+body/review text available.
- [x] Non-concept and reader-appeal review agent rules added to the weekly workflow.
- [x] Numeric proof reviewer added: articles must include concrete numbers, before/after difference examples, and improvement factors.
- [x] Writing angle reviewer added: public and social-work articles are checked against audience-specific entry angles and banned phrases.
- [x] Learning database fields documented for numeric proof, writing angle, non-concept review, banned phrases, review feedback, and agent discussions.
- [x] Agent training loop documented with review-event pairing, contrast cards, agent discussion traces, and explicit gap status for missing per-event review comments.

2026-06-05 update:

- [x] Analysis history panel added to the public review page.
- [x] Analysis history is now grouped into weekly reports with status, outcomes, blockers, next actions, and expandable records.
- [x] Plain-text article pack outputs are logged in `article-pack-history.json`, including generated packs and blocked attempts.
- [x] Previous reports and logs are exposed only as public-safe derived summaries.
- [x] Local private paths are normalized before writing `analysis-history.json`.
- [x] Copy and TXT download actions added for each analysis record.

2026-06-08 local gate upgrade:

- [x] Current article body length gate changed to non-whitespace body characters.
- [x] `tools/validate-war-room-state.js` added for JSON, gate-count, role-leak, body-length, bodyPath, title novelty, and article-pack-history drift checks.
- [x] Source-of-truth reconciliation report added so weekly and biweekly flows know which repo files are authoritative.
- [x] Biweekly prewrite checklist added; formal 10-article packs should stop at blocker report when live review/comment learning is insufficient.
- [x] 「檢核投稿機制」聊天本體回查完成，已將標題新意、內容差異、新讀者價值與案例數字判斷回填到產稿前 gate。
- [x] Public knowledge-base title index added; validator now checks current candidate titles against 1323 existing public knowledge-base titles.
- [x] Plain-text article packs must now include `articlePackReviewGate.status = green` before entering Kevin approval; validator fails non-green or missing review traces.

2026-06-09 rejection-learning regeneration:

- [x] Latest InfoCenter read-only collection completed: 2086 events, 350 rejected reviews.
- [x] Complete review content increased to 51 rows; review/comment cross-learning-ready cards increased to 50.
- [x] Public-safe derived files written without raw event ids, raw review text, or raw article bodies.
- [x] Submission quality gates updated to `data/submission-quality-gates-2026-06-09.json`.
- [x] Current review board regenerated as `2026-06-09-rejection-learned-pack`.
- [x] Validator passes with no warnings.

Production proof:

- Stable URL: <https://familyfin-knowledge-war-room.vercel.app/>
- Vercel CLI deployment target: `production`
- Header verified: `X-Robots-Tag: noindex, nofollow, noarchive`
- `robots.txt`: `Disallow: /`
