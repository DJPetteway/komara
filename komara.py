#!/usr/bin/env python3
"""Komara L0: a shared, tamper-evident record of diaspora contributions.

Anyone - in Ouagadougou, Port-au-Prince, Atlanta or Paris - can log what they
are putting forward (an idea, expertise, capital, a relationship), toward which
track, for which nation. Every entry carries the hash of the one before it, so
the record can be checked by anyone and cannot be quietly rewritten.

Standard library only. Usage: python3 komara.py --help
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
TRACKS_FILE = HERE / "tracks.json"
DEFAULT_LOG = HERE / "contributions.jsonl"
GENESIS = "0" * 64
KINDS = {"idea": None, "expertise": "hours", "capital": "USD", "relationship": "introductions"}


def load_tracks() -> dict:
    return json.loads(TRACKS_FILE.read_text())


def digest(entry: dict) -> str:
    body = {k: v for k, v in entry.items() if k != "hash"}
    return hashlib.sha256(json.dumps(body, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def read_log(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def append(path: Path, who: str, kind: str, track: str, nation: str, note: str,
           amount: float | None = None, at: str | None = None) -> dict:
    tracks = {t["id"] for t in load_tracks()["tracks"]}
    if track not in tracks:
        raise ValueError(f"unknown track {track!r}; choose from {sorted(tracks)}")
    if kind not in KINDS:
        raise ValueError(f"unknown kind {kind!r}; choose from {sorted(KINDS)}")
    if amount is not None and amount <= 0:
        raise ValueError("amount must be positive")
    log = read_log(path)
    entry = {
        "seq": len(log),
        "at": at or datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "who": who, "kind": kind, "track": track, "nation": nation,
        "amount": amount, "unit": KINDS[kind] if amount is not None else None,
        "note": note,
        "prev": log[-1]["hash"] if log else GENESIS,
    }
    entry["hash"] = digest(entry)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return entry


def verify(log: list[dict]) -> tuple[bool, str]:
    prev = GENESIS
    for i, e in enumerate(log):
        if e.get("seq") != i or e.get("prev") != prev:
            return False, f"chain broken at entry {i}"
        if digest(e) != e.get("hash"):
            return False, f"entry {i} was altered"
        prev = e["hash"]
    return True, f"{len(log)} entries intact"


def summarize(log: list[dict]) -> dict:
    by_track: dict[str, Counter] = defaultdict(Counter)
    totals: dict[tuple[str, str], float] = defaultdict(float)
    for e in log:
        by_track[e["track"]][e["kind"]] += 1
        if e.get("amount"):
            totals[(e["track"], e["unit"])] += e["amount"]
    return {
        "contributors": len({e["who"] for e in log}),
        "nations": sorted({e["nation"] for e in log}),
        "by_track": {t: dict(c) for t, c in by_track.items()},
        "totals": {f"{t} ({u})": v for (t, u), v in totals.items()},
    }


# ---- command line ---------------------------------------------------------

def cmd_tracks(args) -> None:
    data = load_tracks()
    print(f"Source: {data['source']}\n")
    for t in data["tracks"]:
        asp = ", ".join(str(a) for a in t["aspirations"])
        print(f"[{t['id']}] {t['name']}")
        print(f"    focus: {'; '.join(t['focus'])}")
        print(f"    Agenda 2063 aspirations: {asp}\n")


def cmd_add(args) -> None:
    e = append(args.log, args.who, args.kind, args.track, args.nation, args.note, args.amount)
    print(f"#{e['seq']} recorded  {e['hash'][:12]}")


def cmd_list(args) -> None:
    for e in read_log(args.log):
        if args.track and e["track"] != args.track:
            continue
        if args.nation and e["nation"].lower() != args.nation.lower():
            continue
        amt = f" {e['amount']:g} {e['unit']}" if e.get("amount") else ""
        print(f"#{e['seq']:<4} {e['at'][:10]}  {e['track']:<11} {e['nation']:<16} "
              f"{e['who']} - {e['kind']}{amt}: {e['note']}")


def cmd_summary(args) -> None:
    print(json.dumps(summarize(read_log(args.log)), indent=2, ensure_ascii=False))


def cmd_verify(args) -> None:
    ok, msg = verify(read_log(args.log))
    print(("OK: " if ok else "FAILED: ") + msg)
    sys.exit(0 if ok else 1)


def main(argv: list[str] | None = None) -> None:
    p = argparse.ArgumentParser(prog="komara", description=__doc__.splitlines()[0])
    p.add_argument("--log", type=Path, default=DEFAULT_LOG, help="contribution log (JSON Lines)")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("tracks", help="show the agenda tracks").set_defaults(fn=cmd_tracks)

    a = sub.add_parser("add", help="record a contribution")
    a.add_argument("--who", required=True)
    a.add_argument("--kind", required=True, choices=sorted(KINDS))
    a.add_argument("--track", required=True)
    a.add_argument("--nation", required=True, help="nation or region served, e.g. 'Burkina Faso', 'Haiti'")
    a.add_argument("--amount", type=float, help="hours, USD or introductions, depending on kind")
    a.add_argument("--note", required=True, help="what is being contributed, in one line")
    a.set_defaults(fn=cmd_add)

    ls = sub.add_parser("list", help="list contributions")
    ls.add_argument("--track")
    ls.add_argument("--nation")
    ls.set_defaults(fn=cmd_list)

    sub.add_parser("summary", help="totals by track and kind").set_defaults(fn=cmd_summary)
    sub.add_parser("verify", help="check the log has not been altered").set_defaults(fn=cmd_verify)

    args = p.parse_args(argv)
    try:
        args.fn(args)
    except ValueError as err:
        p.error(str(err))


if __name__ == "__main__":
    main()
