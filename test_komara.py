import json
import tempfile
import unittest
from pathlib import Path

import komara


class RecordTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.log = Path(self.dir.name) / "log.jsonl"

    def tearDown(self):
        self.dir.cleanup()

    def add(self, **kw):
        args = dict(who="A", kind="idea", track="sovereignty", nation="Haiti", note="n")
        args.update(kw)
        return komara.append(self.log, **args)

    def test_entries_chain_and_verify(self):
        first = self.add()
        second = self.add(kind="capital", amount=500, track="economy")
        self.assertEqual(second["prev"], first["hash"])
        self.assertEqual(second["unit"], "USD")
        self.assertEqual(komara.verify(komara.read_log(self.log)), (True, "2 entries intact"))

    def test_edit_is_detected(self):
        self.add()
        self.add()
        lines = self.log.read_text().splitlines()
        e = json.loads(lines[0])
        e["note"] = "rewritten"
        lines[0] = json.dumps(e)
        self.log.write_text("\n".join(lines) + "\n")
        ok, msg = komara.verify(komara.read_log(self.log))
        self.assertFalse(ok)
        self.assertIn("entry 0", msg)

    def test_deletion_is_detected(self):
        self.add()
        self.add()
        self.add()
        lines = self.log.read_text().splitlines()
        self.log.write_text("\n".join([lines[0], lines[2]]) + "\n")
        self.assertFalse(komara.verify(komara.read_log(self.log))[0])

    def test_rejects_unknown_track_kind_and_bad_amount(self):
        with self.assertRaises(ValueError):
            self.add(track="nope")
        with self.assertRaises(ValueError):
            self.add(kind="nope")
        with self.assertRaises(ValueError):
            self.add(kind="expertise", amount=0)
        self.assertFalse(self.log.exists())

    def test_summary(self):
        self.add(who="A", kind="expertise", amount=10, track="society", nation="Burkina Faso")
        self.add(who="B", kind="expertise", amount=5, track="society", nation="Haiti")
        self.add(who="A", kind="idea", track="technology", nation="Haiti")
        s = komara.summarize(komara.read_log(self.log))
        self.assertEqual(s["contributors"], 2)
        self.assertEqual(s["nations"], ["Burkina Faso", "Haiti"])
        self.assertEqual(s["by_track"]["society"], {"expertise": 2})
        self.assertEqual(s["totals"]["society (hours)"], 15)

    def test_every_track_maps_to_known_aspirations(self):
        data = komara.load_tracks()
        for t in data["tracks"]:
            for a in t["aspirations"]:
                self.assertIn(str(a), data["agenda2063_aspirations"])


if __name__ == "__main__":
    unittest.main()
