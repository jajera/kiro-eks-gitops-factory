# Implementation Plan: docs-site-scaffold

## Overview

Greenfield Astro 7 + Starlight 0.41 documentation site in the Docs_Repo, built on top of the two
files already present (`README.md` stub, `LICENSE`). Work proceeds bottom-up: toolchain config,
then Astro/Starlight config with a first green build, then the `<Still />` component, then media
vendoring, then the eight content pages, then `scripts/check-content.mjs` (which encodes
Properties 1-12 and 14), then the three workflow callers and the README, then final verification.

**Primary content path (design):** adapt narrative and vendor Stills from the local Source_Factory
Walkthrough_Source at `/home/johna/workspace/jajera/kiro-eks-argocd-migration/docs/` (currently
untracked on that repo, but present on disk). Degraded mode (pending Still notes / verbatim
placeholders) is only for when that local tree is missing — not the expected path for this
implementation.

Two ordering notes that differ from a naive reading:

- **Vendoring (task 5) runs before content authoring (task 6).** Which of the 19 Stills exist on
  disk decides whether a page uses a `<Still />` call or a `:::note[Still pending]` block. Writing
  pages first would mean writing them twice.
- **`scripts/check-content.mjs` is written after content exists** so each property check is
  validated against a real corpus rather than an empty directory.

Every file written here is named in the design's Repository File Tree section. Nothing outside
that inventory is created — in particular no `scripts/generate-architecture-diagram.mjs`, no
`src/data/`, no `.vscode/`, no `apps/`, `bootstrap/`, `clusters/`, `policies/`, `infrastructure/`,
no slideshow page (Decision D8 / OQ4), and no fourth workflow (Decisions D6, D7; Requirements
10.1, 10.3).

### Scope expansion and narrative revision (tasks 14-22)

Tasks 1-13 are complete and the first release shipped: 8 pages, `astro.config.mjs`,
`src/components/Still.astro`, `scripts/check-content.mjs` carrying Properties 1-12 and 14, 19
vendored Stills, 3 workflow callers, expanded README, green `npm run build`. Task 14 is also
complete: the `.kiro/settings` Property 11 allow-list entry, the matching `.gitignore` line,
`embeddedLanguageFormatting: "off"` in `.prettierrc`, and the `verify:artifacts` script stub in
`package.json` are all on disk, and `prettier --check .` is green. Completed tasks are not
renumbered or reopened.

Tasks 15-22 implement Requirements 11-18 **and** the narrative revision — Requirements 19 and 20,
plus revised 2.6, 2.10-2.13, 12.1, 12.3-12.6, 12.9, and new 12.12-12.15. Where a task rewrites a
completed task's output (for example `lab-b.mdx` from task 6.5, or `index.mdx` from task 6.1) the
new task states it as a rewrite.

**What changed since these tasks were first drafted.** The eight shipped pages were reviewed
against the Product_Thesis and rejected — not for lack of depth, but because the site read as a
recap of mechanisms and a table of contents rather than as one argument. Four defects were named:
mechanism before problem; Glossary identifiers rendered literally in Reader prose
(`Source_Factory` eleven times across eight pages); a six-card landing grid implying six
independent modules; and structural page titles that assert nothing. The uncomfortable part is
that the first scope expansion contributed to the last two: a mandated `## Tradeoff` section,
a mandated `## Gotcha` section, a mandated ordered list, and a per-`##`-section table/Still
pairing rule is a uniform module template stamped six times. Requirements 12.1 and 12.3-12.6 were
relaxed to keep the substance and drop the form, so the following instructions from the earlier
draft of tasks 15-22 are **retired**:

- the eight-section `lab-b.mdx` restructure (now five sections, Decision D19);
- every mandated `## Tradeoff` heading (Requirement 12.13 retires the exact-heading check;
  Requirement 12.4 permits running prose with no heading and no labelled fields and is
  review-gated);
- every uniformly mandated `## Gotcha` heading (Requirement 12.5 now accepts an anchored `gotchas`
  link **or** a heading from a five-word vocabulary, assigned deliberately unevenly so
  Requirement 12.15 and Property 31 pass);
- the ordered-list mandate on `lab-b`, `lab-d-reference`, `autonomy-modes`, and `gotchas`
  (Requirement 12.3 now binds `lab-a` and `lab-c` only), and the per-section table/Still pairing
  language everywhere (Requirement 12.6 is evaluated per page);
- the old Property 17 sequencing note ("fails four of six sections of `lab-b`"), superseded by
  design risk R8.

What tasks 15-22 now deliver: three new pages (`lab-d-reference`, `autonomy-modes`, `gotchas`);
ten new Sidebar labels and eleven frontmatter titles that state claims rather than topics
(Decision D23); a rewritten landing page with a fixed twelve-block source order and no card grid
(Decision D17); the `Before this:` / `Next:` spine thread across all eleven pages (Decision D18);
one spine claim per page plus the formula on six pages; the purge of 27 Glossary identifiers from
Reader prose and from `README.md`; 16 Embedded_Artifacts quoted character-for-character;
seventeen checker properties (15-20, 22-31 emitted; 21 opt-in) plus revisions to Properties 1, 2,
6, 7, 8, 10, 11, and the restatement of Property 12; and `scripts/verify-artifacts.mjs` as the
opt-in maintainer fidelity mode (Decision D11).

**Ordering is content-first, and it has to be (design risk R8).** The shipped
`scripts/check-content.mjs` asserts `/^## Tradeoff\s*$/m` on `lab-a`, `lab-b`, and `lab-c` and
fails without it — and every one of those pages loses that heading. In the other direction the
shipped content fails the revised checker on Property 24 (mechanism before numbers on `index`),
Property 25 (the six-card grid), Properties 26 and 27 (no spine thread anywhere), Property 28
(formula clauses), and Property 29 (eleven `Source_Factory` occurrences plus a README sentence).
`main` is red in both directions until one change carries the checker edit, the eleven-page
rewrite, the sidebar labels, and the README wording. So: baseline cleanup (14, done), new pages
and the sidebar (15), page rewrites (16), a checkpoint that expects exactly the three known
Property 12 violations and nothing else (17), then the checker (18, 19, 20), then verification
(21) and the final checkpoint (22). **No checkpoint sits between a checker change and the content
that satisfies it**, and task 17 states the one red check it tolerates rather than pretending the
tree is green.

Three sequencing hazards inside that shape, each handled by keeping one change atomic rather than
by ordering around it:

- **Task 15.2 carries a checker edit.** The shipped Property 10 asserts that no sidebar entry is
  labelled Lab D, and Requirement 2.6 now mandates the label `Lab D (out of scope)` — pinned as an
  exact string by Requirement 2.11 precisely because Property 10 scans labels. The page, the
  sidebar entry, and the Property 10 revision land together.
- **Task 18.6 deletes a check rather than weakening one.** The `/^## Tradeoff\s*$/m` presence
  assertion is removed outright, and **no property asserts that a tradeoff exists any more**
  (design OQ10). That is stated in the task so nobody re-adds it believing it was an oversight.
- **Task 20.7's Property 30 must exclude `<pre>` and `<code>` text nodes.** Read literally,
  Requirement 20.8 would report every identifier Requirement 20.6 exempts and make Requirement
  3.7's character-for-character quoting unsatisfiable.

## Tasks

- [x] 1. Base scaffold and toolchain configuration
  - Implements design section "Components and Interfaces / `package.json`" and
    "Components and Interfaces / Validator configuration"

  - [x] 1.1 Create `package.json`
    - Copy the JSON block from the design's `package.json` section byte-for-byte: `name`
      `kiro-eks-gitops-factory`, `"type": "module"`, `version` `0.0.1`, `private` true
    - Scripts exactly as specified: `dev`, `build`, `preview`, `validate`, `test`, `format`,
      `lint`, `check:content`
    - `validate` MUST be the literal string
      `prettier --check . && markdownlint-cli2 "src/**/*.mdx"` with nothing appended
      (Requirement 1.5 pins this; Decision D6 forbids chaining `check:content` into it)
    - `test` MUST be `npm run build` (Requirement 1.6)
    - Dependencies: `@astrojs/starlight` `^0.41.6`, `astro` `^7.1.6`, `starlight-base-path`
      `^0.2.1`, `starlight-theme-vintage` `^0.1.0`
    - devDependencies: `markdownlint-cli2` `^0.22.1`, `prettier` `^3.5.0`, `sharp` `^0.34.0`,
      `typescript` `^5.8.0`
    - `overrides`: `esbuild` `^0.28.1`, `js-yaml` `^4.2.0`, `markdown-it` `^14.2.0`
      (Decision D7 — carried from the Reference_Site for DX parity)
    - Verify: `node -e "const p=require('./package.json'); if(p.scripts.validate!=='prettier --check . && markdownlint-cli2 \"src/**/*.mdx\"') process.exit(1)"`
      exits 0
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6_

  - [x] 1.2 Create `tsconfig.json`, `.nvmrc`, `.gitignore`
    - `tsconfig.json`: `{ "extends": "astro/tsconfigs/strict" }` and nothing else
    - `.nvmrc`: the single line `22` — deliberately not the Reference_Site's `20`
      (Decision D4; must match `node-version: "22"` in `deploy.yml`)
    - `.gitignore`: `node_modules/`, `dist/`, `.astro/`
    - Verify: `cat .nvmrc` prints `22`; `git check-ignore -q dist` succeeds after the file exists
    - _Requirements: 1.7, 1.8, 1.9_

  - [x] 1.3 Create Validator configuration files
    - `.prettierrc`: `{ "semi": true, "singleQuote": false, "tabWidth": 2, "trailingComma": "all" }`
    - `.prettierignore`: `dist`, `node_modules`, `pnpm-lock.yaml` (one per line)
    - `.markdownlint.json` verbatim: `{ "default": true, "MD013": false, "MD033": false, "MD041": false }`
      — MD033 off is required for `<Still />`, MD041 off is required because Starlight MDX opens
      with frontmatter
    - LICENSE already present (MIT, John Ajera 2026) and needs no change
    - _Requirements: 4.1, 4.2, 4.3, 1.10_

  - [x] 1.4 Install dependencies and commit the lockfile
    - Run `npm install`; commit the generated `package-lock.json` so CI builds are reproducible
      (Risk R1) — only when the user asks for a commit; otherwise leave the lockfile ready
    - Verify: `npm install` exits 0 and `package-lock.json` exists
    - _Requirements: 1.11_

- [x] 2. Astro and Starlight configuration with a first green build
  - Implements design sections "Components and Interfaces / `astro.config.mjs`" and
    "Data Models / Content collection configuration"

  - [x] 2.1 Create `astro.config.mjs`
    - Reproduce the design's config block exactly, including the two module-scope consts
      `title` and `description` so the `head` meta cannot drift from them
    - `title` = `EKS GitOps Factory`; `description` = the 94-char ASCII thesis line from the
      design (<= 120 chars, carries `skills generate -> hooks enforce -> humans approve`)
    - `site` = `https://jajera.github.io`; `base` = `/kiro-eks-gitops-factory/` (both slashes)
    - `favicon: "/favicon.svg"`; `head` with `og:title` and `og:description` only
      (Decision D9 — no og:image, no twitter card, because the asset does not exist)
    - `plugins: [starlightThemeVintage(), starlightBasePath()]` in that order
    - `social`: one `github` entry, label `Source Repository`, href
      `https://github.com/jajera/kiro-eks-gitops-factory` — the **Docs_Repo**, intentional per
      Requirement 2.4 and the design's note on the social link; do not "fix" it to the
      Source_Factory
    - `editLink.baseUrl` = `https://github.com/jajera/kiro-eks-gitops-factory/edit/main/`
    - `sidebar`: explicit array, no autogenerate — Home `/`, then slugs `why`, `setup`, `lab-a`,
      `lab-b`, `lab-c`, `vibe-vs-spec`, `done` with the design's labels, in that exact order
    - Also export (or co-locate) the Source_Factory URL constant
      `https://github.com/jajera/kiro-eks-argocd-migration` for content authors and Property 9
      (Decision D10) — one exact spelling everywhere; do not invent alternate URL forms
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 10.6_

  - [x] 2.2 Create `src/content.config.ts` and `src/env.d.ts`
    - `src/content.config.ts` exactly as the design's Data Models block: `defineCollection` from
      `astro:content`, `docsLoader()` from `@astrojs/starlight/loaders`, `docsSchema()` from
      `@astrojs/starlight/schema`, exported as `collections.docs`
    - This file is **mandatory, not optional**: without it the `docs` collection does not exist
      and `astro build` fails, breaking Requirements 1.11, 2.7, and 3.6. It must live at
      `src/content.config.ts` — Astro rejects the legacy `src/content/config.ts` path
    - `src/env.d.ts` for Astro type ambience
    - _Requirements: 3.6, 1.11, 2.7_

  - [x] 2.3 Add `public/favicon.svg`
    - Simple original SVG mark; Starlight resolves `/favicon.svg` against `base` itself
    - _Requirements: 2.2_

  - [x] 2.4 Create stub content pages and get the first green build
    - Create `src/content/docs/index.mdx` with non-empty `title`, `description`, and
      `template: splash`
    - Also create frontmatter-only stubs for the seven sidebar slugs (`why`, `setup`, `lab-a`,
      `lab-b`, `lab-c`, `vibe-vs-spec`, `done`) so Starlight does not fail on unresolved sidebar
      entries — full prose arrives in task 6
    - Run `npm run build` and confirm exit code 0 with `dist/` produced and no error diagnostics
    - Verify: `npm run build` exits 0; `dist/index.html` contains `EKS GitOps Factory`
    - _Requirements: 1.11, 2.7, 3.1, 3.2, 3.6_

- [x] 3. Checkpoint - scaffold builds
  - Ensure all tests pass, ask the user if questions arise.
  - `npm run validate` and `npm run build` both exit 0 before content work begins

- [x] 4. Base-path-safe Still component
  - Implements design sections "Components and Interfaces / `Still.astro`",
    "Media Pipeline / Base-path correctness", Decision D5

  - [x] 4.1 Create `src/components/Still.astro`
    - Props interface: `src` (path under `public/`, e.g. `media/walkthrough/09-gator-verify.png`),
      `alt`, `caption` — all three required, so accessibility is not optional
    - Compute `href` as `` `${import.meta.env.BASE_URL}${src}` `` then
      `.replace(/\/{2,}/g, "/")` (the guard that also covers a double-prefix from
      `starlight-base-path`, Open Question OQ5)
    - Render `<figure><img src={href} alt={alt} loading="lazy" /><figcaption>{caption}</figcaption></figure>`
    - Rationale to preserve: Astro copies `public/` verbatim and does **not** base-path rewrite
      Markdown image paths, so raw `![...](...)` 404s in production with no build error. This
      component makes Requirement 7.3 true by construction and gives the caption checks a single
      parseable anchor
    - _Requirements: 7.3, 7.4_

- [x] 5. Vendor Stills from Walkthrough_Source (primary path)
  - Implements design sections "Media Pipeline / Vendoring procedure",
    "Primary mode: adapt and vendor from local Walkthrough_Source", and
    "Degraded mode: local Walkthrough_Source also missing"

  - [x] 5.1 Vendor the 19 named Stills into `public/media/walkthrough/`
    - **Expected source:** local Source_Factory clone
      `/home/johna/workspace/jajera/kiro-eks-argocd-migration/docs/media/walkthrough/`
      (untracked upstream, but present locally). Confirm with
      `test -d /home/johna/workspace/jajera/kiro-eks-argocd-migration/docs/media/walkthrough`
      before copying. **Do not fetch from the network.** If the local tree is absent, fall through
      to the degraded path below and record count `0`
    - Copy every `*.png` with filenames preserved exactly, including the `10b-` variant and both
      `10-` prefixes, so a future re-vendor is a plain directory copy (Requirement 7.1)
    - Target inventory (Requirement 7.2): `01-repo-tree.png`, `07-block-infra-denied.png`,
      `08-pdb-rule.png`, `09-gator-verify.png`, `10-add-app-session.png`, `10-vibe-mode.png`,
      `10b-add-app-scaffolding.png`, `11-kustomize-build.png`, `12-add-app-done.png`,
      `13-pr-checks.png`, `14-kiro-explorer-tree.png`, `15-steering-profile.png`,
      `16-steering-archetypes.png`, `17-skill-add-app.png`, `18-skill-migrate.png`,
      `19-hooks-grid.png`, `20-agent-config.png`, `21-mcp-servers.png`, `22-specs-timeline.png`
    - Do not resize, crop, recompress, or composite. Do not copy `slideshow.html`, `*.mjs`,
      `node_modules/`, or the untracked `apps/demo-nginx/` tree (Requirements 7.6, 10.3; Risk R4;
      Decision D8)
    - Record provenance for the eventual commit message: local source path + date (and Source_Factory
      commit SHA only if `docs/` is actually committed there — do not invent a SHA)
    - **Degraded path (only if local tree missing):** any Still not vendored is not referenced with
      `<Still />` at all. Task 6 uses the `:::note[Still pending]` form instead, which keeps
      Property 3 true unconditionally
    - Record the actual vendored count (`N of 19`) as the input to task 6; primary path should be
      `19 of 19`
    - Verify: `ls public/media/walkthrough/*.png | wc -l` matches the recorded count; no non-PNG
      files present under that directory
    - _Requirements: 7.1, 7.2, 7.6_

