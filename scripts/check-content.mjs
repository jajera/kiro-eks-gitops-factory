#!/usr/bin/env node
/**
 * Content invariant checker for docs-site-scaffold.
 * Zero-dependency, read-only, no network. Emits: PROPERTY <n> <file>:<line> <message>
 *
 * Read-only by construction (Requirement 12.9): this file contains no write, rename,
 * or delete call. Everything below reads from disk and asserts.
 *
 * Structure: a parse layer builds the shared products once (fences, headings,
 * sections, Source declarations, ordered lists, the sidebar slug chain, normalised
 * heading sequences, the Reader-prose projection, the dist text-node walk), then the
 * properties are assertions over those products.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "src/content/docs");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
const workflowsDir = path.join(root, ".github/workflows");
const readmePath = path.join(root, "README.md");
const astroCfgPath = path.join(root, "astro.config.mjs");

const SOURCE_FACTORY_URL =
  "https://github.com/jajera/kiro-eks-argocd-migration";
const BASE_PREFIX = "/kiro-eks-gitops-factory/";
const NAMED_STILLS = [
  "01-repo-tree.png",
  "07-block-infra-denied.png",
  "08-pdb-rule.png",
  "09-gator-verify.png",
  "10-add-app-session.png",
  "10-vibe-mode.png",
  "10b-add-app-scaffolding.png",
  "11-kustomize-build.png",
  "12-add-app-done.png",
  "13-pr-checks.png",
  "14-kiro-explorer-tree.png",
  "15-steering-profile.png",
  "16-steering-archetypes.png",
  "17-skill-add-app.png",
  "18-skill-migrate.png",
  "19-hooks-grid.png",
  "20-agent-config.png",
  "21-mcp-servers.png",
  "22-specs-timeline.png",
];
const FORBIDDEN = [
  "apps",
  "bootstrap",
  "clusters",
  "policies",
  "infrastructure",
];
const FACTORY_TOKENS = [
  "git clone",
  "install-gator.sh",
  "gator verify",
  "kustomize build",
  "add-app",
];
const PLACEHOLDERS = ["111122223333", "444455556666", "ap-southeast-2"];

// The six Lesson_Pages (Requirement 9.11). Properties 6 and 12 quantify over these.
const LESSON_PAGES = [
  "lab-a",
  "lab-b",
  "lab-c",
  "lab-d-reference",
  "autonomy-modes",
  "gotchas",
];

// Property 12's four-item heading vocabulary (Requirement 12.13).
const TRADEOFF_VOCABULARY = [
  "Tradeoff",
  "Tradeoffs",
  "Why this way",
  "What this costs",
];

// Property 15's at-least-one clause. Requirement 12.2 scopes the Embedded_Artifact
// obligation to these three pages, not to all six Lesson_Pages.
const ARTIFACT_PAGES = ["lab-a", "lab-b", "lab-c"];

// Property 16's page set (Requirement 12.3 as revised). Two pages, not six:
// `lab-b`, `lab-d-reference`, `autonomy-modes`, and `gotchas` are exempt by name,
// because a numbered list of things to read is a template artefact, not guidance.
const COMMAND_PAGES = ["lab-a", "lab-c"];

// Property 18's elision markers: the fence language's comment syntax plus an
// ellipsis (Depth_Bar Mechanics / excerpt and elision grammar). `json` is absent on
// purpose and its absence is the mechanism — JSON has no comment syntax, so no
// marker line can satisfy Requirement 12.7 and a JSON artifact can never be
// excerpted. It must be quoted whole and therefore fit the 60-line cap.
const ELISION_MARKERS = {
  yaml: "# ...",
  yml: "# ...",
  bash: "# ...",
  sh: "# ...",
  md: "<!-- ... -->",
  markdown: "<!-- ... -->",
};
const ARTIFACT_CONTENT_LINE_CAP = 60;

// Property 19's five-item heading vocabulary (Requirement 12.5 as revised). The set
// is closed: `## Known problems` fails, deliberately. Widening the branch from the
// single string `Gotcha` to five is what lets three pages take the heading branch
// without producing three identical heading-sequence tails for Property 31.
const GOTCHA_VOCABULARY = [
  "Gotcha",
  "Gotchas",
  "Known scars",
  "What bites",
  "What goes wrong",
];

// Property 20's entry template (Requirement 16.7), in order.
const ENTRY_LABELS = ["**Symptom:**", "**Cause:**", "**Fix:**"];

// Property 22's live-cluster tokens (Requirement 18.8). Deliberately NOT merged into
// FACTORY_TOKENS: Property 9 validates Requirements 9.12 and 10.6, which enumerate
// exactly five tokens, and adding these three there would make that traceability
// false. Two requirements, two token sets, two properties.
const LIVE_CLUSTER_RE = /^\s*(?:sudo\s+)?(argocd|kubectl|curl)\b/;

// Property 31's floor: pairs are compared only when both sequences have length 3 or
// more (design OQ12, a reading Requirement 12.15 does not state). Two pages carrying
// only `## Tradeoff` and `## Gotcha` would match on coincidence rather than on a
// template, and reporting that trains a maintainer to ignore the diagnostic. No
// authored Lesson_Page has fewer than four level-2 headings, so the floor is inert
// today; it exists so a future short page cannot produce a false positive.
const HEADING_SEQUENCE_FLOOR = 3;

// Property 23's three conjuncts (Requirements 2.10, 2.11, 2.12).
//
// The cap is asserted over the whole array rather than over today's eleven entries:
// `What makes prompts safe (Lab B)` already sits at 31 characters with one character
// of headroom, so the next label added is the one that discovers the limit (design
// risk R11).
const SIDEBAR_LABEL_CAP = 32;

// The pin is load-bearing for Property 10, not cosmetic. Without the parenthetical,
// "Lab D" in a label has no "out of scope" within 80 characters, and Requirement 2.6
// (which mandates the entry) would contradict Requirement 10.2 (which guards the
// boundary). This is the one label the narrative revision left untouched.
const PINNED_SIDEBAR_LABELS = {
  "lab-d-reference": "Lab D (out of scope)",
};

// The ten slugs Requirement 2.6 names, in Sidebar order. This is what stops a label
// rewrite from carrying a slug with it: Property 1 compares slugs to page basenames,
// so a coordinated rename of both would pass it while silently breaking every inbound
// link and anchor. Slugs are identifiers; labels are prose.
const REQUIRED_SIDEBAR_SLUGS = [
  "why",
  "concepts",
  "setup",
  "lab-a",
  "lab-b",
  "map-project-profile",
  "map-workload-archetypes",
  "map-gitops-conventions",
  "map-add-app",
  "map-manage-clusters",
  "map-migrate-workload",
  "map-promote-app",
  "lab-c",
  "lab-d-reference",
  "autonomy-modes",
  "vibe-vs-spec",
  "gotchas",
  "done",
];

// Property 28's six pages and three clauses (Requirements 19.15, 19.16). Matched
// case-insensitively, so a sentence opening `Skills generate` counts.
const FORMULA_PAGES = ["index", "why", "lab-a", "lab-b", "lab-c", "done"];
const FORMULA_CLAUSES = ["skills generate", "hooks enforce", "humans approve"];

// Property 25's three lab mentions and the ordinal vocabulary Requirement 19.6
// accepts. `1.` / `2.` / `3.` are here as lexical tokens: an ordered-list item is
// recognised structurally, so these cover an ordinal written inline in running prose.
const LAB_TOKENS = ["Lab A", "Lab B", "Lab C"];
const ORDINAL_TOKEN_RE = /\b(?:First|Second|Third)\b|(?:^|\s)[123]\.(?:\s|$)/;

// Requirement 19.4's mechanism terms and the three numeric/lexical anchors that must
// precede the first of them in the landing page source. All nine terms from
// Requirement 19.2, matched case-insensitively with an optional plural `s`.
const MECHANISM_TERMS = [
  "steering",
  "skill",
  "hook",
  "agent",
  "MCP",
  "Gatekeeper",
  "gator",
  "Kustomize",
  "overlay",
];
const LANDING_ANCHORS = [
  { name: "app count", re: /\b100\b/ },
  { name: "hour count", re: /\b450\b/ },
  { name: "drift", re: /\bdrift\b/i },
];

// The 27 Glossary identifiers banned from Reader_Prose (Requirement 20.1). Matched
// exact and case-sensitive on word boundaries, which is why `Still` is listed and
// "still pending" as an adverb is clean.
const BANNED_IDENTIFIERS = [
  "Source_Factory",
  "Docs_Site",
  "Docs_Repo",
  "Walkthrough_Source",
  "Reference_Site",
  "Product_Thesis",
  "Depth_Bar",
  "Lesson_Page",
  "Content_Author",
  "Content_Checker",
  "Build_Pipeline",
  "Validator",
  "Embedded_Artifact",
  "Generated_Manifests",
  "Archetype_Contract",
  "Constraint_Template",
  "Gator_Suite",
  "Hook_Definition",
  "Media_Provenance",
  "Still",
  "Stills",
  "Gotchas_Page",
  "Autonomy_Page",
  "Lab_D_Reference",
  "Autonomy_Mode",
  "Deploy_Workflow",
  "Linter_Workflow",
  "Conform_Workflow",
];

let failures = 0;

function fail(prop, file, line, message) {
  const rel = path.relative(root, file) || file;
  console.error(`PROPERTY ${prop} ${rel}:${line} ${message}`);
  failures += 1;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function listMdx() {
  return fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(docsDir, f))
    .sort();
}

// ---------------------------------------------------------------------------
// Parse layer: shared products, built once per page
// ---------------------------------------------------------------------------

function parseFrontmatter(text) {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const body = text.slice(4, end);
  const out = {};
  for (const line of body.split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

/**
 * Fence index: one entry per fenced block with its opening line, closing line,
 * language, meta, and content lines (all line numbers 1-based).
 */
