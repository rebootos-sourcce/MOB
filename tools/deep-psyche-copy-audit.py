#!/usr/bin/env python3
"""Locate the existing voice gate's Deep Psyche findings by record and field.

Diagnostic only. Does not exempt strings, modify the registry or replace the
required voice gate. Match the actual checked literal against JSON paths.
"""
import collections
import importlib.util
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
FILE = ROOT / "atuned_src/engine/data/deep_psyche.js"
spec = importlib.util.spec_from_file_location("voice_check", ROOT / ".claude/skills/atuned-voice/check.py")
voice = importlib.util.module_from_spec(spec)
spec.loader.exec_module(voice)

def literal(value):
    return json.dumps(value, ensure_ascii=False)[1:-1].replace("<", r"\u003c")

def walk(value, path):
    if isinstance(value, str):
        yield literal(value), path
    elif isinstance(value, list):
        for i, item in enumerate(value):
            yield from walk(item, path + [i])
    elif isinstance(value, dict):
        for key, item in value.items():
            yield literal(key), path + ["@key:" + key]
            yield from walk(item, path + [key])

def main():
    content = FILE.read_text(encoding="utf-8")
    prefix = "var DEEP_PSYCHE="
    if content.count(prefix) != 1:
        raise ValueError("Expected one generated Deep Psyche declaration")
    payload = content.split(prefix, 1)[1].strip()
    if not payload.endswith(";"):
        raise ValueError("Generated Deep Psyche declaration is incomplete")
    data = json.loads(payload[:-1])
    records = data["records"]
    ids = [record["id"] for record in records]
    if len(set(ids)) != len(ids) or len(ids) != data["sourceRecordCount"]:
        raise ValueError("Registry count or identity mismatch")
    locations = collections.defaultdict(list)
    for value, path in walk(data, []):
        locations[value].append(path)
    hits = []
    seen = collections.Counter()
    for _, line, raw in voice.objection_strings(str(FILE)):
        for rule, severity, match in voice.objection_hits(raw):
            key = (raw, rule["id"])
            options = locations.get(raw, [])
            i = seen[key]
            seen[key] += 1
            path = options[i] if i < len(options) else []
            record = ids[path[1]] if len(path) > 2 and path[0] == "records" else None
            field = str(path[2]) if record else None
            hits.append({"record": record, "field": field, "path": path,
                         "rule": rule["id"], "severity": severity,
                         "line": line, "match": match, "text": raw})
    fields = collections.Counter((h["field"] or "unmapped") for h in hits if h["severity"] == "stop")
    result = {"records": len(records), "findings": len(hits),
              "stops": sum(h["severity"] == "stop" for h in hits),
              "unmapped": sum(not h["path"] for h in hits),
              "stopsByField": dict(sorted(fields.items())), "details": hits}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if result["unmapped"] else 0

if __name__ == "__main__":
    sys.exit(main())