- [x] 6. Author the eight content pages from Walkthrough_Source
  - Implements design sections "Content Mapping", "Per-page content contracts",
    "Placeholder-account rule", Decision D1 (flat `.mdx`, no subdirectories)
  - Rules that apply to every page in this task:
    - Prefer adapting local `docs/Walkthrough.md` over rewriting from scratch; keep factory facts
      (Requirement 3.3). Cross-check hooks/skills/paths against public Source_Factory trees
    - Flat file at `src/content/docs/<slug>.mdx`; `.mdx` not `.md` (the markdownlint glob in
      Requirement 1.4 only covers `src/**/*.mdx`)
    - Frontmatter carries non-empty `title` and `description` (<= 160 chars); no other keys
      except `template: splash` on `index.mdx`. No `sidebar.order` — ordering lives only in
      `astro.config.mjs`
    - Images go through `<Still />` only. Raw Markdown `![...](...)` is prohibited (Property 4)
    - Every caption: one sentence, <= 120 characters (Property 5)
    - Lab pages: at most two sentences of prose between consecutive Stills (Property 6)
    - Reader-run commands are copyable fenced blocks meant to run in the Source_Factory working
      tree, and any page carrying such a command links the Decision D10 Source_Factory URL
      `https://github.com/jajera/kiro-eks-argocd-migration` (Requirements 9.10, 10.6; Property 9)
    - First occurrence of `111122223333`, `444455556666`, or `ap-southeast-2` on a page is
      immediately followed by a `:::caution` callout telling the Reader to replace them before
      live IAM/ECR; later occurrences on the same page do not repeat it. Map `111122223333` ->
      dev (`dev-eks-1`), `444455556666` -> prod (`prod-eks-1`) (Requirement 9.8, Property 8)
    - **Verbatim material is never invented or paraphrased.** Primary path: quote from local
      Walkthrough_Source. Only if that file is unavailable, defer behind
      `:::note[Verbatim source pending]` naming `docs/Walkthrough.md` in the Source_Factory
      (Requirement 3.3, degraded-mode contract)

  - [x] 6.1 Write `src/content/docs/index.mdx` (landing)
    - `template: splash`. Full Product_Thesis: manual GitOps onboarding does not scale at roughly
      100 apps; the factory plus Kiro removes re-deciding tree shape and silent drift; it does
      **not** remove workload understanding, IAM shrink, DNS/TLS, or cutover risk; formula
      `skills generate -> hooks enforce -> humans approve`
    - Explicit statement that Readers clone and run in the Source_Factory, with the D10 link
    - No Stills on this page
    - _Requirements: 3.1, 3.4, 10.6_

  - [x] 6.2 Write `src/content/docs/why.mdx`
    - Adapt the ~100-app scale table from local Walkthrough_Source (verbatim values):

      | Path                    | Per app    | For 100 apps          |
      | ----------------------- | ---------- | --------------------- |
      | Manual (experienced)    | ~3-6 h     | ~450 h                |
      | Manual (mixed)          | ~1-2 days  | ~150 person-days      |
      | Factory + Kiro + review | ~45-90 min | ~75-150 h after setup |

      If Walkthrough_Source is unavailable, use `:::note[Verbatim source pending]` instead of
      inventing numbers

    - Human gate: accelerate drafting, do not merge or promote to prod without review
    - Two-column "removes / does not remove" table. Link `.kiro/steering/` and `.kiro/hooks/`
      paths in the Source_Factory
    - This page carries the honest limits; it must not read as a sales page
    - _Requirements: 9.1_

  - [x] 6.3 Write `src/content/docs/setup.mdx`
    - Clone the Source_Factory; install gator via `./scripts/install-gator.sh` (default pin
      `GATOR_VERSION=3.22.0`); expect gator CLI **3.22.0**
    - State explicitly that this differs from the Gatekeeper Helm chart `version`/`appVersion`
      **3.21.1** in
      `infrastructure/gatekeeper/base/vendored/chart/gatekeeper/Chart.yaml` (Risk R3 — leaving
      the skew implicit produces confusing `gator verify` failures)
    - Prerequisites: `kustomize`, Node/npx, Kiro for Lab C
    - Document (do not ask Readers to run) the regeneration scripts
      `docs/media/walkthrough/capture.mjs` and `capture-kiro-configs.mjs` (Requirement 7.5)
    - Placeholder-account caution callout per the shared rule
    - _Requirements: 9.2, 7.5, 9.8, 9.10, 10.6_

  - [x] 6.4 Write `src/content/docs/lab-a.mdx`
    - Commands in copyable blocks, run in the Source_Factory tree:
      `gator verify infrastructure/gatekeeper/tests/...`,
      `kustomize build policies/overlays/dev-eks-1 >/dev/null`,
      `kustomize build policies/overlays/prod-eks-1 >/dev/null`
    - Expected output: all suites `ok`, final `PASS`
    - Still `09-gator-verify.png` via `<Still />`, or the pending note if not vendored
    - `## Tradeoff` section: offline admission testing with gator versus waiting for a live
      cluster webhook — state the choice, the alternative, and the reason
    - _Requirements: 9.3, 9.10, 9.11, 10.6_

  - [x] 6.5 Write `src/content/docs/lab-b.mdx`
    - The `.kiro/` config map as rendered Stills, never a faked live Kiro UI: `01-repo-tree.png`,
      `14-kiro-explorer-tree.png`, `15-steering-profile.png`, `16-steering-archetypes.png`,
      `17-skill-add-app.png`, `18-skill-migrate.png`, `19-hooks-grid.png`, `08-pdb-rule.png`,
      `20-agent-config.png`, `21-mcp-servers.png`, `22-specs-timeline.png`
    - Cover: steering `always` versus `fileMatch`; project-profile; archetypes; skills `add-app`
      and `migrate-workload`; hooks grid plus the PDB scar (`minAvailable: 1` only when
      `replicas >= 2`); agent `eks-migration`; MCP with docs servers on and live cluster adapters
      off until credentials exist; specs as build history
    - Layer diagram prompt -> agent -> skill -> hooks -> PR -> human -> Argo as a **Mermaid
      block**, not a screenshot
    - `## Tradeoff` section: steering `always` versus `fileMatch` scoping
    - Watch the two-sentences-between-Stills cap closely; this is the most Still-dense page
    - _Requirements: 9.4, 7.6, 9.9, 9.11_

  - [x] 6.6 Write `src/content/docs/lab-c.mdx`
    - Quote this exact thin `demo-nginx` prompt inside a fenced `text` block (from local
      Walkthrough_Source — never paraphrase). If the source file is missing, use
      `:::note[Verbatim source pending]` naming `docs/Walkthrough.md` instead:

      ```text
      Add a web-service app named demo-nginx.
      Image: public.ecr.aws/nginx/nginx:1.27 (retag into our ECR as demo-nginx).
      No Secrets Manager. Egress: DNS + HTTPS as required for probes.
      Ingress: yes, hostname demo-nginx.dev.example.com on alb.
      Replicas: 2 in both overlays (so PDB minAvailable: 1 is valid).
      ```

    - Stills in Walkthrough_Source order: `10-add-app-session.png`,
      `10b-add-app-scaffolding.png`, `07-block-infra-denied.png`, `11-kustomize-build.png`,
      `12-add-app-done.png`, `13-pr-checks.png`
    - `07-block-infra-denied.png` documents the Git-only hook **allowing** `kustomize`, despite
      the filename. Hedge the ACCESS DENIED claim: `kubectl apply` deny was not in the Lab C
      recording; link `.kiro/hooks/block-infra-commands.kiro.hook` instead of asserting it
      (Requirement 3.3; Risk R2)
    - Takeaway: a vibe prompt still yields a factory result because steering / skill / hooks /
      agent did the heavy lifting
    - Do **not** check in any `apps/demo-nginx` manifests; Lab C teaches generation in the
      Source_Factory (Requirement 10.3; Risk R4)
    - `## Tradeoff` section: thin prompt plus hard guardrails versus a long prescriptive prompt
    - _Requirements: 9.5, 9.11, 10.3, 10.4, 10.6_

  - [x] 6.7 Write `src/content/docs/vibe-vs-spec.mdx`
    - Still `10-vibe-mode.png` (or pending note) plus the Walkthrough_Source comparison table
      (input, feedback loop, when to use which)
    - Lab C is the vibe case; spec-driven fits multi-phase platform work: operator install,
      policy bundle, CI, bootstrap
    - _Requirements: 9.6_

  - [x] 6.8 Write `src/content/docs/done.mdx`
    - Evidence checklist for Labs A-C **only**: Lab A gator `PASS`; Lab B config-map Stills
      understood; Lab C dual overlays plus PR checks
    - Explicit statement that Live Lab D (Argo CD Healthy, ALB ADDRESS, curl 200, prod promote)
      is out of scope, so the checklist does not read as incomplete. Any "Lab D" mention must sit
      in a sentence saying it is out of scope (Property 10)
    - Link `.github/workflows/kustomize-build.yml` and `policy-validate.yml` in the
      Source_Factory. No Stills on this page
    - _Requirements: 9.7, 10.2_

- [x] 7. Checkpoint - content builds and lints
  - Ensure all tests pass, ask the user if questions arise.
  - `npm run build` exits 0 with all eight slugs resolving; `npm run validate` exits 0

- [x] 8. Content checker core and media invariants
  - Implements design section "`scripts/check-content.mjs` contract" and Decision D6
  - Zero-dependency Node ESM, read-only, **no network access**

  - [x] 8.1 Create `scripts/check-content.mjs` skeleton and reporting contract
    - Inputs: `astro.config.mjs` as text; `package.json` and the three workflow files as data;
      every `.mdx` under `src/content/docs/`; the `public/` tree listing; `dist/**/*.html` when
      present
    - Emit one line per violation, exactly `PROPERTY <n> <file>:<line> <message>`
    - Exit 1 if any violation, 0 otherwise
    - Print Still inventory coverage as `vendored N of 19 named Stills` — **information, never a
      failure**, because Requirement 7.2 is conditional ("when present") rather than an absolute
      pre-scaffold mandate
    - Print a skip notice for `dist/`-dependent checks when `dist/` is absent
    - No dependency added to `package.json`; no property-based testing library (Decision D6 —
      randomised sampling over an eight-page corpus is strictly worse than enumerating it)
    - Verify: `npm run check:content` runs and exits 0 or 1 with no stack trace
    - _Requirements: 7.4, 7.7, 9.9_

  - [x] 8.2 Implement the Still-resolution check
    - **Property 3: Every referenced Still resolves to a vendored file**
    - Extract every `src` prop from every `<Still />` usage under `src/content/docs/`, assert
      `public/<src>` exists on disk
    - This is the only automated detector for Requirement 7.7 — `astro build` does not fail on a
      dangling `public/` reference — so it is required, not optional
    - **Validates: Requirements 7.1, 7.7**

  - [x] 8.3 Implement the caption cap check
    - **Property 5: Every Still caption fits the editorial cap**
    - Assert each `caption` prop is <= 120 characters and is exactly one sentence: a single
      terminal `.`, `!`, or `?` at the end of the string
    - **Validates: Requirements 7.4, 9.9**

  - [x] 8.4 Implement the base-path image check
    - **Property 4: Every image reference is base-path prefixed**
    - Two conjuncts, one failure mode: scan `dist/**/*.html` and assert every local
      `<img src="/...">` begins with `/kiro-eks-gitops-factory/`; grep every content page and
      assert no raw `![...](...)` appears
    - Skip the `dist/` half with a printed notice when `dist/` is absent
    - **Validates: Requirements 7.3**

  - [x] 8.5 Implement the frontmatter check
    - **Property 2: Every content page has usable frontmatter**
    - Parse YAML frontmatter for every `.mdx` under `src/content/docs/`; assert `title` and
      `description` are both strings and both non-empty after trimming. `docsSchema()` already
      fails the build on a missing `title`; the non-empty and `description`-required halves are
      the checker's job
    - **Validates: Requirements 3.1**

  - [x] 8.6 Implement the pending-Still form check
    - **Property 7: Pending Stills are labelled, never faked**
    - For every `:::note[Still pending]` block, assert the body names a `*.png` filename and a
      `docs/media/walkthrough/` path. This is what makes Property 3 safe to state
      unconditionally
    - **Validates: Requirements 7.6**

- [x] 9. Content checker corpus and scope invariants
  - Same file, `scripts/check-content.mjs`; each check is additive and independently runnable

  - [x] 9.1 Implement the sidebar/page correspondence check
    - **Property 1: Sidebar and content pages are in exact correspondence**
    - Build the slug set from the `sidebar` array in `astro.config.mjs` and the slug set from
      files under `src/content/docs/` (excluding `index.mdx`); assert set equality — no dangling
      navigation entry, no orphan page
    - **Validates: Requirements 2.6, 3.2**

  - [x] 9.2 Implement the prose-between-Stills check
    - **Property 6: Lab pages stay visual-first**
    - For `lab-a`, `lab-b`, `lab-c`: split on `<Still` boundaries, strip fenced code blocks and
      admonitions from the intervening text, count sentence terminators, assert `<= 2`
    - **Validates: Requirements 9.9**

  - [x] 9.3 Implement the placeholder-callout check
    - **Property 8: Placeholder identifiers always carry a replacement warning**
    - For every page mentioning `111122223333`, `444455556666`, or `ap-southeast-2`, assert a
      `:::caution` block exists whose body mentions replacement
    - **Validates: Requirements 9.8**

  - [x] 9.4 Implement the Source_Factory link check
    - **Property 9: Factory operations always point at the Source_Factory**
    - Select pages containing a factory command token (`git clone`, `install-gator.sh`,
      `gator verify`, `kustomize build`, a Kiro `add-app` invocation) and assert each contains
      `https://github.com/jajera/kiro-eks-argocd-migration` (the single centralised spelling from
      Decision D10 / task 2.1)
    - **Validates: Requirements 10.6**

  - [x] 9.5 Implement the Lab D scope check
    - **Property 10: No page presents Live Lab D as in scope**
    - Assert no sidebar entry is labelled Lab D, and that any "Lab D" occurrence in prose sits in
      a sentence containing "out of scope" or "not in scope"
    - **Validates: Requirements 9.7, 10.2**

  - [x] 9.6 Implement the forbidden-path check
    - **Property 11: No Source_Factory implementation tree is present**
    - Assert non-existence at the repo root of `apps/`, `bootstrap/`, `clusters/`, `policies/`,
      `infrastructure/`, and any runnable factory config under `.kiro/` other than
      `.kiro/specs/`. This is the scope-creep guard, including the `apps/demo-nginx` case
    - **Validates: Requirements 10.1, 10.3**

  - [x] 9.7 Implement the tradeoff-section check
    - **Property 12: Every lab page carries a tradeoff explanation**
    - Assert a `## Tradeoff` heading exists on `lab-a`, `lab-b`, `lab-c`. Structural presence
      only — whether the reason is a good reason is review-gated, not computed
    - **Validates: Requirements 9.11**

  - [x] 9.8 Implement the PR workflow permissions check
    - **Property 14: Every PR workflow declares the required permissions**
    - Parse each file under `.github/workflows/`, filter to those with a `pull_request` trigger,
      and deep-equal the permissions map against exactly `statuses: write`, `checks: write`,
      `contents: read`, `pull-requests: read`. Stated over the set so a future fourth caller
      cannot ship under-permissioned
    - Parse without adding a YAML dependency (the two files are fixed-shape; a targeted text
      parse is acceptable given the zero-dependency contract)
    - **Validates: Requirements 6.5**

