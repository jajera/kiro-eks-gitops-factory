# Requirements Document

## Introduction

Build a new Astro + Starlight documentation site in repository `kiro-eks-gitops-factory`
that walks readers through the EKS / Argo CD / Kiro GitOps factory. The site publishes
to GitHub Pages at `jajera.github.io/kiro-eks-gitops-factory` and covers Labs A–C (plus
Lab D reference, Autonomy modes, Vibe vs Spec, Gotchas, and Done) adapted from the
upstream Source_Factory walkthrough and from the factory artifacts themselves.

This repository is documentation only. Readers clone and run factory commands against
the Source_Factory (`jajera/kiro-eks-argocd-migration`). The Docs_Site must not own
cluster state or be where workloads are applied — the same separation as the IPAM
walkthrough versus `tfstack/terraform-aws-ipam`.

Structural and quality template (site architecture, DX, editorial bar — not IPAM
content): `jajera/amazon-vpc-ipam-multi-account-walkthrough`.

Product thesis (keep front and center): manual GitOps onboarding does not scale
(~100 apps). Factory + Kiro removes re-deciding tree shape and silent drift. It does
**not** remove workload understanding, IAM shrink, DNS/TLS, or cutover risk. Formula:
**skills generate → hooks enforce → humans approve.**

### Scope expansion (approved after the first release)

The first release shipped 8 pages that recap **what exists**. Review found that a
recap plus a config screenshot does not teach a Reader **how to implement**. The
Depth_Bar below is now the editorial gate, and it closes two distinct gaps:

- **Parity gap**: sections present in Walkthrough_Source but absent or compressed on
  the Docs_Site (steering table with inclusion modes, four-skill table, eight hooks in
  three categories, agent JSON, four MCP servers, specs structure, autonomy modes,
  media provenance, the full Vibe-vs-Spec composition pattern).
- **Depth gap**: implementation detail that _neither_ the Docs_Site nor
  Walkthrough_Source currently carries. Walkthrough_Source is a visual tour by design
  and contains no Rego, no gator suite YAML, no hook JSON, and no generated manifest.
  Porting it verbatim therefore does not clear the Depth_Bar on its own.

Both gaps are in scope. Requirements 1–10 remain in force except where explicitly
revised: 2.6 (sidebar now lists the new pages), 9.7 (Done checklist stays Labs A–C),
9.9 (sentence cap excludes fenced code and admonitions), 9.11 (tradeoffs extend to the
new lesson pages), and 10.2 (Lab D reference material permitted; Lab D still not a
runnable lab here). New criteria are appended within Requirements 2, 3, and 9, and new
Requirements 11–18 are appended, so existing design and task traceability is preserved.

### Narrative revision (approved after review of the eight shipped pages)

Review of the shipped site found four defects that more depth would have made worse, not
better:

- **Mechanism before problem.** The landing page hero led with "thin Kiro prompts, hard
  guardrails, and no chat-side cluster apply" — every noun answering a question the Reader
  had not been asked. The hook (~100 apps, ~450 hours manual, drift nobody catches) sat
  below the fold in body text.
- **Spec vocabulary in Reader prose.** `Source_Factory` rendered literally, underscore and
  all, 11 times across 8 pages. Glossary identifiers are internal terms of this document,
  not Reader language.
- **A table of contents instead of a story.** Six equal-weight landing cards implied six
  independent modules doable in any order, when Lab A → Lab B → Lab C is one continuous
  argument.
- **Structural page titles.** "Lab B — Config map" names a topic and asserts nothing, when
  what the page actually proves is that a one-paragraph prompt is safe.

The correction resolves the tension in favour of the story without giving up depth.
Retained as hard requirements: Embedded_Artifacts quoted character-for-character from named
Source_Factory paths (3.7, 12.2, 12.7, 12.11), architecture decisions stated with
reasoning, honest tradeoffs and gotchas, and followable steps wherever a Reader actually
runs something. Dropped: the mandate that every lesson page carry identically named
sections in the same order, and the mandate that a tradeoff be expressed as three literal
labels. The first scope expansion optimised for machine-checkable depth and paid for it in
mandated boilerplate — a uniform module template stamped six times is the mechanism by
which the "just talk tutorial" feel would have returned at greater length.

Where a rigid form is dropped, the obligation is either restated so a machine check still
applies (a small allowed vocabulary of forms rather than one exact string), or explicitly
reclassified as review-gated and labelled as such in the criterion, per 12.10's standing
rule that this document must not claim enforcement it does not have.

This revision touches: 2.6 (sidebar labels and titles now carry claims; slugs unchanged),
12.1, 12.3, 12.4, 12.5, 12.6 (uniform per-page and per-section templates relaxed), and
appends Requirements 19 (Narrative_Spine) and 20 (Reader-facing vocabulary). Requirements
1.5, 3.7, 9.9, 10.1, 10.3–10.7, 11, 13, 14, 15, 16, 17, and 18 are unchanged and stay in
force: only the packaging changes, not the content.

## Glossary

Every identifier defined below is **internal vocabulary for this document and the design and
tasks that trace to it**. Glossary identifiers are not Reader language: they must not appear
in rendered page content, frontmatter, or Sidebar labels. Requirement 20 defines the banned
Spec_Vocabulary set, the Reader_Prose scope it applies to, and the machine check that
enforces it.

