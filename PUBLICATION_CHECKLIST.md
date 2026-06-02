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
- Agent rules: `docs/agent-writing-quality-rules-v1.md`
- Suggestions data: `suggestions.json`

Production proof:

- Stable URL: <https://familyfin-knowledge-war-room.vercel.app/>
- Vercel CLI deployment target: `production`
- Header verified: `X-Robots-Tag: noindex, nofollow, noarchive`
- `robots.txt`: `Disallow: /`