- [x] 10. GitHub Actions workflow callers
  - Implements design section "Components and Interfaces / Workflow callers" and Decision D3
  - Three individual caller files. Never a `markdown-pr-checks` or `astro-docs-pr-checks` bundle,
    and never a fourth workflow. Copy each YAML body verbatim from the design, including the
    `permissions` and `concurrency` blocks. No `continue-on-error` anywhere — failure propagation
    is inherited, which is what makes each one usable as a required status check

  - [x] 10.1 Create `.github/workflows/deploy.yml`
    - `on: push` to `main` plus `workflow_dispatch`; `concurrency: { group: pages,
      cancel-in-progress: false }`; permissions `contents: read`, `pages: write`,
      `id-token: write`
    - Single job `pages` calling
      `actionsforge/actions/.github/workflows/astro-pages-deploy.yml@main` with
      `node-version: "22"`, `validate-command: npm run validate`, `test-command: npm run test`
    - `node-version` must equal `.nvmrc` (Decision D4)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 10.2 Create `.github/workflows/markdown-lint.yml`
    - `on: pull_request: {}`; permissions `statuses: write`, `checks: write`, `contents: read`,
      `pull-requests: read`; job `markdown-lint` calling
      `actionsforge/actions/.github/workflows/markdown-lint.yml@main`
    - _Requirements: 6.1, 6.2, 6.5, 6.6_

  - [x] 10.3 Create `.github/workflows/commitmsg-conform.yml`
    - `on: pull_request: {}`; the same four permissions; job `commitmsg-conform` calling
      `actionsforge/actions/.github/workflows/commitmsg-conform.yml@main`
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

- [x] 11. README expansion
  - Implements design section "README Contract"

  - [x] 11.1 Expand `README.md` from the existing two-line stub
    - Level-1 heading exactly `kiro-eks-gitops-factory`, then a single plain-ASCII paragraph
      matching the GitHub description intent: a repeatable EKS and Argo CD app factory with thin
      Kiro prompts, hard guardrails, and no chat-side cluster apply
    - Links to `https://jajera.github.io/kiro-eks-gitops-factory/` and
      `https://github.com/jajera/kiro-eks-argocd-migration`
    - "What this is / What this is not" table with at least the design's three rows: Starlight
      walkthrough vs implementation; explains why/how/labs/screenshots vs where you clone and run
      gator/kustomize/Kiro `add-app`; may vendor or link stills vs owns manifests, hooks, skills,
      policy
    - An explicit note that Readers run factory commands in the Source_Factory and this site only
      documents — preferred wording: "Run all factory commands from the Source_Factory, not from
      this documentation repo."
    - Local development section with fenced `npm install`, `npm run dev`, `npm run validate`,
      `npm run build`. `npm run check:content` may be mentioned as an optional authoring aid
    - Ensure blanks around headings so markdownlint (PR workflow) stays clean
    - Verify: `npm run validate` exits 0 (prettier formats the README too)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 12. Final verification
  - Implements design section "Testing Strategy / Layers"

  - [x] 12.1 Run the full local gate and fix anything it reports
    - `npm run validate` exits 0 with no error output (Requirement 4.6)
    - `npm run build` exits 0, produces `dist/`, emits no error diagnostics
    - `npm run check:content` exits 0 and prints the `vendored N of 19 named Stills` line
      (expect `19 of 19` on the primary path)
    - Confirm the deliberately-absent list still holds: no `src/data/`, no `.vscode/`, no
      `scripts/generate-architecture-diagram.mjs`, no slideshow page, no fourth workflow, no
      `apps/`, `bootstrap/`, `clusters/`, `policies/`, `infrastructure/`
    - _Requirements: 1.11, 2.7, 3.6, 4.4, 4.6, 7.7_

  - [x] 12.2 Verify format idempotence
    - **Property 13: Formatting is idempotent and leaves the Validator green**
    - Run `npm run format`, capture the tree state, run `npm run format` again, assert no diff,
      then assert `npm run validate` exits 0. Catches a prettier rule and a markdownlint rule
      that disagree, which would make the repo unformattable-and-clean at the same time
    - **Validates: Requirements 4.5, 4.6**

- [x] 13. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Baseline cleanup and configuration prerequisites
  - Implements design sections "Open Questions and Risks / OQ6", Decision D13, and
    "Components and Interfaces / `package.json`" as revised by the scope expansion
  - Runs first so the repository is green before any content lands. Requirement 12.8 needs
    `validate`, `check:content`, and `build` all at exit 0, and two of the three fail today

  - [x] 14.1 Clear the two known baseline failures
    - **Property 11 allow-list.** `npm run check:content` currently reports exactly one violation:
      `PROPERTY 11 .kiro/settings:1 runnable factory config under .kiro/ other than specs/: settings`.
      It is a false positive. `.kiro/settings/mcp.json` is untracked local Kiro MCP configuration —
      confirm with `git ls-files .kiro/settings`, which returns nothing — so it is editor state, not
      Source_Factory factory config. The config Property 11 guards against is steering, skills,
      hooks, and agents
    - Resolution (design OQ6): add `settings` beside `specs` in the `.kiro/` allow-list in
      `scripts/check-content.mjs` (the loop that emits the message above), and add `.kiro/settings/`
      to `.gitignore` so it is never committed. This keeps Requirement 10.1's intent — no runnable
      factory config as system of record — while removing the false positive
    - **Prettier on the spec.** `prettier --check .` fails on
      `.kiro/specs/docs-site-scaffold/requirements.md` after the requirements edit. Run
      `npm run format` to fix it
    - Verify: `npm run validate` exits 0; `npm run check:content` exits 0 and emits no `PROPERTY`
      lines; `npm run build` exits 0
    - _Requirements: 10.1, 4.5, 4.6, 12.8_

  - [x] 14.2 Add `embeddedLanguageFormatting: "off"` to `.prettierrc`
    - Final file: `{ "semi": true, "singleQuote": false, "tabWidth": 2, "trailingComma": "all", "embeddedLanguageFormatting": "off" }`
      — the fifth key is additive and contradicts none of the four Requirement 4.1 names
    - **This must land before any Embedded_Artifact is written.** Decision D13 measured the failure:
      with prettier's default `"auto"`, `prettier --write` re-indents the elision marker inside a
      fenced YAML block, indenting `# ...` by two spaces, which breaks Requirement 3.7's
      character-for-character obligation, Requirement 12.7's marker form, and Requirement 12.8's
      exit-0 requirement in one edit
    - Do not use `.prettierignore` instead: it works at file granularity and would exempt the whole
      page including its prose, defeating Requirement 4.4
    - Verify: `npm run format` then `npm run validate` both exit 0
    - _Requirements: 4.1, 3.7, 12.7, 12.8_

  - [x] 14.3 Add the `verify:artifacts` script to `package.json`
    - Add `"verify:artifacts": "node scripts/verify-artifacts.mjs"` as a sibling script
    - **Do not touch `validate`.** Requirement 1.5 pins it character-for-character as
      `prettier --check . && markdownlint-cli2 "src/**/*.mdx"` and nothing may be appended.
      `verify:artifacts` is never chained into `validate`, `test`, or `build`, and never referenced
      from any of the three workflow callers (Decision D11). Requirement 12.8's three-command list
      deliberately excludes it, because it depends on a Source_Factory clone CI does not have
    - The script body arrives in task 20.1. Until then `npm run verify:artifacts` exits non-zero on
      a missing module; nothing else invokes it, so no gate regresses
    - Verify: the `validate` string byte check from task 1.1 still exits 0
    - _Requirements: 1.4, 1.5, 3.7_

