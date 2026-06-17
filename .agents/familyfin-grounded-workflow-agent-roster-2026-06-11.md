# FamilyFin Grounded Workflow Agent Roster

Status: project mirror of the global Codex skill and Agent OS workflow.

## Purpose

Use the same grounded method across all FamilyFin knowledge-war-room work:

- article writing and revision
- article submission gates
- reviewer learning
- weekly reports
- web-search expansion suggestions
- approval workbenches and UI tools
- dashboards, copy/export flows, and validation scripts
- workflow/automation proposals

## Agent Map

### Core Agents

1. `task_router`
   - Routes work into article, check/gate, tool/workbench, report, automation proposal, or research pack.

2. `source_grounding_reviewer`
   - Confirms current Taiwan sources, rules, policies, statistics, and domain facts.

3. `real_feedback_miner`
   - Mines public feedback and review comments for how people actually talk, doubt, ask, and resist.

4. `taiwan_habit_reviewer`
   - Checks Taiwan local habits, social friction, face, contract pressure, family dynamics, and power imbalance.

5. `resource_benefit_translator`
   - Converts official resources, tool features, or policy facts into practical benefit.

6. `scenario_or_workflow_mapper`
   - For articles: maps daily situation.
   - For tools: maps real user workflow.
   - For checks: maps failure points.

7. `creator`
   - Produces the first artifact: article, report, tool spec, JSON card, UI copy, or checklist.

8. `voice_and_usability_reviewer`
   - For prose: Taiwan natural tone.
   - For tools: readable UI labels, realistic steps, copy/export clarity.

9. `numeric_decision_reviewer`
   - Ensures numbers, decision boundaries, measurable effect, or validation outputs exist.

10. `role_privacy_boundary_reviewer`
   - Prevents private/internal content and role leakage from entering public output.

11. `final_quality_gate`
   - Final green / revise / reject.

## Task-Specific Overlays

### Article Overlay

Add:

- `public_writer`
- `scenario_narrative_reviewer`
- `behavior_realism_reviewer`
- `writing_form_variety_reviewer`
- `role_leak_reviewer`

Required proof:

- body length
- plain text body
- metadata cards
- role leak audit
- validator pass

### Article Generation Grouping Overlay v2

Use this overlay when generating or regenerating article packs. The goal is staged handoff, not more simultaneous agents.

Stage owners:

1. `topic_planning_group`
   - Owns topic fit, knowledge gap, tag fit, title diversity, family economy relevance, writing-form selection, accepted/rejected InfoCenter contrast learning, and `topicEvidenceCard`.

2. `drafting_group`
   - Owns plain-text body, scene narrative, paragraph rhythm, `readerLoadCard`, `articleUsefulnessReview`, `financialDecisionCard`, `financialLiteracyTransfer`, and `improvementPlanCard`.

3. `content_quality_group`
   - Owns non-concept review, article usefulness, resource benefit translation, improvement plan quality, behavior realism, fact/case boundary, and role/privacy boundary.

4. `taiwan_voice_ai_reduction_group`
   - Owns Taiwan natural voice, de-AI rewrite candidates, style variation, awkward phrase removal, and `deAiReview`.

4a. `writing_form_variety_reviewer`
   - Owns `writingFormDiversityReview`.
   - Checks that each article has a distinct narrative form, article move, accepted-submission structure reference, rejected-draft contrast reference, and regenerate instruction when the pack feels templated.
   - Uses only de-identified learning from successful submissions and rejected article/review contrast cards.

4b. `article_usefulness_reviewer`
   - Owns `articleUsefulnessReview`.
   - Checks that each article advances one household financial judgment, prevents one common misreading, uses concrete body evidence, and leaves one next number/date/risk/choice for the reader to check.
   - Sends complete-but-average drafts back to topic planning or drafting instead of polishing wording only.

5. `reader_simulation_group`
   - Owns simulated reading checks for ordinary readers, anxious caregivers, resource-unfamiliar readers, and editor proxy. Simulation is an editorial check, not real user research.

6. `final_packaging_group`
   - Owns final green gate, TXT output, copy target, history record, validation proof, and role leak audit.

Additional required proof:

- `readerLoadCard`
- `articleUsefulnessReview`
- `styleVariationGate`
- `writingFormDiversityReview`
- `deAiReview`
- `readerSimulationReview`
- article-pack level style density
- `node tools/validate-war-room-state.js`
- `node tools/audit-article-role-integrity.js <article-dir>`

Style variation thresholds:

- `不是...而是 / 而在 / 而要 / 只是`: max 3 per article.
- The whole pack must not exceed one contrast-formula use per article on average.
- Articles using the contrast formula must not exceed half of the pack.
- `怎麼做比較穩`, `比較穩的做法`, `比較穩的順序`, `比較穩的是`, and `比較穩，` are blocked.
- Fake Q&A transitions such as `但這個月五號怎麼辦，還是要先處理` are blocked.
- `真正` max 3 per article.

### Tool / Workbench Overlay

Add:

- `workflow_mapper`
- `interaction_designer`
- `public_private_boundary_reviewer`
- `human_simulation_verifier`

Required proof:

- real entry point
- user action path
- data source boundary
- copy/export/review states
- local HTTP/browser verification when feasible

### Check / Gate Overlay

Add:

- `failure_mode_miner`
- `false_positive_reviewer`
- `revision_instruction_writer`

Required proof:

- what failure is caught
- what evidence triggers it
- how to revise
- validator or sample run output

### Report / Weekly Review Overlay

Add:

- `history_summarizer`
- `proof_curator`
- `next_action_reviewer`

Required proof:

- linked source files
- what changed
- what remains uncertain
- next action

## Handoff

Do not put every instruction into one prompt.

Use this order:

route -> facts -> real feedback -> Taiwan habit -> resource benefit -> scenario/workflow -> create -> voice/usability -> numeric/decision -> privacy/role -> final gate

## Governance

- Local source of truth: `.agents/skills/familyfin-grounded-workflow/SKILL.md`.
- Global skill: `C:\Users\Kevin\.codex\skills\familyfin-grounded-workflow\SKILL.md`.
- Global Agent OS workflow: `C:\Users\Kevin\Documents\Codex\agent-os-home\codex-os\workflows\familyfin-grounded-staged-workflow.md`.
- Never auto-submit, auto-approve, expose private review text, scrape identities, or deploy public changes without explicit approval.

## Expansion Review Card

- What changed: replaced article-only skill draft with project-wide grounded workflow skill and agent roster.
- Why needed: Kevin clarified the method must apply to checks, tool generation, article writing, reports, and future agents.
- Owner: `final_quality_gate`.
- Trigger: any FamilyFin knowledge-war-room artifact or workflow that affects user-facing output or reviewer decisions.
- Should not do: autonomous submission/deploy/approval/private data exposure.
- Proof: validator pass, role leak audit when article-related, and task-specific report/log.
- Durable source of truth: `.agents/skills/familyfin-grounded-workflow/SKILL.md` and this roster.
- Next review: after additional real article/tool/check uses reveal friction or reviewer feedback changes.
