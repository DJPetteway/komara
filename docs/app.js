// Komara Project — a small hash-routed site.
// Views: splash, study (setup, lessons, thread, conversations), lesson, case, join, reform.
(function () {
  "use strict";

  var MODULES = window.KOMARA_MODULES;
  var CASES = window.KOMARA_CASES;
  var LESSONS = window.KOMARA_LESSONS;
  var REG = window.KOMARA_REGISTRY;
  var byId = {}, caseById = {};
  MODULES.forEach(function (m) { byId[m.id] = m; });
  CASES.forEach(function (c, i) { c.n = i + 1; caseById[c.id] = c; });

  var VERDICTS = { supported: "Supported", partly: "Partly supported", not: "Not supported" };
  var view = document.getElementById("view");
  var root = document.documentElement;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] == null || attrs[k] === false) return;
        if (k === "text") node.textContent = attrs[k];
        else if (k === "class") node.className = attrs[k];
        else node.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function on(node, type, fn) { node.addEventListener(type, fn); return node; }
  function button(text, cls, fn) { return on(el("button", { class: cls, type: "button", text: text }), "click", fn); }

  // ---- Saved state (this browser only) ------------------------------------

  function load(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
  }

  var answers = load("komara.thread.v1", {});
  var progress = load("komara.lessons.v1", {});
  var notes = load("komara.notes.v1", {});
  var settings = load("komara.settings.v1", null);
  var member = load("komara.member.v1", null);
  var reform = load("komara.reform.v1", null) || freshReform();

  function freshReform() { return { step: 1, agreed: false, path: null, checks: {}, report: null }; }

  // ---- Study settings ----------------------------------------------------

  var DEFAULTS = { who: "adult", how: "self", depth: "standard", text: "standard", motion: "on" };
  var SETTING_DEFS = [
    { key: "who", label: "Who is learning?", options: [["youth", "Ages 11–14"], ["teen", "Ages 15–18"], ["adult", "College or adult"], ["teacher", "Teacher or group leader"]] },
    { key: "how", label: "How are you studying?", options: [["self", "On my own"], ["group", "With a group or class"]] },
    { key: "depth", label: "How deep?", options: [["quick", "Quick · 10 min"], ["standard", "Standard · 20 min"], ["deep", "Deep · 40 min"]],
      hint: { quick: "Key points, a quick check and the conversation.", standard: "Adds the full story, the perspectives and a timeline activity.", deep: "Adds key dates, people, sources and more questions." } },
    { key: "text", label: "Text size", options: [["standard", "Standard"], ["large", "Large"]] },
    { key: "motion", label: "Motion", options: [["on", "Smooth"], ["off", "Reduce motion"]] }
  ];

  function S() { return settings || DEFAULTS; }
  function applySettings() {
    root.classList.toggle("large-text", S().text === "large");
    root.classList.toggle("calm", S().motion === "off");
  }
  function settingLabel(key) {
    var def = SETTING_DEFS.filter(function (d) { return d.key === key; })[0];
    return def.options.filter(function (o) { return o[0] === S()[key]; })[0][1];
  }

  function renderSetup() {
    var draft = Object.assign({}, S());
    var hint = el("p", { class: "hint" });

    function group(def) {
      return el("fieldset", { class: "seg-group" }, [
        el("legend", { text: def.label }),
        el("div", { class: "seg" }, def.options.map(function (o) {
          var id = "set-" + def.key + "-" + o[0];
          var radio = el("input", { type: "radio", id: id, name: def.key, value: o[0], checked: draft[def.key] === o[0] });
          on(radio, "change", function () {
            draft[def.key] = o[0];
            if (def.key === "who" && o[0] === "teacher") { draft.how = "group"; document.getElementById("set-how-group").checked = true; }
            if (def.key === "depth") hint.textContent = def.hint[o[0]];
          });
          return el("label", { class: "seg-option", for: id }, [radio, el("span", { text: o[1] })]);
        })),
        def.key === "depth" ? hint : null
      ]);
    }
    hint.textContent = SETTING_DEFS[2].hint[draft.depth];

    function start(values) {
      settings = values; store("komara.settings.v1", settings); applySettings();
      if (location.hash === "#study") route(false); else location.hash = "study";
    }

    return el("div", { class: "setup" }, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Study · free, no account needed" }),
        el("h1", { class: "title", text: "Set up your study" }),
        el("p", { class: "lede", text: "Choose how you want to learn. You can change this at any time." })
      ]),
      el("div", { class: "seg-list" }, SETTING_DEFS.map(group)),
      el("div", { class: "actions" }, [
        button("Start studying", "btn primary", function () { start(draft); }),
        button("Use the defaults", "quiet", function () { start(Object.assign({}, DEFAULTS)); })
      ])
    ]);
  }

  // ---- Splash ------------------------------------------------------------

  var DOORS = [
    ["study", "Study", "A free curriculum for students and anyone curious. Start instantly."],
    ["join", "Join", "Register your skills and verify yourself."],
    ["reform", "Reform", "Ready to contribute? Your next steps, in order."]
  ];

  function renderSplash() {
    return el("div", { class: "splash" }, [
      el("p", { class: "eyebrow", text: "Est. Florida · 2026" }),
      el("h1", { class: "wordmark", text: "Komara" }),
      el("p", { class: "splash-line", text: "An open institution for the global African diaspora, from Florida to Haiti to the Sahel." }),
      el("nav", { class: "doors", "aria-label": "Sections" }, DOORS.map(function (d) {
        return el("a", { class: "door", href: "#" + d[0] }, [
          el("span", { class: "door-title", text: d[1] }),
          el("span", { class: "door-text", text: d[2] })
        ]);
      }))
    ]);
  }

  // ---- Study shell -------------------------------------------------------

  function studyHead(tab) {
    var tabs = [["study", "Lessons"], ["thread", "The thread"], ["talk", "Conversations"]];
    return el("div", null, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Study" }),
        el("h1", { class: "title", text: "Study" }),
        el("p", { class: "settings-line" }, [
          el("span", { text: [settingLabel("who"), settingLabel("how"), settingLabel("depth")].join(" · ") }),
          el("a", { href: "#setup", text: "Adjust" })
        ])
      ]),
      el("nav", { class: "tabs", "aria-label": "Study" }, tabs.map(function (t) {
        return el("a", { href: "#" + t[0], class: t[0] === tab ? "on" : null, "aria-current": t[0] === tab ? "page" : null, text: t[1] });
      }))
    ]);
  }

  // Rough reading time for a lesson's story, at 220 words a minute.
  function readMinutes(m) {
    var words = 0;
    m.sections.forEach(function (s) { s.p.forEach(function (p) { words += p.split(/\s+/).length; }); });
    return Math.max(1, Math.round(words / 220));
  }

  function lessonStatus(m) {
    var p = progress[m.id];
    if (!p) return "Not started";
    return Object.keys(p.quiz || {}).length >= LESSONS[m.id].quiz.length ? "Complete" : "In progress";
  }

  function renderLessons() {
    return el("div", null, [
      studyHead("study"),
      el("p", { class: "section-intro", text: "Eight lessons, in order of time. Each has key points, the story, balanced perspectives, a quick check, a timeline activity and a conversation." }),
      el("div", { class: "grid four" }, MODULES.map(function (m) {
        var status = lessonStatus(m);
        return el("a", { class: "card", href: "#" + m.id }, [
          el("span", { class: "label", text: m.kicker }),
          el("span", { class: "card-title", text: m.title }),
          el("span", { class: "card-sum", text: m.summary }),
          el("span", { class: "card-foot" }, [
            el("span", { text: m.era }),
            el("span", { class: "status-pill s-" + status.toLowerCase().replace(/ /g, "-"), text: status })
          ])
        ]);
      }))
    ]);
  }

  // ---- The thread --------------------------------------------------------

  function score() {
    var judged = 0, matched = 0;
    CASES.forEach(function (c) {
      var a = answers[c.id];
      if (a && a !== "skip") { judged++; if (a === c.verdict) matched++; }
    });
    return { judged: judged, matched: matched };
  }
  function firstOpen() {
    for (var i = 0; i < CASES.length; i++) if (!answers[CASES[i].id]) return CASES[i];
    return CASES[0];
  }
  function badge(verdict) { return el("span", { class: "verdict v-" + verdict, text: VERDICTS[verdict] }); }

  function renderThread() {
    var sc = score();
    return el("div", null, [
      studyHead("thread"),
      el("div", { class: "section-intro" }, [
        el("p", { text: CASES.length + " claims, oldest first. Judge each one before you see the evidence, then follow it to what happened next." }),
        el("div", { class: "actions" }, [
          el("a", { class: "btn primary", href: "#" + firstOpen().id, text: sc.judged ? "Continue" : "Begin" }),
          sc.judged ? el("span", { class: "score", text: "Judged " + sc.judged + " · matched the historians on " + sc.matched }) : null
        ])
      ]),
      el("ol", { class: "thread" }, CASES.map(function (c) {
        var a = answers[c.id];
        return el("li", null, [el("a", { href: "#" + c.id }, [
          el("span", { class: "t-year", text: c.year }),
          el("span", { class: "t-body" }, [
            el("span", { class: "t-claim", text: c.claim }),
            el("span", { class: "t-meta" }, [el("span", { class: "label", text: byId[c.chapter].kicker }),
              a ? badge(c.verdict) : el("span", { class: "status", text: "Not judged yet" })])
          ])
        ])]);
      }))
    ]);
  }

  function renderCase(c) {
    var a = answers[c.id];
    var ch = byId[c.chapter];
    var next = CASES[c.n];
    function setAnswer(v) { if (v == null) delete answers[c.id]; else answers[c.id] = v; store("komara.thread.v1", answers); route(true); }

    var head = el("header", { class: "case-head" }, [
      el("a", { class: "back", href: "#thread", text: "The thread" }),
      el("div", { class: "progress", "aria-hidden": "true" }, CASES.map(function (x) {
        return el("span", { class: x.id === c.id ? "here" : (answers[x.id] ? "done" : null) });
      })),
      el("p", { class: "eyebrow", text: "Case " + c.n + " of " + CASES.length + " · " + c.year + " · " + ch.kicker }),
      el("h1", { class: "claim", text: c.claim })
    ]);

    if (!a) {
      return el("article", { class: "case" }, [head, el("section", { class: "ask" }, [
        el("h2", { text: "Where do you stand?" }),
        el("div", { class: "choices" }, ["supported", "partly", "not"].map(function (v) {
          return button(VERDICTS[v], "choice", function () { setAnswer(v); });
        })),
        button("Show the evidence without answering", "quiet", function () { setAnswer("skip"); })
      ])]);
    }

    var you = a === "skip" ? "You chose not to answer." :
      (a === c.verdict ? "You said " + VERDICTS[a].toLowerCase() + ". That matches the historians." :
       "You said " + VERDICTS[a].toLowerCase() + ". The evidence points another way.");
    return el("article", { class: "case" }, [head, el("div", { class: "reveal" }, [
      el("p", { class: "you rise" }, [you + " ", button("Answer again", "quiet", function () { setAnswer(null); })]),
      el("section", { class: "block rise" }, [
        el("h2", { text: "The evidence" }),
        el("ul", { class: "evidence" }, c.evidence.map(function (e) {
          return el("li", null, [el("span", { text: e[0] }), el("cite", { text: e[1] })]);
        }))
      ]),
      el("section", { class: "block rise" }, [el("h2", { text: "The strongest argument against" }), el("p", { text: c.counter })]),
      el("section", { class: "block verdict-block rise" }, [
        el("h2", { text: "The verdict" }), badge(c.verdict), el("p", { text: c.verdictText }),
        el("a", { class: "link-arrow", href: "#" + ch.id, text: "Study the lesson: " + ch.title })
      ]),
      el("section", { class: "next-block rise" }, [
        el("h2", { text: "What happened next" }), el("p", { text: c.next }),
        next ? el("a", { class: "btn primary", href: "#" + next.id, text: "Case " + next.n + ": " + next.claim })
             : el("a", { class: "btn primary", href: "#reform", text: "Add yourself to the story" })
      ])
    ])]);
  }

  // ---- Conversations -----------------------------------------------------

  var scrollTarget = null;

  function renderTalk() {
    return el("div", null, [
      studyHead("talk"),
      el("p", { class: "section-intro", text: "Topics that rarely come up in school or at home. Each comes with background and questions to start the conversation." }),
      el("ol", { class: "talk-list" }, MODULES.map(function (m) {
        var t = LESSONS[m.id].talk;
        return el("li", null, [on(el("a", { href: "#" + m.id }, [
          el("span", { class: "label", text: m.title }),
          el("strong", { text: t.topic }),
          el("span", { class: "muted", text: t.starters[0] })
        ]), "click", function () { scrollTarget = "sec-talk"; })]);
      }))
    ]);
  }

  // ---- A lesson ----------------------------------------------------------

  // Deterministic shuffle, so a lesson looks the same on every visit.
  function shuffled(items, seed) {
    var h = 0, out = items.slice();
    for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    for (var j = out.length - 1; j > 0; j--) {
      h = (h * 1103515245 + 12345) >>> 0;
      var k = h % (j + 1), t = out[j]; out[j] = out[k]; out[k] = t;
    }
    return out;
  }

  function lessonProgress(m) {
    if (!progress[m.id]) progress[m.id] = { quiz: {} };
    return progress[m.id];
  }
  function saveProgress() { store("komara.lessons.v1", progress); }

  function quiz(m) {
    var qs = LESSONS[m.id].quiz;
    var wrap = el("div", { class: "quiz" });
    var summary = el("p", { class: "quiz-summary", "aria-live": "polite" });

    function renderSummary() {
      var p = lessonProgress(m), done = 0, right = 0;
      qs.forEach(function (q, i) { if (p.quiz[i] != null) { done++; if (p.quiz[i] === q[1][0]) right++; } });
      summary.textContent = done === qs.length ? "You got " + right + " of " + qs.length + ". Lesson complete." : "";
      summary.hidden = done !== qs.length;
    }

    qs.forEach(function (q, i) {
      var box = el("div", { class: "q" });
      function draw() {
        box.innerHTML = "";
        var chosen = lessonProgress(m).quiz[i];
        box.appendChild(el("p", { class: "q-text", text: (i + 1) + ". " + q[0] }));
        var opts = el("div", { class: "q-options" });
        shuffled(q[1], m.id + i).forEach(function (o) {
          var cls = "q-opt";
          if (chosen != null) cls += o === q[1][0] ? " right" : (o === chosen ? " wrong" : " dim");
          var b = button(o, cls, function () {
            if (lessonProgress(m).quiz[i] != null) return;
            lessonProgress(m).quiz[i] = o; saveProgress(); draw(); renderSummary();
          });
          if (chosen != null) b.disabled = true;
          opts.appendChild(b);
        });
        box.appendChild(opts);
        if (chosen != null) box.appendChild(el("p", { class: "q-why rise", text: (chosen === q[1][0] ? "Correct. " : "Not quite. ") + q[2] }));
      }
      draw();
      wrap.appendChild(box);
    });
    renderSummary();
    wrap.appendChild(summary);
    wrap.appendChild(button("Try the questions again", "quiet", function () {
      lessonProgress(m).quiz = {}; saveProgress(); route(true);
    }));
    return wrap;
  }

  function timeline(m) {
    var dates = m.dates, pick = [];
    var n = Math.min(5, dates.length);
    for (var i = 0; i < n; i++) pick.push(dates[Math.round(i * (dates.length - 1) / (n - 1))]);
    var pool = shuffled(pick, m.id + "-t");
    if (pool.every(function (d, j) { return d === pick[j]; })) pool.push(pool.shift());
    var placed = [];
    var wrap = el("div", { class: "timeline-act" });

    function draw(checked) {
      wrap.innerHTML = "";
      wrap.appendChild(el("p", { class: "muted", text: "Put these events in order, earliest first. Tap them one at a time; tap a placed event to take it back." }));
      var slots = el("ol", { class: "slots" });
      for (var s = 0; s < pick.length; s++) {
        var d = placed[s];
        if (!d) { slots.appendChild(el("li", { class: "slot empty" })); continue; }
        var ok = checked && d === pick[s];
        var li = el("li", { class: "slot" + (checked ? (ok ? " right" : " wrong") : "") });
        li.appendChild(button(d[1], "slot-btn", (function (item) {
          return function () { if (checked) return; placed.splice(placed.indexOf(item), 1); draw(false); };
        })(d)));
        if (checked) li.appendChild(el("span", { class: "slot-date", text: d[0] }));
        slots.appendChild(li);
      }
      wrap.appendChild(slots);
      var left = pool.filter(function (d) { return placed.indexOf(d) < 0; });
      if (left.length) {
        wrap.appendChild(el("div", { class: "pool" }, left.map(function (d) {
          return button(d[1], "pool-btn", function () { placed.push(d); draw(false); });
        })));
      } else if (!checked) {
        wrap.appendChild(button("Check my order", "btn primary", function () { draw(true); }));
      } else {
        var all = placed.every(function (d, j) { return d === pick[j]; });
        if (all) { lessonProgress(m).timeline = true; saveProgress(); }
        wrap.appendChild(el("p", { class: "q-why rise", text: all ? "All in order." : "Some are out of place. The dates are shown so you can see why." }));
        wrap.appendChild(button("Try again", "quiet", function () { placed = []; draw(false); }));
      }
    }
    draw(false);
    return wrap;
  }

  function talkSection(m) {
    var t = LESSONS[m.id].talk;
    var parts = [
      el("h3", { class: "talk-topic", text: t.topic }),
      el("p", { text: t.why }),
      el("p", { class: "label", text: "Start the conversation" }),
      el("ol", { class: "starters" }, t.starters.map(function (q) { return el("li", { text: q }); }))
    ];
    if (S().how === "group") {
      parts.push(el("div", { class: "facilitator" }, [
        el("p", { class: "label", text: "For the group leader" }),
        el("ul", null, [
          el("li", { text: "Ground rules: speak for yourself, question ideas rather than people, and anyone may pass." }),
          el("li", { text: "Timing: 5 minutes to read the background, 10 in pairs, 10 together." }),
          el("li", { text: "Close by asking each person for one thing they will look into further." })
        ])
      ]));
    } else {
      var area = el("textarea", { id: "notes-" + m.id, rows: 4, placeholder: "Write your thoughts. They stay on this device." });
      area.value = notes[m.id] || "";
      on(area, "input", function () { notes[m.id] = area.value; store("komara.notes.v1", notes); });
      parts.push(el("div", { class: "field" }, [el("label", { for: "notes-" + m.id, text: "Your reflection" }), area]));
    }
    if (S().depth === "deep") {
      parts.push(el("p", { class: "label", text: "More questions" }));
      parts.push(el("ol", { class: "starters" }, m.questions.map(function (q) { return el("li", { text: q }); })));
    }
    return parts;
  }

  function renderLesson(m) {
    var set = S(), L = LESSONS[m.id];
    var idx = MODULES.indexOf(m), prev = MODULES[idx - 1], next = MODULES[idx + 1];
    var cases = CASES.filter(function (c) { return c.chapter === m.id; });
    var outlineItems = [];

    function section(id, title, children) {
      outlineItems.push([id, title]);
      return el("section", { class: "lesson-sec", id: id }, [el("h2", { text: title })].concat(children));
    }

    var body = [section("sec-key", "Key points", [el("ol", { class: "keypoints" }, m.fast.map(function (f) { return el("li", { text: f }); }))])];

    if (set.depth !== "quick") {
      var story = [];
      m.sections.forEach(function (s) {
        story.push(el("h3", { text: s.h }));
        s.p.forEach(function (p) { story.push(el("p", { text: p })); });
      });
      if (set.depth === "deep") {
        story.push(el("h3", { text: "Key dates" }));
        story.push(el("div", { class: "table-wrap" }, [el("table", { class: "dates" }, [el("tbody", null, m.dates.map(function (d) {
          return el("tr", null, [el("th", { scope: "row", text: d[0] }), el("td", { text: d[1] })]);
        }))])]));
        story.push(el("h3", { text: "People" }));
        var dl = el("dl", { class: "people" });
        m.people.forEach(function (p) { dl.appendChild(el("dt", { text: p[0] })); dl.appendChild(el("dd", { text: p[1] })); });
        story.push(dl);
      }
      body.push(section("sec-story", "The story", story));

      var views = [el("p", { class: "muted", text: "Where the evidence is debated, these are the main positions. Weigh them yourself." }),
        el("ul", { class: "views" }, m.debated.map(function (d) { return el("li", { text: d }); }))];
      if (set.depth === "deep") {
        views.push(el("h3", { text: "Why it matters" }));
        views.push(el("ul", null, m.why.map(function (d) { return el("li", { text: d }); })));
      }
      body.push(section("sec-views", "Perspectives", views));
    }

    var acts = [el("h3", { text: "Quick check" }), quiz(m)];
    if (set.depth !== "quick") { acts.push(el("h3", { text: "Timeline" })); acts.push(timeline(m)); }
    body.push(section("sec-act", "Activities", acts));
    body.push(section("sec-talk", "Talk about it", talkSection(m)));

    if (cases.length) {
      body.push(section("sec-test", "Judge the claims", [el("ul", { class: "case-links" }, cases.map(function (c) {
        return el("li", null, [el("a", { href: "#" + c.id, text: c.claim }), answers[c.id] ? badge(c.verdict) : null]);
      }))]));
    }
    if (set.depth === "deep") {
      body.push(section("sec-src", "Read further", [el("ul", { class: "sources" }, m.sources.map(function (s) {
        return el("li", null, [el("cite", { text: s[0] }), el("span", { text: s[1] })]);
      }))]));
    }

    return el("article", { class: "lesson" }, [
      el("header", { class: "module-head" }, [
        el("a", { class: "back", href: "#study", text: "All lessons" }),
        el("p", { class: "eyebrow", text: m.kicker + " · " + m.era + " · " + settingLabel("depth") }),
        el("h1", { text: m.title }),
        el("p", { class: "lede", text: m.summary }),
        set.who === "youth" && L.note ? el("p", { class: "content-note", text: "Content note: " + L.note }) : null
      ]),
      el("nav", { class: "outline", "aria-label": "In this lesson" }, outlineItems.map(function (s) {
        return button(s[1], "outline-btn", function () { scrollToId(s[0]); });
      })),
      el("div", { class: "lesson-body" }, body),
      el("nav", { class: "pager", "aria-label": "Lesson navigation" }, [
        prev ? el("a", { href: "#" + prev.id }, [el("span", { text: "Previous lesson" }), el("strong", { text: prev.title })]) : el("span"),
        next ? el("a", { class: "next", href: "#" + next.id }, [el("span", { text: "Next lesson" }), el("strong", { text: next.title })]) : el("span")
      ])
    ]);
  }

  // instant: jump without scrolling, used when a new page opens at a section.
  function scrollToId(id, instant) {
    var node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: instant || calm() ? "auto" : "smooth", block: "start" });
  }

  // ---- Reform: the contributor's steps, in order ---------------------------

  var PRINCIPLES = [
    ["Sovereignty first", "Each nation sets its own priorities. Komara contributes; it does not dictate."],
    ["Independence", "No party, government or foreign power directs Komara."],
    ["One people, many places", "The continent and the diaspora are one constituency, in every language."],
    ["Accountability in public", "What Komara promises and delivers is on the record."],
    ["Contribution over credentials", "People are judged by what they put forward and deliver."]
  ];

  var PATHS = [
    { id: "teach", title: "Teach or translate", problem: "Our history is taught in fragments.",
      proposal: "One free curriculum that connects Florida, Haiti, the Sahel and the Afro-Latin world.",
      steps: ["Study one lesson at the Deep setting.", "Teach it to at least three people, or translate its key points into Kreyòl, French, Spanish or Portuguese.", "Note anything that needed correcting or explaining."] },
    { id: "skills", title: "Offer your skills", problem: "Diaspora skills are invisible to the places that need them.",
      proposal: "An open registry of verified skills.",
      steps: ["Name one school, clinic or cooperative your skill could help.", "Contact them and offer two hours this month.", "Agree on a date, and on who will confirm the work was done."] },
    { id: "circle", title: "Host a Komara Circle", problem: "Our communities rarely meet each other.",
      proposal: "Local study groups that use one shared format, anywhere.",
      steps: ["Find four to ten people and a free space: a home, a church hall, a library.", "Choose one lesson and set Study to “With a group or class.”", "Hold the session, and ask one person to confirm it took place."] },
    { id: "school", title: "Connect a school", problem: "Our classrooms never meet.",
      proposal: "Classrooms in Florida, Haiti and Burkina Faso study the same case on the same day, together.",
      steps: ["Identify a teacher you know at a school in Florida, Haiti or the Sahel.", "Share the thread with them and pick one case to study together.", "Propose a date for a joint video session."] },
    { id: "record", title: "Keep the record", problem: "Contributions go unrecorded.",
      proposal: "A public record of work, signed off by the people it served.",
      steps: ["Find one contribution someone in your community has made.", "Ask the person it served whether they will confirm it.", "Submit it as your report in the next step."] }
  ];
  var STEP_NAMES = ["Agree to the principles", "Choose where you start", "Verify yourself", "Take your first steps", "Report what you did"];
  var reformView = null;

  function saveReform() { store("komara.reform.v1", reform); }
  function verified() { return !!(member && member.emailOk && member.phoneOk); }
  function pathById(id) { return PATHS.filter(function (p) { return p.id === id; })[0]; }

  function renderReform() {
    if (reform.step > 5) return reformComplete();
    var showing = reformView && reformView < reform.step ? reformView : reform.step;

    var stepper = el("ol", { class: "stepper" }, STEP_NAMES.map(function (name, i) {
      var n = i + 1, state = n < reform.step ? "done" : (n === reform.step ? "current" : "locked");
      var inner = [el("span", { class: "step-n", text: state === "done" ? "✓" : String(n) }), el("span", { class: "step-name", text: name })];
      var row = state === "done"
        ? on(el("button", { class: "step-btn", type: "button" }, inner), "click", function () { reformView = n; route(true); })
        : el("span", { class: "step-btn", "aria-current": state === "current" ? "step" : null }, inner);
      return el("li", { class: "step " + state + (n === showing ? " showing" : "") }, [row]);
    }));

    return el("div", { class: "reform" }, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Reform" }),
        el("h1", { class: "title", text: "Your next steps" }),
        el("p", { class: "lede", text: "Five steps, in order. Each one unlocks the next. Your progress is saved on this device." })
      ]),
      el("div", { class: "reform-layout" }, [stepper, el("div", { class: "step-panel rise" }, stepPanel(showing))])
    ]);
  }

  function advance(to) { reform.step = Math.max(reform.step, to); reformView = null; saveReform(); route(true); }

  function stepPanel(n) {
    var reviewing = n < reform.step;
    var back = reviewing ? button("Back to your current step", "quiet", function () { reformView = null; route(true); }) : null;

    if (n === 1) {
      var agree = el("input", { type: "checkbox", id: "agree", checked: reform.agreed, disabled: reviewing });
      var go = button("Continue", "btn primary", function () { reform.agreed = true; advance(2); });
      go.disabled = !agree.checked;
      on(agree, "change", function () { go.disabled = !agree.checked; });
      return [
        el("h2", { text: "Agree to the principles" }),
        el("p", { class: "muted", text: "Everyone who contributes through Komara works by the same five principles." }),
        el("dl", { class: "principle-list" }, PRINCIPLES.reduce(function (acc, p) { return acc.concat([el("dt", { text: p[0] }), el("dd", { text: p[1] })]); }, [])),
        el("label", { class: "check", for: "agree" }, [agree, "I will work by these principles."]),
        reviewing ? back : go
      ];
    }

    if (n === 2) {
      var choice = reform.path;
      var go2 = button("Continue", "btn primary", function () { reform.path = choice; saveReform(); advance(3); });
      go2.disabled = !choice;
      return [
        el("h2", { text: "Choose where you start" }),
        el("p", { class: "muted", text: "Each path answers a problem the diaspora has lived with for years. Pick one; you can take another later." }),
        el("div", { class: "paths", role: "radiogroup", "aria-label": "Paths" }, PATHS.map(function (p, i) {
          var id = "path-" + p.id;
          var radio = el("input", { type: "radio", name: "path", id: id, value: p.id, checked: choice === p.id, disabled: reviewing });
          on(radio, "change", function () { choice = p.id; go2.disabled = false; });
          return el("label", { class: "path-card", for: id }, [radio, el("span", { class: "path-body" }, [
            el("span", { class: "path-num", text: ["I", "II", "III", "IV", "V"][i] }),
            el("strong", { text: p.title }),
            el("span", { class: "path-problem", text: p.problem }),
            el("span", { class: "muted", text: p.proposal })
          ])]);
        })),
        reviewing ? back : go2
      ];
    }

    if (n === 3) {
      if (verified()) {
        return [
          el("h2", { text: "Verify yourself" }),
          el("p", { class: "ok-line", text: "Verified as " + member.name + ". Email and phone confirmed." }),
          reviewing ? back : button("Continue", "btn primary", function () { advance(4); })
        ];
      }
      return [
        el("h2", { text: "Verify yourself" }),
        el("p", { text: "Komara works on trust. Register your skills and confirm your email and phone. It takes about four minutes, and you come straight back here." }),
        el("a", { class: "btn primary", href: "#join", text: member ? "Finish verifying" : "Register and verify" })
      ];
    }

    if (n === 4) {
      var p = pathById(reform.path);
      var checks = reform.checks[p.id] || [];
      var go4 = button("Continue", "btn primary", function () { advance(5); });
      var refresh = function () { go4.disabled = !p.steps.every(function (_, i) { return checks[i]; }); };
      var list = el("ul", { class: "checklist" }, p.steps.map(function (s, i) {
        var id = "chk-" + i;
        var box = el("input", { type: "checkbox", id: id, checked: !!checks[i], disabled: reviewing });
        on(box, "change", function () { checks[i] = box.checked; reform.checks[p.id] = checks; saveReform(); refresh(); });
        return el("li", null, [el("label", { class: "check", for: id }, [box, s])]);
      }));
      refresh();
      return [
        el("h2", { text: "Take your first steps" }),
        el("p", { class: "muted", text: "Your path: " + p.title + ". Tick each step when it is done. There is no deadline." }),
        list,
        reviewing ? back : go4
      ];
    }

    var err = el("p", { class: "form-error", role: "alert", hidden: true });
    var form = el("form", { class: "report", novalidate: true }, [
      field("r-what", "What did you do?", el("textarea", { id: "r-what", name: "what", rows: 4, required: true }), "Plain words are best. Include where and when.", true),
      el("div", { class: "row" }, [
        field("r-who", "Who did it serve?", input("r-who", "text", { name: "who", required: true, placeholder: "A school, a group, a person" }), null, true),
        field("r-date", "Date", input("r-date", "date", { name: "date", required: true }), null, true)
      ]),
      el("div", { class: "row" }, [
        field("r-confirm", "Who can confirm it?", input("r-confirm", "text", { name: "confirm", required: true }), "The person or group it served.", true),
        field("r-contact", "Their email or phone", input("r-contact", "text", { name: "contact", required: true }), null, true)
      ]),
      err,
      el("button", { class: "btn primary", type: "submit", text: "Submit my report" })
    ]);
    on(form, "submit", function (e) {
      e.preventDefault();
      var bad = Array.prototype.filter.call(form.elements, function (c) { return c.willValidate && !c.checkValidity(); });
      if (bad.length) { err.textContent = "Please fill in every field. The first one missing is highlighted."; err.hidden = false; bad[0].focus(); return; }
      var d = new FormData(form);
      reform.report = { path: reform.path, what: d.get("what"), who: d.get("who"), date: d.get("date"), confirm: d.get("confirm"),
                        contact: d.get("contact"), member: member && member.name, submitted_at: new Date().toISOString() };
      if (!REG.reportEndpoint) { advance(6); return; }
      fetch(REG.reportEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reform.report) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); advance(6); })
        .catch(function () { err.textContent = "Your report could not be sent. Check your connection and try again."; err.hidden = false; });
    });
    return [
      el("h2", { text: "Report what you did" }),
      el("p", { class: "muted", text: "Your report goes on the record once the person it served confirms it." }),
      form
    ];
  }

  function reformComplete() {
    var p = pathById(reform.path), r = reform.report;
    return el("div", { class: "reform" }, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Reform · complete" }),
        el("h1", { class: "title", text: "You are on the record" }),
        el("p", { class: "lede", text: "Your report is waiting for confirmation from " + r.confirm + ". Once they confirm, it joins Komara’s public record." })
      ]),
      el("dl", { class: "summary-list rise" }, [
        el("dt", { text: "Path" }), el("dd", { text: p.title }),
        el("dt", { text: "What you did" }), el("dd", { text: r.what }),
        el("dt", { text: "Who it served" }), el("dd", { text: r.who + " · " + r.date })
      ]),
      REG.reportEndpoint ? null : el("p", { class: "draft", text: "Preview mode. Reports stay on this device until a backend is connected." }),
      el("div", { class: "actions" }, [
        button("Take another path", "btn primary", function () { reform.step = 2; reform.path = null; reform.report = null; saveReform(); route(true); }),
        el("a", { class: "btn", href: "#study", text: "Keep studying" })
      ])
    ]);
  }

  // ---- Join: register, then verify ----------------------------------------

  function field(id, label, control, hint, required) {
    return el("div", { class: "field" }, [
      el("label", { for: id }, [label, required ? el("span", { class: "req", text: " *" }) : null]),
      control,
      hint ? el("p", { class: "hint", text: hint }) : null
    ]);
  }
  function input(id, type, attrs) {
    var a = { id: id, name: id, type: type };
    Object.keys(attrs || {}).forEach(function (k) { a[k] = attrs[k]; });
    return el("input", a);
  }
  function select(id, options, placeholder, required) {
    return el("select", { id: id, name: id, required: required }, [el("option", { value: "", text: placeholder })].concat(
      options.map(function (o) { return el("option", { value: o, text: o }); })
    ));
  }
  function skillPair(n, required) {
    var cat = select("skill" + n + "_category", Object.keys(REG.skills), "Choose a field", required);
    var skill = select("skill" + n, [], "Choose a field first", required);
    skill.disabled = true;
    on(cat, "change", function () {
      skill.innerHTML = "";
      var opts = REG.skills[cat.value] || [];
      skill.appendChild(el("option", { value: "", text: opts.length ? "Choose a trade or role" : "Choose a field first" }));
      opts.forEach(function (o) { skill.appendChild(el("option", { value: o, text: o })); });
      skill.disabled = !opts.length;
    });
    return [cat, skill];
  }
  function checkboxGroup(name, options) {
    return el("div", { class: "checks", role: "group" }, options.map(function (o, i) {
      var id = name + "_" + i;
      return el("label", { class: "check", for: id }, [input(id, "checkbox", { name: name, value: o }), o]);
    }));
  }

  function saveMember() { store("komara.member.v1", member); }

  function renderJoin() {
    var stage = !member ? 0 : (verified() ? 2 : 1);
    return el("div", null, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Skills registry" }),
        el("h1", { class: "title", text: "Join" }),
        el("p", { class: "lede", text: "The diaspora has every skill a nation needs. Register once, verify yourself, and schools, clinics and community projects can find you." }),
        el("ol", { class: "mini-steps" }, ["Your details", "Verify", "Done"].map(function (n, i) {
          return el("li", { class: i < stage ? "done" : (i === stage ? "current" : null), "aria-current": i === stage ? "step" : null, text: n });
        }))
      ]),
      el("div", { class: "rise" }, [stage === 0 ? joinForm() : (stage === 1 ? verifyPanel() : joinDone())])
    ]);
  }

  function joinForm() {
    var s1 = skillPair(1, true), s2 = skillPair(2, false);
    var err = el("p", { class: "form-error", role: "alert", hidden: true });
    var form = el("form", { id: "registry", novalidate: true }, [
      el("fieldset", null, [
        el("legend", { text: "Who you are" }),
        el("div", { class: "row" }, [
          field("full_name", "Full legal name", input("full_name", "text", { autocomplete: "name", required: true }), "As it appears on your ID or license.", true),
          field("preferred_name", "Name you go by", input("preferred_name", "text", { autocomplete: "nickname" }))
        ]),
        el("div", { class: "row" }, [
          field("email", "Email", input("email", "email", { autocomplete: "email", required: true }), "You will confirm it with a code.", true),
          field("phone", "Phone, with country code", input("phone", "tel", { autocomplete: "tel", placeholder: "+1 305 555 0123", required: true }), "You will confirm it with a code.", true)
        ]),
        el("div", { class: "row" }, [
          field("city", "City", input("city", "text", { autocomplete: "address-level2", required: true }), null, true),
          field("country", "Country you live in", select("country", REG.countries, "Choose a country", true), null, true)
        ]),
        field("heritage", "Heritage or connection", select("heritage", REG.heritage, "Choose one (optional)", false))
      ]),
      el("fieldset", null, [
        el("legend", { text: "What you can do" }),
        el("div", { class: "row" }, [field("skill1_category", "Main field", s1[0], null, true), field("skill1", "Main trade or role", s1[1], null, true)]),
        el("div", { class: "row" }, [
          field("experience", "Experience", select("experience", REG.experience, "Choose a range", true), null, true),
          field("license", "License or certification", input("license", "text", { placeholder: "e.g. Florida RN license, Board of Nursing" }), "Licensed trades are checked with the issuing body.")
        ]),
        el("div", { class: "row" }, [field("skill2_category", "Second field", s2[0]), field("skill2", "Second trade or role", s2[1])]),
        field("languages_0", "Languages you work in", checkboxGroup("languages", REG.languages)),
        field("availability", "Time you can give", select("availability", REG.availability, "Choose one", true), null, true)
      ]),
      el("fieldset", null, [
        el("legend", { text: "Your credibility" }),
        field("profile_url", "A public profile or portfolio", input("profile_url", "url", { placeholder: "https://", required: true }), "LinkedIn, a business website, a portfolio or a professional listing.", true),
        el("div", { class: "row" }, [
          field("reference_name", "A reference who knows your work", input("reference_name", "text")),
          field("reference_contact", "Their email or phone", input("reference_contact", "text"))
        ]),
        el("p", { class: "note", text: "Never upload ID documents here. Next you confirm your email and phone yourself; then a Komara reviewer checks your profile or reference, and any license with the body that issued it." }),
        el("label", { class: "check", for: "public_name" }, [input("public_name", "checkbox", {}), "Show my name publicly next to work I contribute. Leave this off to appear by trade and city only."]),
        el("label", { class: "check", for: "consent" }, [input("consent", "checkbox", { required: true }), "I agree that Komara may store these details and contact me about initiatives that match my skills. I can ask for my record to be deleted at any time."])
      ]),
      err,
      el("button", { class: "btn primary", type: "submit", text: "Continue to verification" })
    ]);
    on(form, "submit", function (e) {
      e.preventDefault();
      var bad = Array.prototype.filter.call(form.elements, function (c) { return c.willValidate && !c.checkValidity(); });
      if (bad.length) { err.textContent = "Please fill in the fields marked with an asterisk. The first one missing is highlighted."; err.hidden = false; bad[0].focus(); return; }
      var rec = collect(form);
      function proceed() {
        member = { name: rec.preferred_name || rec.full_name, email: rec.email, phone: rec.phone, trade: rec.skill1, city: rec.city,
                   license: rec.license || null, profile: rec.profile_url, emailOk: false, phoneOk: false, record: rec };
        saveMember(); route(true); window.scrollTo(0, 0);
      }
      if (!REG.endpoint) { proceed(); return; }
      fetch(REG.endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(rec) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); proceed(); })
        .catch(function () { err.textContent = "Your details could not be sent. Check your connection and try again."; err.hidden = false; });
    });
    return el("div", null, [REG.endpoint ? null : el("p", { class: "draft", text: "Preview mode. Nothing is sent yet; your details stay on this device." }), form]);
  }

  function collect(form) {
    var data = new FormData(form), rec = {};
    ["full_name", "preferred_name", "email", "phone", "city", "country", "heritage", "skill1_category", "skill1", "experience",
     "license", "skill2_category", "skill2", "availability", "profile_url", "reference_name", "reference_contact"].forEach(function (k) {
      var v = (data.get(k) || "").toString().trim();
      if (v) rec[k] = v;
    });
    rec.languages = data.getAll("languages");
    rec.public_name = form.elements.public_name.checked;
    rec.submitted_at = new Date().toISOString();
    return rec;
  }

  // Codes are sent and checked by the backend when one is configured.
  // In preview mode the page makes up a code and shows it on screen.
  var previewCodes = {};

  function codeRow(channel, label, to) {
    var okKey = channel + "Ok";
    var row = el("div", { class: "verify-row" });
    function draw(sent, message) {
      row.innerHTML = "";
      row.className = "verify-row" + (member[okKey] ? " ok" : "");
      row.appendChild(el("div", { class: "verify-label" }, [el("strong", { text: label }), el("span", { class: "muted", text: to })]));
      if (member[okKey]) { row.appendChild(el("span", { class: "verify-state", text: "Confirmed" })); return; }
      if (!sent) {
        row.appendChild(button("Send code", "btn", function () {
          if (REG.sendCodeEndpoint) {
            fetch(REG.sendCodeEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: channel, to: to }) })
              .then(function (r) { if (!r.ok) throw new Error(r.status); draw(true, "Code sent to " + to + "."); })
              .catch(function () { draw(false, "The code could not be sent. Try again."); });
          } else {
            previewCodes[channel] = String(Math.floor(100000 + Math.random() * 900000));
            draw(true, "Preview mode: no message is sent. Your code is " + previewCodes[channel] + ".");
          }
        }));
        if (message) row.appendChild(el("p", { class: "form-error", text: message }));
        return;
      }
      var id = "code-" + channel;
      var box = input(id, "text", { inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6", placeholder: "6-digit code" });
      var err = el("p", { class: "form-error", role: "alert", hidden: true });
      function accept() { member[okKey] = true; saveMember(); route(true); }
      function reject() { err.textContent = "That code did not match. Check it and try again."; err.hidden = false; }
      row.appendChild(el("div", { class: "code-entry" }, [
        el("label", { class: "sr-only", for: id, text: label + " code" }), box,
        button("Confirm", "btn primary", function () {
          var code = box.value.trim();
          if (!REG.checkCodeEndpoint) { if (code === previewCodes[channel]) accept(); else reject(); return; }
          fetch(REG.checkCodeEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: channel, to: to, code: code }) })
            .then(function (r) { if (!r.ok) throw new Error(r.status); accept(); })
            .catch(reject);
        })
      ]));
      if (message) row.appendChild(el("p", { class: "hint rise", text: message }));
      row.appendChild(err);
    }
    draw(false);
    return row;
  }

  function verifyPanel() {
    return el("div", { class: "verify" }, [
      el("h2", { text: "Confirm it’s you" }),
      el("p", { class: "muted", text: "Enter the code sent to each. This shows you are a real person who can be reached." }),
      codeRow("email", "Email", member.email),
      codeRow("phone", "Phone", member.phone),
      el("div", { class: "verify-row pending" }, [
        el("div", { class: "verify-label" }, [el("strong", { text: "Profile review" }), el("span", { class: "muted", text: member.profile })]),
        el("span", { class: "verify-state", text: "Reviewed by Komara" })
      ]),
      member.license ? el("div", { class: "verify-row pending" }, [
        el("div", { class: "verify-label" }, [el("strong", { text: "License check" }), el("span", { class: "muted", text: member.license })]),
        el("span", { class: "verify-state", text: "Checked with the issuer" })
      ]) : null,
      button("Change my details", "quiet", function () { member = null; saveMember(); route(true); })
    ]);
  }

  function joinDone() {
    return el("div", { class: "verify" }, [
      el("h2", { text: "You’re verified, " + member.name + "." }),
      el("p", { class: "muted", text: "Your email and phone are confirmed. Your profile" + (member.license ? " and license are" : " is") + " now with a Komara reviewer." }),
      el("div", { class: "member-card" }, [
        el("strong", { text: member.name }),
        el("span", { text: member.trade + " · " + member.city }),
        el("span", { class: "badges" }, [
          el("span", { class: "verdict v-supported", text: "Email confirmed" }),
          el("span", { class: "verdict v-supported", text: "Phone confirmed" }),
          el("span", { class: "verdict v-partly", text: "Profile in review" })
        ])
      ]),
      el("div", { class: "actions" }, [
        el("a", { class: "btn primary", href: "#reform", text: "Continue to your next steps" }),
        el("a", { class: "btn", href: "#study", text: "Study" })
      ]),
      button("Start over with different details", "quiet", function () { member = null; saveMember(); route(true); })
    ]);
  }

  // ---- Routing and transitions -------------------------------------------

  function build(name) {
    if (name === "study") return settings ? renderLessons() : renderSetup();
    if (name === "setup") return renderSetup();
    if (name === "thread") return renderThread();
    if (name === "talk") return renderTalk();
    if (name === "join") return renderJoin();
    if (name === "reform") return renderReform();
    if (byId[name]) return renderLesson(byId[name]);
    if (caseById[name]) return renderCase(caseById[name]);
    return renderSplash();
  }

  function sectionOf(name) {
    if (name === "join" || name === "reform") return name;
    if (name === "study" || name === "setup" || name === "thread" || name === "talk" || byId[name] || caseById[name]) return "study";
    return "";
  }

  function calm() { return S().motion === "off" || window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  // soft: redraw the current page in place (after an answer or a step) without the page transition.
  function route(soft) {
    var name = (location.hash || "").replace(/^#/, "");
    var nav = sectionOf(name);
    function swap() {
      var node = build(name);
      if (!soft && !calm()) node.classList.add("enter");
      view.innerHTML = "";
      view.appendChild(node);
      view.classList.remove("leaving");
      document.body.classList.toggle("is-splash", nav === "");
      document.querySelectorAll(".nav a").forEach(function (a) {
        var here = a.getAttribute("href") === "#" + nav;
        a.classList.toggle("on", here);
        if (here) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      if (!soft) {
        window.scrollTo(0, 0);
        if (scrollTarget) { scrollToId(scrollTarget, true); scrollTarget = null; }
      }
    }
    if (soft || calm() || !view.firstChild) swap();
    else { view.classList.add("leaving"); setTimeout(swap, 140); }
  }

  applySettings();
  window.addEventListener("hashchange", function () { route(false); });
  route(false);
})();