- [x] 15. Three new pages, ten new sidebar labels, and the Property 10 revision
  - Implements design sections "Per-Page Content Contracts: Scope Expansion" for `gotchas.mdx`,
    `lab-d-reference.mdx`, and `autonomy-modes.mdx`; "Components and Interfaces /
    `astro.config.mjs`" as revised by the narrative revision; and Decision D23
  - Requirement 2.9 and Property 1 assert set equality between sidebar slugs and page basenames, so
    each new page and its sidebar entry land in the same sub-task. Adding a page without its entry
    fails Property 1 as an orphan; adding an entry without its page fails Property 1 and
    `astro build`
  - Final sidebar is Home plus ten slugs in the exact Requirement 2.6 order: `why`, `setup`,
    `lab-a`, `lab-b`, `lab-c`, `lab-d-reference`, `autonomy-modes`, `vibe-vs-spec`, `gotchas`, `done`
  - **All ten labels change and zero slugs change** (Requirements 2.6, 2.10; Decision D23). Slugs
    are identifiers in links, anchors, and the Property 1 contract; labels are prose. A slug rename
    is a build break and a content move at once
  - **Rules that apply to every page written or rewritten in tasks 15 and 16:**
    - **Reading the factory working tree.** It is at
      `/home/johna/workspace/jajera/kiro-eks-argocd-migration`, which is outside this workspace, so
      the `read_file` tool refuses it. Use `execute_bash` with `sed -n '<A>,<B>p' <path>` or `cat`.
      **No network fetching** — the public GitHub tree 404s `docs/` because it is untracked upstream
      (OQ1)
    - **Every Embedded_Artifact is quoted character-for-character** from a named factory-repo path.
      Never paraphrase, reconstruct, or invent YAML, Rego, JSON, or Markdown. Requirements 3.8 and
      15.7 give the fallback: link the path instead of showing a block
    - **Declaration convention (Decision D14).** One visible line immediately before the opening
      fence: ``Source: [`<path>`](<SOURCE_FACTORY_URL>/blob/main/<path>) lines A-B,C-D`` — inline
      code path, link target ending in the same path, ranges only for excerpts, **no trailing
      period** (a period would count as a sentence against Requirement 9.9). Expressive Code's
      `title=` attribute is **not** acceptable: it sits on the fence line, one line outside
      Requirement 12.2's 3-line window
    - **Excerpt ranges are design output, not implementer judgement.** Use the design's artifact
      inventory rather than re-deriving: `httpsonly.yaml` `1-4,15-19,35-71`; `networkpolicy.yaml`
      `1-36,55-72`; `workload-archetypes.md` `1-4,11-13,19-20` and `44-46,60-76`; Walkthrough Lab D
      commands `400-404` with its checklist table at `390-397`. One elision marker line at each
      omission point, in the fence language's comment syntax: `# ...` for `yaml` and `bash`,
      `<!-- ... -->` for `md`
    - **JSON can never be excerpted** (no comment syntax, so no legal marker), so JSON artifacts are
      quoted whole and must be at or below 60 lines. Both in scope qualify:
      `block-infra-commands.kiro.hook` is 14 lines, `eks-migration.json` is 10
    - **Every Embedded_Artifact block is at or below 60 content lines** excluding the fence
      delimiters (Requirement 12.11). `deployment.yaml` is 56 lines against that cap — four lines of
      headroom (design risk R5)
    - **No mandated section template.** No page owes a `## Tradeoff` heading and no page owes a
      `## Gotcha` heading. A tradeoff is argued in running prose where the page's argument reaches
      it (Requirements 12.4, 12.13); a gotcha takes either an anchored `gotchas` link or a heading
      from the vocabulary `Gotcha`, `Gotchas`, `Known scars`, `What bites`, `What goes wrong`
      (Requirement 12.5). Where a page does choose a tradeoff heading, its text must come from
      `Tradeoff`, `Tradeoffs`, `Why this way`, or `What this costs` (Requirement 12.13)
    - **Requirement 12.15 / Property 31.** No two Lesson_Pages may share an identical normalised
      `##` heading sequence. The design tables the six resulting sequences; the authored pages must
      match them. This is why the gotcha headings are assigned unevenly rather than uniformly
    - **Requirement 12.6 is per page, not per section.** A section may legitimately carry a table
      and two screenshots and nothing else, provided the page carries an Embedded_Artifact or an
      ordered list of 3 or more items somewhere
    - **Requirement 12.3 binds `lab-a` and `lab-c` only.** The other four Lesson_Pages are exempt
      by name; a numbered list of things to read is a template artefact rather than guidance. Where
      a list survives on those pages it survives on editorial merit, because it describes a real
      sequence
    - **The spine thread (Requirement 19.13, 19.14; Decision D18).** Two single-line forms:
      `Before this: [<label>](../<slug>/) <one sentence>.` as the first body block **above the first
      `##`**, and `Next: [<label>](../<slug>/) <one sentence>.` as the **last block of the page**.
      One Markdown link first on the line, one sentence after it, whole line at most 200 characters
      so it always falls inside Requirement 19.14's final-500-character window. The checker asserts
      the link **target**, never the link text
    - **No `<Still />` appears above the first `##` heading on any page.** This is the design rule
      that keeps the `Before this:` line and the spine claim outside Requirement 9.9's sentence cap
      by construction, and Property 6's third conjunct asserts it
    - **Reader vocabulary (Requirement 20).** None of the 27 Glossary identifiers appears in page
      body text, frontmatter `title` or `description`, sidebar `label`, caption, or `alt` text. Say
      "the factory repo" or name `jajera/kiro-eks-argocd-migration`; say "screenshot" or "frame",
      never a capitalised `Still`. The single Reader-visible exemption is the `:::note[Still
pending]` admonition **title** — its body is ordinary prose and must be worded accordingly.
      `Constraint_Template` is banned; `ConstraintTemplate`, the real Gatekeeper kind, is not
    - Frontmatter `title` and `description` both non-empty, `description` at most 160 characters.
      The `title` states the page's claim as a sentence and may exceed its 32-character sidebar
      label (Requirement 2.13)
    - `<Still />` only; no raw Markdown images. Captions one sentence, at most 120 characters
    - First occurrence of `111122223333`, `444455556666`, or `ap-southeast-2` on a page is followed
      by a `:::caution` whose body says **replace** before live IAM/ECR
    - No `apps/` directory and no path containing `apps/demo-nginx` is ever created in this repo
      (Requirements 10.3, 15.8)

  - [x] 15.1 Write `src/content/docs/gotchas.mdx` and its sidebar entry
    - Sidebar entry `{ label: "Known scars and fixes", slug: "gotchas" }` (21 characters) inserted
      between `vibe-vs-spec` and `done`, in the same change as the page
    - Frontmatter `title: Known scars, and how to get past them`; description at most 160 characters
    - `Before this:` line to `../vibe-vs-spec/` opens the page, above the first `##`. `Next:` line
      to `../done/` is the last block of the page
    - Six entries, each a `###` section whose first three non-empty blocks are lines beginning
      `**Symptom:**`, `**Cause:**`, `**Fix:**` in that order with nothing interleaved
      (Requirement 16.7; this is the entry-boundary convention Property 20 parses, and Requirement
      12.14 makes it this page's structure of record)
    - Section order, giving the normalised `##` sequence
      `how to triage a gator failure / version and placeholder scars / gator failure modes / what goes wrong`:
      `## How to triage a gator failure` (4-item ordered list: confirm the suite count is 14,
      re-read the failing case name, open the case object, open the constraint match scope);
      `## Version and placeholder scars` group; `## Gator failure modes` group; `## What goes wrong`
    - **Heading text is load-bearing** — it fixes the anchors tasks 16.4-16.6 link to. Use exactly
      `### Gator version skew`, `### The PDB scar at replicas 1`,
      `### Placeholder accounts and region`, and `## Gator failure modes`, giving
      `#the-pdb-scar-at-replicas-1`, `#placeholder-accounts-and-region`, and `#gator-failure-modes`
    - This page takes Requirement 12.5's **heading** branch with `## What goes wrong`, chosen from
      the vocabulary so the word does not collide with its own `###` entry headings
    - Skew entry: gator CLI `3.22.0` from the `GATOR_VERSION` default in
      `scripts/install-gator.sh` line 14; chart `version`/`appVersion` `3.21.1` from
      `infrastructure/gatekeeper/base/vendored/chart/gatekeeper/Chart.yaml`; fix is keep the pinned
      CLI. **At most three sentences plus one link to the Setup page** — Setup owns the reasoning
      (Requirement 16.3)
    - PDB entry: `minAvailable: 1` valid only at `replicas >= 2`; encoded in both `.kiro/steering/`
      and `.kiro/hooks/validate-app-scaffold.kiro.hook`; a hook failure blocks the scaffold and names
      the offending manifest with the conflicting values; fix is raise replicas or drop the PDB
    - Placeholder entry: `111122223333` (dev, `dev-eks-1`), `444455556666` (prod, `prod-eks-1`),
      `ap-southeast-2`, plus the `:::caution` containing **replace** (Property 8)
    - Exactly three gator failure-mode entries per Requirements 16.9, 16.10, 16.11: suite path
      resolving to no tests (fix confirms 14 suites), a case asserting the wrong violation count, a
      constraint match scope excluding the reviewed object
    - Every entry requiring file inspection links its factory-repo path under
      `https://github.com/jajera/kiro-eks-argocd-migration`. The page contains a `gator verify`
      token, so Property 9 fires on it
    - `## What goes wrong` carries the tradeoff in running prose with no labelled fields — one
      consolidated troubleshooting page over inline callouts on every lab page, because duplicated
      explanations drift, which is why Requirement 16.3 makes Setup authoritative for the skew —
      then the gotcha this page owes about itself: nothing machine-verifies in CI that a quoted file
      still matches its source, because `verify:artifacts` needs a local clone and skips without one
    - No `##` section on this page carries a table or a screenshot, so Requirement 12.6 is satisfied
      by the triage list. The triage list is editorial, not mandated — Requirement 12.3 exempts this
      page
    - _Requirements: 3.9, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10, 16.11, 2.6, 2.8, 2.9, 2.10, 2.12, 2.13, 9.8, 9.11, 9.12, 12.4, 12.5, 12.13, 12.14, 12.15, 19.13, 19.14, 20.2_

  - [x] 15.2 Write `src/content/docs/lab-d-reference.mdx`, its sidebar entry, and the Property 10 revision
    - **These three land in one change.** The shipped Property 10 asserts "no sidebar entry is
      labelled Lab D" (task 9.5), and Requirement 2.6 mandates
      `{ label: "Lab D (out of scope)", slug: "lab-d-reference" }`. Adding the entry without the
      revision turns `check:content` red; the revision without the entry is untested. Insert the
      entry between `lab-c` and `autonomy-modes`
    - **This is the one label the narrative revision leaves untouched** (Requirement 2.11 pins it as
      an exact string, 20 characters) because Property 10 scans labels and the parenthetical is what
      keeps the disclaimer inside the 80-character window in the same string
    - **Property 10 (revised): no page presents the live path as in scope.** Reverse the ban clause:
      for all occurrences of `Lab D` in any content page **and in any sidebar `label` string**, the
      text "out of scope" or "not in scope" occurs within 80 characters. The mandated label
      satisfies the window inside its own string, so the sidebar becomes an ordinary case of the
      proximity rule rather than an exception
    - **Validates: Requirements 9.7, 10.2, 18.5**
    - Frontmatter `title: Lab D (out of scope): what the live path looks like`; description under
      160 characters. Name the phrase once in the title and say **"the live path"** thereafter, so
      the proximity rule stays cheap and the page stays readable
    - Intro, above the first `##`: `Before this:` line to `../lab-c/`; framing that this is what the
      live path looks like, not a lab a Reader runs from this site; it starts only after human PR
      review, and changes reach the cluster through Git merge and Argo CD sync, never a chat-side
      apply (Requirements 18.4, 18.6)
    - Sections, giving the normalised `##` sequence
      `the visual checklist / frames not captured / reading the checklist / what bites`
    - `## The visual checklist`: reproduce `docs/Walkthrough.md` lines 390-397 as a **live Markdown
      table** (step / capture / pass-when) — 18.2 says "reproduce", so a fenced table would not
      render — and in the same section place the Source line plus a `bash` fence quoting
      `docs/Walkthrough.md` lines 400-404 (two `argocd app get`, two `kubectl -n demo-nginx get`,
      one `curl`)
    - Read both ranges with `sed -n '390,397p'` and `sed -n '400,404p'` against
      `/home/johna/workspace/jajera/kiro-eks-argocd-migration/docs/Walkthrough.md`. The declared
      range is block content, not the fence delimiters on lines 399 and 405. No interior omission, so
      no elision marker
    - `## Frames not captured`: one `:::note[Still pending]` naming `23-argocd-healthy.png`,
      `24-alb-ingress.png`, `25-curl-ok.png` and the shared `docs/media/walkthrough/` path. Those
      frames must never appear in a `<Still />` (Requirement 18.7; Properties 3 and 7 compose here,
      no new detector needed). The note **body** is ordinary Reader prose — say "the factory repo",
      not the Glossary identifier; only the admonition title is exempt (Requirement 20.7)
    - `## Reading the checklist`: prose mapping each pass-when to what a Reader would look at, plus
      the tradeoff argued in running prose with no heading — reference-only reproduction over a
      runnable Lab D, because running it needs a live cluster this site has no honest way to show.
      **The 4-item ordered list from the earlier draft is gone**: Requirement 12.3 exempts this page
      by name, and a numbered list mapping table rows to what you would look at is exactly the
      template artefact the criterion calls out. The page still clears the Depth_Bar through its
      Embedded_Artifact (Requirement 18.3)
    - `## What bites`: promoting to the prod overlay before the digest is pinned, then the `Next:`
      line to `../autonomy-modes/`. This page takes Requirement 12.5's heading branch, and
      `What bites` rather than `Gotcha` is what keeps its heading sequence distinct from
      `autonomy-modes` under Requirement 12.15
    - Requirement 18.8 is covered by Property 22, not Property 9 — `argocd`, `kubectl`, and `curl`
      are not among Property 9's five tokens, and the Source declaration line supplies the URL by
      construction. Do not extend Property 9's token list
    - Known cost to state, not to hide: the Source declaration links `docs/Walkthrough.md`, which is
      still untracked upstream, so the link 404s until `docs/` is pushed (OQ1, R7)
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 3.9, 10.2, 2.6, 2.8, 2.9, 2.11, 2.13, 9.11, 12.4, 12.5, 12.6, 12.13, 12.15, 19.13, 19.14, 20.2, 20.7_

  - [x] 15.3 Write `src/content/docs/autonomy-modes.mdx` and its sidebar entry
    - Sidebar entry `{ label: "Choose an autonomy mode", slug: "autonomy-modes" }` (23 characters)
      between `lab-d-reference` and `vibe-vs-spec`
    - Frontmatter `title: Choose an autonomy mode: Autopilot or Supervised`; description at most 160
      characters
    - Adapt from the walkthrough lines 411-428 (`sed -n '411,428p'`). Assert nothing about Kiro's UI
      beyond what that source states (Requirements 3.3, 11.13)
    - Intro, above the first `##`: `Before this:` line to `../lab-d-reference/`; Autopilot is the
      default; Supervised yields for approval after each file-editing turn; Lab C ran in Autopilot,
      cross-linking `lab-c` (Requirements 17.2, 17.3)
    - Sections, giving the normalised `##` sequence
      `what a supervised turn does / choosing a mode / both modes keep the gates / mode is not session type / what bites`
    - `## What a Supervised turn does`: 3-item ordered list (Kiro proposes edits as individual hunks,
      the Reader accepts or rejects each, the turn yields before continuing) and, in the same
      section, the two-mode comparison table. **The list is editorial, not mandated** — Requirement
      12.3 exempts this page — and it stays because it describes a real sequence a Reader watches. It
      is also what satisfies Requirement 12.6 at page scope
    - `## Choosing a mode`: Autopilot for scaffolding a known archetype, running validation, bulk
      file creation, with hooks and PR review as the net; Supervised for editing live bootstrap
      manifests and changing policy enforcement actions, where one wrong line blocks cluster syncs
    - `## Both modes keep the gates`: hooks fire in both including the shell gate in Supervised; both
      require a human merge before Argo CD sees anything
    - `## Mode is not session type`: mode controls when a Reader reviews edits, session type controls
      whether requirements are negotiated first; links `vibe-vs-spec`
    - `## What bites`: first the tradeoff in running prose with no labelled fields — Autopilot by
      default with hooks as the net, over Supervised everywhere, because Supervised everywhere turns
      a 45-minute scaffold into an afternoon of clicking — then the gotcha itself:
      `block-infra-commands` is an `askAgent` hook, so it instructs the agent rather than
      hard-blocking, and Autopilot plus a soft gate is why merge review is still the real boundary;
      then the `Next:` line to `../vibe-vs-spec/`
    - No screenshots and no Embedded_Artifact — Requirement 12.2 does not scope one to this page
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 3.9, 2.6, 2.8, 2.9, 2.10, 2.12, 2.13, 9.11, 12.4, 12.5, 12.6, 12.13, 12.14, 12.15, 19.13, 19.14, 20.2_

  - [x] 15.4 Restate the remaining seven sidebar labels in `astro.config.mjs`
    - After 15.1-15.3 the array holds eleven entries. Set every label to the exact Requirement 2.6
      string. Ten labels change; the `Home` link and all ten slugs stay as they are (Requirement
      2.10)

      | Slug              | Label                             | Chars |
      | ----------------- | --------------------------------- | ----: |
      | —                 | `Home`                            |     4 |
      | `why`             | `Why manual onboarding breaks`    |    28 |
      | `setup`           | `Install the toolchain`           |    21 |
      | `lab-a`           | `Prove policy offline (Lab A)`    |    28 |
      | `lab-b`           | `What makes prompts safe (Lab B)` |    31 |
      | `lab-c`           | `Onboard an app (Lab C)`          |    22 |
      | `lab-d-reference` | `Lab D (out of scope)`            |    20 |
      | `autonomy-modes`  | `Choose an autonomy mode`         |    23 |
      | `vibe-vs-spec`    | `Vibe or spec, and when`          |    22 |
      | `gotchas`         | `Known scars and fixes`           |    21 |
      | `done`            | `Evidence checklist`              |    18 |

    - Every label is at or below Requirement 2.12's 32-character cap.
      `What makes prompts safe (Lab B)` is 31 — **one character of headroom** (design risk R11), so
      that label is effectively frozen unless the claim gets shorter
    - Do not touch the module-scope `title` const `EKS GitOps Factory` (Requirement 2.1) or the
      `description` const; neither is a page title and nothing keys off the per-page titles
    - Verify: `node -e "const s=require('fs').readFileSync('astro.config.mjs','utf8'); for (const m of s.matchAll(/label: \"([^\"]+)\"/g)) if (m[1].length > 32) { console.error(m[1]); process.exit(1) }"`
      exits 0
    - _Requirements: 2.6, 2.10, 2.11, 2.12, 19.17_

- [x] 16. Rewrite the eight shipped pages and the README to the spine and the Depth_Bar
  - Implements design sections "Narrative Spine Mechanics", "Reader-Facing Vocabulary Mechanics",
    "Per-Page Content Contracts: Scope Expansion", and "README Contract" item 5
  - All rules from task 15 apply unchanged. These rewrites land **before** the checker properties in
    tasks 18-20, so every new property is green on arrival except the three known Property 12
    violations task 17 tolerates (design risk R8)
  - Pages rewritten here supersede the output of tasks 6.1-6.8; those checkboxes stay checked
  - **Frontmatter titles (Requirement 2.13, Decision D23).** Carry these across exactly; each states
    the page's claim as a sentence and is deliberately longer than its sidebar label:

    | Page              | Frontmatter `title`                                          |
    | ----------------- | ------------------------------------------------------------ |
    | `index`           | `EKS GitOps Factory`                                         |
    | `why`             | `Why manual GitOps onboarding breaks at 100 apps`            |
    | `setup`           | `Install the toolchain before Lab A`                         |
    | `lab-a`           | `Lab A: policy passes before any cluster exists`             |
    | `lab-b`           | `Lab B: the configuration is what makes a thin prompt safe`  |
    | `lab-c`           | `Lab C: a thin prompt produces a compliant dual-overlay app` |
    | `lab-d-reference` | `Lab D (out of scope): what the live path looks like`        |
    | `autonomy-modes`  | `Choose an autonomy mode: Autopilot or Supervised`           |
    | `vibe-vs-spec`    | `Vibe or spec, and when each earns its keep`                 |
    | `gotchas`         | `Known scars, and how to get past them`                      |
    | `done`            | `Evidence checklist: what Labs A-C proved`                   |

    `index` keeps a topic title on purpose: it is not a Lesson_Page, and the string feeds the
    `<title>` element where a search result wants the product name. Its claim lives in the hero
    tagline instead

  - **The spine thread pairing (Requirements 19.13, 19.14; Decision D18).** Derived from Sidebar
    order, so `index` owes only a `Next:` and `done` owes only a `Before this:`:

    | Page              | `Before this:` target            | `Next:` target                  |
    | ----------------- | -------------------------------- | ------------------------------- |
    | `index`           | — first in Sidebar order (19.13) | `/why/`                         |
    | `why`             | `../`                            | `../setup/`                     |
    | `setup`           | `../why/`                        | `../lab-a/`                     |
    | `lab-a`           | `../setup/`                      | `../lab-b/`                     |
    | `lab-b`           | `../lab-a/`                      | `../lab-c/`                     |
    | `lab-c`           | `../lab-b/`                      | `../lab-d-reference/`           |
    | `lab-d-reference` | `../lab-c/`                      | `../autonomy-modes/`            |
    | `autonomy-modes`  | `../lab-d-reference/`            | `../vibe-vs-spec/`              |
    | `vibe-vs-spec`    | `../autonomy-modes/`             | `../gotchas/`                   |
    | `gotchas`         | `../vibe-vs-spec/`               | `../done/`                      |
    | `done`            | `../gotchas/`                    | — last in Sidebar order (19.14) |

  - **The formula, six times, never as a slogan (Requirements 19.15, 19.16).** All three clauses
    `skills generate`, `hooks enforce`, and `humans approve` appear in the source of `index`, `why`,
    `lab-a`, `lab-b`, `lab-c`, and `done`, and each occurrence names which clause that page is
    proving: `index` none yet (the shape of the argument), `why` why the split exists, `lab-a`
    `hooks enforce`, `lab-b` `skills generate` and `hooks enforce` jointly, `lab-c`
    `skills generate`, `done` `humans approve`
  - **The vocabulary purge (Requirement 20.10).** These eight pages carry the eleven literal
    `Source_Factory` occurrences the review found. Substitutions: `Source_Factory` -> "the factory
    repo" or `jajera/kiro-eks-argocd-migration`; `Walkthrough_Source` -> "the walkthrough in the
    factory repo" or `docs/Walkthrough.md`; `Docs_Site`/`Docs_Repo` -> "this site" / "this
    documentation repo"; `Still`/`Stills` -> "screenshot" or "frame"; `Embedded_Artifact` -> "the
    quoted file" or "the block below"; `Generated_Manifests` -> "the manifests `add-app` produced";
    `Archetype_Contract` -> "the `web-service` contract"; `Constraint_Template`/`Gator_Suite` -> "the
    ConstraintTemplate" / "the gator suite"; `Hook_Definition` -> "the hook file"; `Autonomy_Mode` ->
    "autonomy mode"; `Content_Checker`/`Validator`/`Build_Pipeline` -> "the content checker" /
    `npm run validate` / "the build"; `Content_Author` -> "a maintainer" or "you". Where a sentence
    would begin with the adverb "Still", rewrite the sentence (Requirement 20.11)

  - [x] 16.1 Rewrite `src/content/docs/index.mdx` — the landing page as an ordered argument
    - **Requirement 19.4 is a source-order check, so block order including frontmatter key order is
      load-bearing** (design risk R9). Twelve blocks in this exact order (Decision D17): frontmatter
      `title`, frontmatter `description`, frontmatter `template`, frontmatter `hero.tagline`,
      frontmatter `hero.actions`, body the cost, body why prompting fails, body the move, body the
      formula, `## Three labs, one argument`, body the human gate, `Next:` line
    - Copy the frontmatter verbatim from the design. The `description` carries `100`, `450`, and
      `drift` so all three anchors precede any mechanism term; the tagline carries the same three as
      a second line of defence:

      ```yaml
      description: Onboarding about 100 apps by hand costs roughly 450 hours and drifts
        apart app by app. This site shows what to build instead.
      template: splash
      hero:
        tagline: About 100 apps to onboard. Roughly 450 hours by hand, and drift no
          reviewer catches.
        actions:
          - text: See what it costs
            link: /why/
            icon: right-arrow
            variant: primary
          - text: The factory repo
            link: https://github.com/jajera/kiro-eks-argocd-migration
            icon: external
            variant: minimal
      ```

    - The hero tagline must contain **none** of `steering`, `skill`, `hook`, `agent`, `MCP`,
      `Gatekeeper`, `gator`, `Kustomize`, `overlay` (Requirement 19.3). Do not reorder the
      frontmatter keys and do not rewrite the description without the numbers — either breaks
      Property 24 while leaving the visible page unchanged
    - Block 5 (the cost): at most three sentences — the app count, the hour count, re-deciding tree
      shape for every app, drift no reviewer catches. Block 6: a bare model invents a different tree
      per app and, given a shell, applies it to a live cluster. **Block 7 is the first block
      permitted to name a mechanism**: knowledge, ordered procedure, refusal, and the bundle over the
      three. Block 8: the formula, with the sentence naming which clause this page is and is not yet
      claiming
    - Block 9 replaces the six-card `<CardGrid>` with a three-item ordered list carrying lexical
      ordinals, and the `Card` / `CardGrid` import is **dropped from the file entirely**:

      ```mdx
      ## Three labs, one argument

      Each lab rests on the conclusion of the one before it, so the order is the point.

      1. **First — Lab A** proves policy passes before any cluster exists.
         [Prove policy offline (Lab A)](/lab-a/)
      2. **Second — Lab B** proves the configuration in the repository is what makes a thin prompt safe.
         [What makes prompts safe (Lab B)](/lab-b/)
      3. **Third — Lab C** proves a thin prompt produces a compliant dual-overlay app.
         [Onboard an app (Lab C)](/lab-c/)
      ```

    - Block 10: what the factory does not remove (workload understanding, IAM shrink, DNS/TLS,
      cutover risk); this site documents and you clone and run in the factory repo, with the link
      `https://github.com/jajera/kiro-eks-argocd-migration` (Requirements 3.4, 10.6)
    - Block 11: `Next: [Why manual onboarding breaks](/why/) …` — this is the one page that uses
      root-absolute link form, matching the hero `actions`, because a relative `../` from the site
      root would escape the base path
    - No screenshots on this page. Requirement 19.5's statement that the three labs form one ordered
      argument is block 9's opening sentence
    - _Requirements: 3.1, 3.4, 10.6, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.14, 19.15, 19.16, 20.2, 20.10_

  - [x] 16.2 Rewrite `src/content/docs/why.mdx` — spine moves 1, 2, and 3 in full
    - Intro above the first `##`: `Before this:` line to `../` and the page's framing. `Next:` line
      to `../setup/` as the last block
    - Move 1 with its numbers — keep the scale table verbatim from the walkthrough:

      | Path                    | Per app    | For 100 apps          |
      | ----------------------- | ---------- | --------------------- |
      | Manual (experienced)    | ~3-6 h     | ~450 h                |
      | Manual (mixed)          | ~1-2 days  | ~150 person-days      |
      | Factory + Kiro + review | ~45-90 min | ~75-150 h after setup |

    - Move 2: prompting a model harder does not fix it, because a bare model invents a different tree
      per app and will apply changes to a live cluster
    - Move 3: the decisions move into the repository — steering supplies knowledge, skills order
      procedure, hooks refuse what must not happen, and the agent bundles them so a thin prompt
      activates the whole stack
    - Keep the human gate ("accelerate drafting; do not merge or promote to prod without review") and
      the two-column removes / does not remove table. This page carries the honest limits and must
      not read as a sales page
    - The formula appears here naming **why the split exists**: generation is what scales,
      enforcement is what keeps 100 apps matching, approval is what stays human
    - Purge `Source_Factory` from this page's prose; link `.kiro/steering/` and `.kiro/hooks/` paths
      in the factory repo
    - _Requirements: 9.1, 19.8, 19.13, 19.14, 19.15, 19.16, 20.2, 20.10_

  - [x] 16.3 Extend `src/content/docs/setup.mdx` — skew authority, provenance, and the thread
    - Keep the existing contract; Setup is **not** a Lesson_Page, so the Depth_Bar does not apply
    - Addition 1, the authoritative gator skew explanation (Requirements 9.13, 16.3): gator CLI
      `3.22.0` with its origin as the `GATOR_VERSION` default in `scripts/install-gator.sh`,
      Gatekeeper Helm chart `version`/`appVersion` `3.21.1` with its origin as
      `infrastructure/gatekeeper/base/vendored/chart/gatekeeper/Chart.yaml`, why the mismatch is
      expected, and that the Reader keeps the pinned CLI rather than downgrading it. This page owns
      the reasoning because the Reader installs gator here before reaching the gotchas page
    - Addition 2, the provenance table (Requirement 11.12, Decision D16): `01`, `09`, `13` from
      `capture.mjs`; `08` and `14`-`22` from `capture-kiro-configs.mjs`; `07`, `10`, `10-vibe-mode`,
      `10b`, `11`, `12` from the Lab C recording; `23`-`25` from a Reader's own live cluster. It goes
      here, beside the Requirement 7.5 capture-script fence, because provenance and regeneration are
      one subject. Call it "where each screenshot came from", never the Glossary identifier
    - Addition 3, the spine thread: `Before this:` to `../why/` above the first `##`, `Next:` to
      `../lab-a/` as the last block
    - Title becomes `Install the toolchain before Lab A`; confirm the `description` is at most 160
      characters (Property 2 gains that cap in task 18.2)
    - Purge `Source_Factory` from this page's prose: "Clone the factory repo
      (`jajera/kiro-eks-argocd-migration`)" and "the two capture scripts in the factory repo"
    - _Requirements: 9.2, 9.13, 11.12, 16.3, 7.5, 19.13, 19.14, 20.2, 20.10_

  - [x] 16.4 Rewrite `src/content/docs/lab-a.mdx` — the policy authoring chain
    - Intro above the first `##`: `Before this:` line to `../setup/`; the spine claim that **policy
      passes before any cluster exists** (Requirement 19.9); the formula naming `hooks enforce` as
      the clause this page earns; the offline-admission framing; and the chain ConstraintTemplate ->
      Constraint -> gator suite -> `gator verify` PASS (Requirement 13.1)
    - Seven sections, giving the normalised `##` sequence
      `run the offline suite / the constrainttemplate / the constraint / the gator suite / the failing case / reading a violation message / where the rest live`:
      `## Run the offline suite`, `## The ConstraintTemplate`, `## The Constraint`,
      `## The gator suite`, `## The failing case`, `## Reading a violation message`,
      `## Where the rest live`. **There is no `## Tradeoff` section and no `## Gotcha` section**
    - `## Run the offline suite`: 3-item ordered list (install gator, `gator verify`, both policy
      overlay builds), the `bash` fence, then screenshot `09-gator-verify.png`. Keep the existing
      offline commands (Requirement 13.9). This is one of the two pages Requirement 12.3 still binds
    - Four Embedded_Artifacts, each with its Source line, quoted from the working tree:
      - `infrastructure/gatekeeper/constraint-templates/httpsonly.yaml` — 71 lines, **excerpt**
        `lines 1-4,15-19,35-71`, 48 content lines, two `# ...` markers. Segments are
        apiVersion/kind/name, `spec.crd.spec.names.kind: K8sHttpsOnly`, and `targets` plus both
        `violation` rules with their helpers
      - `infrastructure/gatekeeper/constraints/httpsonly/constraint.yaml` — 12 lines, whole
      - `infrastructure/gatekeeper/tests/httpsonly/suite.yaml` — 15 lines, whole
      - `infrastructure/gatekeeper/tests/httpsonly/fail.yaml` — 17 lines, whole
    - `## The failing case` also carries a `text` fence with the expected violation message
      `Ingress should be https. tls configuration and allow-http=false annotation are required for test-ingress`.
      Label it as the expected result of the `ingress-without-tls` case, **not** a captured terminal
      session (Requirement 13.7), and give it **no Source line** — it is deliberately not an
      Embedded_Artifact
    - `## Reading a violation message`: name the constraint kind `K8sHttpsOnly`, the reviewed object
      identity `test-ingress` in namespace `my-app`, and the string built by the Rego `sprintf` call
    - `## Where the rest live`: link `infrastructure/gatekeeper/constraints/` (15 directories) and
      `infrastructure/gatekeeper/tests/` (14 suites) rather than reproducing every policy. Its tail
      carries, in this order: the **tradeoff in running prose with no heading** — offline gator over
      waiting for a live admission webhook, because a webhook needs a cluster and this lab's whole
      claim is that you do not have one; the gotcha as the anchored link
      `../gotchas/#gator-failure-modes`; and the `Next:` line to `../lab-b/` as the last block
    - Say "in your clone of the factory repo", never the Glossary identifier
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 9.3, 9.11, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.11, 12.13, 12.15, 19.9, 19.13, 19.14, 19.15, 19.16, 20.2, 20.10_

  - [x] 16.5 Rewrite `src/content/docs/lab-b.mdx` — one proof in five sections
    - **This replaces the eight-section restructure the earlier draft specified** (Decision D19).
      That layout was derived from a constraint, not from the page: Requirement 12.6 read per section
      forced a fence or a 3-item list into every screenshot-bearing section. Requirement 12.6 is now
      per page and Requirement 12.3 exempts `lab-b` entirely, so the sectioning follows the argument
    - **The claim this page proves (Requirement 19.10): the configuration in the repository is what
      makes a thin prompt safe.** Everything on the page is evidence for that one sentence
    - Intro above the first `##`, with no screenshot in it: `Before this:` line to `../lab-a/`; the
      spine claim; the formula naming `skills generate` and `hooks enforce` as the pair this page
      joins
    - Five sections, giving the normalised `##` sequence
      `what the repository already decided / knowledge what the model is told before it starts / procedure what the model does in what order / refusal what cannot happen even if asked / the bundle one prompt activates all three`:
      1. `## What the repository already decided` — the Mermaid layer diagram prompt -> agent ->
         skill -> hooks -> PR -> human -> Argo, **moved to the front** because it is the shape of the
         argument rather than its summary; the repo and `.kiro` trees; screenshots `01-repo-tree`,
         `14-kiro-explorer-tree` with one bridge sentence between them
      2. `## Knowledge: what the model is told before it starts` — the six-row steering table with
         the **verified** `fileMatchPattern` globs (noting that `apps/**` is the walkthrough's
         shorthand); the context-budget reasoning for `always` versus conditional; `md` excerpt block
         A of `.kiro/steering/workload-archetypes.md` (111 lines) `lines 1-4,11-13,19-20`, 11 content
         lines, two `<!-- ... -->` markers, including the `inclusion: fileMatch` frontmatter line;
         `md` excerpt block B of the same file `lines 44-46,60-76`, 21 content lines, one marker —
         the "Also required" row and the `## Hardening` section through the two PDB lines, which is
         what Lab C is checked against; screenshots `15-steering-profile`, `16-steering-archetypes`
      3. `## Procedure: what the model does, in what order` — the four-skill table with trigger and
         key behaviour, noting `migrate-workload`'s progressive disclosure via `references/`; the
         decision that a procedure belongs in a skill rather than steering, because duplicating it
         loads it on every interaction and lets it drift; screenshots `17-skill-add-app`,
         `18-skill-migrate`
      4. `## Refusal: what cannot happen even if asked` — the whole
         `.kiro/hooks/block-infra-commands.kiro.hook` (14 lines, `json`, with the Expressive Code
         `wrap` meta because line 12 is a single ~3,200-character string) walked field by field; the
         eight-hook table in three categories with their IDE events (`preToolUse`, `fileEdited`,
         `fileCreated`); why the shell gate is the most critical; how to write a new hook (file
         location, event name, tool scope, how deny and allow are expressed, what keeps the Git-only
         guarantee intact); screenshots `19-hooks-grid`, `08-pdb-rule`
      5. `## The bundle: one prompt activates all three` — the whole `.kiro/agents/eks-migration.json`
         (10 lines) with the hooks-are-IDE-level explanation; the four-server MCP table with purpose
         and default state, stating that `eks` is locked to `--read-only` and `kubernetes` sets
         `ALLOW_ONLY_NON_DESTRUCTIVE_TOOLS=true`, and the conclusion that combined with the shell
         gate there is no path from the agent to a live cluster mutation; the specs structure and the
         two named specs `initial-project-setup` and `gatekeeper-admission`; screenshots
         `20-agent-config`, `21-mcp-servers`, `22-specs-timeline`
    - The tail of section 5 carries the **tradeoff in running prose with no heading** — `always` for
      cheap global facts against `fileMatch` for heavy archetype rules, argued where the layers have
      just been assembled — then the gotcha as the anchored link
      `../gotchas/#the-pdb-scar-at-replicas-1`, then the `Next:` line to `../lab-c/`
    - **What is gone and must not come back**: the eight-section layout; `## The layered contract`
      and its 3-item "read steering, read the skill, watch the hooks fire" list (Requirement 12.3
      names it a template artefact and exempts this page); `## The web-service contract` as its own
      section (block B folds into section 2, where it is knowledge the model is given);
      `## Writing your own hook` as its own section (folds into section 4, beside the hook being read
      field by field); `## How the layers connect` as a closing section (the diagram opens section
      1); `## Agent, MCP, and specs` (renamed to state what the section proves); `## Tradeoff`;
      `## Gotcha`
    - **Requirement obligations preserved in full.** Nothing from Requirements 11 or 14 is dropped:
      six-file steering table with verified globs (11.1), context-budget reasoning (11.2), four-skill
      table with progressive disclosure (11.3), the skill-not-steering decision (11.4), eight hooks
      in three categories with IDE events (11.5), the shell gate as most critical (11.6), the agent
      JSON with the hooks-are-IDE-level explanation (11.7), four MCP servers with the read-only locks
      and the conclusion (11.8), the specs structure with both named specs (11.9), the hook JSON
      (14.1), the field-by-field walk (14.2), the steering excerpt with its inclusion-mode
      frontmatter (14.3), the `web-service` contract excerpt (14.4), every abstraction anchored to an
      artifact or a link (14.5), hook-authoring guidance (14.6), and the layer diagram plus the
      formula (14.7). All eleven screenshots from Requirement 9.4 are still here, and both excerpt
      plans are unchanged
    - Field-by-field hook explanation (Requirement 14.2) from the verified file: `enabled`, `name`,
      `description`, `version`, `when.type: preToolUse` with `when.toolTypes: ["shell"]`,
      `then.type: askAgent` with the DENY / ALLOW / USER OVERRIDE lists and the refusal string
      `ACCESS DENIED — Git-only repo.` Say what the file says: `askAgent` is a **soft** gate that
      instructs the agent rather than hard-blocking the process, which is why Requirement 11.6's
      "denies anything that could mutate" is paired with the merge-and-sync guarantee. The same fact
      is the `autonomy-modes` gotcha
    - Requirement 12.6 holds at page scope on any one of this page's four Embedded_Artifacts, so no
      section needs a companion fence or a filler list
    - Watch Requirement 9.9 **within** each section: section 1 has one bridge sentence between the
      two trees, section 2 one between the profile and archetypes frames, section 4 one about the PDB
      scar being encoded in steering and in the `validate-app-scaffold` hook, section 5 at most two
      between each of its three frames. Across section boundaries the prose is far longer, which is
      exactly what Decision D12's within-section walk permits
    - _Requirements: 9.4, 9.9, 9.11, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 12.2, 12.4, 12.5, 12.6, 12.7, 12.11, 12.13, 12.15, 19.10, 19.13, 19.14, 19.15, 19.16, 20.2, 20.10_

  - [x] 16.6 Rewrite `src/content/docs/lab-c.mdx` — generated manifests and the contract check
    - Intro above the first `##`: `Before this:` line to `../lab-b/`; the spine claim that **a thin
      prompt produces a compliant dual-overlay app** (Requirement 19.11); the formula naming
      `skills generate` as the clause this page earns; the Requirement 15.4 statement adjacent to the
      first block that the quoted YAML is teaching material on a documentation page, **not** a system
      of record, not a Kustomize input, not an Argo CD source; and Requirement 15.5 reworded for
      Requirement 20 — "you get these files by running the prompt below against the `eks-migration`
      agent in your clone of the factory repo", and copying them into this repository as files is
      prohibited by Requirement 10.3
    - Five sections, giving the normalised `##` sequence
      `the thin prompt / what add app generated / contract check / done and pr checks / takeaway`
    - `## The thin prompt`: the exact `demo-nginx` prompt in a `text` fence, quoted from the
      walkthrough (lines 259-264), never paraphrased; screenshots `10-add-app-session`,
      `10b-add-app-scaffolding`
    - `## What add-app generated`: seven Source lines and seven `yaml` blocks; screenshots
      `07-block-infra-denied`, `11-kustomize-build`. Keep the R2 hedge — that frame documents the
      hook **allowing** `kustomize` despite its filename, and the `kubectl apply` deny was not in the
      recording, so link `.kiro/hooks/block-infra-commands.kiro.hook` rather than asserting it
      - `apps/demo-nginx/base/manifests/deployment.yaml` — 56 lines, whole. **Four lines of headroom
        against the 60-line cap** (design risk R5); note it so the next re-quote knows
      - `apps/demo-nginx/base/manifests/ingress.yaml` — 23 lines, whole
      - `apps/demo-nginx/base/manifests/networkpolicy.yaml` — 72 lines, **excerpt**
        `lines 1-36,55-72`, 55 content lines, one `# ...` marker. Segment 2 starts at the `---`
        separator on line 55 so the quote stays a well-formed multi-document stream; the omitted
        document is `allow-https-egress`, named in prose with the full file linked
      - `apps/demo-nginx/base/manifests/poddisruptionbudget.yaml` — 12 lines, whole
      - `apps/demo-nginx/overlays/dev-eks-1/kustomization.yaml` — 6 lines, whole
      - `apps/demo-nginx/overlays/prod-eks-1/kustomization.yaml` — 6 lines, whole. The two are
        byte-identical; say why (structural symmetry is the dual-overlay guarantee; the environment
        difference lives one level down in the patches) so it does not read as padding
      - `apps/demo-nginx/overlays/prod-eks-1/manifests/deployment-patch.yaml` — 18 lines, whole.
        **The seventh file** (Decision D15): none of the six Requirement 15.1 names carries a digest,
        and Requirement 15.2 needs one. The base pins the mutable tag `:1.27` on line 27; the
        placeholder `@sha256:REPLACE_WITH_ACTUAL_DIGEST` is on line 11 of this patch. State that this
        is the promotion model, not an oversight
    - `## Contract check`: 3-item ordered list (build the dev overlay, build the prod overlay, run
      `gator verify`) — kept because this is one of the two pages Requirement 12.3 binds — and the
      seven-row table naming, per Archetype_Contract item, the quoted file, the satisfying field, a
      verdict, and exactly one supplying layer with its path: readiness probe, liveness probe,
      Ingress, NetworkPolicy, PDB validity at `replicas: 2`, placeholder digest, both overlays present
    - `## Done and PR checks`: 3-item ordered list of the done state; screenshots `12-add-app-done`,
      `13-pr-checks`. The list stays because it is a sequence of things to do
    - `## Takeaway`: a vibe prompt still yields a factory result because steering, the skill, the
      hooks, and the agent did the work; then the **tradeoff in running prose with no heading** — a
      thin prompt plus hard guardrails over a long prescriptive prompt, because a prescriptive prompt
      has to be rewritten for every app while the guardrails are written once; then the gotcha as the
      anchored link `../gotchas/#placeholder-accounts-and-region`; then the `Next:` line to
      `../lab-d-reference/` as the last block. **No `## Tradeoff` heading**
    - The quoted `deployment.yaml` image reference contains `111122223333` and `ap-southeast-2`, so
      the page needs its `:::caution` (Property 8)
    - Requirement 15.7 fallback stays available per file: if a named file is absent, unreadable, or
      differs from what you would quote, omit that block, list the paths `add-app` creates, and link
      the skill definition. Never show reconstructed YAML
    - Create **no** `apps/` directory and no file whose path contains `apps/demo-nginx`
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 9.5, 9.8, 9.11, 10.3, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.11, 12.13, 12.15, 19.11, 19.13, 19.14, 19.15, 19.16, 20.2, 20.10_

  - [x] 16.7 Rewrite `src/content/docs/vibe-vs-spec.mdx`
    - Not a Lesson_Page, so no Depth_Bar element is required — no artifact, no ordered list, no
      tradeoff, no gotcha. It **does** owe both spine lines, because Requirements 19.13 and 19.14
      quantify over every page: `Before this:` to `../autonomy-modes/` above the first `##`, `Next:`
      to `../gotchas/` as the last block
    - Full five-dimension comparison: input, feedback loop, traceability, best for, risk surface
    - The three-document description of a spec session; the "when vibe is the right call" list; the
      "when spec-driven earns its keep" list; the "they compose, not compete" pattern where a spec
      session builds the platform and vibe sessions onboard apps on top of it
    - State that neither mode bypasses the human gate: specs are reviewed before implementation
      starts, vibe output is reviewed before merge
    - Keep screenshot `10-vibe-mode.png`; cross-link `autonomy-modes` for the independent
      mode-versus-session-type point. Title becomes
      `Vibe or spec, and when each earns its keep`
    - _Requirements: 9.6, 11.10, 11.11, 17.8, 19.13, 19.14, 20.2, 20.10_

  - [x] 16.8 Rewrite `src/content/docs/done.mdx` — the page that closes the spine
    - Title becomes `Evidence checklist: what Labs A-C proved`
    - Intro above the first `##`: `Before this:` line to `../gotchas/` and the spine claim that
      **humans still merge, and the human gate is the design rather than a shortfall** (Requirement
      19.12, spine move 5). This is the **last** page in Sidebar order, so Requirement 19.14 exempts
      it and it carries **no** `Next:` line
    - The formula appears here naming `humans approve` — the clause this page finally earns rather
      than quotes
    - Keep the evidence checklist at Labs A-C only, with no Lab D evidence row: Lab A gator `PASS`;
      Lab B config-map screenshots understood; Lab C dual overlays plus PR checks
    - Where the page names Lab D, the same sentence states that Lab D is out of scope as a runnable
      lab **and** links the `lab-d-reference` page (Requirement 9.7 as revised). Keep every mention
      inside Property 10's 80-character window
    - Link `.github/workflows/kustomize-build.yml` and `policy-validate.yml` in the factory repo. No
      screenshots on this page
    - _Requirements: 9.7, 10.2, 19.12, 19.13, 19.15, 19.16, 20.2, 20.10_

  - [x] 16.9 Purge spec vocabulary from `README.md`
    - Requirement 20.12 makes `README.md` a Reader surface on GitHub, so Property 29 reads it under
      the same removal rules as page source. The current wording fails on one sentence
    - Replace "Run all factory commands from the Source_Factory, not from this documentation repo."
      with "Run all factory commands from the factory repo
      (`jajera/kiro-eks-argocd-migration`), not from this documentation repo."
    - Sweep the rest of the file for any of the 27 identifiers in prose. **The table header
      `Source factory repository` stays**: two ordinary words with a space, not the underscored
      identifier, and Property 29 matches on word boundaries. Rewording it would lose the table's
      parallelism for nothing
    - Keep every Requirement 8 obligation intact: the level-1 heading, the single ASCII paragraph,
      the "What this is / What this is not" table, the published-site and factory-repo links, and the
      four fenced local-development commands
    - Verify: `npm run validate` exits 0 (prettier formats the README too)
    - _Requirements: 20.2, 20.5, 20.12, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 17. Checkpoint - eleven pages build and lint, with one known red check
  - Ensure all tests pass, ask the user if questions arise.
  - `npm run validate` and `npm run build` both exit 0 with all ten sidebar slugs resolving
  - `npm run check:content` is **expected to be red here, and only in one way**: the shipped
    `/^## Tradeoff\s*$/m` assertion emits `PROPERTY 12 <file>:1` for `lab-a`, `lab-b`, and `lab-c`,
    because every one of those pages lost that heading in task 16. Confirm those three lines are the
    **only** `PROPERTY` output. **Do not re-add the heading to make the check pass** — Requirement
    12.13 retires it and task 18.6 deletes the assertion
  - This is design risk R8 stated as a gate: the checker edit and the content rewrite cannot both be
    green at once in either order, so the plan takes the direction where the failure is one known
    assertion rather than eight unimplemented properties

- [x] 18. Content checker: shared parse products and revisions to the shipped properties
  - Implements design section "`scripts/check-content.mjs` contract" (both the scope-expansion and
    narrative-revision addition lists) and the revised statements of Properties 1, 2, 6, 7, 8, 11,
    and the restatement of Property 12
  - Same file, `scripts/check-content.mjs`. Still zero-dependency Node ESM, read-only, no network.
    Property 10's revision already landed in task 15.2
  - Diagnostic format is unchanged: `PROPERTY <n> <file>:<line> <message>`

  - [x] 18.1 Add the shared parse products and the informational count lines
    - Parse once, assert many times. Build: a fence index per page (opening line, closing line,
      language, meta, content lines); a Source declaration index keyed to fences; a `##` and `###`
      section index with each section's contents classified as table, screenshot component, fence,
      ordered list, or admonition; the ordered-list index with item counts and visible numbers; the
      slugified heading set of `gotchas.mdx` at both `##` and `###` levels; the **ordered slug chain**
      from the sidebar array so Properties 26 and 27 derive expected targets rather than hard-coding
      pairs; per-page **normalised level-2 heading sequences** per the Requirement 12.15 rules for
      Property 31; a **Reader-prose projection** of each page produced by applying Requirement 20.5's
      four removal steps in order for Property 29; a `dist/` HTML **text-node walk with `<pre>` and
      `<code>` subtrees excluded** for Property 30; and the landing page's first-mechanism-term and
      first-anchor indices for Property 24
    - Normalisation for heading sequences, in this order: strip the leading `##` and surrounding
      whitespace; remove backticks, `*`, `_`, and link syntax keeping link text; lower-case; replace
      every run of non-alphanumeric characters with a single space; trim. Headings inside fenced
      blocks are excluded via the fence index
    - Removal order for the Reader-prose projection, in this order: fenced code blocks including
      their fence lines and meta; inline code spans; JSX component names and their imports; JSX
      attribute **names** only. Attribute **values** stay, because a `caption` or `alt` string is
      Reader prose that Requirement 20.2 names explicitly
    - Print informational count lines beside the existing `vendored N of 19 named Stills`:
      `16 declared Embedded_Artifacts`,
      `spine thread: 10 previous links, 10 next links, chain intact`, and
      `vocabulary: 0 matches in 11 pages, README, and 11 labels`. All are information, never a pass
      condition — the pass condition is the absence of violations
    - `README.md` joins the corpus for the vocabulary scan only. It is the single file outside
      `src/content/docs/` that Property 29 touches
    - **Read-only by construction** (Requirement 12.9): no write, rename, or delete call anywhere.
      Confirm by hashing `src/content/docs/` before and after a run
    - Verify: `npm run check:content` runs and prints all four count lines
    - _Requirements: 12.9, 20.5, 20.12_

  - [x] 18.2 Revise Properties 1 and 2 for the widened corpus
    - **Property 1: Sidebar and content pages are in exact correspondence** — unchanged statement,
      now eleven pages and ten slugs. Confirm set equality still holds after tasks 15.1-15.3
    - **Property 2: Every content page has usable frontmatter** — add the `description` length cap of
      160 characters alongside the existing non-empty `title` and `description` assertions
    - Note what this property deliberately does **not** do now that eleven titles changed: it asserts
      `title` is present and non-empty, never that it equals a particular string, and it applies no
      length cap to `title`. Requirement 2.13 makes a 58-character title beside a 22-character label
      legal, and the two caps live in different properties over different files
    - **Validates: Requirements 2.6, 2.8, 2.9, 3.1, 3.2, 3.9, 16.1, 17.1, 18.1**

  - [x] 18.3 Revise Property 6: section-scoped pairs, six pages, and a screenshot-free intro
    - **Property 6: Lesson pages stay visual-first (revised)**
    - Widen the page set from three lab slugs to the six Lesson_Pages (`lab-a`, `lab-b`, `lab-c`,
      `lab-d-reference`, `autonomy-modes`, `gotchas`)
    - Scope the pairwise walk **within a `##` section** (Decision D12): split each page on level-2
      headings, then split each section on `<Still` boundaries, strip fenced code, admonitions, link
      text, inline code spans, and headings, count sentence terminators, assert `<= 2`
    - Add the new third conjunct over **all eleven** content pages: no `<Still` occurrence precedes
      the page's first level-2 heading line. This is what makes Requirement 19.13's `Before this:`
      line and the spine claim free of the sentence cap by construction rather than by care. The
      matching guarantee for the `Next:` line needs no conjunct — 9.9 only counts prose _between_
      consecutive screenshots, and the `Next:` line is the last block
    - Decision D12's original reason (Requirement 12.6 read per section forced the prose) is retired;
      the surviving reason is Decision D20's — Requirement 12.3 still mandates ordered lists on
      `lab-a` and `lab-c`, and on `lab-b` the prose at a section boundary is a six-row table plus two
      excerpt walkthroughs. Keep the scoping; do not re-cite the dead reason in a comment
    - **Validates: Requirements 9.9, 19.13**

  - [x] 18.4 Revise Properties 7 and 8 for the widened corpus
    - **Property 7: Pending screenshots are labelled, never faked** — the `lab-d-reference` note
      names three PNGs in one block, so the check must accept a body listing multiple filenames plus
      one shared `docs/media/walkthrough/` path
    - **Property 8: Placeholder identifiers always carry a replacement warning** — confirm it now
      fires on `gotchas` and on `lab-c` (the quoted `deployment.yaml` image reference carries
      `111122223333` and `ap-southeast-2`) and that both pages carry their `:::caution`
    - **Validates: Requirements 7.6, 9.8, 16.5, 18.7**

  - [x] 18.5 Revise Property 11 with the tree-wide `apps/demo-nginx` conjunct
    - **Property 11: No factory implementation tree is present (revised)**
    - Keep the root-level forbidden set (`apps/`, `bootstrap/`, `clusters/`, `policies/`,
      `infrastructure/`, runnable factory config under `.kiro/` other than `.kiro/specs/` and
      `.kiro/settings/` per task 14.1) and add a second conjunct: no path anywhere in the tree
      contains the substring `apps/demo-nginx`, excluding `node_modules/`, `dist/`, `.astro/`, and
      `.git/`
    - Requirement 15.9 cites this property by number and asks about a path, not a root directory.
      The failure mode is concrete: Lab C quotes seven files from that tree, and the obvious next
      move for a maintainer is to paste a block into a real file to run `kustomize build`. A
      root-level check would miss `src/scratch/apps/demo-nginx/deployment.yaml`
    - **Validates: Requirements 10.1, 10.3, 15.8, 15.9**

  - [x] 18.6 Restate Property 12 — delete the tradeoff presence check, keep a heading vocabulary
    - **Property 12: A dedicated tradeoff heading uses the allowed vocabulary (restated)**
    - **Delete the `/^## Tradeoff\s*$/m` presence assertion outright** (the `["lab-a","lab-b","lab-c"]`
      block around line 287 of the shipped script). Requirement 12.13 instructs the checker to
      accept a lesson page carrying no `Tradeoff` heading. **This is a retirement, not a tightening,
      and nothing replaces it: after this task no property asserts that a tradeoff exists at all.**
      That is Requirement 12.12's review judgment and design OQ10's recorded risk — it is written
      here so nobody re-adds the check believing it was an oversight
    - What the property asserts instead: for all headings on a Lesson_Page whose normalised text
      begins with `tradeoff`, or contains `this way` or `this costs`, that heading's text is an exact
      member of the vocabulary `Tradeoff`, `Tradeoffs`, `Why this way`, `What this costs`. A
      near-miss such as `## Trade-offs and costs` is reported rather than silently accepted
    - The three labels `Choice`, `Alternative`, `Reason` are **not** required and **not** checked.
      Requirement 12.4 permits running prose with no heading and no labelled fields, and a labelled
      triple is exactly the form the review rejected
    - Property 12 keeps its number rather than being deleted, so the emitted set stays hole-free.
      Change the diagnostic message from `lab page missing "## Tradeoff" heading` to a
      vocabulary-mismatch message naming the offending heading
    - Verify: after this task, `npm run check:content` emits **no** `PROPERTY 12` lines for the three
      lab pages, and the three violations task 17 tolerated are gone
    - **Validates: Requirements 12.13**

- [x] 19. Content checker: the Depth_Bar properties
  - Implements design sections "Depth_Bar Mechanics", "Requirement 12.15: comparing heading
    sequences", and Properties 15-20, 22, and 31
  - Same file, `scripts/check-content.mjs`, all assertions over the task 18.1 parse products. Every
    page these properties bind was written or rewritten in tasks 15 and 16, so each sub-task should
    report zero violations the first time it runs. A violation here means a page drifted from its
    contract, not that the property is too strict

  - [x] 19.1 Implement Property 15
    - **Property 15: Every Embedded_Artifact declares its source**
    - For every fence carrying a Source declaration line: the line matches the Decision D14 grammar
      (the literal `Source:` plus one space, then one inline-code path, then a Markdown link to
      `<SOURCE_FACTORY_URL>/blob/main/<path>`, then optionally the word `lines` and a range list
      `A-B,C-D` with no spaces inside it, and no trailing period); it sits within the 3 source lines
      preceding the opening fence or the 3 following the closing fence; and the inline-code path is
      identical to the path segment after `/blob/main/` in the URL
    - Assert at least one such block exists on each of `lab-a`, `lab-b`, and `lab-c`
    - A fence with **no** Source line is not an Embedded_Artifact and is not checked — exactly
      Requirement 12.2's "counts as an Embedded_Artifact only if". Reader command blocks,
      expected-output blocks, and Mermaid diagrams are ordinary fences
    - This is the offline half of Requirement 3.7. Byte fidelity is Property 21, and real factory-repo
      YAML pasted with no declaration stays a review item — do not claim otherwise in the message text
    - **Validates: Requirements 3.7, 12.2, 13.2, 13.3, 13.4, 13.5, 14.1, 14.3, 14.4, 15.1, 18.3**

  - [x] 19.2 Implement Property 18
    - **Property 18: Embedded_Artifact blocks obey the size and excerpt contract**
    - Content between the fence delimiters is at most 60 lines (Requirement 12.11)
    - For a declaration stating N ranges: the block contains exactly N-1 elision marker lines; each
      marker is the fence language's comment syntax followed by an ellipsis (`# ...` for `yaml` and
      `bash`, `<!-- ... -->` for `md`, and **no legal form for `json`**, which is the mechanical form
      of "JSON can never be excerpted"); and the k-th quoted segment has exactly as many lines as the
      k-th declared range
    - The segment-length conjunct is what makes this strong with no clone present: a block declaring
      `lines 1-4,15-19,35-71` must have segments of 4, 5, and 37 lines
    - Messages name the declared range and the observed length — "segment 2 is 6 lines, declared
      15-19 is 5 lines" is actionable, "excerpt malformed" is not
    - **Validates: Requirements 12.7, 12.11**

  - [x] 19.3 Implement Property 16, scoped to the two command pages
    - **Property 16: Command pages carry followable steps (revised)**
    - For each of `lab-a` and `lab-c` **only**, at least one Markdown ordered list exists whose item
      count is between 3 and 15 inclusive and whose visible numbers run consecutively from 1
    - **Do not scope this to the six Lesson_Pages.** Requirement 12.3 now binds only "the pages
      lab-a and lab-c where a Reader executes commands" and exempts `lab-b`, `lab-d-reference`,
      `autonomy-modes`, and `gotchas` by name, because "a numbered list of things to read is a
      template artefact rather than guidance". The four exempt pages clear the Depth_Bar through
      their Embedded_Artifacts (`lab-b`, `lab-d-reference`) or their reasoning (`autonomy-modes`,
      `gotchas`), and the lists that remain on those pages are editorial
    - Keep the numbering conjunct: a list authored `1. 1. 1.` renders fine and reads wrongly, and a
      list that restarts mid-sequence is usually two lists that lost a blank line
    - Requirement 12.3's "observable result" clause is not asserted — a checker cannot tell a stated
      result from a restated action. That is one of Requirement 12.10's review judgments
    - **Validates: Requirements 12.3**

  - [x] 19.4 Implement Property 17, evaluated per page
    - **Property 17: A table or a screenshot never stands alone on a page (revised)**
    - For every Lesson_Page: if the page contains a Markdown table (a line of `|` cells followed by a
      delimiter row) or a `<Still` occurrence **anywhere on it**, then the page also contains at
      least one Embedded_Artifact or at least one ordered list of at least 3 items **anywhere on it**
    - **Evaluate per page, never per `##` section.** Requirement 12.6 states the scope change in its
      own text and gives the reason: a per-section rule forces a fenced block or a numbered list into
      every section that carries a table and reintroduces the boilerplate the revision removes. The
      earlier draft's note that this property "fails four of the six sections of `lab-b.mdx`" is
      retired along with the per-section reading
    - State the cost honestly in the implementation comment: the guarantee that a _particular_
      screenshot sits next to its evidence is gone. What is kept is the thing 12.6 was for — a page
      that is nothing but tables and screenshots still fails. Requirement 14.5's structural half is
      now implied only at page scope, which moves it further toward review
    - **Validates: Requirements 12.6, 14.5**

  - [x] 19.5 Implement Property 19 with the five-word heading vocabulary
    - **Property 19: Every lesson page names a gotcha (revised)**
    - For each of the six Lesson_Pages: either a heading exists whose text is one of `Gotcha`,
      `Gotchas`, `Known scars`, `What bites`, or `What goes wrong`, followed by at least one
      sentence, **or** a link exists whose target ends in an anchor fragment that is a member of the
      slugified heading set of `gotchas.mdx`
    - The five-item set is closed: `## Known problems` fails, and that is intentional. Do not accept
      only `## Gotcha` — six pages all ending `## Gotcha` was half of the identical-heading-sequence
      signature Requirement 12.15 and Property 31 now catch
    - Expected assignment after tasks 15 and 16: anchored links on `lab-a`
      (`#gator-failure-modes`), `lab-b` (`#the-pdb-scar-at-replicas-1`), and `lab-c`
      (`#placeholder-accounts-and-region`); `## What bites` on `lab-d-reference` and
      `autonomy-modes`; `## What goes wrong` on `gotchas`
    - Check fragment membership independent of the path form, so the relative-link convention is a
      readability choice rather than a checker dependency
    - This is a genuine cross-file property: a heading rename on the gotchas page silently dangles
      every inbound anchor and nothing else in the toolchain notices
    - **Validates: Requirements 12.5**

  - [x] 19.6 Implement Property 20
    - **Property 20: Gotchas entries are symptom, then cause, then fix**
    - For every `###` section of `gotchas.mdx`, the first three non-empty blocks of the section body
      begin with `**Symptom:**`, `**Cause:**`, and `**Fix:**`, in that order, with no other block
      between them
    - Entries are `###` sections by convention; group headings and the page's `## What goes wrong`
      element are `##` and therefore not entries
    - This is the one uniform template the revision deliberately keeps: Requirement 12.14 names
      Requirement 16.7's ordering as the gotchas page's structure of record, because a lookup surface
      is scanned rather than walked and scanning depends on every entry looking the same
    - **Validates: Requirements 16.7**

  - [x] 19.7 Implement Property 22
    - **Property 22: Live-cluster command blocks link the factory repo**
    - For every content page whose **fenced block contents** contain `argocd`, `kubectl`, or `curl`
      as a leading command word, assert the page links
      `https://github.com/jajera/kiro-eks-argocd-migration`
    - Scan fenced contents only, never prose, so `curl` does not fire on a passing mention
    - **Do not extend Property 9's five-token list.** Property 9 validates Requirements 9.12 and 10.6,
      which enumerate exactly five tokens; adding these three would make the checker enforce a rule
      no requirement states and make Property 9's traceability false. Two requirements, two token
      sets, two properties
    - **Validates: Requirements 18.8**

  - [x] 19.8 Implement Property 31
    - **Property 31: No two lesson pages share a heading sequence**
    - For all 15 unordered pairs of the six Lesson_Pages whose normalised `##` sequences both have
      length 3 or more, assert the two sequences are not equal. On a match, report a violation naming
      both page paths
    - Compare whole sequences: same length, same elements, same order. No subsequence matching, no
      set intersection, no similarity score. Two pages sharing one or two heading names are **not** a
      violation, and the authored layouts do that three times on purpose
    - The length-3 floor is a reading Requirement 12.15 does not state (design OQ12). No Lesson_Page
      has fewer than four level-2 headings under the specified layouts, so it is inert today; it
      exists so a future short page does not produce a false positive
    - Verify the six authored sequences match the design's table:

      | Page              | Normalised `##` sequence                                                                                                                                                                                                     | Len |
      | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --: |
      | `lab-a`           | run the offline suite / the constrainttemplate / the constraint / the gator suite / the failing case / reading a violation message / where the rest live                                                                     |   7 |
      | `lab-b`           | what the repository already decided / knowledge what the model is told before it starts / procedure what the model does in what order / refusal what cannot happen even if asked / the bundle one prompt activates all three |   5 |
      | `lab-c`           | the thin prompt / what add app generated / contract check / done and pr checks / takeaway                                                                                                                                    |   5 |
      | `lab-d-reference` | the visual checklist / frames not captured / reading the checklist / what bites                                                                                                                                              |   4 |
      | `autonomy-modes`  | what a supervised turn does / choosing a mode / both modes keep the gates / mode is not session type / what bites                                                                                                            |   5 |
      | `gotchas`         | how to triage a gator failure / version and placeholder scars / gator failure modes / what goes wrong                                                                                                                        |   4 |

    - **Validates: Requirements 12.15**