function buildFenceIndex(lines) {
  const fences = [];
  let open = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (open === null) {
      const m = /^(\s*)(`{3,}|~{3,})\s*([^\s`~]*)\s*(.*)$/.exec(line);
      if (m) {
        open = {
          open: i + 1,
          marker: m[2],
          lang: m[3] || "",
          meta: (m[4] || "").trim(),
          content: [],
        };
      }
      continue;
    }
    const closeRe = new RegExp(
      `^\\s*${open.marker[0]}{${open.marker.length},}\\s*$`,
    );
    if (closeRe.test(line)) {
      open.close = i + 1;
      fences.push(open);
      open = null;
      continue;
    }
    open.content.push(line);
  }
  if (open) {
    // Unterminated fence: treat the rest of the file as fenced so nothing inside it
    // is mistaken for a heading.
    open.close = lines.length;
    fences.push(open);
  }
  return fences;
}

function fenceLineSet(fences) {
  const set = new Set();
  for (const f of fences) {
    for (let ln = f.open; ln <= f.close; ln++) set.add(ln);
  }
  return set;
}

/**
 * Heading normalisation (Requirement 12.15), in this order: strip the leading `##`
 * and surrounding whitespace; remove backticks, `*`, `_`, and link syntax keeping
 * link text; lower-case; collapse every run of non-alphanumeric characters to one
 * space; trim.
 */
