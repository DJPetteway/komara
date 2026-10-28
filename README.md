# Komara

Komara organizes intellectual and strategic capital to develop ideas, cultivate
leadership, and advance institutional reform across Africa and the global diaspora.
See [CHARTER.md](CHARTER.md).

## The Komara Project site

`docs/` is a free static website, with no build step. It opens on a short splash
page with three doors: **Study**, **Join** and **Reform**.


- **The thread** (home page): the curriculum's spine. It is 14 cases in time
  order, from Florida 14,000 years ago to Sankara in 1987. Each case is a claim.
  The learner judges it (supported, partly supported, not supported) before
  seeing the evidence, the strongest counter-argument and the historians'
  verdict. Then the case leads into the next one. Some claims hold up, some are
  popular myths, and some are honestly contested. Answers stay in the learner's
  own browser. The cases live in `docs/cases.js`.
- **Chapters**: eight longer readings for depth: the first Americans; Florida's
  explorer logs; Spain, France and Florida (Fort Mose); the Haudenosaunee
  between empires; the Haitian Revolution; Dessalines; Haiti, the Louisiana
  Purchase and Florida; and Sankara. Each has key points, key dates, people,
  what's debated, sources and discussion questions. The content lives in
  `docs/modules.js`. The cases and chapters are drafts for historians to review
  before classroom use.
- **Reform**: five long-standing problems, what Komara proposes for each and the
  first step, plus Komara's principles.
- **Join** (the skills registry): a skills form with dropdowns for field, trade,
  experience, country, heritage and availability, plus contact details and
  verification (a public profile, an optional reference, and license details).
  The choices live in `docs/registry.js`. Until `endpoint` is set to a form
  backend (for example Formspree or a Google Apps Script web app), the form
  runs in preview mode and only shows the record it would send.

To view it locally, open `docs/index.html` in a browser. To publish it, turn on
GitHub Pages (Settings → Pages → deploy from a branch, folder `/docs`), or upload the folder to any static host.

## L0: the contribution record

This layer does one thing: it keeps a shared record of **who is contributing what,
toward which agenda track, for which nation**. The record is tamper-evident.
Each entry stores the hash of the entry before it, so `verify` catches any edit
or deletion.

- `komara.py`: the tool. One file, Python 3.10+, standard library only.
- `tracks.json`: the agenda. The first agenda uses the four tracks of the
  Russia–Africa Economic and Humanitarian Forum (28–29 October 2026), each
  mapped to the *Agenda 2063* aspirations it serves. The tracks are plain data:
  edit or replace them as Komara's own agenda develops.
- `contributions.jsonl`: the record, created on first use. One JSON object per line.

### Contribution kinds

| kind           | amount measured in |
|----------------|--------------------|
| `idea`         | no amount          |
| `expertise`    | hours              |
| `capital`      | USD                |
| `relationship` | introductions      |

### Usage

```sh
python3 komara.py tracks

python3 komara.py add --who "A. Ouédraogo" --kind expertise --track society \
  --nation "Burkina Faso" --amount 40 \
  --note "Co-design a Haitian Revolution history module for secondary schools"

python3 komara.py add --who "M. Jean-Baptiste" --kind relationship --track society \
  --nation Haiti --amount 3 \
  --note "Introductions to Haitian historians for the shared curriculum"

python3 komara.py list --nation Haiti
python3 komara.py summary
python3 komara.py verify
```

### Tests

```sh
python3 -m unittest -v
```