- [x] 20. Content checker: the narrative spine and vocabulary properties, and the opt-in fidelity mode
  - Implements design sections "Narrative Spine Mechanics", "Reader-Facing Vocabulary Mechanics",
    "Optional Maintainer Verification Mode", Properties 23-30, and Property 21
  - Sub-tasks 20.1-20.7 edit `scripts/check-content.mjs` and are serialised for that reason; 20.8
    writes a separate file and can run alongside 20.1

  - [x] 20.1 Implement Property 23
    - **Property 23: Sidebar labels obey the cap, the pin, and the slug set**
    - Three conjuncts over the sidebar array in `astro.config.mjs`: every `label` string is at most
      32 characters; the entry whose `slug` is `lab-d-reference` has the `label` exactly
      `Lab D (out of scope)`; and the set of `slug` values equals the ten slugs Requirement 2.6 names
    - Assert the cap over the whole array rather than over today's eleven entries — the next label
      added is the one that will exceed it, and `What makes prompts safe (Lab B)` already sits at 31
      with one character of headroom (design risk R11)
    - The pin is load-bearing for Property 10: without the parenthetical, "Lab D" in a label has no
      "out of scope" within 80 characters and Requirements 2.6 and 10.2 contradict each other
    - The slug-set conjunct is what stops a label rewrite from carrying a slug with it. Property 1
      alone would pass a coordinated rename that silently broke every inbound link and anchor
    - **Validates: Requirements 2.10, 2.11, 2.12**

  - [x] 20.2 Implement Property 24
    - **Property 24: The landing page states the problem before any mechanism**
    - Three conjuncts over the **full source** of `src/content/docs/index.mdx`, frontmatter included:
      the first occurrence of any Requirement 19.2 mechanism term — `steering`, `skill`, `hook`,
      `agent`, `MCP`, `Gatekeeper`, `gator`, `Kustomize`, `overlay`, matched case-insensitively with
      an optional plural `s` — is preceded by the first occurrence of the app count, the hour count,
      or the word `drift`; the `hero.tagline` value contains none of those terms; and all three of
      `100`, `450`, and `drift` appear somewhere on the page
    - The diagnostic must name **both indices it compared** (design risk R9): the check is sensitive
      to frontmatter key order, and a maintainer tidying frontmatter alphabetically is a realistic
      way to break it while leaving the visible page unchanged
    - Two limits to state rather than paper over: term matching is lexical, so "hooked on this idea"
      would false-positive — accepted, because the alternative is part-of-speech tagging in a
      zero-dependency checker. And Requirement 19.2's content half, that the page states re-deciding
      tree shape and drift no reviewer catches rather than merely containing the tokens, stays
      review-gated
    - **Validates: Requirements 19.2, 19.3, 19.4**

  - [x] 20.3 Implement Property 25
    - **Property 25: The landing page presents the labs as an ordered sequence**
    - Three conjuncts: the first occurrences of `Lab A`, `Lab B`, and `Lab C` appear in that source
      order; each one's enclosing block is an ordered-list item or carries an ordinal token from
      {`First`, `Second`, `Third`, `1.`, `2.`, `3.`}; and no `<Card>` element's `title` attribute
      names a lab without such an ordinal token
    - The third conjunct is vacuous today because Decision D17 removed the cards, and it is kept
      anyway: `<CardGrid>` is the obvious thing for a future author to reach for on a splash page,
      and Requirement 19.7 exists to catch exactly that
    - Whether the ordered list _reads_ as steps is Requirement 19.1's review judgment
    - **Validates: Requirements 19.6, 19.7**

  - [x] 20.4 Implement Properties 26 and 27
    - **Property 26: Every page but the first links the previous page.** For all eleven content pages
      except `index`, a line matching `/^Before this: \[[^\]]+\]\(([^)]+)\)\s+\S/` appears in the
      page source **before the first `##` heading**, and the captured target resolves to the slug of
      the immediately preceding page in Sidebar order
    - **Property 27: Every page but the last links the next page.** For all eleven content pages
      except `done`, a line matching `/^Next: \[[^\]]+\]\(([^)]+)\)\s+\S/m` appears **within the final
      500 characters** of the page source, and the captured target resolves to the slug of the
      immediately following page in Sidebar order
    - **Derive both expected targets from the ordered slug chain** built in task 18.1, never from
      hard-coded pairs. A sidebar reorder is the failure this catches, and it is the one file a
      maintainer edits when adding a page — the properties must report the pages either side of the
      move by name
    - Assert the **link target only**, never the link text. Coupling text to the Sidebar label would
      make a label edit cascade into ten pages and make Requirements 2.6 and 19.13 co-dependent for
      no gain
    - Also assert the 200-character line cap from Decision D18, which is what guarantees a whole
      `Next:` line falls inside Property 27's 500-character window rather than being bisected by it
    - Two properties rather than one bidirectional check: the page exemptions differ (`index` versus
      `done`) and the position rules differ (before the first `##` versus the last 500 characters), so
      one property would need two input spaces, two checks, and a traceability line naming two
      criteria that fail independently
    - **Validates: Requirements 19.13, 19.14**

  - [x] 20.5 Implement Property 28
    - **Property 28: The formula's three clauses appear on the six named pages**
    - For each of `index`, `why`, `lab-a`, `lab-b`, `lab-c`, and `done`, assert the source contains
      all three of `skills generate`, `hooks enforce`, and `humans approve`, matched
      case-insensitively
    - Which clause a page names, and whether it names one at all, is review-gated by Requirement
      19.15's own wording; the per-page assignment is tabled in task 16's preamble so a reviewer has
      a reference
    - Note the interaction with Property 24: on `index` the three clause strings contain `skills` and
      `hooks`, which are mechanism terms, so the formula must sit below the block carrying the
      numbers. Two properties over the same page, compatible only because the block order was
      designed for it
    - **Validates: Requirements 19.15, 19.16**

  - [x] 20.6 Implement Property 29
    - **Property 29: Reader prose carries no spec vocabulary**
    - Over the Reader-prose projection of all eleven pages and of `README.md`, plus all twenty-two
      frontmatter `title` and `description` values and all eleven sidebar `label` strings: no member
      of the 27-identifier set appears. Emit one violation per match naming the file, the line, and
      the identifier
    - The 27 identifiers are `Source_Factory`, `Docs_Site`, `Docs_Repo`, `Walkthrough_Source`,
      `Reference_Site`, `Product_Thesis`, `Build_Pipeline`, `Content_Author`, `Depth_Bar`,
      `Embedded_Artifact`, `Lesson_Page`, `Generated_Manifests`, `Archetype_Contract`,
      `Constraint_Template`, `Gator_Suite`, `Hook_Definition`, `Autonomy_Mode`, `Media_Provenance`,
      `Content_Checker`, `Gotchas_Page`, `Autonomy_Page`, `Lab_D_Reference`, `Deploy_Workflow`,
      `Linter_Workflow`, `Conform_Workflow`, `Validator`, and `Still` with its plural `Stills`
    - **Match exactly, case-sensitively, on word boundaries.** Case sensitivity matters in one place:
      `Still` and `Stills` are banned only when capitalised, so "the screenshot is still pending" is
      clean while "the Still is pending" is not. `Constraint_Template` is banned but
      `ConstraintTemplate` is not — the second is the real Gatekeeper kind and belongs on Lab A
    - The **single** exemption for text that renders to a Reader is the `:::note[Still pending]`
      admonition **title** (Requirement 20.7). The note body is not exempt
    - Removal steps come from task 18.1's projection and implement Requirement 20.6's exemption,
      which is what keeps this property compatible with Requirement 3.7's character-for-character
      quoting. Step 4 strips attribute _names_ only, so
      `caption="The Still showing gator PASS"` is a violation on its value
    - **Validates: Requirements 20.1, 20.2, 20.5, 20.6, 20.7, 20.9, 20.10, 20.12**

  - [x] 20.7 Implement Property 30
    - **Property 30: Rendered output carries no spec vocabulary**
    - Walk `dist/**/*.html`, extract text nodes, and match the same 27 identifiers; emit one
      violation per match naming the HTML file path. When `dist/` is absent, print a skip notice and
      pass — the same treatment Property 4 already gets (design OQ13)
    - **Exclude the text content of `<pre>` and `<code>` elements, and the rendered `Still pending`
      admonition title.** This is not an implementation shortcut: read literally, Requirement 20.8
      would report exactly the identifiers Requirement 20.6 exempts and make Requirement 3.7's
      character-for-character obligation unsatisfiable. Excluding code subtrees is the only reading
      under which 20.6, 20.7, and 20.8 cohere
    - Keep this separate from Property 29 rather than folding it in: the input spaces differ (source
      text versus rendered text), the precondition differs, and only this one catches an identifier
      that reaches rendered output without appearing in page source — a component default, a
      Starlight-generated label, or an `aria-label`
    - Record the known weakness rather than fixing it: a stale `dist/` gives this property a false
      pass (design risk R10). Run `npm run build` before `npm run check:content` when the vocabulary
      result matters
    - **Validates: Requirements 20.8**

  - [x] 20.8 Create `scripts/verify-artifacts.mjs`
    - **Property 21: Quoted artifacts match their source (opt-in)**
    - Zero-dependency Node ESM, read-only, no network, invoked as `npm run verify:artifacts`. The
      `package.json` script entry already landed in task 14.3
    - Resolution order: `SOURCE_FACTORY_PATH` if set, otherwise `../kiro-eks-argocd-migration`
      relative to this repo's root. Accept a path only if it is a directory containing `.kiro/` and
      `infrastructure/`, so a wrong-repo sibling reports "not a factory clone" rather than 16
      spurious missing-file errors
    - **Absence is not failure.** With no clone resolved, print a notice naming the path it looked
      for, saying that artifact fidelity verification is skipped and that Requirement 3.7 stays
      review-gated, and exit 0. This is the whole point of the mode: it must never fail a build for
      absence and never make the factory repo a build dependency (Requirement 7.1)
    - Per artifact: parse the Source declaration; read the declared file from the clone; if ranges are
      declared, drop the marker lines from the quoted block and compare each quoted segment to its
      declared source range; otherwise compare the whole block to the whole file. Exact comparison
      including trailing whitespace, only the final newline normalised
    - Output one line per mismatch as `ARTIFACT <page>:<line> <path> <ranges> <first differing line>`
      plus a unified diff of the offending segment. Exit 1 on any mismatch, 0 otherwise. Print the
      count line `verified N of N artifacts` so a maintainer reads the count, not the exit code — a
      skipped run is not a pass
    - **Wired into nothing**: not `validate` (Requirement 1.5 pins that string character-for-character
      and nothing may be appended), not `test`, not `build`, not `deploy.yml`, not either PR caller,
      and not Requirement 12.8's three-command list. `check:content` and `verify:artifacts` are
      siblings of `validate`, never appendages
    - **Validates: Requirements 3.7, 12.10**