- **Docs_Site**: The Astro + Starlight static documentation site produced by this project
- **Docs_Repo**: The GitHub repository `jajera/kiro-eks-gitops-factory` that hosts the Docs_Site
- **Build_Pipeline**: The npm scripts and GitHub Actions workflows that validate, build, and deploy the Docs_Site
- **Content_Author**: A contributor who writes or edits Markdown/MDX documentation pages
- **Reader**: A person consuming the published documentation site in a browser
- **Source_Factory**: The upstream factory repository (`jajera/kiro-eks-argocd-migration`) that owns `.kiro/`, GitOps trees, Gatekeeper/gator, CI, and the draft `docs/Walkthrough.md` plus stills. If that repo is later renamed to `kiro-eks-gitops-factory`, all Docs_Site links SHALL be updated; until then `jajera/kiro-eks-argocd-migration` is canonical
- **Walkthrough_Source**: `docs/Walkthrough.md` and `docs/media/walkthrough/` in the Source_Factory
- **Reference_Site**: `jajera/amazon-vpc-ipam-multi-account-walkthrough` — structural/quality template for Astro + Starlight layout, README pattern, Pages deploy, and PR hygiene
- **Sidebar**: The Starlight navigation structure defining page ordering and grouping
- **Still**: A PNG walkthrough screenshot vendored from Walkthrough_Source into `public/`
- **Validator**: The combination of prettier and markdownlint-cli2 invoked via `npm run validate`
- **Deploy_Workflow**: The GitHub Actions workflow that builds and publishes the Docs_Site to GitHub Pages
- **Linter_Workflow**: The GitHub Actions workflow that checks Markdown lint on pull requests
- **Conform_Workflow**: The GitHub Actions workflow that checks commit message format on pull requests
- **Product_Thesis**: The human-first framing that factory + Kiro scale onboarding without removing human judgment on IAM, DNS/TLS, and cutover risk; vibe coding still yields compliant dual-overlay apps because steering/skills/hooks/agent are the guardrails
- **Lesson_Page**: One of the six pages that must clear the Depth_Bar (lab-a, lab-b, lab-c, lab-d-reference, autonomy-modes, gotchas)
- **Depth_Bar**: The editorial acceptance gate for every lesson page. A page clears the Depth_Bar when it contains at least one Embedded_Artifact (or a link to the Source_Factory file it would otherwise quote), an architecture decision stated with its reasoning, a named tradeoff or gotcha, and — WHERE the page asks a Reader to execute a command — ordered steps the Reader can follow. The Depth_Bar does not require any page to carry a section with a particular heading, and does not require the same elements in the same order on every page; Requirement 12 fixes which parts are machine-checked and which are review-gated. A page consisting only of restated facts, tables, and screenshots does not clear the Depth_Bar
- **Narrative_Spine**: The single continuous argument the Docs_Site makes, latent in Walkthrough_Source and canonical for this project, in five moves: (1) roughly 100 apps must be onboarded, manual cost is approximately 450 hours, and the real cost is re-deciding tree shape per app plus drift nobody catches; (2) prompting a model harder does not fix that, because a bare model invents a different tree per app and will apply changes to a live cluster; (3) so the decisions move into the repository — steering supplies knowledge, skills order procedure, hooks refuse what must not happen, and the agent bundles them so a thin prompt activates the whole stack; (4) the claim is proved in three moves — policy passes before any cluster exists, the configuration is what makes a thin prompt safe, and a thin prompt produces a compliant dual-overlay app; (5) humans still merge, and that is the design rather than a shortfall
- **Spec_Vocabulary**: The set of Glossary identifiers banned from Reader_Prose, enumerated in Requirement 20.1
- **Reader_Prose**: The text a Reader sees rendered, comprising every `dist/` HTML text node plus every Sidebar `label` string and frontmatter `title` and `description` value, and equivalently the source of each page under `src/content/docs/` after removing fenced code blocks, inline code spans, JSX component names, and JSX attribute names
- **Embedded_Artifact**: A fenced code block on a Docs_Site page whose content is copied character-for-character from a named Source_Factory file path, with that path stated on the page adjacent to the block
- **Constraint_Template**: A Gatekeeper `ConstraintTemplate` YAML document under Source_Factory `infrastructure/gatekeeper/constraint-templates/`, carrying the Rego `violation` rule
- **Constraint**: A Gatekeeper constraint instance under Source_Factory `infrastructure/gatekeeper/constraints/<name>/constraint.yaml` that binds a Constraint_Template to a match scope and parameters
- **Gator_Suite**: A `suite.yaml` under Source_Factory `infrastructure/gatekeeper/tests/<name>/` plus its sibling case files, executed by `gator verify`
- **Hook_Definition**: A `*.kiro.hook` JSON file under Source_Factory `.kiro/hooks/`
- **Generated_Manifests**: The Kustomize base and overlay YAML that the `add-app` skill produced for `demo-nginx` during the Lab C recording, quoted on a lesson page as teaching material only
- **Archetype_Contract**: The `web-service` requirements defined in Source_Factory `.kiro/steering/workload-archetypes.md` (probes, Ingress, NetworkPolicy, PDB validity, placeholder digest, dual overlay)
- **Autonomy_Mode**: One of Kiro's two session execution modes — Autopilot (applies edits and yields at the end) or Supervised (yields for hunk-level approval after each file-editing turn)
- **Gotchas_Page**: The Docs_Site troubleshooting page at slug `gotchas` collecting version skew, scars, placeholders, and failure modes
- **Autonomy_Page**: The Docs_Site page at slug `autonomy-modes` covering Autopilot versus Supervised
- **Lab_D_Reference**: The Docs_Site page at slug `lab-d-reference` that shows what the live path looks like as reference material, while Lab D remains out of scope as a runnable lab
- **Media_Provenance**: The mapping from each Still frame group to the Source_Factory capture script or recording that produced it
- **Content_Checker**: `scripts/check-content.mjs`, the zero-dependency content invariant checker invoked by the Build_Pipeline

## Requirements

### Requirement 1: Project Scaffold

**User Story:** As a Content_Author, I want a working Astro + Starlight project scaffold matching the Reference_Site pattern, so that I can write and ship documentation with the same DX.

#### Acceptance Criteria

1. THE Docs_Site SHALL use Astro version 7.x and @astrojs/starlight version 0.41.x as production dependencies (Astro >= 7.1.0 required for published XSS advisories)
2. THE Docs_Site SHALL include starlight-base-path and starlight-theme-vintage as Starlight plugin dependencies in package.json
3. THE Docs_Site SHALL define the site URL as `https://jajera.github.io` and the base path as `/kiro-eks-gitops-factory/` in astro.config.mjs
4. THE Docs_Site SHALL include a package.json with scripts: `dev` (`astro dev`), `build` (`astro build`), `preview` (`astro preview`), `validate` (prettier then markdownlint-cli2), `test` (`npm run build`), `format` (`prettier --write .`), and `lint` (`markdownlint-cli2 "src/**/*.mdx"`)
5. THE Docs_Site SHALL define the validate script as `prettier --check . && markdownlint-cli2 "src/**/*.mdx"` executing prettier first and markdownlint-cli2 second in sequence, matching the Reference_Site pattern
6. THE Docs_Site SHALL use `npm run build` as the test script
7. THE Docs_Site SHALL include a tsconfig.json extending the `astro/tsconfigs/strict` preset
8. THE Docs_Site SHALL include an .nvmrc file containing the string `22` (aligned with the Deploy_Workflow Node version)
9. THE Docs_Site SHALL include a .gitignore file excluding node_modules, dist, and .astro directories
10. THE Docs_Repo SHALL include an MIT LICENSE file at the repository root
11. WHEN a Content_Author runs `npm install` followed by `npm run build`, THE Docs_Site SHALL complete both commands with a zero exit code

### Requirement 2: Astro Configuration

**User Story:** As a Content_Author, I want the Astro configuration to match the Reference_Site patterns, so that the site builds and deploys consistently.

#### Acceptance Criteria

1. THE Docs_Site SHALL configure astro.config.mjs with a title of "EKS GitOps Factory"
2. THE Docs_Site SHALL configure a favicon at `public/favicon.svg`, a site description of 120 characters or fewer summarizing the EKS GitOps factory purpose (plain ASCII), and head meta entries for og:title and og:description derived from the configured title and description
3. THE Docs_Site SHALL enable Starlight plugins starlight-theme-vintage and starlight-base-path
4. THE Docs_Site SHALL configure a social link of type "github" pointing to `https://github.com/jajera/kiro-eks-gitops-factory` (Docs_Repo), matching the Reference_Site pattern of linking the docs repository
5. THE Docs_Site SHALL configure an editLink with the base URL `https://github.com/jajera/kiro-eks-gitops-factory/edit/main/`
6. THE Docs_Site SHALL define an explicit sidebar with a Home link to `/` followed by items in this order, where each label states the claim its page proves rather than the topic the page covers: "Why manual onboarding breaks" (slug: why), "Building blocks you will touch" (slug: concepts), "Install the toolchain" (slug: setup), "Prove policy offline (Lab A)" (slug: lab-a), then a nested group "What makes prompts safe" containing "Lab B — .kiro/ hub" (slug: lab-b), "Project profile map" (slug: map-project-profile), and "Workload archetypes map" (slug: map-workload-archetypes), then "Onboard an app (Lab C)" (slug: lab-c), "Lab D (out of scope)" (slug: lab-d-reference), "Choose an autonomy mode" (slug: autonomy-modes), "Vibe or spec, and when" (slug: vibe-vs-spec), "Known scars and fixes" (slug: gotchas), "Evidence checklist" (slug: done)
7. WHEN a Content_Author runs `npm run build`, THE Build_Pipeline SHALL produce a successful build with the configured title, sidebar, and metadata rendered in the output
8. THE Docs_Site SHALL keep the set of sidebar slugs exactly equal to the set of page basenames under `src/content/docs/` excluding `index`, so that the Content_Checker set-equality property holds
9. WHEN a Content_Author adds a page under `src/content/docs/`, THE Content_Author SHALL add the matching sidebar entry in astro.config.mjs in the same change, because the Content_Checker fails the build for an orphan page or a sidebar slug without a page
10. THE Docs_Site SHALL keep every slug named in Requirement 2.6 exactly as spelled there while Requirement 2.6 label strings change, because the Content_Checker asserts set equality between Sidebar slugs and page basenames and any slug rename breaks the build
11. THE Docs_Site SHALL keep the `lab-d-reference` Sidebar label as the string `Lab D (out of scope)`, so that the substring "out of scope" stays within 80 characters of the substring "Lab D" and the Content_Checker Lab D property and Requirement 18.1 both continue to hold
12. THE Docs_Site SHALL keep every Sidebar label at 32 characters or fewer, so that labels render on one line in the Starlight sidebar at its default width
13. THE Docs_Site SHALL allow each page's frontmatter `title` to differ from and exceed the length of its Sidebar label, where the frontmatter `title` states the page's claim explicitly and the Sidebar label states the same claim in abbreviated form