function normaliseHeading(raw) {
  let t = raw.replace(/^#{1,6}\s*/, "").trim();
  t = t.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  t = t.replace(/[`*_]/g, "");
  t = t.toLowerCase();
  t = t.replace(/[^a-z0-9]+/g, " ");
  return t.trim();
}

function headingText(raw) {
  return raw.replace(/^#{1,6}\s*/, "").trim();
}

function slugifyHeading(raw) {
  let t = headingText(raw);
  t = t.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  t = t.replace(/[`*_]/g, "");
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildHeadings(lines, fenced) {
  const headings = [];
  for (let i = 0; i < lines.length; i++) {
    if (fenced.has(i + 1)) continue;
    const m = /^(#{1,6})\s+(.*)$/.exec(lines[i]);
    if (!m) continue;
    headings.push({
      level: m[1].length,
      line: i + 1,
      raw: lines[i],
      text: headingText(lines[i]),
      normalised: normaliseHeading(lines[i]),
      slug: slugifyHeading(lines[i]),
    });
  }
  return headings;
}

/**
 * Section index for `##` and `###` headings. A section runs from its heading to the
 * next heading of the same or shallower level. Contents are classified so later
 * properties can ask "does this section carry a table / screenshot / fence / ordered
 * list / admonition" without re-scanning.
 */
function buildSections(lines, headings, fences, fenced) {
  const sections = [];
  for (const h of headings) {
    if (h.level !== 2 && h.level !== 3) continue;
    let end = lines.length;
    for (const other of headings) {
      if (other.line > h.line && other.level <= h.level) {
        end = other.line - 1;
        break;
      }
    }
    const body = lines.slice(h.line, end);
    const bodyStart = h.line + 1;
    const classes = {
      table: false,
      still: false,
      fence: false,
      orderedList: false,
      admonition: false,
    };
    for (let k = 0; k < body.length; k++) {
      const ln = bodyStart + k;
      const line = body[k];
      if (line.includes("<Still")) classes.still = true;
      if (fenced.has(ln)) continue;
      if (/^\s*\|/.test(line)) classes.table = true;
      if (/^\s*\d+\.\s/.test(line)) classes.orderedList = true;
      if (/^\s*:::/.test(line)) classes.admonition = true;
    }
    for (const f of fences) {
      if (f.open >= bodyStart && f.open <= end) classes.fence = true;
    }
    sections.push({
      level: h.level,
      heading: h.text,
      normalised: h.normalised,
      slug: h.slug,
      headingLine: h.line,
      startLine: bodyStart,
      endLine: end,
      contentLines: body,
      classes,
    });
  }
  return sections;
}

/**
 * Source declaration index (Decision D14), keyed to fences. A declaration counts when
 * it sits in the 3 lines before the opening fence or the 3 lines after the closing
 * fence (Requirement 12.2). A fence with no declaration is not an Embedded_Artifact.
 */
const SOURCE_DECL_RE =
  /^Source:\s+\[`([^`]+)`\]\((\S+?)\)(?:\s+lines\s+(\d+-\d+(?:,\d+-\d+)*))?\s*$/;

function buildSourceDeclarations(lines, fences) {
  const declarations = [];
  fences.forEach((f, fenceIndex) => {
    const windows = [];
    for (let ln = f.open - 3; ln < f.open; ln++) if (ln >= 1) windows.push(ln);
    for (let ln = f.close + 1; ln <= f.close + 3; ln++) {
      if (ln <= lines.length) windows.push(ln);
    }
    for (const ln of windows) {
      const m = SOURCE_DECL_RE.exec(lines[ln - 1].trim());
      if (!m) continue;
      const ranges = (m[3] || "")
        .split(",")
        .filter(Boolean)
        .map((r) => {
          const [a, b] = r.split("-").map(Number);
          return { from: a, to: b };
        });
      declarations.push({
        line: ln,
        fenceIndex,
        fence: f,
        declaredPath: m[1],
        url: m[2],
        ranges,
        isExcerpt: ranges.length > 0,
      });
      break;
    }
  });
  return declarations;
}

/** Ordered-list index: runs of consecutive `N.` items with their visible numbers. */
function buildOrderedLists(lines, fenced) {
  const lists = [];
  let current = null;
  for (let i = 0; i < lines.length; i++) {
    const ln = i + 1;
    const line = lines[i];
    if (fenced.has(ln)) continue;
    const m = /^(\s*)(\d+)\.\s+(.*)$/.exec(line);
    if (m) {
      if (current && current.indent === m[1].length) {
        current.numbers.push(Number(m[2]));
        current.endLine = ln;
      } else {
        if (current) lists.push(current);
        current = {
          startLine: ln,
          endLine: ln,
          indent: m[1].length,
          numbers: [Number(m[2])],
        };
      }
      continue;
    }
    // A blank line or continuation keeps the run open; anything else closes it.
    if (current && !/^\s*$/.test(line) && !/^\s+\S/.test(line)) {
      lists.push(current);
      current = null;
    }
  }
  if (current) lists.push(current);
  return lists.map((l) => ({
    startLine: l.startLine,
    endLine: l.endLine,
    count: l.numbers.length,
    numbers: l.numbers,
  }));
}

function extractStills(text) {
  const results = [];
  const re = /<Still\s+([\s\S]*?)\/>/g;
  let m;
  while ((m = re.exec(text))) {
    const block = m[1];
    const src = /src="([^"]+)"/.exec(block)?.[1];
    const caption = /caption="([^"]*)"/.exec(block)?.[1];
    const line = text.slice(0, m.index).split(/\n/).length;
    results.push({
      src,
      caption,
      line,
      index: m.index,
      end: m.index + m[0].length,
    });
  }
  return results;
}

/**
 * Reader-prose projection (Requirement 20.5), applying the four removal steps in
 * order: fenced code blocks including their fence lines and meta; inline code spans;
 * JSX component names and their import statements; JSX attribute *names* only.
 *
 * Attribute *values* survive on purpose — a `caption` or `alt` string is Reader prose
 * that Requirement 20.2 names explicitly. Line numbering is preserved so a later
 * property can report a line.
 */
function buildReaderProse(lines, fenced) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const ln = i + 1;
    // 1. fenced code blocks, fence lines and meta included
    if (fenced.has(ln)) {
      out.push("");
      continue;
    }
    let line = lines[i];
    // 2. inline code spans
    line = line.replace(/`[^`]*`/g, " ");
    // 3. JSX component names and their imports
    if (/^\s*import\s.+from\s+["']/.test(line)) {
      out.push("");
      continue;
    }
    line = line.replace(/<\/?[A-Z][A-Za-z0-9]*/g, "<");
    // 4. JSX attribute names only; the quoted value stays
    line = line.replace(/\b[A-Za-z][A-Za-z0-9-]*=(?=["'{])/g, "");
    out.push(line);
  }
  return { lines: out, text: out.join("\n") };
}

function parsePage(file) {
  const text = read(file);
  const lines = text.split(/\r?\n/);
  const fences = buildFenceIndex(lines);
  const fenced = fenceLineSet(fences);
  const headings = buildHeadings(lines, fenced);
  const sections = buildSections(lines, headings, fences, fenced);
  const slug = path.basename(file, ".mdx");
  return {
    file,
    slug,
    text,
    lines,
    fences,
    fenced,
    headings,
    sections,
    frontmatter: parseFrontmatter(text),
    stills: extractStills(text),
    sourceDeclarations: buildSourceDeclarations(lines, fences),
    orderedLists: buildOrderedLists(lines, fenced),
    headingSequence: headings
      .filter((h) => h.level === 2)
      .map((h) => h.normalised),
    headingSlugs: {
      level2: new Set(headings.filter((h) => h.level === 2).map((h) => h.slug)),
      level3: new Set(headings.filter((h) => h.level === 3).map((h) => h.slug)),
    },
    readerProse: buildReaderProse(lines, fenced),
    lineOf: (idx) => text.slice(0, idx).split(/\n/).length || 1,
    firstLevel2Line: headings.find((h) => h.level === 2)?.line ?? null,
  };
}

/** Ordered slug chain from the sidebar array; `index` stands in for the `/` link. */
function buildSidebar(astroCfg) {
  const start = astroCfg.indexOf("sidebar: [");
  const block = start === -1 ? astroCfg : astroCfg.slice(start);
  const entries = [];
  const re =
    /\{\s*label:\s*"([^"]+)"\s*,\s*(?:slug:\s*"([^"]+)"|link:\s*"([^"]+)")\s*,?\s*\}/g;
  let m;
  while ((m = re.exec(block))) {
    const line = astroCfg.slice(0, start + m.index).split(/\n/).length || 1;
    entries.push({
      label: m[1],
      slug: m[2] ?? null,
      link: m[3] ?? null,
      line,
    });
  }
  return {
    entries,
    labels: entries.map((e) => e.label),
    slugs: entries.filter((e) => e.slug).map((e) => e.slug),
    // The reading order the spine thread follows: the landing page, then every slug.
    chain: entries.map((e) => e.slug ?? "index"),
  };
}

/** dist/ HTML text-node walk with `<pre>` and `<code>` subtrees excluded. */
function buildDistTextNodes() {
  if (!fs.existsSync(distDir)) return null;
  const files = [];
  (function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.endsWith(".html")) files.push(p);
    }
  })(distDir);
  const out = [];
  for (const htmlFile of files.sort()) {
    const html = read(htmlFile);
    // Blank out <pre> and <code> subtrees, keeping newline count so line numbers hold.
    //
    // This exclusion is mandatory for Property 30, and it is a design decision rather
    // than an implementation shortcut. Every Embedded_Artifact lands inside
    // <pre><code> after rendering, so read literally Requirement 20.8 would report
    // exactly the identifiers Requirement 20.6 exempts and make Requirement 3.7's
    // character-for-character quoting unsatisfiable. Excluding code subtrees is the
    // only reading under which 20.6, 20.7, and 20.8 cohere.
    let masked = html.replace(/<(pre|code)\b[\s\S]*?<\/\1>/gi, (block) =>
      block.replace(/[^\n]/g, " "),
    );
    // Requirement 20.7's single rendering exemption, carried through to rendered
    // output: the `:::note[Still pending]` admonition title renders as a
    // `starlight-aside__title` element. Only titles that actually carry the pinned
    // string are masked, so an ordinary aside title stays in the scan.
    masked = masked.replace(
      /<p[^>]*class="[^"]*starlight-aside__title[^"]*"[^>]*>[\s\S]*?<\/p>/gi,
      (block) =>
        /Still pending/.test(block) ? block.replace(/[^\n]/g, " ") : block,
    );
    const nodes = [];
    const re = />([^<]+)</g;
    let m;
    while ((m = re.exec(masked))) {
      const raw = m[1];
      if (!raw.trim()) continue;
      nodes.push({
        text: raw,
        line: masked.slice(0, m.index).split(/\n/).length || 1,
      });
    }
    out.push({ file: htmlFile, html, nodes });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Shared helpers over the parse products
// ---------------------------------------------------------------------------

function stripForSentences(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/:::[\s\S]*?:::/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#+\s.*$/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceCount(text) {
  const cleaned = stripForSentences(text);
  if (!cleaned) return 0;
  const matches = cleaned.match(/[.!?](?=\s|$)/g);
  return matches ? matches.length : 0;
}

function captionSentenceOk(caption) {
  if (!caption) return false;
  if (caption.length > 120) return false;
  // Ignore periods inside path-like tokens (.kiro, demo-nginx.dev.example.com)
  const normalized = caption.replace(/\b[\w-]*\.[\w.-]+\b/g, "X");
  const terms = normalized.match(/[.!?]/g) || [];
  if (terms.length !== 1) return false;
  return /[.!?]$/.test(caption.trim());
}

/**
 * First Markdown table on a page: a line of `|` cells immediately followed by a
 * delimiter row. Returns its 1-based line number, or null. Fenced lines are skipped
 * so a table quoted inside an artifact is not mistaken for a rendered one.
 */
function findTableLine(page) {
  for (let i = 0; i + 1 < page.lines.length; i++) {
    const ln = i + 1;
    if (page.fenced.has(ln) || page.fenced.has(ln + 1)) continue;
    if (!/^\s*\|/.test(page.lines[i])) continue;
    const delim = page.lines[i + 1];
    if (/^\s*\|[\s:|-]+\|\s*$/.test(delim) && delim.includes("-")) return ln;
  }
  return null;
}

/**
 * The block enclosing a given 1-based line: the run of non-blank lines around it,
 * narrowed to the ordered-list item containing it when the run is a list. The
 * narrowing matters for Property 25 — without it a three-item list is one block, so
 * an ordinal on item 1 would vouch for items 2 and 3 as well.
 */
function enclosingBlock(page, line) {
  let start = line;
  let end = line;
  while (start > 1 && !/^\s*$/.test(page.lines[start - 2])) start -= 1;
  while (end < page.lines.length && !/^\s*$/.test(page.lines[end])) end += 1;
  let itemStart = null;
  for (let ln = line; ln >= start; ln -= 1) {
    if (/^\s*\d+\.\s/.test(page.lines[ln - 1])) {
      itemStart = ln;
      break;
    }
  }
  if (itemStart !== null) {
    let itemEnd = itemStart;
    for (let ln = itemStart + 1; ln <= end; ln += 1) {
      if (/^\s*\d+\.\s/.test(page.lines[ln - 1])) break;
      itemEnd = ln;
    }
    return {
      start: itemStart,
      end: itemEnd,
      orderedListItem: true,
      text: page.lines.slice(itemStart - 1, itemEnd).join("\n"),
    };
  }
  return {
    start,
    end,
    orderedListItem: false,
    text: page.lines.slice(start - 1, end).join("\n"),
  };
}

/** Blank-line-separated blocks of a section body, each with its first line number. */
function splitBlocks(contentLines, startLine) {
  const blocks = [];
  let current = null;
  contentLines.forEach((line, k) => {
    if (/^\s*$/.test(line)) {
      current = null;
      return;
    }
    if (!current) {
      current = { line: startLine + k, lines: [] };
      blocks.push(current);
    }
    current.lines.push(line);
  });
  return blocks;
}

// Property 10 (revised): no page presents the live path as in scope.
// Scans page content *and* sidebar label strings: every "Lab D" occurrence must
// have "out of scope" or "not in scope" within 80 characters. The mandated label
// `Lab D (out of scope)` satisfies the window inside its own string, so the
// sidebar is an ordinary case of the proximity rule rather than an exception.
function scanLabD(haystack, file, lineFor) {
  const re = /Lab D/gi;
  let m;
  while ((m = re.exec(haystack))) {
    const window = haystack.slice(
      Math.max(0, m.index - 80),
      m.index + 80 + m[0].length,
    );
    if (!/out of scope|not in scope/i.test(window)) {
      fail(
        10,
        file,
        lineFor(m.index),
        'Lab D mention must say "out of scope" within 80 characters',
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Corpus
// ---------------------------------------------------------------------------

const astroCfg = read(astroCfgPath);
const sidebar = buildSidebar(astroCfg);
const pages = listMdx().map(parsePage);
const pageBySlug = new Map(pages.map((p) => [p.slug, p]));
const lessonPages = LESSON_PAGES.map((s) => pageBySlug.get(s)).filter(Boolean);
const landing = pageBySlug.get("index") ?? null;
const distPages = buildDistTextNodes();

// README joins the corpus for the vocabulary scan only. It is the single file
// outside src/content/docs/ that Property 29 touches (Requirement 20.12).
const readme = fs.existsSync(readmePath)
  ? (() => {
      const text = read(readmePath);
      const lines = text.split(/\r?\n/);
      const fences = buildFenceIndex(lines);
      const fenced = fenceLineSet(fences);
      return {
        file: readmePath,
        text,
        lines,
        readerProse: buildReaderProse(lines, fenced),
      };
    })()
  : null;

/**
 * `hero.tagline` value, folded across continuation lines, with its line number.
 * parseFrontmatter is deliberately flat and cannot reach a nested key, and Property
 * 24's second conjunct needs the tagline in isolation rather than as part of the
 * page source.
 */
function extractHeroTagline(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const fmLines = text.slice(4, end).split(/\r?\n/);
  for (let i = 0; i < fmLines.length; i++) {
    const m = /^(\s+)tagline:\s*(.*)$/.exec(fmLines[i]);
    if (!m) continue;
    const indent = m[1].length;
    const parts = [m[2].trim()];
    for (let k = i + 1; k < fmLines.length; k++) {
      const next = fmLines[k];
      if (/^\s*$/.test(next)) break;
      const nextIndent = next.length - next.trimStart().length;
      if (nextIndent <= indent) break;
      if (/^\s*(?:-\s|[A-Za-z0-9_-]+:)/.test(next)) break;
      parts.push(next.trim());
    }
    let value = parts.join(" ").trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // +2 for the opening `---` line and 1-based numbering.
    return { value, line: i + 2 };
  }
  return null;
}

// Landing page indices for Property 24: where the first mechanism term appears in
// source order, and where each of the three anchors appears. Mechanism terms are
// matched case-insensitively with an optional plural `s`, so `skill` covers `skills`
// and `Kustomize` covers `kustomize`.
const MECHANISM_RE_SOURCE = `\\b(?:${MECHANISM_TERMS.join("|")})s?\\b`;

const landingIndex = landing
  ? (() => {
      const src = landing.text;
      let firstMechanism = null;
      for (const term of MECHANISM_TERMS) {
        const m = new RegExp(`\\b${term}s?\\b`, "i").exec(src);
        if (!m) continue;
        if (!firstMechanism || m.index < firstMechanism.index) {
          firstMechanism = {
            term,
            matched: m[0],
            index: m.index,
            line: landing.lineOf(m.index),
          };
        }
      }
      const anchors = LANDING_ANCHORS.map(({ name, re }) => {
        const m = re.exec(src);
        return m
          ? { name, index: m.index, line: landing.lineOf(m.index) }
          : { name, index: null, line: null };
      });
      return { firstMechanism, anchors, tagline: extractHeroTagline(src) };
    })()
  : null;

// Spine thread products: the declared previous/next targets per page, and the
// targets the ordered slug chain expects.
const SPINE_PREV_RE = /^Before this:\s+\[([^\]]*)\]\(([^)]+)\)/m;
const SPINE_NEXT_RE = /^Next:\s+\[([^\]]*)\]\(([^)]+)\)/m;

// The grammar Properties 26 and 27 assert (Decision D18): the literal prefix and one
// space, exactly one inline link first on the line, then a sentence. The trailing
// `\s+\S` is what rejects a bare link with no sentence after it.
const SPINE_PREV_STRICT = /^Before this: \[[^\]]+\]\(([^)]+)\)\s+\S/m;
const SPINE_NEXT_STRICT = /^Next: \[[^\]]+\]\(([^)]+)\)\s+\S/m;
const SPINE_LINE_CAP = 200;
const SPINE_NEXT_WINDOW = 500;