- [x] 21. Final verification of the narrative revision

  - [x] 21.1 Run the full local gate and fix anything it reports
    - `npm run validate` exits 0 with no error output
    - `npm run check:content` exits 0, emits no `PROPERTY` lines, and prints all four informational
      count lines (`vendored 19 of 19 named Stills`, `16 declared Embedded_Artifacts`,
      `spine thread: 10 previous links, 10 next links, chain intact`, and
      `vocabulary: 0 matches in 11 pages, README, and 11 labels`)
    - `npm run build` exits 0, produces `dist/`, emits no error diagnostics, and resolves all ten
      sidebar slugs. Run it **before** `check:content` so Property 30 scans current HTML rather than
      a stale `dist/` (design risk R10)
    - **Confirm the emitted-number set is `{1..12, 14..20, 22..31}`.** Thirteen is format idempotence
      (verified by running `format` twice) and twenty-one is `verify:artifacts`, so neither is ever
      emitted by `check:content`. Property 12 keeps its number with its restated meaning rather than
      leaving a hole
    - Confirm no property asserts that a tradeoff exists, and that no `## Tradeoff` heading was
      re-added to any page to make a check pass (Requirements 12.4, 12.13; OQ10)
    - Confirm the `validate` script string is still byte-identical to Requirement 1.5, with
      `check:content` and `verify:artifacts` as siblings rather than appendages
    - Confirm the boundary still holds: no `apps/`, `bootstrap/`, `clusters/`, `policies/`, or
      `infrastructure/` at the root, and no path anywhere containing `apps/demo-nginx`
    - _Requirements: 12.8, 1.5, 2.7, 3.6, 4.6, 10.1, 10.3, 15.8, 12.13_

  - [x] 21.2 Run the opt-in fidelity mode both ways
    - With a clone present
      (`SOURCE_FACTORY_PATH=/home/johna/workspace/jajera/kiro-eks-argocd-migration`),
      `npm run verify:artifacts` exits 0 and reports `verified 16 of 16 artifacts`
    - With `SOURCE_FACTORY_PATH` pointed at a non-existent path, it prints the skip notice and exits
      0 without verifying anything
    - Fix any reported mismatch by re-quoting from the working tree, never by editing the expected
      value
    - **Validates: Requirements 3.7, 12.10**

  - [x] 21.3 Re-verify format idempotence with fenced artifacts present
    - **Property 13: Formatting is idempotent and leaves the Validator green**
    - Run `npm run format`, capture the tree state, run it again, assert no diff, then assert
      `npm run validate` exits 0. Then assert `npm run verify:artifacts` still reports
      `verified 16 of 16 artifacts` — this is the check that proves Decision D13's
      `embeddedLanguageFormatting: "off"` is doing its job and prettier has not silently re-indented
      an elision marker
    - **Validates: Requirements 4.5, 4.6, 3.7**

  - [x] 21.4 Spot-check the narrative surfaces a property cannot judge
    - Confirm every sidebar label matches Requirement 2.6 exactly and that none exceeds 32
      characters, with `Lab D (out of scope)` unchanged
    - Confirm the eleven frontmatter titles match task 16's table exactly
    - Confirm the six Lesson_Page heading sequences match task 19.8's table, so Property 31 is
      passing on the intended layouts rather than on an accident
    - Confirm the landing page's twelve blocks are in the specified source order and that the
      `Card` / `CardGrid` import is gone
    - Confirm each of the six formula pages names which clause it is proving, per task 16's
      assignment. Requirement 19.15's which-clause half and Requirements 19.1 and 19.17 are
      review-gated by their own text — this sub-task is where that review has something to check
      against
    - _Requirements: 2.6, 2.12, 2.13, 19.1, 19.15, 19.17, 12.15_