### Requirement 3: Content Structure and Source Adaptation

**User Story:** As a Content_Author, I want Starlight pages mapped from Walkthrough_Source, so that navigation improves without rewriting factory facts.

#### Acceptance Criteria

1. THE Docs_Site SHALL create a `src/content/docs/` directory containing an index.mdx landing page with frontmatter containing title and description fields
2. THE Docs_Site SHALL create content pages (or clear Sidebar sections) covering: why, setup, lab-a, lab-b, lab-c, vibe-vs-spec, and done
3. THE Docs_Site SHALL adapt narrative content from Source_Factory `docs/Walkthrough.md` rather than inventing new factory facts; WHEN a Still or claim is uncertain, THE page SHALL link to the Source_Factory file path instead of inventing content
4. THE landing page SHALL state the Product_Thesis and link Readers to the Source_Factory for clone/run operations
5. THE Docs_Site MAY include an optional bonus page for the Walkthrough_Source slideshow (`slideshow.html`) if it remains useful after migration
6. WHEN a Content_Author runs `npm run build`, THE Build_Pipeline SHALL exit with code 0 and produce output in the dist directory without emitting any error diagnostics
7. WHERE a page contains an Embedded_Artifact, THE page SHALL reproduce the block content character-for-character from the named Source_Factory file path and SHALL state that path adjacent to the block; paraphrased, reconstructed, or invented YAML, Rego, JSON, or Markdown is prohibited
8. IF a Content_Author cannot read the Source_Factory file that an Embedded_Artifact would quote, THEN THE page SHALL link the Source_Factory file path instead of showing a code block
9. THE Docs_Site SHALL create content pages covering the slugs added by the scope expansion: lab-d-reference, autonomy-modes, and gotchas, each with frontmatter containing non-empty title and description fields

### Requirement 4: Formatting and Lint Configuration

**User Story:** As a Content_Author, I want consistent formatting and lint rules, so that all documentation follows the same style.

#### Acceptance Criteria

1. THE Docs_Site SHALL include a .prettierrc configuration file defining formatting rules for the project (semi true, double quotes, tabWidth 2, trailingComma all — matching the Reference_Site)
2. THE Docs_Site SHALL include a .prettierignore file excluding dist, node_modules, and pnpm-lock.yaml
3. THE Docs_Site SHALL include a .markdownlint.json configuration with default rules enabled and MD013, MD033, and MD041 disabled
4. WHEN a Content_Author runs `npm run validate`, THE Validator SHALL check project files for formatting violations via prettier and MDX files under src for lint violations via markdownlint-cli2, and SHALL exit with a non-zero exit code if any violation is found
5. WHEN a Content_Author runs `npm run format`, THE Validator SHALL auto-fix formatting issues via prettier --write .
6. IF a Content_Author runs `npm run validate` and all checked files conform to the prettier and markdownlint configurations, THEN THE Validator SHALL exit with a zero exit code and produce no error output

### Requirement 5: GitHub Actions Deploy Workflow

**User Story:** As a Content_Author, I want automatic deployment to GitHub Pages on push to main, so that published docs stay current.

#### Acceptance Criteria

1. THE Deploy_Workflow SHALL be defined in `.github/workflows/deploy.yml` and trigger on pushes to the main branch and on workflow_dispatch events
2. THE Deploy_Workflow SHALL use the `actionsforge/actions/.github/workflows/astro-pages-deploy.yml@main` reusable workflow
3. THE Deploy_Workflow SHALL specify Node version 22 via the `node-version` input
4. THE Deploy_Workflow SHALL pass `npm run validate` as the validate-command input and `npm run test` as the test-command input to the reusable workflow
5. THE Deploy_Workflow SHALL declare concurrency group `pages` with `cancel-in-progress: false` and permissions `contents: read`, `pages: write`, and `id-token: write`, matching the Reference_Site deploy caller
6. IF the build or validation fails, THEN THE Deploy_Workflow SHALL mark the workflow run as failed and prevent deployment

### Requirement 6: GitHub Actions PR Workflows

**User Story:** As a Content_Author, I want pull requests validated for markdown lint and commit message format, so that quality gates are enforced before merge.

#### Acceptance Criteria

1. THE Linter_Workflow SHALL be defined in `.github/workflows/markdown-lint.yml` and trigger on `pull_request: {}`
2. THE Linter_Workflow SHALL use the `actionsforge/actions/.github/workflows/markdown-lint.yml@main` reusable workflow as an individual caller file (not a markdown-pr-checks or astro-docs-pr-checks bundle)
3. THE Conform_Workflow SHALL be defined in `.github/workflows/commitmsg-conform.yml` and trigger on `pull_request: {}`
4. THE Conform_Workflow SHALL use the `actionsforge/actions/.github/workflows/commitmsg-conform.yml@main` reusable workflow as an individual caller file (not a bundle)
5. THE Linter_Workflow and Conform_Workflow SHALL declare permissions `statuses: write`, `checks: write`, `contents: read`, and `pull-requests: read`
6. IF the Linter_Workflow or Conform_Workflow reports a failure, THEN THE workflow run SHALL conclude as failed so repository branch protection can treat it as a required status check

### Requirement 7: Static Media Handling

**User Story:** As a Content_Author, I want Walkthrough_Source stills available in the Docs_Site build, so that lab pages are visual-first and the site builds standalone.

#### Acceptance Criteria

1. THE Docs_Site SHALL vendor PNG stills from Source_Factory `docs/media/walkthrough/` into `public/media/walkthrough/` (or an equivalent public path), preserving source filenames so the site builds without runtime dependency on the Source_Factory
2. THE Docs_Site SHALL include at least these stills when present in Walkthrough_Source: `09-gator-verify.png` (Lab A); Lab B config-map stills (`01-repo-tree.png`, `14-kiro-explorer-tree.png`, `15-steering-profile.png`, `16-steering-archetypes.png`, `17-skill-add-app.png`, `18-skill-migrate.png`, `19-hooks-grid.png`, `08-pdb-rule.png`, `20-agent-config.png`, `21-mcp-servers.png`, `22-specs-timeline.png`); Lab C / Vibe stills (`10-add-app-session.png`, `10b-add-app-scaffolding.png`, `07-block-infra-denied.png`, `11-kustomize-build.png`, `12-add-app-done.png`, `13-pr-checks.png`, `10-vibe-mode.png`)
3. WHEN a Still is referenced in a lab page, THE Docs_Site SHALL serve the image from the public directory using the configured base path `/kiro-eks-gitops-factory/`
4. THE Docs_Site SHALL limit each image caption to a single sentence of no more than 120 characters for each Still that documents a distinct lab step
5. THE Docs_Site SHALL document (not require Readers to run) the Source_Factory capture scripts `docs/media/walkthrough/capture.mjs` and `capture-kiro-configs.mjs` as the regeneration path for stills
6. THE Docs_Site SHALL use real Walkthrough_Source stills or clearly labeled placeholders; fabricated or montaged chat UIs are prohibited
7. IF a content page references a Still filename that was not vendored into public, THEN a Content_Author SHALL either vendor the missing Still from Walkthrough_Source or remove/replace the reference before merge (do not invent screenshots)