const spine = (() => {
  const chain = sidebar.chain;
  const rows = chain.map((slug, i) => {
    const page = pageBySlug.get(slug);
    const prevSlug = i === 0 ? null : chain[i - 1];
    const nextSlug = i === chain.length - 1 ? null : chain[i + 1];
    const targetFor = (target, fromLanding) => {
      if (target === null) return null;
      if (target === "index") return "../";
      return fromLanding ? `/${target}/` : `../${target}/`;
    };
    const fromLanding = slug === "index";
    return {
      slug,
      page: page ?? null,
      expectedPrev: targetFor(prevSlug, fromLanding),
      expectedNext: targetFor(nextSlug, fromLanding),
      declaredPrev: page ? (SPINE_PREV_RE.exec(page.text)?.[2] ?? null) : null,
      declaredNext: page ? (SPINE_NEXT_RE.exec(page.text)?.[2] ?? null) : null,
    };
  });
  const prevLinks = rows.filter((r) => r.declaredPrev).length;
  const nextLinks = rows.filter((r) => r.declaredNext).length;
  const intact = rows.every(
    (r) =>
      r.declaredPrev === r.expectedPrev && r.declaredNext === r.expectedNext,
  );
  return { rows, prevLinks, nextLinks, intact };
})();

// Vocabulary scan product: matches of the 27 banned identifiers in Reader prose.
// The `:::note[Still pending]` admonition title is the single rendering exemption
// (Requirement 20.7), so it is masked before matching.
const BANNED_RE = new RegExp(`\\b(${BANNED_IDENTIFIERS.join("|")})\\b`, "g");

function vocabularyMatches(prose, file) {
  const hits = [];
  prose.lines.forEach((line, i) => {
    const masked = line.replace(/:::note\[Still pending\]/g, ":::note[]");
    let m;
    BANNED_RE.lastIndex = 0;
    while ((m = BANNED_RE.exec(masked))) {
      hits.push({ file, line: i + 1, identifier: m[1] });
    }
  });
  return hits;
}

const vocabulary = (() => {
  const hits = [];
  for (const p of pages) hits.push(...vocabularyMatches(p.readerProse, p.file));
  if (readme) hits.push(...vocabularyMatches(readme.readerProse, readme.file));
  for (const entry of sidebar.entries) {
    BANNED_RE.lastIndex = 0;
    let m;
    while ((m = BANNED_RE.exec(entry.label))) {
      hits.push({ file: astroCfgPath, line: entry.line, identifier: m[1] });
    }
  }
  return hits;
})();

const declaredArtifacts = pages.reduce(
  (n, p) => n + p.sourceDeclarations.length,
  0,
);

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

// Property 1: Sidebar and content pages are in exact correspondence.
// Eleven pages, ten slugs after the scope expansion; the statement is unchanged.
for (const entry of sidebar.entries) {
  const line = entry.line;
  scanLabD(entry.label, astroCfgPath, () => line);
}
const sidebarSlugs = sidebar.slugs;
const pageSlugs = pages.map((p) => p.slug).filter((s) => s !== "index");
for (const slug of sidebarSlugs) {
  if (!pageSlugs.includes(slug)) {
    fail(1, astroCfgPath, 1, `sidebar slug missing page: ${slug}`);
  }
}
for (const slug of pageSlugs) {
  if (!sidebarSlugs.includes(slug)) {
    fail(
      1,
      path.join(docsDir, `${slug}.mdx`),
      1,
      `orphan page not in sidebar: ${slug}`,
    );
  }
}

// Property 23: Sidebar labels obey the cap, the pin, and the slug set.
//
// Three conjuncts because they fail three different ways, and each one is a thing the
// narrative revision made newly breakable. The cap is asserted over every entry, not
// over a snapshot of today's eleven. The pin is what keeps Property 10 satisfiable.
// The slug set is what Property 1 cannot see: Property 1 asserts set equality between
// Sidebar slugs and page basenames, so renaming `gotchas` to `scars` in both places
// passes it while breaking every inbound link — this conjunct pins the slugs against
// the list Requirement 2.6 names.
for (const entry of sidebar.entries) {
  if (entry.label.length > SIDEBAR_LABEL_CAP) {
    fail(
      23,
      astroCfgPath,
      entry.line,
      `sidebar label "${entry.label}" is ${entry.label.length} characters; the cap is ${SIDEBAR_LABEL_CAP}`,
    );
  }
  const pinned = entry.slug ? PINNED_SIDEBAR_LABELS[entry.slug] : undefined;
  if (pinned !== undefined && entry.label !== pinned) {
    fail(
      23,
      astroCfgPath,
      entry.line,
      `sidebar label for slug \`${entry.slug}\` is "${entry.label}"; Requirement 2.11 pins it to "${pinned}"`,
    );
  }
}
for (const slug of REQUIRED_SIDEBAR_SLUGS) {
  if (!sidebarSlugs.includes(slug)) {
    fail(
      23,
      astroCfgPath,
      1,
      `sidebar is missing the Requirement 2.6 slug \`${slug}\``,
    );
  }
}
for (const slug of sidebarSlugs) {
  if (!REQUIRED_SIDEBAR_SLUGS.includes(slug)) {
    fail(
      23,
      astroCfgPath,
      1,
      `sidebar slug \`${slug}\` is not one of the Requirement 2.6 sidebar slugs`,
    );
  }
}

