// Komara Project — a small hash-routed page: home, learn, one view per module, join.
(function () {
  "use strict";

  var MODULES = window.KOMARA_MODULES;
  var REG = window.KOMARA_REGISTRY;
  var byId = {};
  MODULES.forEach(function (m) { byId[m.id] = m; });

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

  // Rough reading time for the full story, at 220 words a minute.
  function readMinutes(m) {
    var words = 0;
    m.sections.forEach(function (s) { s.p.forEach(function (p) { words += p.split(/\s+/).length; }); });
    return Math.max(1, Math.round(words / 220));
  }

  function kicker(m) {
    return el("span", { class: "label", text: m.kicker });
  }

  function moduleCard(m) {
    return el("a", { class: "card", href: "#" + m.id }, [
      kicker(m),
      el("span", { class: "card-title", text: m.hook }),
      el("span", { class: "card-sum", text: m.dek }),
      el("span", { class: "card-foot", text: m.era + " · " + readMinutes(m) + " min read" })
    ]);
  }

  // A learning path that follows the connected story from Florida outward.
  var PATH = [
    ["spain-france-florida", "Start at home", "Florida’s first free Black town"],
    ["haitian-revolution", "Cross the water", "The revolution that founded Haiti"],
    ["sankara", "Reach the Sahel", "The president who renamed Burkina Faso"]
  ];
  var FEATURED = "spain-france-florida";

  function renderHome() {
    var f = byId[FEATURED];
    return el("div", { class: "home" }, [
      el("section", { class: "hero" }, [
        el("p", { class: "eyebrow", text: "Komara Project · free diaspora curriculum" }),
        el("h1", { text: "The connected story of the diaspora." }),
        el("p", { class: "lede", text: "Every community learns its own piece of the story. Komara teaches how the pieces join, from Florida to Haiti to Burkina Faso and across the Afro-Latin world. Each story starts with a 60-second version." }),
        el("div", { class: "actions" }, [
          el("a", { class: "btn primary", href: "#learn", text: "Browse the stories" }),
          el("a", { class: "btn", href: "#join", text: "Join the skills registry" })
        ]),
        el("p", { class: "facts", text: MODULES.length + " stories · plain language · sources for every story · free to use and share" })
      ]),
      el("section", { class: "featured" }, [
        el("a", { class: "featured-text", href: "#" + f.id }, [
          el("p", { class: "label", text: "Featured story" }),
          el("h2", { text: f.hook }),
          el("p", { class: "dek", text: f.dek }),
          el("span", { class: "link-arrow", text: "Read the 60-second version" })
        ]),
        el("ol", { class: "featured-facts" }, f.fast.slice(0, 3).map(function (t) { return el("li", { text: t }); }))
      ]),
      el("section", { class: "band" }, [
        el("div", { class: "band-head" }, [
          el("h2", { text: "A learning path" }),
          el("p", { class: "muted", text: "Three stories, in order, that trace the connection from Florida to the Sahel." })
        ]),
        el("ol", { class: "path" }, PATH.map(function (step) {
          var m = byId[step[0]];
          return el("li", null, [el("a", { href: "#" + m.id }, [
            el("span", { class: "label", text: step[1] }),
            el("strong", { text: step[2] }),
            el("span", { class: "muted", text: m.era })
          ])]);
        }))
      ]),
      el("section", { class: "band" }, [
        el("div", { class: "band-head" }, [
          el("h2", { text: "All stories" }),
          el("p", { class: "muted", text: "In order of time, from the first Americans to Sankara." })
        ]),
        el("div", { class: "grid four" }, MODULES.map(moduleCard))
      ]),
      el("section", { class: "band pillars" }, [
        el("h2", { text: "What Komara offers" }),
        el("div", { class: "grid three plain" }, [
          el("div", null, [el("h3", { text: "Free curriculum" }), el("p", { text: "Stories in plain language, with key dates, sources and discussion questions. Use them in a classroom, a church hall or a living room." })]),
          el("div", null, [el("h3", { text: "Skills registry" }), el("p", { text: "Tell us your trade, your languages and how much time you have. Schools, clinics and community projects across the diaspora can find you." })]),
          el("div", null, [el("h3", { text: "Proof of work" }), el("p", { text: "When you contribute, the people you helped sign it off, and it goes on a public record that cannot be quietly edited." })])
        ])
      ])
    ]);
  }

  function renderLearn() {
    return el("div", null, [
      el("section", { class: "page-head" }, [
        el("p", { class: "eyebrow", text: "The Connected Story" }),
        el("h1", { text: "Eight stories they skipped in school" }),
        el("p", { class: "lede", text: "In order of time, from the first Americans to Sankara. Each one starts with a 60-second version, then the full story if you want it." }),
        el("p", { class: "draft", text: "Draft v0. These modules are written for review by historians before classroom use. Corrections are welcome." })
      ]),
      el("div", { class: "grid four" }, MODULES.map(moduleCard))
    ]);
  }

  // A button, not a #link: the hash is reserved for page routing.
  function fullStoryButton(minutes) {
    var b = el("button", { class: "fast-more", type: "button", text: "Read the full story · " + minutes + " min" });
    b.addEventListener("click", function () {
      document.getElementById("full-story").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return b;
  }

  function list(items, cls) {
    return el("ul", { class: cls || "" }, items.map(function (t) { return el("li", { text: t }); }));
  }

  function renderModule(m) {
    var idx = MODULES.indexOf(m);
    var prev = MODULES[idx - 1], next = MODULES[idx + 1];

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

    var connects = el("div", { class: "connects" }, m.connects.map(function (id) {
      return el("a", { href: "#" + id, text: byId[id].title });
    }));

    return el("article", { class: "module" }, [
      el("header", { class: "module-head" }, [
        el("a", { class: "back", href: "#learn", text: "All stories" }),
        el("p", { class: "eyebrow", text: m.kicker + " · " + m.title + " · " + m.era }),
        el("h1", { text: m.hook }),
        el("p", { class: "dek", text: m.dek })
      ]),
      el("section", { class: "fast", "aria-labelledby": "fast-h" }, [
        el("h2", { id: "fast-h", text: "The 60-second version" }),
        el("ol", null, m.fast.map(function (f) { return el("li", { text: f }); })),
        fullStoryButton(readMinutes(m))
      ]),
      el("div", { class: "module-body", id: "full-story" }, [
        el("div", { class: "story" }, [el("p", { class: "lede", text: m.summary })].concat(story, [
          el("h2", { text: "What people argue about" }),
          list(m.debated, "debated"),
          el("h2", { text: "Why it matters to us" }),
          list(m.why),
          el("h2", { text: "Talk about it" }),
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
          connects
        ])
      ]),
      el("nav", { class: "pager", "aria-label": "Module navigation" }, [
        prev ? el("a", { href: "#" + prev.id }, [el("span", { text: "Previous" }), el("strong", { text: prev.title })]) : el("span"),
        next ? el("a", { class: "next", href: "#" + next.id }, [el("span", { text: "Next" }), el("strong", { text: next.title })]) : el("span")
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
        el("h1", { text: "Put your skills on the map" }),
        el("p", { class: "lede", text: "Teachers, nurses, electricians, farmers, coders, musicians: the diaspora has every skill a nation needs. Register once, and schools, clinics and community projects can find you. Takes about three minutes." }),
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
    if (name === "learn") node = renderLearn();
    else if (name === "join") node = renderJoin();
    else if (byId[name]) { node = renderModule(byId[name]); nav = "learn"; }
    else { node = renderHome(); nav = ""; }
    view.innerHTML = "";
    view.appendChild(node);
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.classList.toggle("on", a.getAttribute("href") === "#" + nav);
    });
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  route();
})();