- [x] 22. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP.
- Property checks 3, 4, and 5 (tasks 8.2-8.4) are **not** marked optional even though they are
  verification code: the design's Error Handling table shows `check:content` is the _only_
  detector for Requirements 7.3, 7.4, and 7.7. Skipping them would leave those requirements with
  no mechanism at all. The remaining property checks have either a second detector
  (`astro build`, `docsSchema()`) or a review path, so they carry `*`.
- No property-based testing library is introduced. The properties quantify over the checked-in
  corpus — eleven pages, nineteen screenshot names, sixteen quoted artifacts, six gotchas entries,
  two PR workflows — and `scripts/check-content.mjs` enumerates it exhaustively, which is stronger
  than random sampling (Testing Strategy, Decision D6).
- `check:content` is deliberately not wired into CI because Requirement 1.5 pins the `validate`
  string and Requirements 5 and 6 fix the workflow set at three callers. Twenty-seven of the
  thirty-one properties are local-only, and all nine added by the narrative revision are in that
  group — this revision moved the site's most editorially important invariants into checks no
  required status check runs. That gap is Open Question OQ3 and closing it needs a requirements
  change, not a task here.
- Slideshow (`slideshow.html`) is deferred (Decision D8 / OQ4). Do not add a sidebar entry or an
  unlinked public HTML copy in this plan.

