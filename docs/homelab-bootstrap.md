# Homelab / Git bootstrap

Tipo **2**: GitHub is the primary (issues, PRs, wiki). Forgejo is a **pull-mirror** (LAN).

| Item | Value |
|------|--------|
| GitHub | `https://github.com/borjalofe/domain-driven-design-tech-challenge` (**public**) |
| Forgejo | `borja/domain-driven-design-tech-challenge` (pull-mirror, interval `8h0m0s`, wiki) |
| Local remotes | `github` (upstream), `forgejo` (mirror) — never `origin` |
| Branch protection (`main`) | Require PR; no force-push (GitHub) |
| Merge rights | Owner only (`borjalofe`) |
| Wiki | Enabled on GitHub |

## Checklist

- [x] GitHub public repo created
- [x] Initial `main` pushed to `github`
- [ ] Forgejo pull-mirror configured (`8h`, wiki on) — **do on LAN**
- [x] Local remote `github` set
- [ ] Local remote `forgejo` (after mirror exists)
- [ ] Branch protection on `main` (PR reviews required count 0; force-push off)
- [ ] Labels + milestones + issue templates (apply via `gh` after first curriculum push)

## Labels

| Label | Role |
|-------|------|
| `status:needs-review` | Awaiting approval |
| `status:approved` | Ready to start |
| `status:in-progress` | Work started |
| `status:blocked` | Cannot proceed (dependency / external gate) |
| `status:done` | Finished |
| `type:epic` | Epic tracker (**no PR**) |
| `type:task` | Atomic task |
| `category:infra` / `docs` / `feature` / `chore` | Category |
| `milestone-slice` | Counts toward milestone deliverable |

## Milestones

| Milestone | Deliverable |
|-----------|-------------|
| **C-M1** | Tipo 2 bootstrap (this doc, protection, labels, templates) |
| **C-M2** | Bootcamp shell (Vite, router, Zustand, theme, instructor, Framer S1) |
| **C-M3** | Telemetry catalog domain + playground `/` + seed CSV |
| **C-M4** | Short track (~45–60 min) + talk-script EN |
| **C-M5** | Full track + homework + smoke |
| **deferred** | Express/SQLite runtime, Framer S2 |

## Issue templates

Under `.github/ISSUE_TEMPLATE/`: `task.yml`, `bug.yml`, `epic.yml`.

## Forgejo pull-mirror (when on LAN)

1. Forgejo → New Migration from `https://github.com/borjalofe/domain-driven-design-tech-challenge.git`
2. Enable periodic pull-mirror, interval `8h0m0s`
3. Include wiki; do **not** treat Forgejo as write primary
4. `git remote add forgejo forgejo:borja/domain-driven-design-tech-challenge.git`
