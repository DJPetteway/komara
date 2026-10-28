// Komara Project — a small hash-routed site.
// Views: the thread (home), one view per case, chapters, one view per chapter, join.
(function () {
  "use strict";

  var MODULES = window.KOMARA_MODULES;
  var CASES = window.KOMARA_CASES;
  var REG = window.KOMARA_REGISTRY;
  var byId = {}, caseById = {};
  MODULES.forEach(function (m) { byId[m.id] = m; });
  CASES.forEach(function (c, i) { c.n = i + 1; caseById[c.id] = c; });

  var VERDICTS = { supported: "Supported", partly: "Partly supported", not: "Not supported" };

  var view = document.getElementById("view");

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "class") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function on(node, type, fn) { node.addEventListener(type, fn); return node; }

  // ---- The learner's answers (kept in this browser only) -----------------

  var KEY = "komara.thread.v1";
  var answers = {};
  try { answers = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { answers = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(answers)); } catch (e) { /* storage blocked */ } }

  function score() {
    var judged = 0, matched = 0;
    CASES.forEach(function (c) {
      var a = answers[c.id];
      if (a && a !== "skip") { judged++; if (a === c.verdict) matched++; }
    });
    return { judged: judged, matched: matched };
  }

  function badge(verdict) {
    return el("span", { class: "verdict v-" + verdict, text: VERDICTS[verdict] });
  }

  // ---- Splash (home) ----------------------------------------------------

  var DOORS = [
    ["study", "Study", "The connected story of the diaspora, one claim at a time."],
    ["join", "Join", "Put your skills on the map for schools, clinics and communities."],
    ["reform", "Reform", "Take on the problems the diaspora has lived with for years."]
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

  // ---- Study: the thread -------------------------------------------------

  function studyTabs(current) {
    return el("div", { class: "tabs", role: "navigation", "aria-label": "Study" }, [
      el("a", { href: "#study", class: current === "study" ? "on" : "", text: "The thread" }),
      el("a", { href: "#learn", class: current === "learn" ? "on" : "", text: "Chapters" })
    ]);
  }

  function renderStudy() {
    var sc = score();
    return el("div", null, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Study" }),
        el("h1", { class: "title", text: "The thread" }),
        el("p", { class: "lede", text: CASES.length + " claims, oldest first. Judge each one, weigh the evidence, see the verdict." }),
        el("div", { class: "actions" }, [
          el("a", { class: "btn primary", href: "#" + firstOpen().id, text: sc.judged ? "Continue" : "Begin" }),
          sc.judged ? el("span", { class: "score", text: "Judged " + sc.judged + " · matched the historians on " + sc.matched }) : null
        ])
      ]),
      studyTabs("study"),
      el("ol", { class: "thread" }, CASES.map(threadItem))
    ]);
  }

  // ---- Reform ------------------------------------------------------------

  var REFORMS = [
    ["Our history is taught in fragments.", "One free curriculum that connects Florida, Haiti, the Sahel and the Afro-Latin world.", "Translate the thread into Kreyòl, French, Spanish and Portuguese."],
    ["Diaspora skills are invisible to the places that need them.", "An open registry of verified skills.", "Add yourself to the registry."],
    ["Contributions go unrecorded.", "A public record of work, signed off by the people it served.", "Record the first contributions this season."],
    ["Our communities rarely meet each other.", "Komara Circles: local study groups that use one shared format, anywhere.", "Host the first Circle in your city."],
    ["Our classrooms never meet.", "Classrooms in Florida, Haiti and Burkina Faso study the same case on the same day, together.", "Find three partner schools."]
  ];

  var PRINCIPLES = [
    ["Sovereignty first", "Each nation sets its own priorities. Komara contributes; it does not dictate."],
    ["Independence", "No party, government or foreign power directs Komara."],
    ["One people, many places", "The continent and the diaspora are one constituency, in every language."],
    ["Accountability in public", "What Komara promises and delivers is on the record."],
    ["Contribution over credentials", "People are judged by what they put forward and deliver."]
  ];

  function renderReform() {
    return el("div", null, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Reform" }),
        el("h1", { class: "title", text: "Reform" }),
        el("p", { class: "lede", text: "Five problems the diaspora has lived with for years, and what Komara proposes. Each is open to anyone." })
      ]),
      el("ol", { class: "reforms" }, REFORMS.map(function (r) {
        return el("li", null, [
          el("p", { class: "r-problem", text: r[0] }),
          el("p", { class: "r-proposal", text: r[1] }),
          el("p", { class: "r-step" }, [el("span", { class: "label", text: "First step" }), " " + r[2]])
        ]);
      })),
      el("section", { class: "band principles" }, [
        el("h2", { text: "Principles" }),
        el("dl", null, PRINCIPLES.reduce(function (acc, pr) {
          return acc.concat([el("dt", { text: pr[0] }), el("dd", { text: pr[1] })]);
        }, []))
      ]),
      el("div", { class: "actions" }, [el("a", { class: "btn primary", href: "#join", text: "Take part" })])
    ]);
  }

  function firstOpen() {
    for (var i = 0; i < CASES.length; i++) if (!answers[CASES[i].id]) return CASES[i];
    return CASES[0];
  }

  function threadItem(c) {
    var a = answers[c.id];
    var status = a ? badge(c.verdict) : el("span", { class: "status", text: "Not judged yet" });
    return el("li", null, [el("a", { href: "#" + c.id }, [
      el("span", { class: "t-year", text: c.year }),
      el("span", { class: "t-body" }, [
        el("span", { class: "t-claim", text: c.claim }),
        el("span", { class: "t-meta" }, [el("span", { class: "label", text: byId[c.chapter].kicker }), status])
      ])
    ])]);
  }

  // ---- One case ----------------------------------------------------------

  function renderCase(c) {
    var a = answers[c.id];
    var ch = byId[c.chapter];
    var next = CASES[c.n];

    var progress = el("div", { class: "progress", "aria-hidden": "true" }, CASES.map(function (x) {
      return el("span", { class: x.id === c.id ? "here" : (answers[x.id] ? "done" : "") });
    }));

    var head = el("header", { class: "case-head" }, [
      el("a", { class: "back", href: "#study", text: "The thread" }),
      progress,
      el("p", { class: "eyebrow", text: "Case " + c.n + " of " + CASES.length + " · " + c.year + " · " + ch.kicker }),
      el("h1", { class: "claim", text: c.claim })
    ]);

    var body;
    if (!a) {
      body = el("section", { class: "ask" }, [
        el("h2", { text: "Where do you stand?" }),
        el("div", { class: "choices" }, ["supported", "partly", "not"].map(function (v) {
          return on(el("button", { class: "choice", type: "button", text: VERDICTS[v] }), "click", function () {
            answers[c.id] = v; save(); route();
          });
        })),
        on(el("button", { class: "quiet", type: "button", text: "Show the evidence without answering" }), "click", function () {
          answers[c.id] = "skip"; save(); route();
        })
      ]);
    } else {
      var you = a === "skip" ? "You chose not to answer." :
        (a === c.verdict ? "You said " + VERDICTS[a].toLowerCase() + ". That matches the historians." :
         "You said " + VERDICTS[a].toLowerCase() + ". The evidence points another way.");
      body = el("div", { class: "reveal" }, [
        el("p", { class: "you" }, [you + " ", on(el("button", { class: "quiet", type: "button", text: "Answer again" }), "click", function () {
          delete answers[c.id]; save(); route();
        })]),
        el("section", { class: "block" }, [
          el("h2", { text: "The evidence" }),
          el("ul", { class: "evidence" }, c.evidence.map(function (e) {
            return el("li", null, [el("span", { text: e[0] }), el("cite", { text: e[1] })]);
          }))
        ]),
        el("section", { class: "block" }, [
          el("h2", { text: "The strongest argument against" }),
          el("p", { text: c.counter })
        ]),
        el("section", { class: "block verdict-block" }, [
          el("h2", { text: "The verdict" }),
          badge(c.verdict),
          el("p", { text: c.verdictText }),
          el("a", { class: "link-arrow", href: "#" + ch.id, text: "Go deeper: " + ch.title })
        ]),
        el("section", { class: "next-block" }, [
          el("h2", { text: "What happened next" }),
          el("p", { text: c.next }),
          next
            ? el("a", { class: "btn primary", href: "#" + next.id, text: "Case " + next.n + ": " + next.claim })
            : el("a", { class: "btn primary", href: "#join", text: "Add yourself to the story" })
        ])
      ]);
    }
    return el("article", { class: "case" }, [head, body]);
  }

  // ---- Chapters ----------------------------------------------------------

  // Rough reading time for a chapter, at 220 words a minute.
  function readMinutes(m) {
    var words = 0;
    m.sections.forEach(function (s) { s.p.forEach(function (p) { words += p.split(/\s+/).length; }); });
    return Math.max(1, Math.round(words / 220));
  }

  function casesIn(m) { return CASES.filter(function (c) { return c.chapter === m.id; }); }

  function chapterCard(m) {
    var n = casesIn(m).length;
    return el("a", { class: "card", href: "#" + m.id }, [
      el("span", { class: "label", text: m.kicker }),
      el("span", { class: "card-title", text: m.title }),
      el("span", { class: "card-sum", text: m.summary }),
      el("span", { class: "card-foot", text: m.era + " · " + readMinutes(m) + " min read" + (n ? " · " + n + (n > 1 ? " cases" : " case") : "") })
    ]);
  }

  function renderLearn() {
    return el("div", null, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Study" }),
        el("h1", { class: "title", text: "Chapters" }),
        el("p", { class: "lede", text: "Eight longer readings, in order of time, with dates, people, sources and questions." }),
        el("p", { class: "draft", text: "Draft v0. Written for review by historians before classroom use. Corrections are welcome." })
      ]),
      studyTabs("learn"),
      el("div", { class: "grid four" }, MODULES.map(chapterCard))
    ]);
  }

  function list(items, cls) {
    return el("ul", { class: cls || "" }, items.map(function (t) { return el("li", { text: t }); }));
  }

  function renderModule(m) {
    var idx = MODULES.indexOf(m);
    var prev = MODULES[idx - 1], next = MODULES[idx + 1];
    var cases = casesIn(m);

    var story = [];
    m.sections.forEach(function (s) {
      story.push(el("h2", { text: s.h }));
      s.p.forEach(function (p) { story.push(el("p", { text: p })); });
    });

    var dates = el("table", { class: "dates" }, [el("tbody", null, m.dates.map(function (d) {
      return el("tr", null, [el("th", { scope: "row", text: d[0] }), el("td", { text: d[1] })]);
    }))]);

    var people = el("dl", { class: "people" }, []);
    m.people.forEach(function (p) {
      people.appendChild(el("dt", { text: p[0] }));
      people.appendChild(el("dd", { text: p[1] }));
    });

    var sources = el("ul", { class: "sources" }, m.sources.map(function (s) {
      return el("li", null, [el("cite", { text: s[0] }), el("span", { text: s[1] })]);
    }));

    return el("article", { class: "module" }, [
      el("header", { class: "module-head" }, [
        el("a", { class: "back", href: "#learn", text: "All chapters" }),
        el("p", { class: "eyebrow", text: m.kicker + " · " + m.era + " · " + readMinutes(m) + " min read" }),
        el("h1", { text: m.title }),
        el("p", { class: "lede", text: m.summary })
      ]),
      el("section", { class: "fast", "aria-labelledby": "fast-h" }, [
        el("h2", { id: "fast-h", text: "Key points" }),
        el("ol", null, m.fast.map(function (f) { return el("li", { text: f }); })),
        cases.length ? el("div", { class: "fast-cases" }, [
          el("p", { class: "label", text: "Test yourself" })
        ].concat(cases.map(function (c) {
          return el("a", { href: "#" + c.id, text: "Case " + c.n + ": " + c.claim });
        }))) : null
      ]),
      el("div", { class: "module-body" }, [
        el("div", { class: "story" }, story.concat([
          el("h2", { text: "What people argue about" }),
          list(m.debated),
          el("h2", { text: "Why it matters to us" }),
          list(m.why),
          el("h2", { text: "Questions for discussion" }),
          el("ol", { class: "questions" }, m.questions.map(function (q) { return el("li", { text: q }); })),
          el("h2", { text: "Read further" }),
          sources
        ])),
        el("aside", { class: "rail" }, [
          el("h3", { text: "Key dates" }),
          el("div", { class: "table-wrap" }, [dates]),
          el("h3", { text: "People" }),
          people,
          el("h3", { text: "Connects to" }),
          el("div", { class: "connects" }, m.connects.map(function (id) {
            return el("a", { href: "#" + id, text: byId[id].title });
          }))
        ])
      ]),
      el("nav", { class: "pager", "aria-label": "Chapter navigation" }, [
        prev ? el("a", { href: "#" + prev.id }, [el("span", { text: "Previous chapter" }), el("strong", { text: prev.title })]) : el("span"),
        next ? el("a", { class: "next", href: "#" + next.id }, [el("span", { text: "Next chapter" }), el("strong", { text: next.title })]) : el("span")
      ])
    ]);
  }

  // ---- Registry form ----------------------------------------------------

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
    var s = el("select", { id: id, name: id }, [el("option", { value: "", text: placeholder })].concat(
      options.map(function (o) { return el("option", { value: o, text: o }); })
    ));
    if (required) s.required = true;
    return s;
  }

  function skillPair(n, required) {
    var cat = select("skill" + n + "_category", Object.keys(REG.skills), "Choose a field", required);
    var skill = select("skill" + n, [], "Choose a field first", required);
    skill.disabled = true;
    cat.addEventListener("change", function () {
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

  function renderJoin() {
    var s1 = skillPair(1, true), s2 = skillPair(2, false);

    var form = el("form", { id: "registry", novalidate: "" }, [
      el("fieldset", null, [
        el("legend", { text: "Who you are" }),
        el("div", { class: "row" }, [
          field("full_name", "Full legal name", input("full_name", "text", { autocomplete: "name", required: "" }), "As it appears on your ID or license.", true),
          field("preferred_name", "Name you go by", input("preferred_name", "text", { autocomplete: "nickname" }))
        ]),
        el("div", { class: "row" }, [
          field("email", "Email", input("email", "email", { autocomplete: "email", required: "" }), "We send a confirmation link here.", true),
          field("phone", "Phone, with country code", input("phone", "tel", { autocomplete: "tel", placeholder: "+1 305 555 0123", required: "" }), null, true)
        ]),
        el("div", { class: "row" }, [
          field("city", "City", input("city", "text", { autocomplete: "address-level2", required: "" }), null, true),
          field("country", "Country you live in", select("country", REG.countries, "Choose a country", true), null, true)
        ]),
        field("heritage", "Heritage or connection", select("heritage", REG.heritage, "Choose one (optional)", false))
      ]),
      el("fieldset", null, [
        el("legend", { text: "What you can do" }),
        el("div", { class: "row" }, [
          field("skill1_category", "Main field", s1[0], null, true),
          field("skill1", "Main trade or role", s1[1], null, true)
        ]),
        el("div", { class: "row" }, [
          field("experience", "Experience", select("experience", REG.experience, "Choose a range", true), null, true),
          field("license", "License or certification", input("license", "text", { placeholder: "e.g. Florida RN license, issued by the Board of Nursing" }), "Licensed trades are checked with the issuing body.")
        ]),
        el("div", { class: "row" }, [
          field("skill2_category", "Second field", s2[0]),
          field("skill2", "Second trade or role", s2[1])
        ]),
        field("languages_0", "Languages you work in", checkboxGroup("languages", REG.languages)),
        field("availability", "Time you can give", select("availability", REG.availability, "Choose one", true), null, true)
      ]),
      el("fieldset", null, [
        el("legend", { text: "So we can verify you" }),
        field("profile_url", "A public profile or portfolio", input("profile_url", "url", { placeholder: "https://", required: "" }), "LinkedIn, a business website, a portfolio or a professional listing.", true),
        el("div", { class: "row" }, [
          field("reference_name", "A reference who knows your work", input("reference_name", "text")),
          field("reference_contact", "Their email or phone", input("reference_contact", "text"))
        ]),
        el("p", { class: "note", text: "Do not upload ID documents here. We confirm your email and phone, check your profile or reference, and verify licenses with the body that issued them." }),
        el("label", { class: "check", for: "public_name" }, [input("public_name", "checkbox", {}), "Show my name publicly next to work I contribute. Leave this off to appear by trade and city only."]),
        el("label", { class: "check", for: "consent" }, [input("consent", "checkbox", { required: "" }), "I agree that Komara may store these details and contact me about initiatives that match my skills. I can ask for my record to be deleted at any time."])
      ]),
      el("p", { class: "form-error", id: "form_error", role: "alert", hidden: "" }),
      el("button", { class: "btn primary", type: "submit", text: REG.endpoint ? "Join the registry" : "Preview my record" })
    ]);

    var result = el("div", { class: "result", id: "result", hidden: "" });
    form.addEventListener("submit", function (e) { submit(e, form, result); });

    return el("div", null, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "Skills registry" }),
        el("h1", { class: "title", text: "Join" }),
        el("p", { class: "lede", text: "The diaspora has every skill a nation needs. Register once, and schools, clinics and community projects can find you. About three minutes." }),
        REG.endpoint ? null : el("p", { class: "draft", text: "Preview mode. Submissions are not sent anywhere yet; you will see the record that would be stored." })
      ]),
      form,
      result
    ]);
  }

  function collect(form) {
    var data = new FormData(form);
    var rec = {};
    ["full_name", "preferred_name", "email", "phone", "city", "country", "heritage",
     "skill1_category", "skill1", "experience", "license", "skill2_category", "skill2",
     "availability", "profile_url", "reference_name", "reference_contact"].forEach(function (k) {
      var v = (data.get(k) || "").toString().trim();
      if (v) rec[k] = v;
    });
    rec.languages = data.getAll("languages");
    rec.public_name = form.elements.public_name.checked;
    rec.submitted_at = new Date().toISOString();
    return rec;
  }

  function submit(e, form, result) {
    e.preventDefault();
    var err = document.getElementById("form_error");
    var bad = Array.prototype.filter.call(form.elements, function (c) { return c.willValidate && !c.checkValidity(); });
    if (bad.length) {
      err.textContent = "Please fill in the fields marked with an asterisk. The first one missing is highlighted.";
      err.hidden = false;
      bad[0].focus();
      return;
    }
    err.hidden = true;
    var rec = collect(form);

    function show(title, text) {
      result.innerHTML = "";
      result.appendChild(el("h2", { text: title }));
      result.appendChild(el("p", { text: text }));
      result.appendChild(el("pre", { text: JSON.stringify(rec, null, 2) }));
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (!REG.endpoint) {
      show("Your record (preview)", "This is what the registry would store. Once a form backend is connected, this button will send it and you will get a confirmation email.");
      return;
    }
    fetch(REG.endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(rec) })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        show("You're on the registry", "Check your email for a confirmation link. Here is a copy of what you sent.");
      })
      .catch(function () {
        err.textContent = "Your details could not be sent. Check your connection and try again.";
        err.hidden = false;
      });
  }

  // ---- Routing ----------------------------------------------------------

  function route() {
    var name = (location.hash || "").replace(/^#/, "");
    var node, nav = name;
    if (name === "study") node = renderStudy();
    else if (name === "learn") { node = renderLearn(); nav = "study"; }
    else if (name === "join") node = renderJoin();
    else if (name === "reform") node = renderReform();
    else if (byId[name]) { node = renderModule(byId[name]); nav = "study"; }
    else if (caseById[name]) { node = renderCase(caseById[name]); nav = "study"; }
    else { node = renderSplash(); nav = ""; }
    document.body.classList.toggle("is-splash", nav === "" );
    view.innerHTML = "";
    view.appendChild(node);
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.classList.toggle("on", a.getAttribute("href") === "#" + nav);
    });
  }

  window.addEventListener("hashchange", function () { route(); window.scrollTo(0, 0); });
  route();
})();
