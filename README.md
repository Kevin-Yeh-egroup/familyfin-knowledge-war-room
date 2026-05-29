# 好理家在知識庫戰情室

This is a public review package for the FamilyFinHealth knowledge-base war room.

- Source entry: <https://www.familyfinhealth.com/social-worker/knowledge-base>
- Review mode: public but noindex
- Deployment target: Vercel production
- Artifact slug: `familyfin-knowledge-war-room`

The page is a reporting artifact. It may propose evidence-backed article drafts, but it does not modify or publish knowledge-base articles automatically.

Review console:

- Each `新增建議` item can be opened to inspect the pre-generated draft, source package, case note, and next-step checklist.
- Kevin can mark an item as `已核准`, `補證中`, or `退回`.
- Approved items are grouped by knowledge-base category in a browser-local approval vault.
- The vault can export approved suggestions as JSON or Markdown for later upload, GitHub review, or back-office publishing.
- Current MVP persistence is `localStorage`; cross-device durable approval storage should be added through GitHub, Google Sheets, or a knowledge-base API before using it as the single source of record.

Updated article-generation rule:

- Websearch must collect Taiwan-specific data, policy context, and credible real cases before drafting.
- Drafts should use Kevin's general-public or social-worker prompt style.
- Drafts must avoid purely conceptual writing.
- Numbers require sources.
- News cases must be attributed, de-identified, and not embellished.
- Any composite scenario must be labeled as an illustrative scenario.
- Drafts require a fact/case review and a prompt-fit review before publication.

Minimum drafting gate:

- At least one Taiwan official, legal, institutional, or statistical source.
- At least one Taiwan-specific number or one verifiable real case.
- Every major recommendation must lead to an action: eligibility check, office/window, process, form, phone number, URL, or checklist.
- Without reliable sources, the item must be labeled as `待查證`, `概念性建議`, or returned for evidence gathering.

Source priority:

1. Taiwan official statistics and government open data.
2. Original legal, policy, and institutional sources.
3. Responsible ministry or local government pages.
4. Academic, professional, or NGO reports with method/year/sample.
5. Reliable news cases, used only for scenario context.

Draft structure:

1. Taiwan opening scenario.
2. Problem reframing.
3. Taiwan data or policy context.
4. Case-based explanation without invented details.
5. Reader/self-check or social-work risk assessment.
6. Concrete next steps and resources.
7. Source notes, case notes, limits, and review findings.
