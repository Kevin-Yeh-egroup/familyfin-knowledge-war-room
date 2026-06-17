---
name: familyfin-grounded-workflow
description: Use for FamilyFin / 好理家在 knowledge-war-room work: article generation, article review, rejection learning, weekly reports, tool/workbench generation, dashboards, checklists, automations proposals, and any user-facing or reviewer-facing output that must fit Taiwan facts, real feedback, ordinary-reader tone, Taiwan habits, and behavior realism.
---

# FamilyFin Grounded Workflow

## Scope

This skill is not only for writing.

Use it whenever producing or reviewing:

- Knowledge-base articles and article packs
- Submission quality gates and reviewer reports
- War-room dashboards, approval workbenches, copy/export tools
- Weekly or biweekly review reports
- Agent workflows, checklists, scoring cards, or automation proposals
- Topic expansion suggestions and web-search research packs

## Core Standard

Every output must pass five layers:

1. **Taiwan Fact Grounding**
   - Use current Taiwan facts, laws, policies, subsidies, statistics, official windows, or verified public cases.
   - Official sources are for correctness, not tone imitation.

2. **Real Feedback Grounding**
   - Learn how people actually describe the problem from public comments, forums, article feedback, YouTube/Threads/Dcard/PTT style discussions, and 好理家審稿回饋.
   - Store only summarized patterns, not identities or long copied comments.

3. **Taiwan Natural Voice**
   - Avoid translation tone, official announcement tone, consultant deck tone, and abstract AI connectors.
   - Generate 2-3 wording candidates for suspicious sentences and choose the one a Taiwan reader would naturally continue reading.

4. **Behavior Realism**
   - Check whether normal people would actually do the suggested action.
   - Consider contracts, face, shame, power imbalance, landlord relationship, family pressure, workplace pressure, fear of being labeled, and time/cost friction.
   - If an action is hard, name the friction and place it in a realistic order.

5. **Usefulness And Verification**
   - For articles: reader learns a concrete financial assessment or decision.
   - For tools: the workflow solves a real user task and avoids unrealistic steps.
   - For checks: the gate catches likely failure, not just formal metadata.
   - For reports: the user can see what changed, why, proof, and next action.

## References To Read As Needed

- `docs/agent-writing-quality-rules-v1.md`
- `docs/submission-quality-gate-agent.md`
- `docs/non-concept-article-review-agent.md`
- `docs/taiwan-natural-language-corpus-workflow-2026-06-11.md`
- `data/taiwan-natural-language-feedback-seeds-2026-06-11.json`
- `data/taiwan-behavior-realism-feedback-seeds-2026-06-11.json`
- `data/approved-author-structure-cards-2026-06-10.json`
- `data/review-rejection-learning-2026-06-09.json`
- `data/review-rejection-derived-full-2026-06-09.json`
- `data/review-contrast-cards-2026-06-03.json`
- Recent relevant files in `reports/`, `logs/`, `analysis-history.json`, `article-pack-history.json`, and `suggestions.json`.

Read the smallest relevant subset. Do not load everything by default.

## Agent Chain

1. `task_router`
   - Classify the task: article, check/gate, tool/workbench, report, automation proposal, research pack, or workflow update.

2. `source_grounding_reviewer`
   - Verify current Taiwan facts and source reliability.
   - Reject stale subsidy, legal, or government details.

3. `real_feedback_miner`
   - Extract ordinary language, objections, anxieties, and behavior signals from real feedback.
   - For private InfoCenter review material, summarize rules only and preserve privacy boundaries.

4. `taiwan_habit_reviewer`
   - Check whether the proposed wording, flow, or user action matches Taiwan habits and social constraints.
   - Flags unrealistic behaviors such as “just negotiate rent delay” when contracts and face pressure matter.

5. `resource_benefit_translator`
   - Convert resources, policies, or tool features into the real benefit for a family, worker, social worker, or reviewer.
   - Avoid announcement copy.

6. `scenario_or_workflow_mapper`
   - For articles: create a readable scenario without fake-case framing.
   - For tools: map the real user workflow, owner, input, action, output, and approval point.
   - For checks: map what failure should be caught and where.

7. `creator`
   - Draft article, tool spec, report, UI copy, checklist, or data structure.

8. `voice_and_usability_reviewer`
   - For prose: Taiwan natural voice.
   - For tools/workbenches: real user path, labels, copy button/export behavior, review state, and low-friction operation.

9. `numeric_decision_reviewer`
   - Ensure numbers, before/after effects, remaining gap, or measurable checks exist where relevant.
   - For tools, ensure metrics or validation rules are visible.

10. `role_privacy_boundary_reviewer`
   - Remove role leakage, internal notes, private comments, raw reviewer text, SEO/AIO fields, and agent reasoning from public surfaces.

11. `final_quality_gate`
   - Decide green / revise / reject.
   - Requires proof appropriate to task.

## Output Contracts

### Article Or Article Pack

Must record:

