# Komara

Komara organizes intellectual and strategic capital to develop ideas, cultivate
leadership, and advance institutional reform across Africa and the global diaspora.
See [CHARTER.md](CHARTER.md).

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
