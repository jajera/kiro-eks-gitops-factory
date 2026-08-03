#!/usr/bin/env node
/**
 * Property 21: Quoted artifacts match their source (opt-in maintainer mode).
 *
 * Zero-dependency Node ESM, read-only, no network. Invoked as
 * `npm run verify:artifacts`. Wired into nothing: not `validate`, not `test`,
 * not `build`, not any workflow caller (Decision D11).
 *
 * Absence of a factory clone is not a failure. With no clone resolved the script
 * prints a notice and exits 0, because the factory repo must never become a
 * build dependency (Requirement 7.1). A skipped run is not a pass: read the
 * `verified N of N artifacts` count line, not the exit code.
 *
 * Validates: Requirements 3.7, 12.10
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "src/content/docs");
const DEFAULT_CLONE = path.resolve(root, "../kiro-eks-argocd-migration");

// Decision D14 declaration grammar:
//   Source: [`<path>`](<url>/blob/main/<path>) lines A-B,C-D
// The range list is optional and present only for excerpts.
const DECLARATION =
  /^Source: \[`([^`]+)`\]\((\S+?)\)(?: lines (\d+-\d+(?:,\d+-\d+)*))?\s*$/;

// Elision markers per fence language (Depth_Bar Mechanics / excerpt grammar).
const MARKERS = {
  yaml: "# ...",
  yml: "# ...",
  bash: "# ...",
  sh: "# ...",
  md: "<!-- ... -->",
  markdown: "<!-- ... -->",
};

let mismatches = 0;
let verified = 0;
let total = 0;

function resolveClone() {
  const fromEnv = process.env.SOURCE_FACTORY_PATH;
  const candidate = fromEnv ? path.resolve(fromEnv) : DEFAULT_CLONE;
  if (!isDir(candidate)) {
    return { path: candidate, ok: false, reason: "absent" };
  }
  if (
    !isDir(path.join(candidate, ".kiro")) ||
    !isDir(path.join(candidate, "infrastructure"))
  ) {
    return { path: candidate, ok: false, reason: "not-a-clone" };
  }
  return { path: candidate, ok: true };
}

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function listMdx() {
  if (!isDir(docsDir)) return [];
  return fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f) => path.join(docsDir, f));
}

/** Split text into lines, normalising only the final newline. */
function toLines(text) {
  const body = text.endsWith("\n") ? text.slice(0, -1) : text;
  return body.split("\n");
}

/**
 * Collect every declared artifact on a page: the declaration line, its parsed
 * parts, and the fenced block that follows it.
 */
function collectArtifacts(file) {
  const lines = toLines(fs.readFileSync(file, "utf8"));
  const found = [];
  for (let i = 0; i < lines.length; i++) {
    const m = DECLARATION.exec(lines[i]);
    if (!m) continue;
    const [, declaredPath, url, ranges] = m;
    // The fence opens on the next non-blank line (D14: immediately preceding).
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;
    const open = /^```(\S*)/.exec(lines[j] ?? "");
    if (!open) continue;
    let k = j + 1;
    while (k < lines.length && !/^```\s*$/.test(lines[k])) k++;
    found.push({
      file,
      line: i + 1,
      declaredPath,
      url,
      ranges: ranges ?? null,
      lang: open[1].split(/\s+/)[0] || "",
      quoted: lines.slice(j + 1, k),
    });
    i = k;
  }
  return found;
}

function parseRanges(spec) {
  return spec.split(",").map((r) => {
    const [a, b] = r.split("-").map(Number);
    return { start: a, end: b };
  });
}

/** Split a quoted excerpt on its elision marker lines. */
function splitOnMarkers(quoted, marker) {
  const segments = [[]];
  let markerCount = 0;
  for (const line of quoted) {
    if (marker && line.trim() === marker) {
      markerCount += 1;
      segments.push([]);
    } else {
      segments[segments.length - 1].push(line);
    }
  }
  return { segments, markerCount };
}