### Requirement 8: README Documentation

**User Story:** As a Content_Author, I want a README that explains what this repo is and is not, so that visitors understand the project scope immediately.

#### Acceptance Criteria

1. THE Docs_Repo SHALL include a README.md at the repository root with a level-1 heading containing the repository name `kiro-eks-gitops-factory` and a single-paragraph plain-ASCII description matching the GitHub description intent: a repeatable EKS and Argo CD app factory with thin Kiro prompts, hard guardrails, and no chat-side cluster apply
2. THE README SHALL include a "What this is / What this is not" table with at least 3 rows distinguishing the Docs_Site from the Source_Factory (Starlight walkthrough vs implementation; explains why/how/labs/screenshots vs clone/run gator/kustomize/Kiro; may vendor stills vs owns manifests/hooks/skills/policy)
3. THE README SHALL include a short note that Readers run factory commands in the Source_Factory repository; this site only documents
4. THE README SHALL include a local development section presenting the commands `npm install`, `npm run dev`, `npm run validate`, and `npm run build` inside fenced code blocks
5. THE README SHALL include a link to the published site (`https://jajera.github.io/kiro-eks-gitops-factory/`) and a link to the Source_Factory (`https://github.com/jajera/kiro-eks-argocd-migration`)

### Requirement 9: In-Scope Lab Content

**User Story:** As a Reader, I want Labs A–C and Vibe vs Spec taught at a 200-level with working commands and honest visuals, so that I can follow along without guesswork.

#### Acceptance Criteria

1. THE Why page SHALL present the Product_Thesis, the ~100-app scale table from Walkthrough_Source, the human gate, and what the factory does and does not remove
2. THE Setup page SHALL instruct Readers to clone the Source_Factory, install gator via `./scripts/install-gator.sh`, pin/expect gator 3.22.0, and list prerequisites (`kustomize`, Node/npx, Kiro for Lab C)
3. THE Lab A page SHALL cover offline admission: `gator verify`, policy overlay `kustomize build` for `dev-eks-1` / `prod-eks-1`, and Still `09-gator-verify.png`
4. THE Lab B page SHALL cover the `.kiro/` config map with rendered stills (not fake live Kiro UI): repo/`.kiro` trees, steering (always vs fileMatch), project-profile, archetypes, skills `add-app` and `migrate-workload`, hooks grid plus PDB scar (`minAvailable: 1` only when replicas >= 2), agent `eks-migration`, MCP (docs on; live cluster adapters off until creds), specs as build history, and the layer diagram prompt → agent → skill → hooks → PR → human → Argo
5. THE Lab C page SHALL cover Kiro onboarding with the exact thin `demo-nginx` prompt from Walkthrough_Source, scaffolding stills, Git-only hook (`kustomize` ALLOW; note that ACCESS DENIED for `kubectl apply` was not in the recording if still true), verify (kustomize + markdownlint), done (dual overlays), PR checks, and the takeaway that a vibe prompt still yields a factory result
6. THE Vibe vs Spec page SHALL include Still `10-vibe-mode.png` and explain when each mode fits, adapted from Walkthrough_Source
7. THE Done page SHALL present an evidence checklist covering Labs A–C only and SHALL exclude any Lab D evidence row; WHERE the Done page names Lab D at all, THE Done page SHALL state within the same sentence that Lab D is out of scope as a runnable lab and SHALL link the Lab_D_Reference page
8. THE Docs_Site SHALL document placeholder AWS accounts `111122223333` / `444455556666` and region `ap-southeast-2` explicitly where they appear, and SHALL tell Readers to replace them before live IAM/ECR
9. THE Docs_Site SHALL present one caption per full-width Still with no more than two sentences of narrative prose between consecutive Stills on lab pages, where fenced code blocks, admonition blocks (`:::note`, `:::caution`, `:::tip`), Markdown link text, inline code spans, and headings are excluded from that sentence count, matching the Content_Checker behaviour of stripping those constructs before counting
10. THE Docs_Site SHALL present each Reader-run command as a copyable code block intended to execute in the Source_Factory working tree when documented prerequisites are met
11. THE Docs_Site SHALL include at least one tradeoff explanation on each of the lab pages (lab-a, lab-b, lab-c) and on each lesson page added by the scope expansion (lab-d-reference, autonomy-modes, gotchas), where a tradeoff explanation states the chosen approach, names at least one alternative, and gives a reason for the choice
12. WHERE a page uses the tokens `git clone`, `install-gator.sh`, `gator verify`, `kustomize build`, or `add-app`, THE page SHALL include the Source_Factory URL `https://github.com/jajera/kiro-eks-argocd-migration`
13. THE Setup page SHALL carry the single authoritative explanation of the gator version skew required by Requirement 16.3, naming gator CLI version `3.22.0` and Gatekeeper Helm chart version `3.21.1`, stating why the mismatch is expected, and stating that the Reader keeps the pinned gator CLI

### Requirement 10: Out-of-Scope Guardrails

**User Story:** As a Content_Author, I want explicit boundaries on what the docs site does not contain, so that scope creep is prevented.

#### Acceptance Criteria

1. THE Docs_Site SHALL not contain Source_Factory implementation trees (`.kiro/` hooks/skills/steering as runnable config, `apps/` manifests, `bootstrap/`, `clusters/`, `infrastructure/gatekeeper/`, `policies/`) as the system of record
2. THE Docs_Site SHALL treat the live path (Argo CD `Synced`/`Healthy`, ALB ADDRESS, curl 200, prod promote) as reference material only: the Lab_D_Reference page MAY reproduce the Walkthrough_Source Lab D visual checklist table and its `argocd` / `kubectl` / `curl` command block, framed as what the live path looks like, and THE Docs_Site SHALL not present Lab D as a lab a Reader can run from this site, SHALL not claim a live cluster result was observed here, and SHALL not add Lab D to the Done evidence checklist (see Requirements 9.7 and 18)
3. THE Docs_Site SHALL not check in hand-scaffolded `apps/demo-nginx` manifests; Lab C teaches Readers to generate via Kiro in the Source_Factory
4. THE Docs_Site SHALL not invent a live cluster demo or instruct Readers to run `kubectl apply` from a chat interface
5. THE Docs_Site SHALL not include Cursor/AI attribution footers in commits or pull request bodies
6. THE Docs_Site SHALL link to the Source_Factory for any clone, gator, kustomize, or Kiro `add-app` operations that Readers perform
7. THE Docs_Site SHALL not copy IPAM/Terraform subject matter from the Reference_Site; only site architecture, DX, and editorial quality patterns MAY be mirrored

### Requirement 11: Walkthrough_Source Parity

**User Story:** As a Reader, I want every section of the Source_Factory walkthrough represented on the Docs_Site, so that navigating the site is never worse than reading the raw Markdown.

#### Acceptance Criteria

