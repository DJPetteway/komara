# Komara

Komara organizes intellectual and strategic capital to develop ideas, cultivate
leadership, and advance institutional reform across Africa and the global diaspora.
See [CHARTER.md](CHARTER.md).

## The Komara Project site

`docs/` is a free static website, with no build step. It opens on a short splash
page with three doors: **Study**, **Join** and **Reform**. The site always shows
its light theme.

- **Study**: free, no account needed. Learners first choose their settings: who
  is learning (ages 11–14, 15–18, adult, teacher), alone or in a group, depth
  (quick, standard, deep), text size and motion. Then there are three tabs:
  - **Lessons**: eight lessons, each with key points, the story, balanced
    perspectives, a quick-check quiz, a timeline activity and a conversation.
    The settings change what a lesson shows: depth adds or removes sections,
    group mode adds notes for the group leader, solo mode adds a private
    reflection box, and ages 11–14 see content notes on difficult topics.
  - **The thread**: 14 claims in time order. The learner judges each one before
    seeing the evidence, the strongest counter-argument and the verdict.
  - **Conversations**: eight topics that rarely come up, such as colorism inside
    the Haitian Revolution and Black–Native alliances and divisions.

  Content lives in `docs/modules.js` (lessons), `docs/lessons.js` (quizzes,
  conversations, content notes) and `docs/cases.js` (the thread). All of it is a
  draft for historians to review before classroom use.
- **Join**: register skills, then verify yourself by confirming email and phone
  with one-time codes. A reviewer then checks the profile link and any license.
- **Reform**: five steps in order, each unlocking the next: agree to the
  principles, choose a path, verify, complete the path's first steps, and report
  what you did for the person it served to confirm.

Progress, answers and notes are saved only in the visitor's browser. Backend
addresses for registrations, verification codes and reports are set in
`docs/registry.js`. While they are empty the site runs in preview mode: nothing
is sent, and verification codes are shown on screen.

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