- low-frequency gap selection review
- topic evidence
- reader fit
- financial decision or literacy transfer
- reader load card
- article usefulness review
- improvement plan and remaining gap
- resource benefit translation
- scenario narrative review
- de-AI review
- style variation gate
- writing form diversity review
- simulated reader review
- Taiwan natural feedback review
- behavior realism review
- role leak check
- final green gate

Public body must be plain text only unless Kevin asks for internal review.

Before title planning, run the **Low-Frequency Gap Gate** whenever Kevin asks to supplement missing/under-mentioned areas, expand the knowledge base, or generate article candidates:

- Use the whole `data/knowledge-base-title-index.json`, knowledge labels/tags, the current formal article pack, and recent trial packs.
- Rank candidate topics by how rarely they are mentioned in the whole knowledge base. Do not treat "not in the latest pack" as the same as "rarely mentioned".
- Record `indexedTitleCount`, searched keywords, `titleIndexHitCount`, excluded dense/recent topics, and the selection reason in `topicGapReview` or `preGenerationReview.knowledgeGapCard`.
- If a topic is already heavily covered, exclude it unless Kevin explicitly asks for that topic or the scan proves a neglected sub-angle.
- If a low-frequency topic has no clear family-economy link, no current Taiwan source, no ordinary-reader angle, or no household financial decision, mark it `pause` and choose another topic.
- The weekly war-room review should hand off low-frequency expansion candidates. The biweekly generation flow must choose from those candidates before considering broad popular topics.

Use the staged article grouping workflow when writing article packs:

`topic_planning_group -> writing_form_variety_reviewer -> drafting_group -> content_quality_group -> taiwan_voice_ai_reduction_group -> reader_simulation_group -> final_packaging_group`

Before drafting an article pack, choose a different writing form or narrative move for each article. Keep referencing the 好理家在文章管理區 event list: use approved article bodies as source material for de-identified structure learning, and use rejected article bodies plus rejection content as contrast lessons. A 12-article pack should use at least 8 unique writing forms and record `writingFormDiversityReview` for every article.

Every article must also record `articleUsefulnessReview`: the one household financial judgment the article advances, the common misreading it prevents, the concrete evidence in the body, the reusable capability, and the next number/date/risk/choice the reader should check after reading. If a draft is complete but average, split or rewrite until the article has one clear judgment.

Do not treat the reader simulation as real user research. It is an editorial gate that catches drop-off, AI flavor, missing next step, shame/trust risk, and unrealistic action advice before Kevin reviews the draft.

The article workstation is copy-only. It should let Kevin select an article and copy title plus body. It should not submit, approve, revise, reject, store local review status, or replace the InfoCenter article-management workflow.

### Tool Or Workbench

Must record:

- real user workflow
- user role and task
- input data and source boundary
- action realism
- Taiwan wording and local habit check
- privacy/public boundary
- copy/export/review states if relevant
- local validation or browser/HTTP proof when feasible

Reject tools that make the user do unrealistic work, hide decision state, or expose private/internal material on public surfaces.

### Check Or Gate

Must record:

- what failure it catches
- why the failure matters
- source of the rule
- false-positive risk
- what to revise when failed
- proof that the gate ran

Reject gates that only confirm metadata while missing reader trust, behavior realism, or actual usefulness.

### Report Or Weekly Review

Must record:

- what changed
- why it matters
- source/evidence
- what was blocked or uncertain
- next concrete action
- public/private boundary

## Hard Rejects

- Fictional case disguised as real.
- Official-policy paragraph with no household benefit.
- Advice ordinary people would not actually do, presented as easy.
- Tool workflow requiring unrealistic user behavior.
- Public surface containing private review content, raw comments, agent notes, or SEO/AIO internals.
- Stale Taiwan subsidy, legal, or local-government details.
- Article gives empathy but no financial assessment, next step, or help path.
- Article pack repeats the same narrative template across most articles without a recorded writing-form diversity review.
- Article expansion fills already-dense or currently common topics when Kevin asked to supplement rarely mentioned knowledge-base gaps.

## Verification

Use the repo checks when relevant:

- `node tools/validate-war-room-state.js`
- `node tools/audit-article-role-integrity.js <article-dir>`
- Source-specific scans for role leaks, unnatural phrases, or unrealistic-action patterns.

For user-facing tools, also verify the real flow through local HTTP/browser checks when feasible.

Record proof in the appropriate `reports/`, `logs/`, JSON data, and history files.

## Promotion Rule

This project skill is now mirrored by a global Codex skill.

Global installation:

- `C:\Users\Kevin\.codex\skills\familyfin-grounded-workflow\SKILL.md`
- `C:\Users\Kevin\Documents\Codex\agent-os-home\codex-os\workflows\familyfin-grounded-staged-workflow.md`

Keep this project file as the war-room-specific source note for data files, article gates, history artifacts, and local verification commands.

Do not promote this workflow into automation, public deployment, account actions, durable memory, or auto-submission without explicit Kevin approval and a governance card.