1. THE Lab B page SHALL present the steering inventory as a table with one row per file — `project-profile.md`, `gitops-conventions.md`, `workload-archetypes.md`, `identity-and-secrets.md`, `policy-validation.md`, `ci-workflows.md` — where each row states the inclusion mode (`always`, or `conditional` with its file pattern `apps/**` or `.github/**`) and the purpose
2. THE Lab B page SHALL state the context-budget reasoning for the two inclusion modes: `always` files are small enough to justify loading on every interaction, and conditional files keep the context window clean during unrelated work while still supplying archetype, identity, and policy rules when their file patterns enter the conversation
3. THE Lab B page SHALL present the skill inventory as a table with one row per skill — `add-app`, `migrate-workload`, `promote-app`, `manage-clusters` — where each row states the trigger intent and the key behaviour, and SHALL state that `migrate-workload` uses progressive disclosure with phase detail held in `references/` and loaded when the relevant phase starts
4. THE Lab B page SHALL state the architecture decision that a procedure belongs in a skill rather than in steering, with the reason that duplicating a procedure into steering loads it on every interaction and lets it drift from the skill
5. THE Lab B page SHALL present all eight Hook_Definitions grouped into three categories — shell gate (`block-infra-commands`), scaffold checks (`validate-app-scaffold`, `validate-infra-scaffold`), and build/policy (`kustomize-build-check`, `kustomize-build-check-on-edit`, `gator-test-on-create`, `gator-test-on-edit`, `policy-validate`) — naming the IDE event each category fires on (`preToolUse`, `fileEdited`, `fileCreated`)
6. THE Lab B page SHALL state that the shell gate is the most critical hook, with the reason that it inspects every shell command before execution and denies anything that could mutate a live cluster, cloud account, or registry, so changes reach clusters only through Argo CD after merge
7. THE Lab B page SHALL embed the `eks-migration` agent JSON as an Embedded_Artifact quoted from Source_Factory `.kiro/agents/eks-migration.json`, and SHALL explain that hooks are absent from the agent definition because hooks are IDE-level rather than agent-level and therefore enforce regardless of which agent is active
8. THE Lab B page SHALL present the MCP inventory as a table with one row per server — `aws-knowledge`, `eks`, `kubernetes`, `filesystem` — stating purpose and default state, SHALL state that `eks` is locked to `--read-only` and `kubernetes` sets `ALLOW_ONLY_NON_DESTRUCTIVE_TOOLS=true`, and SHALL state the conclusion that combined with the shell gate there is no path from the agent to a live cluster mutation
9. THE Lab B page SHALL describe the spec document structure (`requirements.md`, `design.md`, `tasks.md` under `.kiro/specs/<feature>/`) and name the two Source_Factory specs `initial-project-setup` and `gatekeeper-admission` as reviewable project history
10. THE Vibe vs Spec page SHALL present the full comparison across the dimensions input, feedback loop, traceability, best for, and risk surface; the "when vibe is the right call" list; the "when spec-driven earns its keep" list; and the "they compose, not compete" pattern in which a spec session builds the platform and vibe sessions onboard apps on top of it
11. THE Vibe vs Spec page SHALL state that neither mode bypasses the human gate: specs are reviewed before implementation starts and vibe output is reviewed before merge
12. THE Docs_Site SHALL document Media_Provenance as a table mapping frame groups to their producer: `01`, `09`, `13` from `capture.mjs`; `08`, `14`–`22` from `capture-kiro-configs.mjs`; `07`, `10`, `10-vibe-mode`, `10b`, `11`, `12` from the Lab C recording; `23`–`25` from a Reader's own live cluster
13. IF a Walkthrough_Source detail cannot be verified in the Source_Factory working tree, THEN THE page SHALL link the Source_Factory file path rather than restate the detail

### Requirement 12: Implementation Depth Bar

**User Story:** As a Reader, I want each lesson page to show me how to build the thing, so that I can implement it myself instead of only learning that it exists.

#### Acceptance Criteria

1. THE Docs_Site SHALL treat exactly six pages as lesson pages — lab-a, lab-b, lab-c, lab-d-reference, autonomy-modes, and gotchas — and SHALL clear the Depth_Bar on each of them by carrying the elements that criteria 2, 3, 4, 5, and 6 scope to that page, where no criterion requires a lesson page to carry a section with a fixed heading and no criterion requires two lesson pages to present their elements in the same order
2. THE Docs_Site SHALL include at least one Embedded_Artifact on each of the pages lab-a, lab-b, and lab-c, where a fenced code block counts as an Embedded_Artifact only if the Source_Factory file path it was copied from appears either in the 3 source lines immediately preceding the opening fence or in the 3 source lines immediately following the closing fence
3. THE Docs_Site SHALL present, on each of the pages lab-a and lab-c where a Reader executes commands, at least one Markdown ordered list of between 3 and 15 items numbered consecutively from 1, where each item states one action the Reader takes and the observable result of that action either in the same item or in the fenced block immediately following that item; WHERE a lesson page asks a Reader to execute no command (lab-b, lab-d-reference, autonomy-modes, gotchas), THE page SHALL satisfy the Depth_Bar through its Embedded_Artifacts and reasoning without an ordered list, because a numbered list of things to read is a template artefact rather than guidance
4. THE Docs_Site SHALL state at least one architecture decision with its tradeoff on each lesson page, comprising the chosen approach, at least one named alternative, and a reason naming the failure the decision prevents or the cost it avoids, written into the page's own argument; THE Docs_Site SHALL allow that tradeoff to appear as running prose with no dedicated heading and with no labelled fields, and THIS criterion SHALL be treated as review-gated rather than machine-enforced (see 12.12)
5. THE Docs_Site SHALL surface at least one gotcha on each lesson page in one of exactly two machine-recognisable forms: a link to the slug `gotchas` carrying an anchor fragment that resolves to a heading on the Gotchas_Page, or a heading whose text is drawn from the vocabulary `Gotcha`, `Gotchas`, `Known scars`, `What bites`, or `What goes wrong` followed by at least one sentence
6. THE Docs_Site SHALL carry, on each lesson page that presents a Markdown table or a screenshot component, at least one Embedded_Artifact or at least one ordered list of 3 or more items somewhere on that page, so that a table or a screenshot is always evidence alongside teaching material rather than the whole of it; THE Content_Checker SHALL evaluate this criterion per page and SHALL NOT evaluate it per `##` section, because a per-section rule forces a fenced block or a numbered list into every section that carries a table and reintroduces the boilerplate this revision removes
7. WHERE a page quotes an Embedded_Artifact as an excerpt because its Source_Factory file exceeds 60 lines, THE page SHALL quote a contiguous excerpt, SHALL contain exactly one elision marker line at each omission point inside the fenced block, being a line whose only content is the quoted language's comment syntax followed by an ellipsis, SHALL state the quoted line range adjacent to the block, and SHALL link the full Source_Factory file path
8. WHEN a Content_Author runs `npm run validate`, `npm run check:content`, and `npm run build` after adding Embedded_Artifacts, THE Build_Pipeline SHALL exit with code 0 for each of the three commands and THE Content_Checker SHALL report zero violations
9. IF a lesson page fails any of criteria 2, 3, 5, 6, or 7, THEN THE Content_Checker SHALL exit with a non-zero code and SHALL emit one diagnostic per violation naming the page file path, the line number, and the missing or unmet element, leaving all page content unmodified; criterion 4 is excluded from this list because it is review-gated by 12.12 and the Content_Checker cannot evaluate it
10. WHEN a Content_Author opens a pull request that adds or edits a lesson page, THE Docs_Repo SHALL require a human reviewer to confirm the three Depth_Bar judgments that the Content_Checker cannot evaluate — that each Embedded_Artifact matches its named Source_Factory file character-for-character, that each stated observable result matches the output the named command actually produces, and that each Reason names a real failure or cost rather than restating the choice — and these three judgments SHALL NOT be claimed as machine-enforced
11. THE Docs_Site SHALL keep every fenced Embedded_Artifact block at or below 60 content lines, counting lines between the opening and closing fence delimiters and excluding those delimiters
12. WHEN a Content_Author opens a pull request that adds or edits a lesson page, THE Docs_Repo SHALL require a human reviewer to confirm two further judgments beyond the three named in 12.10 — that criterion 4's tradeoff is present, is argued in the page's own words, and names a real alternative and a real cost rather than restating the choice, and that the page reads as one stage of the Narrative_Spine rather than as a standalone module — and these two judgments SHALL NOT be claimed as machine-enforced
13. THE Content_Checker SHALL accept a lesson page that contains no heading whose text is `Tradeoff`, retiring the exact-heading check that the first scope expansion introduced, and WHERE a Content_Author does choose a dedicated heading for a tradeoff, THE heading text SHALL be drawn from the vocabulary `Tradeoff`, `Tradeoffs`, `Why this way`, or `What this costs`, so that a reviewer scanning the page finds a predictable word without every page being obliged to carry the section
14. THE Docs_Site SHALL apply criteria 3, 5, and 6 to the Gotchas_Page and the Autonomy_Page only as those criteria scope themselves, and Requirement 16.7's symptom-cause-fix ordering SHALL be the Gotchas_Page structure of record, because the Gotchas_Page is a lookup surface rather than a lesson walked in sequence
15. IF two lesson pages carry an identical ordered sequence of `##` heading texts, THEN THE Content_Checker SHALL report a violation naming both page paths, because identical heading sequences are the observable signature of a template stamped twice

