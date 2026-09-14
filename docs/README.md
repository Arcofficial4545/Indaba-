# Documentation

Everything about how Indaba is built, designed and run. One topic per file,
kebab-case names.

## Start here

1. [Architecture overview](architecture/overview.md): how the system fits together today.
2. [Deployment runbook](operations/deployment.md): shipping to production, step by step.
3. [`../AGENTS.md`](../AGENTS.md): the rule for writing Next.js code in this repository.

## Map

```text
docs/
  architecture/
    overview.md            Current system: rendering, data layer, auth, email, SEO
    project-context.md     Full product and codebase briefing, snapshot of 2026-09-03
  design/
    design-system.md       The approved design plan: colour, type, layout, with its arithmetic
    design-notes.md        Running log of what was tried and rejected, and why
    redesign-brief.md      The v2 redesign brief the design system answers
  engineering/
    contributing.md        Branching, checks, conventions, database change rules
  operations/
    deployment.md          Release runbook: env vars, Supabase settings, post-deploy checks
    supabase-setup.md      First-time Supabase project setup
    scripts.md             Every npm script, and which ones touch the database
  handover/
    redesign-v2-handover.md  State of the redesign at handover, and the traps
  archive/
    original-build-prompt.md The original full build specification. Historical only
```

Also outside `docs/`:

| File | Purpose |
| --- | --- |
| [`../README.md`](../README.md) | Project entry point |
| [`../supabase/README.md`](../supabase/README.md) | Migration rules |
| [`../.env.example`](../.env.example) | Every environment variable, documented |

## Keeping docs current

- **Snapshots stay snapshots.** `project-context.md`, the handover and the archive
  describe the project at a point in time. Add a new document rather than
  rewriting their history.
- **Living docs change with the code.** `overview.md`, the operations runbooks and
  `supabase/README.md` are updated in the same pull request as the change they
  describe.
- **Decisions.** Record a significant architecture decision as
  `architecture/decisions/NNNN-short-title.md`: context, decision, consequences.