for (const page of pages) {
  const { file, text, frontmatter: fm, lineOf, stills } = page;

  // Property 2: frontmatter is usable.
  // Deliberately not checked: `title` is asserted present and non-empty, never
  // pinned to a string and never length-capped. Requirement 2.13 makes a
  // 58-character title beside a 22-character Sidebar label legal, and the label cap
  // lives in Property 23 over astro.config.mjs — a different value in a different
  // file. Only `description` carries a length cap here.
  if (!fm || !fm.title?.trim() || !fm.description?.trim()) {
    fail(
      2,
      file,
      1,
      "frontmatter must include non-empty title and description",
    );
  } else if (fm.description.length > 160) {
    fail(
      2,
      file,
      1,
      `frontmatter description must be <= 160 characters (got ${fm.description.length})`,
    );
  }

  // Property 4 half: no raw markdown images
  const mdImg = /!\[[^\]]*\]\([^)]+\)/.exec(text);
  if (mdImg) {
    fail(
      4,
      file,
      lineOf(mdImg.index),
      "raw Markdown image syntax is prohibited; use <Still />",
    );
  }

  // Property 3 + 5
  for (const s of stills) {
    if (!s.src) {
      fail(3, file, s.line, "Still missing src");
      continue;
    }
    const abs = path.join(publicDir, s.src);
    if (!fs.existsSync(abs)) {
      fail(3, file, s.line, `Still not vendored: public/${s.src}`);
    }
    if (!captionSentenceOk(s.caption ?? "")) {
      fail(
        5,
        file,
        s.line,
        `caption must be one sentence <= 120 chars (got length ${s.caption?.length ?? 0})`,
      );
    }
  }

  // Property 6, third conjunct: no screenshot appears above the page's first `##`.
  // This is what keeps the `Before this:` line and the page's spine claim clear of
  // the two-sentence cap by construction rather than by care. All eleven pages.
  const firstL2 = page.firstLevel2Line;
  for (const s of stills) {
    if (firstL2 === null || s.line < firstL2) {
      fail(
        6,
        file,
        s.line,
        "no <Still /> may appear above the page's first level-2 heading",
      );
    }
  }

  // Property 7: pending screenshots are labelled, never faked.
  // One note may list several PNG filenames alongside a destination path under
  // this docs repo (`public/media/`) or a legacy factory media path.
  const pendingRe = /:::note\[Still pending\]([\s\S]*?):::/g;
  let pm;
  while ((pm = pendingRe.exec(text))) {
    const body = pm[1];
    const pngs = body.match(/[\w.-]+\.png/g) ?? [];
    const hasDest = /public\/media\//.test(body) || /docs\/media\//.test(body);
    if (pngs.length === 0 || !hasDest) {
      fail(
        7,
        file,
        lineOf(pm.index),
        "Still pending note must name at least one .png and a public/media/ (or docs/media/) path",
      );
    }
  }

  // Property 8: placeholders always carry a replacement warning.
  if (PLACEHOLDERS.some((p) => text.includes(p))) {
    const caution = /:::caution([\s\S]*?):::/g;
    let ok = false;
    let cm;
    while ((cm = caution.exec(text))) {
      if (/replac/i.test(cm[1])) ok = true;
    }
    if (!ok) {
      fail(
        8,
        file,
        1,
        "placeholder IDs require a :::caution callout mentioning replacement",
      );
    }
  }

  // Property 9: Source_Factory link when factory commands appear
  if (FACTORY_TOKENS.some((t) => text.includes(t))) {
    if (!text.includes(SOURCE_FACTORY_URL)) {
      fail(9, file, 1, `factory commands require link ${SOURCE_FACTORY_URL}`);
    }
  }

  // Property 10 (revised): Lab D out of scope — page content half
  scanLabD(text, file, lineOf);
}

// Property 6, first conjunct: consecutive screenshot pairs *within one `##` section*
// carry at most two sentences of prose between them, over the six Lesson_Pages.
// The pairwise walk is scoped to a section (Decision D12): Requirement 12.3 still
// mandates ordered lists on `lab-a` and `lab-c`, and on `lab-b` the prose at a
// section boundary is a six-row table plus two excerpt walkthroughs.
for (const page of lessonPages) {
  const level2 = page.sections.filter((s) => s.level === 2);
  for (const section of level2) {
    const from = page.lines.slice(0, section.startLine - 1).join("\n").length;
    const to = page.lines.slice(0, section.endLine).join("\n").length;
    const inSection = page.stills.filter(
      (s) => s.index >= from && s.end <= to + 1,
    );
    for (let i = 0; i < inSection.length - 1; i++) {
      const between = page.text.slice(inSection[i].end, inSection[i + 1].index);
      const count = sentenceCount(between);
      if (count > 2) {
        fail(
          6,
          page.file,
          inSection[i].line,
          `more than two sentences between consecutive Stills in section "${section.heading}" (${count})`,
        );
      }
    }
  }
}

// Property 11: no factory implementation tree is present.
for (const name of FORBIDDEN) {
  const p = path.join(root, name);
  if (fs.existsSync(p)) {
    fail(11, p, 1, `forbidden Source_Factory tree present: ${name}/`);
  }
}
const kiroDir = path.join(root, ".kiro");
// `specs` is the system of record for this repo; `settings` is untracked local
// Kiro editor state (MCP config), not Source_Factory factory config. Property 11
// guards against checked-in steering, skills, hooks, and agents.
const KIRO_ALLOWED = new Set(["specs", "settings"]);
if (fs.existsSync(kiroDir)) {
  for (const entry of fs.readdirSync(kiroDir)) {
    if (!KIRO_ALLOWED.has(entry)) {
      fail(
        11,
        path.join(kiroDir, entry),
        1,
        `runnable factory config under .kiro/ other than specs/: ${entry}`,
      );
    }
  }
}
// Second conjunct (Requirement 15.9): no path anywhere in the tree contains the
// substring `apps/demo-nginx`. Lab C quotes seven files from that tree, and the
// obvious next move is to paste a block into a real file to run `kustomize build`.
// A root-level check would miss src/scratch/apps/demo-nginx/deployment.yaml.
const TREE_WALK_SKIP = new Set(["node_modules", "dist", ".astro", ".git"]);
(function walkTree(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (TREE_WALK_SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    const rel = path.relative(root, p).split(path.sep).join("/");
    if (rel.includes("apps/demo-nginx")) {
      fail(11, p, 1, `path contains apps/demo-nginx: ${rel}`);
      continue;
    }
    if (ent.isDirectory()) walkTree(p);
  }
})(root);

// Property 12: a dedicated tradeoff heading uses the allowed vocabulary.
//
// The `/^## Tradeoff\s*$/m` presence assertion that used to live here is GONE, and
// nothing replaces it. Requirement 12.13 instructs this checker to accept a lesson
// page that carries no tradeoff heading at all, and Requirement 12.4 permits the
// tradeoff as running prose with no heading and no labelled fields. So, stated
// plainly so nobody re-adds it believing it was an oversight: **no property in this
// file asserts that a tradeoff exists.** That is Requirement 12.12's review judgment
// and design OQ10's recorded risk, accepted deliberately.
//
// The labels `Choice`, `Alternative`, `Reason` are not required and not checked
// either — a labelled triple is exactly the form the review rejected.
//
// What is left keeps a reviewer's scan predictable: where an author does choose a
// tradeoff heading, the wording is one of four rather than one of infinity.
for (const page of lessonPages) {
  for (const h of page.headings) {
    const squashed = h.normalised.replace(/\s+/g, "");
    const looksLikeTradeoff =
      squashed.startsWith("tradeoff") ||
      h.normalised.includes("this way") ||
      h.normalised.includes("this costs");
    if (!looksLikeTradeoff) continue;
    if (!TRADEOFF_VOCABULARY.includes(h.text)) {
      fail(
        12,
        page.file,
        h.line,
        `tradeoff heading "${h.text}" is not one of ${TRADEOFF_VOCABULARY.map((v) => `"${v}"`).join(", ")}`,
      );
    }
  }
}