### Requirement 13: Lab A Policy Authoring Depth

**User Story:** As a Reader, I want to see a real ConstraintTemplate, its constraint, and its gator suite, so that I can author and test my own admission policy.

#### Acceptance Criteria

1. THE Lab A page SHALL walk the Reader through the ordered chain Constraint_Template → Constraint → Gator_Suite → `gator verify` PASS, explaining what each artifact contributes
2. THE Lab A page SHALL embed one Constraint_Template as an Embedded_Artifact including its Rego `violation` rule, quoted from Source_Factory `infrastructure/gatekeeper/constraint-templates/httpsonly.yaml`
3. THE Lab A page SHALL embed the matching Constraint as an Embedded_Artifact quoted from Source_Factory `infrastructure/gatekeeper/constraints/httpsonly/constraint.yaml`
4. THE Lab A page SHALL embed the matching Gator_Suite as an Embedded_Artifact quoted from Source_Factory `infrastructure/gatekeeper/tests/httpsonly/suite.yaml`, and SHALL explain how a suite case binds an object file to a `violations: "yes"` or `violations: "no"` assertion
5. THE Lab A page SHALL show the failing path by embedding the failing case object from Source_Factory `infrastructure/gatekeeper/tests/httpsonly/fail.yaml` and the `violation` message text that the embedded Rego produces for that object
6. THE Lab A page SHALL teach the Reader how to read a gator violation message by naming its parts: the constraint kind, the reviewed object identity, and the message string built by the Rego `sprintf` call
7. WHERE the Lab A page shows expected failing output, THE page SHALL label that block as the expected result of the named suite case rather than presenting it as a captured terminal session, because no failing-run Still exists in Walkthrough_Source
8. THE Lab A page SHALL state where the remaining policies live by linking Source_Factory `infrastructure/gatekeeper/constraints/` and `infrastructure/gatekeeper/tests/`, rather than reproducing every policy
9. THE Lab A page SHALL keep the existing offline commands (`gator verify`, the `dev-eks-1` and `prod-eks-1` policy overlay builds) and Still `09-gator-verify.png`

### Requirement 14: Lab B Artifact Depth

**User Story:** As a Reader, I want to read a real hook file and a real steering excerpt, so that I can write my own hooks and steering instead of only seeing screenshots of them.

#### Acceptance Criteria

1. THE Lab B page SHALL embed at least one complete Hook_Definition as an Embedded_Artifact quoted from Source_Factory `.kiro/hooks/block-infra-commands.kiro.hook`
2. THE Lab B page SHALL explain the embedded Hook_Definition field by field, covering the IDE event it binds to, the tool scope it inspects, and how its deny and allow decisions are expressed
3. THE Lab B page SHALL embed at least one steering excerpt as an Embedded_Artifact quoted from a named file under Source_Factory `.kiro/steering/`, including the frontmatter line that sets the inclusion mode
4. THE Lab B page SHALL embed the Archetype_Contract excerpt for `web-service` from Source_Factory `.kiro/steering/workload-archetypes.md`, so that Lab C can be checked against it
5. THE Lab B page SHALL keep its existing abstract descriptions and tables, and SHALL anchor each of them to a concrete Embedded_Artifact or a Source_Factory file link
6. THE Lab B page SHALL state the authoring guidance a Reader needs to write a new hook: where the file lives, which event names are available for the three hook categories in Requirement 11.5, and what the hook must do to keep the Git-only guarantee intact
7. THE Lab B page SHALL keep the layer diagram prompt → agent → skill → hooks → PR → human → Argo and the formula skills generate → hooks enforce → humans approve

### Requirement 15: Lab C Generated Manifest Depth

**User Story:** As a Reader, I want to see the manifests that `add-app` actually produced and how they satisfy the archetype contract, so that I can judge the output rather than trust a screenshot.

#### Acceptance Criteria

1. THE Lab C page SHALL show the Generated_Manifests for `demo-nginx` as Embedded_Artifacts covering at minimum these six named Source_Factory files — `apps/demo-nginx/base/manifests/deployment.yaml`, `apps/demo-nginx/base/manifests/ingress.yaml`, `apps/demo-nginx/base/manifests/networkpolicy.yaml`, `apps/demo-nginx/base/manifests/poddisruptionbudget.yaml`, `apps/demo-nginx/overlays/dev-eks-1/kustomization.yaml`, and `apps/demo-nginx/overlays/prod-eks-1/kustomization.yaml` — each quoted character-for-character with its full Source_Factory path stated adjacent to the block, and SHALL apply the excerpt-and-elision rule of Requirement 12.7 to any quoted file longer than 60 lines
2. THE Lab C page SHALL present a contract-check list carrying exactly one entry per Archetype_Contract item, covering all seven items — readiness probe, liveness probe, Ingress, NetworkPolicy, PodDisruptionBudget validity at `replicas: 2`, placeholder image digest, and presence of both the `dev-eks-1` and `prod-eks-1` overlays — where each entry names the quoted file from Requirement 15.1 that carries the item, the field in that file that satisfies it, and a verdict of satisfied or not satisfied
3. THE Lab C page SHALL name, for each of the seven entries in Requirement 15.2, exactly one supplying factory layer — steering, the `add-app` skill, or a hook — together with the Source_Factory file path of that layer
4. THE Lab C page SHALL present the Generated_Manifests only as fenced code blocks inside the Lab C page source file under `src/content/docs/`, and SHALL state adjacent to the first such block that the quoted YAML is teaching material on a documentation page and is not a system of record, a Kustomize input, or an Argo CD source
5. THE Lab C page SHALL state that a Reader obtains these manifests by running the thin `demo-nginx` prompt against the `eks-migration` agent in the Source_Factory working tree, and SHALL state that copying the quoted blocks into the Docs_Repo as files is prohibited by Requirement 10.3
6. THE Lab C page SHALL keep the exact thin `demo-nginx` prompt quoted from Walkthrough_Source, Stills `10-add-app-session.png`, `10b-add-app-scaffolding.png`, `11-kustomize-build.png`, `12-add-app-done.png`, and `13-pr-checks.png`, the Git-only hook framing, the `kustomize build` verify step, the dual-overlay done state, and the vibe-prompt takeaway
7. IF a named Generated_Manifest file is absent from the Source_Factory working tree, is unreadable, or differs from the text a Content_Author would quote, THEN THE Lab C page SHALL omit the fenced block for that file, SHALL list the file paths the `add-app` skill creates, and SHALL link the `add-app` skill definition in the Source_Factory instead of showing fabricated YAML
8. THE Docs_Repo SHALL contain no directory named `apps` at its root and no file whose path contains `apps/demo-nginx`, keeping Requirements 10.1 and 10.3 intact while Requirement 15.1 quotes the same manifests as page content
9. IF a directory named `apps` or a file whose path contains `apps/demo-nginx` is present in the Docs_Repo, THEN THE Content_Checker SHALL report a Property 11 violation naming that path and SHALL exit with a non-zero exit code

