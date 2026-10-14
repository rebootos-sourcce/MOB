#!/usr/bin/env node
/**
 * ATÜNED P0-1 appendix navigation patch.
 * From repository root:
 *   node lookdev/patch_appendix_navigation.mjs --check
 *   node lookdev/patch_appendix_navigation.mjs --apply
 * --check is read-only; --apply writes only index.html after all checks pass.
 */
import fs from "node:fs";
import path from "node:path";

const file = path.resolve("index.html");
const apply = process.argv.includes("--apply");
const source = fs.readFileSync(file, "utf8");
let html = source;
const edits = [];

function replaceExactlyOnce(oldText, newText, label) {
  const count = html.split(oldText).length - 1;
  if (count === 0 && html.includes(newText)) {
    edits.push({ label, status: "already-applied" });
    return;
  }
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}; refusing to write.`);
  html = html.replace(oldText, newText);
  edits.push({ label, status: "patched" });
}

replaceExactlyOnce("Five movements. Twenty-eight chapters. Four appendices.",
  "Five movements. Twenty-eight chapters. Six appendices.", "contents summary");
replaceExactlyOnce(
  '   <a data-target="appendix-e" role="link" tabindex="0">App E · Icon Language</a>\n   <a data-target="source-os-diagram" role="link" tabindex="0">D.1 · 11-Layer Diagram</a>',
  '   <a data-target="appendix-e" role="link" tabindex="0">E · Icon Language</a>\n   <a data-target="appendix-f" role="link" tabindex="0">F · Pattern Catalog</a>\n   <a data-target="source-os-diagram" role="link" tabindex="0">D.1 · 11-Layer Diagram</a>',
  "side navigation F");
replaceExactlyOnce('<span class="toc-mv-meta" style="color:#7A726A">4 references</span>',
  '<span class="toc-mv-meta" style="color:#7A726A">6 appendices</span>', "contents appendix count");
replaceExactlyOnce(
  ' <a data-target="appendix-d" role="link" tabindex="0" class="toc-row"><span class="toc-row-num">D</span><span class="toc-row-title">System Specification</span></a>\n</div>\n\n</div>',
  ' <a data-target="appendix-d" role="link" tabindex="0" class="toc-row"><span class="toc-row-num">D</span><span class="toc-row-title">System Specification</span></a>\n <a data-target="appendix-e" role="link" tabindex="0" class="toc-row"><span class="toc-row-num">E</span><span class="toc-row-title">Icon Language</span></a>\n <a data-target="appendix-f" role="link" tabindex="0" class="toc-row"><span class="toc-row-num">F</span><span class="toc-row-title">Pattern Catalog</span></a>\n</div>\n\n</div>',
  "contents E/F");
replaceExactlyOnce(
  '<div id="appendix-a" class="chapter">\n<div class="chapter-header">\n  <div class="chapter-eyebrow">Appendix A</div>\n  <h2 class="chapter-title">The Pattern Catalog</h2>',
  '<div id="appendix-f" class="chapter">\n<div class="chapter-header">\n  <div class="chapter-eyebrow">Appendix F</div>\n  <h2 class="chapter-title">The Pattern Catalog</h2>',
  "Pattern Catalog id and label");
replaceExactlyOnce("var isActive = link.getAttribute('href') === '#' + id",
  "var isActive = link.getAttribute('data-target') === id", "scroll-spy active state");
{
  // The canonical source has varied whitespace around this handler across revisions.
  // Remove exactly one matching native-button keydown shim; native buttons already
  // synthesize click on Enter/Space, so this shim can double-activate the toggle.
  const pattern = /[ \t]*btn\.addEventListener\(\s*'keydown'\s*,\s*function\s*\(\s*ev\s*\)\s*\{\s*if\s*\(\s*ev\.key\s*===\s*'Enter'\s*\|\|\s*ev\.key\s*===\s*' '\s*\)\s*\{\s*ev\.preventDefault\(\)\s*;\s*btn\.click\(\)\s*;\s*\}\s*\}\s*\)\s*;\s*/g;
  const matches = [...html.matchAll(pattern)];
  if (matches.length === 1) {
    html = html.replace(pattern, "");
    edits.push({ label: "remove duplicate native-button keyboard activation", status: "patched" });
  } else if (matches.length === 0 && !html.includes("if(ev.key==='Enter'||ev.key===' ')")) {
    edits.push({ label: "remove duplicate native-button keyboard activation", status: "already-applied" });
  } else {
    throw new Error("remove duplicate native-button keyboard activation: expected one handler, found " + matches.length);
  }
}

function validate(document) {
  const ids = [...document.matchAll(/\bid\s*=\s*(["'])(.*?)\1/g)].map(m => m[2]);
  const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (duplicates.length) throw new Error("Duplicate IDs remain: " + duplicates.join(", "));
  const idSet = new Set(ids);
  const appendixIds = ["a","b","c","d","e","f"].map(x => "appendix-" + x);
  const missingAppendices = appendixIds.filter(id => !idSet.has(id));
  if (missingAppendices.length) throw new Error("Missing appendix sections: " + missingAppendices.join(", "));
  const targetCount = id => [...document.matchAll(/\bid\s*=\s*(["'])(.*?)\1/g)].filter(m => m[2] === id).length;
  for (const id of appendixIds) if (targetCount(id) !== 1) throw new Error(id + " must occur exactly once.");
  const targets = [...document.matchAll(/\bdata-target\s*=\s*(["'])(.*?)\1/g)]
    .map(m => m[2]).filter(target => !target.includes("${"));
  const missingTargets = [...new Set(targets.filter(target => !idSet.has(target)))];
  if (missingTargets.length) throw new Error("Unresolved data-targets: " + missingTargets.join(", "));
  const fragments = [...document.matchAll(/\bhref\s*=\s*(["'])#([^"']+)\1/g)].map(m => m[2]);
  const missingFragments = [...new Set(fragments.filter(target => !idSet.has(target)))];
  if (missingFragments.length) throw new Error("Unresolved fragment hrefs: " + missingFragments.join(", "));
  if (!document.includes("Six appendices.") || !document.includes("6 appendices")) throw new Error("Appendix count copy is inconsistent.");
  if (!document.includes('data-target="appendix-f"') || !document.includes('<span class="toc-row-num">F</span>')) throw new Error("Appendix F is missing from navigation or contents.");
  if (!document.includes("var isActive = link.getAttribute('data-target') === id")) throw new Error("Scroll-spy must match nav data-targets to section IDs.");
  if (document.includes("if(ev.key==='Enter'||ev.key===' ')")) throw new Error("Native button keyboard activation must not be double-wired.");
  return { idCount: ids.length, duplicateIds: duplicates, appendixIds, dataTargetCount: targets.length, fragmentHrefCount: fragments.length };
}
const validation = validate(html);
if (apply && html !== source) {
  fs.writeFileSync(file, html, "utf8");
  const written = fs.readFileSync(file, "utf8");
  console.log(JSON.stringify({ result: "patched", file, beforeBytes: Buffer.byteLength(source), afterBytes: Buffer.byteLength(written), edits, validation: validate(written) }, null, 2));
} else {
  console.log(JSON.stringify({ result: apply ? "already-patched" : "check-only; no files written", file, edits, validation }, null, 2));
}