### Notes for tasks 14-22

- **Task 14 is already complete.** The `.kiro/settings` Property 11 allow-list entry, the
  `.gitignore` line, `embeddedLanguageFormatting: "off"` in `.prettierrc`, and the
  `verify:artifacts` script entry are on disk and `prettier --check .` is green. It stays first in
  the sequence and keeps its `[x]`; nothing in the narrative revision changes what it did.
- **No checker sub-task is optional.** Requirements 12.9, 15.9, 19.4, 19.7, 19.16, 20.5, and 20.9
  mandate Content_Checker behaviour by name, and the design's Error Handling table shows
  `check:content` is the only detector for Requirements 12.2-12.7, 12.11, 12.13, 12.15, 16.7,
  19.3-19.4, 19.6-19.7, 19.13-19.14, 19.16, and 20.8. These are the implementation of those
  criteria, not tests of something else.
- **Ordering is content-first, and task 17 is where the cost shows.** The shipped checker asserts
  `/^## Tradeoff\s*$/m` on the three lab pages, and the revised checker fails the shipped content
  on Properties 24-29. `main` cannot be green in both directions, so the plan takes the direction
  where the intermediate failure is three known Property 12 lines rather than seventeen
  unimplemented properties (design risk R8). No checkpoint sits between a checker change and the
  content that satisfies it.
- **One check is deleted with nothing substituted.** Task 18.6 removes the `## Tradeoff` presence
  assertion and **no property asserts that a tradeoff exists any more**. That is Requirement
  12.12's review judgment and design OQ10's recorded risk, written into the task so nobody re-adds
  the check believing it was an oversight.
- **Two atomic changes to preserve.** Task 15.2 lands the `lab-d-reference` page, its
  `Lab D (out of scope)` sidebar label, and the Property 10 revision together, because the shipped
  Property 10 bans the label Requirement 2.6 mandates and Requirement 2.11 pins. Task 20.7's
  Property 30 must exclude `<pre>` and `<code>` text nodes in the same edit that adds it, or it
  contradicts Requirement 20.6 and makes Requirement 3.7 unsatisfiable.
- **The factory working tree is outside this workspace.** Read it with `execute_bash` and `sed -n`
  / `cat`, never with `read_file`, and never over the network — the public tree 404s `docs/`.
- **Excerpt ranges are design output, not implementer judgement.** `httpsonly.yaml`
  `1-4,15-19,35-71`; `networkpolicy.yaml` `1-36,55-72`; `workload-archetypes.md` `1-4,11-13,19-20`
  and `44-46,60-76`; Walkthrough Lab D commands `400-404` with its checklist table at `390-397`.
  JSON is always quoted whole (14 and 10 lines) because JSON has no comment syntax and therefore no
  legal elision marker. `deployment.yaml` is 56 lines against the 60-line cap, four lines of
  headroom (design risk R5).
- **Property numbering is frozen and hole-free.** Property 13 is format idempotence, not a spare
  slot, which is why the Depth_Bar properties start at 15. Property 12 keeps its number with a new
  meaning rather than being deleted. `check:content` emits `{1..12, 14..20, 22..31}`; 13 comes from
  running `format` twice and 21 from `verify:artifacts`.
- **`verify:artifacts` is never a gate.** Requirement 1.5 pins the `validate` string character-for-
  character, Requirement 12.8 names only `validate`, `check:content`, and `build`, and the mode
  needs a clone CI does not have. It skips with a printed notice and exits 0 when no clone resolves
  (Decision D11, OQ9).
- **Two fragile surfaces worth naming.** Requirement 19.4 is a source-order check, so the landing
  page's frontmatter key order is load-bearing and a maintainer tidying it alphabetically breaks
  Property 24 while leaving the rendered page unchanged (design risk R9). And
  `What makes prompts safe (Lab B)` is 31 characters against a 32-character cap, so that label is
  effectively frozen unless the claim gets shorter (design risk R11).

### Review-gated in tasks 14-22, not automated

Added to the existing review list, from Requirements 12.10, 12.12, 19.1, 19.17, 20.3, and 20.4:

- Whether each quoted artifact matches its named factory file character-for-character **in CI**
  (Requirements 3.7, 12.10) — assisted locally by `npm run verify:artifacts` only.
- Whether a stated observable result matches what the named command actually prints
  (Requirement 12.10).
- **Whether each Lesson_Page carries a tradeoff at all**, and whether it names a real alternative
  and a real cost rather than restating the choice (Requirements 12.4, 12.12). Nothing detects a
  page that simply has no tradeoff; Property 12 only checks that a heading, where one is used,
  comes from a four-word vocabulary. OQ10.
- Whether each page reads as one stage of the argument rather than a standalone module
  (Requirement 12.12).
- Whether the site's argument is continuous in Sidebar order, and whether each title and label
  asserts a claim rather than naming a topic (Requirements 19.1, 19.17). Only the exact label
  strings are machine-pinned, by Property 23. OQ11.
- Whether a spine claim, once stated, is then earned by the page (Requirements 19.8-19.12), and
  whether each formula occurrence names the clause the page is proving rather than sitting there as
  a slogan (Requirement 19.15).
- Whether the replacement for a removed identifier is the intended wording (Requirements 20.3,
  20.4). Property 29 proves the identifier is gone, not that "the factory repo" took its place.
- Whether a specific table is anchored to a specific artifact (Requirement 14.5) — more so than
  before, because Property 17 now implies the pairing only at page scope.
- Whether the gotchas skew entry stays inside three sentences plus one link (Requirement 16.3).
- Whether every gotchas entry needing file inspection carries its own factory-repo link
  (Requirement 16.8) — Property 9 proves only that the page carries the URL.
- Whether a fence quoting real factory content but carrying no Source line is an artifact that lost
  its declaration or an illustrative snippet (Requirements 3.7, 12.2).

### External dependencies (do not block the build)

- **Primary path:** Task 5.1 and task 6 adapt and vendor from the local walkthrough. Expect
  `19 of 19` screenshots and the verbatim scale table and `demo-nginx` prompt without placeholders.
- **Degraded path:** Only if the local `docs/` tree is missing — then pending-screenshot notes and
  `:::note[Verbatim source pending]` blocks apply. Recovery is mechanical.
- **OQ1 residual:** Reader-facing links to `docs/Walkthrough.md` in the factory repo will 404 until
  that tree is pushed to `origin/main`. Two pages now depend on it (`lab-d-reference` and
  `lab-c`'s prompt provenance). That is a factory-repo concern, not a build dependency here. Flag
  it at the final checkpoint; do not invent a remote docs URL that does not exist yet.
- **OQ2 / D10:** Keep the factory-repo URL as one constant spelling so a future rename is one edit.

### Review-gated, not automated

These are not tasks, because no coding agent can settle them. They belong on the PR review
checklist (Testing Strategy, "Explicitly not tested automatically"):

- Whether narrative content faithfully adapts the walkthrough (Requirement 3.3).
- Whether each screenshot is real rather than fabricated or montaged (Requirement 7.6).
- Whether the README's "is / is not" rows are meaningful (Requirement 8.2).
- Whether commits and PR bodies are free of AI attribution footers (Requirement 10.5).
- Whether any Reference_Site IPAM/Terraform subject matter leaked in (Requirement 10.7).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4"] },
    { "id": 4, "tasks": ["4.1", "5.1"] },
    {
      "id": 5,
      "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "6.8"]
    },
    { "id": 6, "tasks": ["8.1", "10.1", "10.2", "10.3", "11.1"] },
    { "id": 7, "tasks": ["8.2"] },
    { "id": 8, "tasks": ["8.3"] },
    { "id": 9, "tasks": ["8.4"] },
    { "id": 10, "tasks": ["8.5"] },
    { "id": 11, "tasks": ["8.6"] },
    { "id": 12, "tasks": ["9.1"] },
    { "id": 13, "tasks": ["9.2"] },
    { "id": 14, "tasks": ["9.3"] },
    { "id": 15, "tasks": ["9.4"] },
    { "id": 16, "tasks": ["9.5"] },
    { "id": 17, "tasks": ["9.6"] },
    { "id": 18, "tasks": ["9.7"] },
    { "id": 19, "tasks": ["9.8"] },
    { "id": 20, "tasks": ["12.1"] },
    { "id": 21, "tasks": ["12.2"] },
    { "id": 22, "tasks": ["14.1", "14.2", "14.3"] },
    { "id": 23, "tasks": ["15.1"] },
    { "id": 24, "tasks": ["15.2"] },
    { "id": 25, "tasks": ["15.3"] },
    { "id": 26, "tasks": ["15.4"] },
    {
      "id": 27,
      "tasks": [
        "16.1",
        "16.2",
        "16.3",
        "16.4",
        "16.5",
        "16.6",
        "16.7",
        "16.8",
        "16.9"
      ]
    },
    { "id": 28, "tasks": ["18.1", "20.8"] },
    { "id": 29, "tasks": ["18.2"] },
    { "id": 30, "tasks": ["18.3"] },
    { "id": 31, "tasks": ["18.4"] },
    { "id": 32, "tasks": ["18.5"] },
    { "id": 33, "tasks": ["18.6"] },
    { "id": 34, "tasks": ["19.1"] },
    { "id": 35, "tasks": ["19.2"] },
    { "id": 36, "tasks": ["19.3"] },
    { "id": 37, "tasks": ["19.4"] },
    { "id": 38, "tasks": ["19.5"] },
    { "id": 39, "tasks": ["19.6"] },
    { "id": 40, "tasks": ["19.7"] },
    { "id": 41, "tasks": ["19.8"] },
    { "id": 42, "tasks": ["20.1"] },
    { "id": 43, "tasks": ["20.2"] },
    { "id": 44, "tasks": ["20.3"] },
    { "id": 45, "tasks": ["20.4"] },
    { "id": 46, "tasks": ["20.5"] },
    { "id": 47, "tasks": ["20.6"] },
    { "id": 48, "tasks": ["20.7"] },
    { "id": 49, "tasks": ["21.1"] },
    { "id": 50, "tasks": ["21.2"] },
    { "id": 51, "tasks": ["21.3"] },
    { "id": 52, "tasks": ["21.4"] }
  ]
}
```

Waves 23-52 cover the narrative revision. Sequencing the wave numbers encode: 15.1-15.4 are
serialised because each edits `astro.config.mjs`; 16.1-16.9 run in parallel because each writes a
different file; 18.x, 19.x, and 20.1-20.7 are serialised because they all edit
`scripts/check-content.mjs`; and 20.8 rides along with 18.1 because `scripts/verify-artifacts.mjs`
is a separate file. Content waves (23-27) come before checker waves (28-48) so the only
intermediate red check is the one task 17 names.