### Requirement 16: Gotchas Page

**User Story:** As a Reader, I want a single troubleshooting page, so that known scars and failure modes do not cost me an afternoon.

#### Acceptance Criteria

1. THE Gotchas_Page SHALL exist at slug `gotchas` with a non-empty frontmatter `title` and a non-empty frontmatter `description` of 160 characters or fewer, and SHALL appear in the Sidebar so that Content_Checker Property 1 and Property 2 report no violation for the page
2. THE Gotchas_Page SHALL document the gator version skew as one entry naming gator CLI version `3.22.0` and its origin as the `GATOR_VERSION` default in Source_Factory `scripts/install-gator.sh`, naming Gatekeeper Helm chart `version` / `appVersion` `3.21.1` and its origin as Source_Factory `infrastructure/gatekeeper/base/vendored/chart/gatekeeper/Chart.yaml`, and stating as the fix that the Reader keeps the pinned gator CLI rather than downgrading it to the chart version
3. WHERE the Setup page documents the gator version skew, THE Docs_Site SHALL treat the Setup page as the single authoritative explanation, because the Reader installs gator `3.22.0` from the Setup page before reaching the Gotchas_Page, and the Gotchas_Page skew entry SHALL carry at most three sentences of explanation plus one link to the Setup page rather than restating the reasoning
4. THE Gotchas_Page SHALL document the PDB scar as one entry stating that `minAvailable: 1` is valid only when `replicas` is 2 or greater, naming both encoding locations as Source_Factory `.kiro/steering/` and the `validate-app-scaffold` hook under Source_Factory `.kiro/hooks/`, stating that a hook failure blocks the scaffold and returns a message identifying the offending manifest and the conflicting `minAvailable` and `replicas` values, and stating as the fix that the Reader raises `replicas` to 2 or greater or removes the PodDisruptionBudget
5. THE Gotchas_Page SHALL document the placeholder AWS account IDs `111122223333` (dev, cluster `dev-eks-1`) and `444455556666` (prod, cluster `prod-eks-1`) and region `ap-southeast-2`, and SHALL include a `:::caution` block whose body contains the word "replace" and instructs the Reader to substitute real values before any live IAM or ECR operation, so that Content_Checker Property 8 reports no violation for the page
6. THE Gotchas_Page SHALL document exactly three gator failure modes as three separate entries — a suite path that resolves to no tests, a case asserting the wrong violation count, and a constraint whose match scope excludes the reviewed object — defined in criteria 9, 10, and 11
7. THE Gotchas_Page SHALL present every entry with its symptom first, its cause second, and its fix third, with no other prose interleaved between those three parts
8. THE Gotchas_Page SHALL include, in every entry that requires the Reader to inspect or edit a file, at least one link to the named Source_Factory file path under `https://github.com/jajera/kiro-eks-argocd-migration`, so that Content_Checker Property 9 reports no violation for the page
9. THE Gotchas_Page SHALL define the no-tests failure mode with the symptom that `gator verify` exits without executing any case and reports a test count of zero, the cause that the supplied path does not resolve to any `suite.yaml` under Source_Factory `infrastructure/gatekeeper/tests/<name>/`, and the fix that the Reader reruns against a path resolving to all 14 suites and confirms the reported suite count is 14
10. THE Gotchas_Page SHALL define the wrong-violation-count failure mode with the symptom that a case fails with a reported expected violation count differing from the actual count while the Constraint behaves as designed, the cause that the asserted violation count in the sibling `pass.yaml` or `fail.yaml` case object does not match the number of violations the Constraint_Template rule produces for that object, and the fix that the Reader reconciles the asserted count with the rule output and reruns `gator verify` to a zero exit code
11. THE Gotchas_Page SHALL define the out-of-scope-match failure mode with the symptom that a `fail.yaml` case object produces zero violations so the negative case passes without exercising the rule, the cause that the Constraint match scope in Source_Factory `infrastructure/gatekeeper/constraints/<name>/constraint.yaml` excludes the reviewed object's kind or namespace, and the fix that the Reader aligns that match scope with the case object and confirms the fail case reports at least one violation

### Requirement 17: Autonomy Modes Page

**User Story:** As a Reader, I want to know when to run Autopilot and when to run Supervised, so that I keep control where a wrong line is expensive.

#### Acceptance Criteria

1. THE Autonomy_Page SHALL exist at slug `autonomy-modes` with frontmatter title and description
2. THE Autonomy_Page SHALL define both Autonomy_Modes: Autopilot as the default, and Supervised as yielding for approval after each turn that edits files, presenting changes as individual hunks a Reader accepts or rejects
3. THE Autonomy_Page SHALL state that Lab C ran in Autopilot
4. THE Autonomy_Page SHALL state when Autopilot fits: scaffolding a known archetype, running validation, and bulk file creation, where hooks and PR review are the safety net
5. THE Autonomy_Page SHALL state when Supervised fits: editing live bootstrap manifests and modifying policy enforcement actions, where a single wrong line could block cluster syncs
6. THE Autonomy_Page SHALL state that both Autonomy_Modes respect hooks, including that the shell gate still fires in Supervised mode
7. THE Autonomy_Page SHALL state that both Autonomy_Modes require a human merge before Argo CD sees any change
8. THE Autonomy_Page SHALL relate Autonomy_Mode selection to the vibe-versus-spec choice as two independent decisions: mode controls when a Reader reviews edits, and session type controls whether requirements are negotiated before implementation

### Requirement 18: Lab D Reference Material

**User Story:** As a Reader, I want to see what the live path looks like, so that I know what to expect after merge without believing this site ran it.

#### Acceptance Criteria

1. THE Lab_D_Reference page SHALL exist at slug `lab-d-reference` with frontmatter title and description, and its sidebar label SHALL be "Lab D (out of scope)"
2. THE Lab_D_Reference page SHALL reproduce the Walkthrough_Source Lab D visual checklist table with its step, capture, and pass-when columns
3. THE Lab_D_Reference page SHALL reproduce the Walkthrough_Source Lab D command block containing the `argocd app get`, `kubectl -n demo-nginx get`, and `curl` commands as an Embedded_Artifact
4. THE Lab_D_Reference page SHALL frame the page as what the live path looks like rather than a lab a Reader runs from this site
5. WHERE the Lab_D_Reference page names Lab D, THE page SHALL state that Lab D is out of scope within 80 characters of that mention, so the Content_Checker Lab D property holds
6. THE Lab_D_Reference page SHALL state that the live path starts only after human PR review and that changes reach the cluster through Git merge and Argo CD sync, never through a chat-side apply
7. THE Lab_D_Reference page SHALL not reference Stills `23-argocd-healthy.png`, `24-alb-ingress.png`, or `25-curl-ok.png` as vendored images; WHERE the page names those frames, THE page SHALL use a `:::note[Still pending]` block naming the `.png` and its `docs/media/walkthrough/` path
8. THE Lab_D_Reference page SHALL link the Source_Factory for every command a Reader would run against a live cluster