// Property 15: every Embedded_Artifact declares its source.
//
// Scope, stated because it is narrower than it first looks: a fence with no Source
// declaration line is not an Embedded_Artifact and is not checked at all — exactly
// Requirement 12.2's "counts as an Embedded_Artifact only if". Reader command blocks,
// expected-output blocks, and Mermaid diagrams are ordinary fences.
//
// What this proves is that a path is declared, visible on the page, adjacent to its
// block, and internally consistent with its own link — offline, with no factory clone
// present. It does NOT prove the quoted bytes match the named file. That is Property
// 21, which is opt-in and local only. Real factory YAML pasted with no declaration is
// indistinguishable from an illustrative snippet here and stays a review item.
for (const page of pages) {
  const declaredAt = new Set(page.sourceDeclarations.map((d) => d.line));
  const windowLines = new Set();
  for (const f of page.fences) {
    for (let ln = f.open - 3; ln < f.open; ln++)
      if (ln >= 1) windowLines.add(ln);
    for (let ln = f.close + 1; ln <= f.close + 3; ln++) {
      if (ln <= page.lines.length) windowLines.add(ln);
    }
  }

  page.lines.forEach((raw, i) => {
    const ln = i + 1;
    // A `Source:` line inside a fence is quoted content, not a declaration.
    if (page.fenced.has(ln)) return;
    if (!/^\s*Source:/.test(raw)) return;
    if (declaredAt.has(ln)) return;
    if (!SOURCE_DECL_RE.test(raw.trim())) {
      fail(
        15,
        page.file,
        ln,
        "Source declaration must read: Source: [`path`](" +
          SOURCE_FACTORY_URL +
          "/blob/main/path) optionally followed by ` lines A-B,C-D`, with no trailing period",
      );
    } else if (!windowLines.has(ln)) {
      fail(
        15,
        page.file,
        ln,
        "Source declaration must sit in the 3 lines before an opening fence or the 3 lines after a closing fence",
      );
    } else {
      fail(
        15,
        page.file,
        ln,
        "second Source declaration in the same fence window; one declaration per block",
      );
    }
  });

  for (const d of page.sourceDeclarations) {
    const expected = `${SOURCE_FACTORY_URL}/blob/main/${d.declaredPath}`;
    if (d.url !== expected) {
      fail(
        15,
        page.file,
        d.line,
        `declared path \`${d.declaredPath}\` disagrees with link target ${d.url}; expected ${expected}`,
      );
    }
  }
}

for (const slug of ARTIFACT_PAGES) {
  const page = pageBySlug.get(slug);
  if (!page) continue; // a missing page is Property 1's report, not this one's
  if (page.sourceDeclarations.length === 0) {
    fail(
      15,
      page.file,
      1,
      "page carries no source-declared fenced block; Requirement 12.2 requires at least one",
    );
  }
}

// Property 18: Embedded_Artifact blocks obey the size and excerpt contract.
//
// The segment-length conjunct is what makes this strong with no factory clone
// present: a declaration of `lines 1-4,15-19,35-71` must have segments of 4, 5, and
// 37 lines, so quoting the wrong amount of text fails offline.
for (const page of pages) {
  for (const d of page.sourceDeclarations) {
    const content = d.fence.content;
    if (content.length > ARTIFACT_CONTENT_LINE_CAP) {
      fail(
        18,
        page.file,
        d.fence.open,
        `block holds ${content.length} content lines; the cap is ${ARTIFACT_CONTENT_LINE_CAP}`,
      );
    }

    const n = d.ranges.length;
    // No declared ranges means a whole-file quote: no omission points, so neither the
    // marker conjunct nor the segment conjunct has anything to say.
    if (n === 0) continue;

    const lang = (d.fence.lang || "").toLowerCase();
    const marker = ELISION_MARKERS[lang];
    if (!marker && n > 1) {
      fail(
        18,
        page.file,
        d.line,
        `\`${lang || "plain"}\` has no comment syntax, so no elision marker is legal and an excerpt cannot be expressed; declaration states ${n} ranges`,
      );
      continue;
    }

    const markerLines = marker
      ? content.filter((line) => line.trim() === marker)
      : [];
    if (markerLines.length !== n - 1) {
      fail(
        18,
        page.file,
        d.fence.open,
        `${n} declared ranges need exactly ${n - 1} \`${marker}\` marker line(s); found ${markerLines.length}`,
      );
      continue;
    }

    const segments = [[]];
    for (const line of content) {
      if (marker && line.trim() === marker) segments.push([]);
      else segments[segments.length - 1].push(line);
    }
    d.ranges.forEach((r, k) => {
      const declared = r.to - r.from + 1;
      if (segments[k].length !== declared) {
        fail(
          18,
          page.file,
          d.fence.open,
          `segment ${k + 1} is ${segments[k].length} lines, declared ${r.from}-${r.to} is ${declared} lines`,
        );
      }
    });
  }
}

// Property 16: command pages carry followable steps.
//
// Two pages, not six (Requirement 12.3 as revised). The numbering conjunct stays:
// a list authored `1. 1. 1.` renders correctly and reads wrongly in source, and a
// list that restarts mid-sequence is usually two lists that lost a blank line.
// Requirement 12.3's "observable result" clause is not asserted — a checker cannot
// tell a stated result from a restated action, so that stays a review judgment.
for (const slug of COMMAND_PAGES) {
  const page = pageBySlug.get(slug);
  if (!page) continue;
  const ok = page.orderedLists.some(
    (l) =>
      l.count >= 3 && l.count <= 15 && l.numbers.every((v, i) => v === i + 1),
  );
  if (!ok) {
    fail(
      16,
      page.file,
      1,
      "no ordered list of 3-15 items whose visible numbers run consecutively from 1",
    );
  }
}

// Property 17: a table or a screenshot never stands alone on a page.
//
// Evaluated per page, never per `##` section (Requirement 12.6 as revised states the
// scope change in its own text). The honest cost: the guarantee that a *particular*
// screenshot sits next to its evidence is gone — a section may now be a table and two
// frames with the page's artifact three sections away, and Requirement 14.5's
// structural half is implied only at page scope, which moves it further toward review.
// What is kept is what 12.6 was for: a page of nothing but tables and screenshots
// still fails, because a page-level implication with no artifact and no ordered steps
// anywhere is still unsatisfied.
for (const page of lessonPages) {
  const tableLine = findTableLine(page);
  const hasStill = page.stills.length > 0;
  if (tableLine === null && !hasStill) continue;
  const hasArtifact = page.sourceDeclarations.length > 0;
  const hasSteps = page.orderedLists.some((l) => l.count >= 3);
  if (!hasArtifact && !hasSteps) {
    fail(
      17,
      page.file,
      tableLine ?? page.stills[0].line,
      "page presents a table or a screenshot but carries no source-declared block and no ordered list of 3+ items anywhere",
    );
  }
}

// Property 19: every lesson page names a gotcha.
//
// The anchor branch is a genuine cross-file property, which is why it is checked
// rather than reviewed: a heading rename on the gotchas page silently dangles every
// inbound anchor and nothing else in the toolchain notices. Fragment membership is
// checked independent of the path form, so the relative-link convention is a
// readability choice rather than a checker dependency.
const gotchasPage = pageBySlug.get("gotchas") ?? null;
const gotchaAnchors = gotchasPage
  ? new Set([
      ...gotchasPage.headingSlugs.level2,
      ...gotchasPage.headingSlugs.level3,
    ])
  : new Set();

for (const page of lessonPages) {
  let satisfied = false;
  for (const section of page.sections) {
    if (!GOTCHA_VOCABULARY.includes(section.heading)) continue;
    if (sentenceCount(section.contentLines.join("\n")) >= 1) {
      satisfied = true;
      break;
    }
  }
  if (!satisfied) {
    const linkRe = /\[[^\]]*\]\(([^)\s]+)\)/g;
    let m;
    while ((m = linkRe.exec(page.text))) {
      const hash = m[1].indexOf("#");
      if (hash === -1) continue;
      const fragment = m[1].slice(hash + 1);
      if (fragment && gotchaAnchors.has(fragment)) {
        satisfied = true;
        break;
      }
    }
  }
  if (!satisfied) {
    fail(
      19,
      page.file,
      1,
      `page names no gotcha: no heading from ${GOTCHA_VOCABULARY.map((v) => `"${v}"`).join(", ")} carrying a sentence, and no link to a gotchas.mdx anchor`,
    );
  }
}

// Property 20: gotchas entries are symptom, then cause, then fix.
//
// This is the one uniform template the revision deliberately keeps. Requirement 12.14
// names Requirement 16.7's ordering as the gotchas page's structure of record, because
// a lookup surface is scanned rather than walked and scanning depends on every entry
// looking the same. Entries are `###`; group headings and the page's
// `## What goes wrong` element are `##` and are therefore not entries.
if (gotchasPage) {
  for (const entry of gotchasPage.sections.filter((s) => s.level === 3)) {
    const blocks = splitBlocks(entry.contentLines, entry.startLine);
    ENTRY_LABELS.forEach((label, k) => {
      const block = blocks[k];
      if (!block) {
        fail(
          20,
          gotchasPage.file,
          entry.headingLine,
          `entry "${entry.heading}" has no block ${k + 1}; expected one beginning ${label}`,
        );
        return;
      }
      if (!block.lines[0].trimStart().startsWith(label)) {
        fail(
          20,
          gotchasPage.file,
          block.line,
          `entry "${entry.heading}" block ${k + 1} begins "${block.lines[0].trim().slice(0, 24)}"; expected ${label}`,
        );
      }
    });
  }
}

