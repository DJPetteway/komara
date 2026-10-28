# Komara

Komara organizes intellectual and strategic capital to develop ideas, cultivate
leadership, and advance institutional reform across Africa and the global diaspora.
See [CHARTER.md](CHARTER.md).

## Komara Commons (the site)

`site/` is a free static website, with no build step:

- **Learn**: eight modules of *The Connected Story*, written in plain language
  and in time order: the first Americans; Florida's explorer logs; Spain, France
  and Florida (Fort Mose); the Haudenosaunee between empires; the Haitian
  Revolution; Dessalines; Haiti, the Louisiana Purchase and Florida; and Sankara.
  Each has key dates, people, what's debated, why it matters, sources and
  discussion questions. The content lives in `site/modules.js`. These modules
  are drafts for historians to review before classroom use.
- **Join the registry**: a skills form with dropdowns for field, trade,
  experience, country, heritage and availability, plus contact details and
  verification (a public profile, an optional reference, and license details).
  The choices live in `site/registry.js`. Until `endpoint` is set to a form
  backend (for example Formspree or a Google Apps Script web app), the form
  runs in preview mode and only shows the record it would send.

To view it locally, open `site/index.html` in a browser. To publish it, turn on
GitHub Pages for the `site/` folder, or upload the folder to any static host.

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