### Requirement 19: Narrative Spine

**User Story:** As a Reader, I want the site to make one continuous argument, so that I understand what problem is being solved and why each lab follows from the last instead of browsing six independent modules.

#### Acceptance Criteria

1. THE Docs_Site SHALL present the Narrative_Spine as one continuous argument in Sidebar order, where each page advances the argument the previous page left off, and THIS criterion SHALL be treated as review-gated rather than machine-enforced
2. THE landing page SHALL state the onboarding problem and its cost — roughly 100 apps to onboard, approximately 450 hours of manual effort, re-deciding tree shape for every app, and drift that no reviewer catches — before naming any factory mechanism, where a factory mechanism is any of the terms steering, skill, hook, agent, MCP, Gatekeeper, gator, Kustomize, or overlay
3. THE landing page hero tagline SHALL name the problem or its cost and SHALL contain none of the factory mechanism terms listed in 19.2, because a tagline made of mechanism nouns answers a question the Reader has not been asked
4. WHEN the Content_Checker scans the landing page, THE Content_Checker SHALL report a violation IF the first occurrence of any factory mechanism term listed in 19.2 precedes the first occurrence of the app count, the hour count, or the word "drift" in the page source
5. THE landing page SHALL state that Lab A, Lab B, and Lab C form one ordered argument in which each lab rests on the conclusion of the lab before it
6. THE landing page SHALL present the labs as an ordered sequence by naming Lab A, then Lab B, then Lab C in that source order, each prefixed with its ordinal position in the sequence, so that the presentation reads as steps rather than as an unordered grid of equal-weight cards
7. IF the landing page presents the labs as sibling `<Card>` elements whose titles carry no ordinal position, THEN THE Content_Checker SHALL report a violation naming the landing page path
8. THE Why page SHALL carry Narrative_Spine moves 1, 2, and 3: the scale and cost of manual onboarding, the reason that prompting a model harder does not fix it (a bare model invents a different tree per app and will apply changes to a live cluster), and the resolution that the decisions move into the repository where steering supplies knowledge, skills order procedure, hooks refuse what must not happen, and the agent bundles them so a thin prompt activates the whole stack
9. THE Lab A page SHALL state the spine claim it proves: that policy passes before any cluster exists
10. THE Lab B page SHALL state the spine claim it proves: that the configuration in the repository is what makes a thin prompt safe
11. THE Lab C page SHALL state the spine claim it proves: that a thin prompt produces a compliant dual-overlay app
12. THE Done page SHALL state Narrative_Spine move 5, that humans still merge and that the human gate is the design rather than a shortfall
13. THE Docs_Site SHALL include, on each page except the first page in Sidebar order, a link to the previous page within the page source that precedes the first `##` heading, together with one sentence naming what the Reader established there
14. THE Docs_Site SHALL include, on each page except the last page in Sidebar order, a link to the next page within the final 500 characters of the page source, together with one sentence naming what the next page settles
15. THE Docs_Site SHALL repeat the formula `skills generate -> hooks enforce -> humans approve` on the landing page and on the pages why, lab-a, lab-b, lab-c, and done, where each occurrence names which of the three clauses the page is currently proving rather than presenting the formula as a standalone slogan
16. WHEN the Content_Checker scans the pages named in 19.15, THE Content_Checker SHALL report a violation for any of those pages whose source does not contain all three clauses `skills generate`, `hooks enforce`, and `humans approve`
17. THE Docs_Site SHALL state, wherever it names a Lesson_Page title or Sidebar label, a claim the page proves rather than only the topic the page covers, and THIS criterion SHALL be treated as review-gated rather than machine-enforced beyond the exact label strings pinned in Requirement 2.6

### Requirement 20: Reader-Facing Vocabulary

**User Story:** As a Reader, I want pages written in language aimed at me, so that I am not reading the internal identifiers of a requirements document rendered literally with underscores.

#### Acceptance Criteria

1. THE Docs_Site SHALL treat the following 27 identifiers as the Spec_Vocabulary: `Source_Factory`, `Docs_Site`, `Docs_Repo`, `Walkthrough_Source`, `Reference_Site`, `Product_Thesis`, `Build_Pipeline`, `Content_Author`, `Depth_Bar`, `Embedded_Artifact`, `Lesson_Page`, `Generated_Manifests`, `Archetype_Contract`, `Constraint_Template`, `Gator_Suite`, `Hook_Definition`, `Autonomy_Mode`, `Media_Provenance`, `Content_Checker`, `Gotchas_Page`, `Autonomy_Page`, `Lab_D_Reference`, `Deploy_Workflow`, `Linter_Workflow`, `Conform_Workflow`, `Validator`, and `Still` together with its plural `Stills` when capitalised
2. THE Docs_Site SHALL exclude every Spec_Vocabulary identifier from Reader_Prose, covering page body text, frontmatter `title` and `description` values, Sidebar `label` strings, screenshot captions, and `alt` text
3. WHERE Reader_Prose refers to the upstream factory repository, THE prose SHALL call it "the factory repo" or name the repository `jajera/kiro-eks-argocd-migration` directly, and SHALL keep the link target `https://github.com/jajera/kiro-eks-argocd-migration` required by Requirements 9.12 and 10.6
4. WHERE Reader_Prose refers to a vendored walkthrough screenshot, THE prose SHALL call it a screenshot or a frame
5. WHEN the Content_Checker scans a page under `src/content/docs/`, THE Content_Checker SHALL remove fenced code blocks, inline code spans, JSX component names, and JSX attribute names before matching Spec_Vocabulary identifiers, and SHALL report one violation per remaining match naming the page path, the line number, and the matched identifier
6. WHERE a Spec_Vocabulary identifier appears inside a fenced code block, inside an inline code span, or as a JSX component name such as `<Still />` or its import statement, THE Content_Checker SHALL report no violation, because that text either quotes a Source_Factory file character-for-character under Requirement 3.7 or does not render as prose
7. WHERE Requirement 18.7 obliges the exact admonition form `:::note[Still pending]`, THE Content_Checker SHALL report no Spec_Vocabulary violation for that admonition title, and this is the single exemption to 20.2 for text that does render to a Reader
8. WHEN a `dist/` directory is present, THE Content_Checker SHALL scan `dist/` HTML text nodes for Spec_Vocabulary identifiers and SHALL report one violation per match naming the HTML file path, so that the check covers rendered output as well as page source
9. IF the Content_Checker reports any Spec_Vocabulary violation, THEN THE Content_Checker SHALL exit with a non-zero exit code and SHALL leave all page content unmodified
10. WHEN Requirement 20 is implemented, THE Content_Author SHALL revise the eight already-shipped pages so that no Spec_Vocabulary identifier remains in their Reader_Prose, including the 11 literal `Source_Factory` occurrences the review found across index, why, setup, lab-a, lab-b, lab-c, vibe-vs-spec, and done
11. WHERE a sentence would begin with the adverb "Still", THE Content_Author SHALL rewrite the sentence rather than suppress the check, because the Content_Checker matches the capitalised token without regard to sentence position
12. THE Docs_Repo SHALL keep README.md prose free of Spec_Vocabulary identifiers under the same removal rules as 20.5, because README.md is a Reader surface on GitHub