// Property 22: live-cluster command blocks link the factory repo.
//
// Fenced block contents only, never prose, so `curl` does not fire on a page that
// merely mentions it.
for (const page of pages) {
  let hit = null;
  for (const f of page.fences) {
    for (let k = 0; k < f.content.length; k++) {
      const m = LIVE_CLUSTER_RE.exec(f.content[k]);
      if (m) {
        hit = { token: m[1], line: f.open + 1 + k };
        break;
      }
    }
    if (hit) break;
  }
  if (hit && !page.text.includes(SOURCE_FACTORY_URL)) {
    fail(
      22,
      page.file,
      hit.line,
      `\`${hit.token}\` command block requires link ${SOURCE_FACTORY_URL}`,
    );
  }
}

// Property 24: the landing page states the problem before any mechanism.
//
// Three conjuncts over the full source of index.mdx, frontmatter included. The check
// is on source *position*, which is why the design fixes the landing page's block
// order rather than trusting intent: the frontmatter `description` carries all three
// anchors, which puts them ahead of anything the body can say.
//
// The diagnostic names both indices it compared, deliberately (design risk R9). This
// check is sensitive to frontmatter key order, and a maintainer tidying frontmatter
// alphabetically would break it while leaving the rendered page identical — a
// diagnostic that only said "mechanism before numbers" would send that maintainer to
// the body copy, which is fine.
//
// Two limits stated rather than papered over. Term matching is lexical, so "hooked on
// this idea" would false-positive; accepted, because the alternative is part-of-speech
// tagging in a zero-dependency script, and the phrase does not appear. And Requirement
// 19.2's content half — that the page *states* re-deciding tree shape and drift no
// reviewer catches rather than merely containing the tokens — stays review-gated.
if (landing && landingIndex) {
  const { firstMechanism, anchors, tagline } = landingIndex;
  const present = anchors.filter((a) => a.index !== null);
  const firstAnchor = present.reduce(
    (best, a) => (best === null || a.index < best.index ? a : best),
    null,
  );

  if (
    firstMechanism &&
    firstAnchor &&
    firstAnchor.index > firstMechanism.index
  ) {
    fail(
      24,
      landing.file,
      firstMechanism.line,
      `mechanism term "${firstMechanism.matched}" at source index ${firstMechanism.index} (line ${firstMechanism.line}) precedes the first of the app count, hour count, or "drift" at source index ${firstAnchor.index} (line ${firstAnchor.line}, ${firstAnchor.name}); the problem must be stated first`,
    );
  } else if (firstMechanism && !firstAnchor) {
    fail(
      24,
      landing.file,
      firstMechanism.line,
      `mechanism term "${firstMechanism.matched}" at source index ${firstMechanism.index} (line ${firstMechanism.line}) has no preceding anchor: none of the app count, hour count, or "drift" appears anywhere`,
    );
  }

  if (!tagline) {
    fail(24, landing.file, 1, "no hero.tagline value found in frontmatter");
  } else {
    const t = new RegExp(MECHANISM_RE_SOURCE, "gi");
    let tm;
    while ((tm = t.exec(tagline.value))) {
      fail(
        24,
        landing.file,
        tagline.line,
        `hero.tagline names the mechanism "${tm[0]}"; Requirement 19.3 requires the tagline to state the cost only`,
      );
    }
  }

  for (const a of anchors) {
    if (a.index === null) {
      fail(24, landing.file, 1, `landing page never states the ${a.name}`);
    }
  }
}

// Property 25: the landing page presents the labs as an ordered sequence.
//
// Three conjuncts. The first two are Requirement 19.6's ordering and ordinal clauses;
// whether the list *reads* as steps is Requirement 19.1's review judgment.
//
// The third conjunct is vacuous today, and it is kept on purpose. Decision D17 removed
// the six-card grid and dropped the `Card` / `CardGrid` import from index.mdx, so there
// are no `<Card>` elements to enumerate. `<CardGrid>` is the obvious thing a future
// author reaches for on a splash page, and Requirement 19.7 exists to catch exactly
// that: three sibling tiles laid out side by side imply "doable in any order", which is
// the defect the review named. A conjunct that only runs once someone re-adds the cards
// is the correct shape for a regression guard.
if (landing) {
  const found = LAB_TOKENS.map((token) => {
    const index = landing.text.indexOf(token);
    return {
      token,
      index,
      line: index === -1 ? null : landing.lineOf(index),
    };
  });

  for (const f of found) {
    if (f.index === -1) {
      fail(25, landing.file, 1, `landing page never mentions ${f.token}`);
    }
  }

  const present = found.filter((f) => f.index !== -1);
  for (let i = 0; i < present.length - 1; i++) {
    if (present[i].index > present[i + 1].index) {
      fail(
        25,
        landing.file,
        present[i + 1].line,
        `${present[i + 1].token} first appears at source index ${present[i + 1].index} (line ${present[i + 1].line}), before ${present[i].token} at index ${present[i].index} (line ${present[i].line}); the labs must appear in order`,
      );
    }
  }

  for (const f of present) {
    const block = enclosingBlock(landing, f.line);
    if (block.orderedListItem) continue;
    if (ORDINAL_TOKEN_RE.test(block.text)) continue;
    fail(
      25,
      landing.file,
      f.line,
      `${f.token} sits in a block that is neither an ordered-list item nor carries an ordinal token from First, Second, Third, 1., 2., 3.`,
    );
  }

  const cardRe = /<Card\b([^>]*?)\/?>/g;
  let cm;
  while ((cm = cardRe.exec(landing.text))) {
    const title = /title="([^"]*)"/.exec(cm[1])?.[1];
    if (!title) continue;
    const lab = /Lab [ABC]/.exec(title);
    if (!lab) continue;
    if (ORDINAL_TOKEN_RE.test(title)) continue;
    fail(
      25,
      landing.file,
      landing.lineOf(cm.index),
      `<Card title="${title}" names ${lab[0]} with no ordinal token; sibling cards present the labs as equal-weight choices`,
    );
  }
}

// Properties 26 and 27: the spine thread.
//
// Both expectations are derived from the ordered slug chain built out of the sidebar
// array, never from hard-coded pairs. A sidebar reorder is the failure these catch,
// and the sidebar is the one file a maintainer edits when adding a page — so the
// diagnostics name the pages either side of the move rather than just saying "wrong
// target".
//
// The link *target* is asserted and the link *text* is not. Text is Reader prose and
// Property 29 already scans it; coupling it to the Sidebar label would make a label
// edit cascade into ten pages and make Requirements 2.6 and 19.13 co-dependent for no
// gain.
//
// The 200-character line cap is Decision D18's, and it is what makes Property 27's
// window trustworthy: a `Next:` line longer than 200 characters could be bisected by
// the 500-character boundary and would then fail on a page that is actually correct.
// Asserting the cap turns that confusing diagnostic into a precise one.
//
// Two properties rather than one bidirectional check: the exemptions differ (the first
// page in Sidebar order owes no back link, the last owes no forward link) and the
// position rules differ (above the first `##` versus the final 500 characters), so one
// property would need two input spaces, two checks, and a traceability line naming two
// criteria that fail independently.
spine.rows.forEach((row, i) => {
  const page = row.page;
  // A slug with no page is Property 1's report, not this one's.
  if (!page) return;
  const chain = sidebar.chain;
  const prevSlug = i === 0 ? null : chain[i - 1];
  const nextSlug = i === chain.length - 1 ? null : chain[i + 1];

  if (prevSlug !== null) {
    const introEnd =
      page.firstLevel2Line === null
        ? page.lines.length
        : page.firstLevel2Line - 1;
    const intro = page.lines.slice(0, introEnd).join("\n");
    const m = SPINE_PREV_STRICT.exec(intro);
    if (!m) {
      const anywhere = SPINE_PREV_STRICT.exec(page.text);
      const where = anywhere
        ? ` a matching line exists at line ${page.lineOf(anywhere.index)}, below the first level-2 heading at line ${page.firstLevel2Line}`
        : "";
      fail(
        26,
        page.file,
        page.firstLevel2Line ?? 1,
        `no \`Before this: [text](target) sentence\` line above the first level-2 heading; \`${row.slug}\` follows \`${prevSlug}\` in Sidebar order.${where}`,
      );
    } else {
      const line = intro.slice(0, m.index).split(/\n/).length;
      if (m[1] !== row.expectedPrev) {
        fail(
          26,
          page.file,
          line,
          `\`Before this:\` targets ${m[1]}; \`${row.slug}\` follows \`${prevSlug}\` in Sidebar order, so the target is ${row.expectedPrev}`,
        );
      }
      const raw = page.lines[line - 1] ?? "";
      if (raw.length > SPINE_LINE_CAP) {
        fail(
          26,
          page.file,
          line,
          `\`Before this:\` line is ${raw.length} characters; the cap is ${SPINE_LINE_CAP}`,
        );
      }
    }
  }

  if (nextSlug !== null) {
    const window = page.text.slice(-SPINE_NEXT_WINDOW);
    const offset = page.text.length - window.length;
    const m = SPINE_NEXT_STRICT.exec(window);
    if (!m) {
      const anywhere = SPINE_NEXT_STRICT.exec(page.text);
      const where = anywhere
        ? ` a matching line exists at line ${page.lineOf(anywhere.index)}, outside the final ${SPINE_NEXT_WINDOW} characters`
        : "";
      fail(
        27,
        page.file,
        page.lines.length,
        `no \`Next: [text](target) sentence\` line within the final ${SPINE_NEXT_WINDOW} characters; \`${row.slug}\` precedes \`${nextSlug}\` in Sidebar order.${where}`,
      );
    } else {
      const line = page.lineOf(offset + m.index);
      if (m[1] !== row.expectedNext) {
        fail(
          27,
          page.file,
          line,
          `\`Next:\` targets ${m[1]}; \`${row.slug}\` precedes \`${nextSlug}\` in Sidebar order, so the target is ${row.expectedNext}`,
        );
      }
      const raw = page.lines[line - 1] ?? "";
      if (raw.length > SPINE_LINE_CAP) {
        fail(
          27,
          page.file,
          line,
          `\`Next:\` line is ${raw.length} characters; the cap is ${SPINE_LINE_CAP}`,
        );
      }
    }
  }
});

