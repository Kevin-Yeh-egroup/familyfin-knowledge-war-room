# 2026-06-17 low-frequency gap gate skill and automation update

## What changed

- Added Low-Frequency Gap Gate to the global `familyfin-grounded-workflow` skill.
- Added the same gate to the project mirror under `.agents/skills/familyfin-grounded-workflow/SKILL.md`.
- Added the low-frequency rule to the global Agent OS `familyfin-grounded-staged-workflow.md`.
- Added weekly handoff rules to `automation-14`.
- Added biweekly generation rules to `automation-15`.
- Added validator checks so the current trial pack must include low-frequency topic evidence when `lowFrequencyTopicSelectionRequired = true`.

## Why needed

Kevin clarified that expansion should supplement topics rarely mentioned in the whole knowledge base, not topics that merely appear missing from the latest article pack or topics that already have many related articles.

## Owner

`familyfin_grounded_orchestrator` owns the gate.

Supporting reviewers:

- `knowledge_gap_mapper`
- `source_grounding_reviewer`
- `numeric_decision_reviewer`
- `taiwan_habit_reviewer`
- `final_quality_gate`

## Trigger

Run this gate before topic planning when:

- Kevin asks to supplement knowledge-base gaps.
- Kevin asks for expansion suggestions.
- Kevin asks for new article generation.
- The weekly war-room automation prepares handoff candidates.
- The biweekly generation automation drafts article candidates.

## Rule

Do not confuse "not in the latest article pack" with "rarely mentioned in the knowledge base".

Topic planning must start from:

- whole knowledge-base title index
- labels/tags
- current formal article pack
- recent trial packs
- weekly handoff candidates

Every generated article candidate must record:

- `indexedTitleCount`
- `searchedKeywords`
- `titleIndexHitCount`
- `excludedDenseTopics`
- `selectionReason`

If `titleIndexHitCount` is above the low-frequency threshold, the candidate must have either `explicitKevinTopicOverride` or `neglectedSubAngleProven`; otherwise the run should stop with a blocker/checkpoint instead of drafting.

## What it should not do

- It should not force obscure topics that lack family-economy relevance.
- It should not draft if Taiwan-current sources are missing.
- It should not use low-frequency status to excuse weak reader value, no financial decision, or no improvement plan.
- It should not override Kevin when he explicitly asks for a known topic.

## Verification

- `node tools\validate-war-room-state.js`
- Readback of global skill, project skill mirror, Agent OS workflow, and automation prompts.

Latest verification result:

- `current trial low-frequency topic selection`: pass, 2 gaps, max hit count 0.
- Overall war-room validator: pass.

## Taiwan tool-fit gate

Verdict: pass.

Reason: the added rule uses Taiwan-facing operational language, keeps the team workflow concrete, avoids imported content-planning jargon as the main instruction, and maps directly to Kevin's actual weekly / biweekly war-room process.

## No-op / rollback

If Kevin later wants a specific common topic, use `explicitKevinTopicOverride` and keep the low-frequency gate as documentation rather than a blocker.