/** Minimal LCS-based unified diff over two small line arrays. */
function unifiedDiff(expected, actual, expectedLabel, actualLabel) {
  const n = expected.length;
  const m = actual.length;
  const lcs = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] =
        expected[i] === actual[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const out = [
    `--- ${expectedLabel}`,
    `+++ ${actualLabel}`,
    `@@ -1,${n} +1,${m} @@`,
  ];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (expected[i] === actual[j]) {
      out.push(` ${expected[i]}`);
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push(`-${expected[i++]}`);
    } else {
      out.push(`+${actual[j++]}`);
    }
  }
  while (i < n) out.push(`-${expected[i++]}`);
  while (j < m) out.push(`+${actual[j++]}`);
  return out;
}

function firstDifference(expected, actual) {
  const len = Math.max(expected.length, actual.length);
  for (let i = 0; i < len; i++) {
    if (expected[i] !== actual[i]) return i;
  }
  return -1;
}

function report(artifact, detail, diff) {
  const rel = path.relative(root, artifact.file);
  const ranges = artifact.ranges ?? "whole";
  console.error(
    `ARTIFACT ${rel}:${artifact.line} ${artifact.declaredPath} ${ranges} ${detail}`,
  );
  if (diff) for (const line of diff) console.error(`  ${line}`);
  mismatches += 1;
}

function verifyArtifact(artifact, clone) {
  const abs = path.join(clone, artifact.declaredPath);
  let sourceLines;
  try {
    sourceLines = toLines(fs.readFileSync(abs, "utf8"));
  } catch {
    report(artifact, `declared file not found in clone: ${abs}`);
    return;
  }

  const marker = MARKERS[artifact.lang] ?? null;

  if (!artifact.ranges) {
    const idx = firstDifference(sourceLines, artifact.quoted);
    if (idx === -1) {
      verified += 1;
      return;
    }
    report(
      artifact,
      `first differing line ${idx + 1}: quoted ${JSON.stringify(
        artifact.quoted[idx] ?? null,
      )} != source ${JSON.stringify(sourceLines[idx] ?? null)}`,
      unifiedDiff(
        sourceLines,
        artifact.quoted,
        `${artifact.declaredPath} (clone)`,
        `${path.relative(root, artifact.file)} block`,
      ),
    );
    return;
  }

  const ranges = parseRanges(artifact.ranges);
  const { segments, markerCount } = splitOnMarkers(artifact.quoted, marker);
  if (segments.length !== ranges.length) {
    report(
      artifact,
      `declared ${ranges.length} range(s) but the block splits into ${segments.length} segment(s) on ${markerCount} marker line(s)`,
    );
    return;
  }

  let ok = true;
  for (let s = 0; s < ranges.length; s++) {
    const { start, end } = ranges[s];
    const expected = sourceLines.slice(start - 1, end);
    const actual = segments[s];
    const idx = firstDifference(expected, actual);
    if (idx === -1) continue;
    ok = false;
    report(
      artifact,
      `segment ${s + 1} (lines ${start}-${end}) first differing source line ${
        start + idx
      }: quoted ${JSON.stringify(actual[idx] ?? null)} != source ${JSON.stringify(
        expected[idx] ?? null,
      )}`,
      unifiedDiff(
        expected,
        actual,
        `${artifact.declaredPath}:${start}-${end} (clone)`,
        `${path.relative(root, artifact.file)} segment ${s + 1}`,
      ),
    );
  }
  if (ok) verified += 1;
}

const clone = resolveClone();
if (!clone.ok) {
  if (clone.reason === "not-a-clone") {
    console.log(
      `NOTICE: ${clone.path} is not a factory clone (no .kiro/ and infrastructure/); skipping artifact fidelity verification (Requirement 3.7 stays review-gated)`,
    );
  } else {
    console.log(
      `NOTICE: no factory clone at ${clone.path}; skipping artifact fidelity verification (Requirement 3.7 stays review-gated)`,
    );
  }
  console.log(
    "NOTICE: set SOURCE_FACTORY_PATH to a clone to verify quoted artifacts",
  );
  process.exit(0);
}

const artifacts = listMdx().flatMap(collectArtifacts);
total = artifacts.length;
for (const artifact of artifacts) verifyArtifact(artifact, clone.path);

console.log(`clone: ${clone.path}`);
console.log(`verified ${verified} of ${total} artifacts`);
if (mismatches > 0) {
  console.error(`${mismatches} artifact mismatch(es)`);
  process.exit(1);
}
process.exit(0);