// Property 28: the formula's three clauses appear on the six named pages.
//
// Requirement 19.16 is the machine half of Requirement 19.15 and this is a direct
// transcription of it. Which clause a page names, and whether it names one at all, is
// review-gated by 19.15's own wording; the per-page assignment is tabled in the design
// so a reviewer has something to check against.
//
// One interaction to keep straight. On `index` the three clause strings contain
// `skills` and `hooks`, which are Requirement 19.2 mechanism terms, so Property 24
// forces the formula below the block carrying the app count, the hour count, and
// `drift`. Two properties over the same page, compatible only because the landing
// page's block order was designed for it — the formula sits at block 8, not higher.
for (const slug of FORMULA_PAGES) {
  const page = pageBySlug.get(slug);
  // A missing page is Property 1's report, not this one's.
  if (!page) continue;
  const haystack = page.text.toLowerCase();
  for (const clause of FORMULA_CLAUSES) {
    if (!haystack.includes(clause)) {
      fail(28, page.file, 1, `page never states the clause \`${clause}\``);
    }
  }
}

// Property 29: Reader prose carries no spec vocabulary.
//
// The `vocabulary` product above already covers everything this property quantifies
// over: the Reader-prose projection of all eleven pages, of README.md (Requirement
// 20.12 — the single file outside src/content/docs/ this touches), and all eleven
// sidebar label strings. One violation per hit, naming the file, the line, and the
// identifier.
//
// Frontmatter `title` and `description` values (Requirement 20.2 names them
// explicitly) need no separate scan: the projection is built over *every* line of the
// page including the frontmatter block, so a banned identifier in a title or a
// description is an ordinary hit at its own line number. Adding a second scan over the
// parsed values would double-report the same string.
//
// The removal steps are what make this compatible with Requirement 3.7 rather than in
// conflict with it. An Embedded_Artifact quotes a factory file character-for-character,
// and if that file contained one of these strings, banning it would make the two
// requirements jointly unsatisfiable. Requirement 20.6 resolves it by exempting code,
// and removal step 1 implements the exemption.
//
// Step 4 strips attribute *names*, not attribute *values* — so `caption=` is invisible
// while `caption="The Still showing gator PASS"` is a violation on its value. That is
// deliberate: a caption or `alt` string is Reader prose.
for (const hit of vocabulary) {
  fail(
    29,
    hit.file,
    hit.line,
    `Reader prose carries the spec identifier \`${hit.identifier}\``,
  );
}

// Property 31: no two lesson pages share a heading sequence.
//
// Whole sequences: same length, same elements, same order. No subsequence matching,
// no set intersection, no similarity score. Two pages sharing one or two heading
// names are not a violation, and the authored layouts do that three times on purpose
// (`lab-d-reference` and `autonomy-modes` both end `what bites`, and both of those
// plus `gotchas` overlap on single names). What trips this is two pages whose entire
// heading list is the same, which is what stamping a template produces.
for (let i = 0; i < lessonPages.length; i++) {
  for (let j = i + 1; j < lessonPages.length; j++) {
    const a = lessonPages[i];
    const b = lessonPages[j];
    if (
      a.headingSequence.length < HEADING_SEQUENCE_FLOOR ||
      b.headingSequence.length < HEADING_SEQUENCE_FLOOR
    ) {
      continue;
    }
    if (a.headingSequence.length !== b.headingSequence.length) continue;
    if (!a.headingSequence.every((h, k) => h === b.headingSequence[k]))
      continue;
    fail(
      31,
      a.file,
      1,
      `identical level-2 heading sequence shared with ${path.relative(root, b.file)}: ${a.headingSequence.join(" / ")}`,
    );
  }
}

// Property 14: PR workflow permissions
const requiredPerms = [
  "statuses: write",
  "checks: write",
  "contents: read",
  "pull-requests: read",
];
if (fs.existsSync(workflowsDir)) {
  for (const f of fs
    .readdirSync(workflowsDir)
    .filter((x) => x.endsWith(".yml"))) {
    const full = path.join(workflowsDir, f);
    const y = read(full);
    if (!/pull_request:/.test(y)) continue;
    for (const perm of requiredPerms) {
      if (!y.includes(perm)) {
        fail(14, full, 1, `missing permission ${perm}`);
      }
    }
  }
}

// Property 4 dist half
if (distPages) {
  for (const { file: htmlFile, html } of distPages) {
    const imgRe = /<img[^>]+src="(\/[^"]+)"/g;
    let im;
    while ((im = imgRe.exec(html))) {
      const src = im[1];
      if (src.startsWith("//") || src.startsWith("/http")) continue;
      if (!src.startsWith(BASE_PREFIX)) {
        fail(4, htmlFile, 1, `img src missing base prefix: ${src}`);
      }
    }
  }
} else {
  console.log("NOTICE: dist/ absent; skipping Property 4 dist HTML scan");
}

// Property 30: rendered output carries no spec vocabulary.
//
// Grouped here with the other dist-gated check rather than in numeric order, because
// both share the same precondition and the same skip notice shape (design OQ13).
//
// Kept separate from Property 29 rather than folded into it: the input spaces differ
// (page source versus rendered text), the precondition differs, and only this one sees
// an identifier that reaches rendered output without appearing in any page source — a
// component default, a Starlight-generated label, or an `aria-label`.
//
// Known weakness, recorded rather than fixed (design risk R10): a stale `dist/` gives
// this property a false pass on freshly edited source. Run `npm run build` before
// `npm run check:content` when the vocabulary result matters.
if (distPages) {
  for (const { file: htmlFile, nodes } of distPages) {
    for (const node of nodes) {
      BANNED_RE.lastIndex = 0;
      let m;
      while ((m = BANNED_RE.exec(node.text))) {
        fail(
          30,
          htmlFile,
          node.line,
          `rendered text carries the spec identifier \`${m[1]}\``,
        );
      }
    }
  }
} else {
  console.log(
    "NOTICE: dist/ absent; skipping Property 30 rendered vocabulary scan",
  );
}

// ---------------------------------------------------------------------------
// Informational count lines. Information, never a pass condition — the pass
// condition is the absence of PROPERTY lines.
// ---------------------------------------------------------------------------

const walkDir = path.join(publicDir, "media/walkthrough");
let vendored = 0;
if (fs.existsSync(walkDir)) {
  const have = new Set(
    fs.readdirSync(walkDir).filter((f) => f.endsWith(".png")),
  );
  vendored = NAMED_STILLS.filter((n) => have.has(n)).length;
}
console.log(`vendored ${vendored} of ${NAMED_STILLS.length} named Stills`);
console.log(`${declaredArtifacts} declared Embedded_Artifacts`);
console.log(
  `spine thread: ${spine.prevLinks} previous links, ${spine.nextLinks} next links, chain ${
    spine.intact ? "intact" : "broken"
  }`,
);
console.log(
  `vocabulary: ${vocabulary.length} matches in ${pages.length} pages, README, and ${sidebar.labels.length} labels`,
);

if (failures > 0) {
  console.error(`${failures} violation(s)`);
  process.exit(1);
}
process.exit(0);
