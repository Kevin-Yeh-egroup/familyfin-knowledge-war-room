# automation-14 / automation-15 Preflight Rules

Date: 2026-06-15
Scope: 好理家在知識庫每週戰情室檢視與雙週文章生成

## Related Files

- repo entry: `C:\Users\Kevin\Documents\Codex\familyfin-knowledge-war-room\README.md`
- automation-14 prompt: `C:\Users\Kevin\.codex\automations\automation-14\automation.toml`
- automation-15 prompt: `C:\Users\Kevin\.codex\automations\automation-15\automation.toml`
- recent blocked example: `C:\Users\Kevin\Documents\Codex\familyfin-knowledge-war-room\reports\2026-06-12-weekly-war-room-review.md`

## Purpose

Prevent weekly review and biweekly article generation from repeating the same blocked discovery when the true issue is login, project context, review/comment path access, or missing upstream proof.

## automation-14 Readiness Card

Before new learning extraction, always record:

- `login_status`
- `project_context_status`
- `review_path_status`
- `comment_path_status`
- `proof_surface_status`
- `decision_basis`

Rules:

- If `EVENT_REVIEW` or `EVENT_COMMENT` is not reachable, stop at blocker-proof/checkpoint.
- `partial signal` must not be upgraded into `complete learning`.
- Shared-profile runtime failure, profile lock, or inaccessible review/comment path must be preserved as the blocker instead of being rewritten into vague access failure wording.

## automation-15 Readiness Card

Before biweekly article generation, always record:

- `upstream_gate_status`
- `login_status`
- `project_context_status`
- `review_comment_status`
- `candidate_pool_status`
- `handoff_status`
- `decision_basis`

Rules:

- If upstream fatal gates from automation-14 remain unresolved, do not rerun the same blocker discovery.
- Reuse the upstream proof artifact and emit an inherited checkpoint card.
- If candidate pool, review/comment proof, or required handoff files are still insufficient, do not generate the 10-article pack.

## Shared Rule

- `blocked`, `no-op`, and inherited stop must preserve the real reason category:
  - `login/session missing`
  - `wrong project context`
  - `target review/comment path unreachable`
  - `proof insufficient`
  - `candidate pool insufficient`
  - `handoff files missing`
