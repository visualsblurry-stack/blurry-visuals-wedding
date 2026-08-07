/* ============================================================
   Blurry Visuals Weddings — site behaviour
   Header, drawer, hero slideshow, portfolio filters, films
   lightbox, story cards + story page renderer, testimonials,
   inquiry form → WhatsApp. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WHATSAPP = "917032390419"; // studio WhatsApp, digits only

  /* ---------- header solid-on-scroll ---------- */
  var hdr = document.querySelector(".hdr");
  var headerInitiallySolid = hdr ? hdr.classList.contains("solid") : false;
  function onScroll() {
    if (hdr) hdr.classList.toggle("solid", headerInitiallySolid || window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- custom cursor ---------- */
  /* A ring trails the pointer while a dot tracks it exactly; over anything
     carrying data-cursor the ring swells into a filled disc and names the
     action. Pointer devices only, and never under reduced motion — the class
     that hides the native cursor goes on only once the replacement exists,
     so nobody is left without a pointer if this block does not run.

     Hover is delegated from the document rather than bound per element: the
     story cards and every story page are rendered from data further down this
     file, long after any one-shot querySelectorAll would have run. */
  if (!REDUCED && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    var cursorLabel = document.createElement("span");
    cursorLabel.className = "cursor-label";
    ring.appendChild(cursorLabel);

    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");

    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.body.classList.add("cursor-custom");

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      ring.classList.add("on");
      dot.classList.add("on");
    }, { passive: true });

    var hideCursor = function () {
      ring.classList.remove("on");
      dot.classList.remove("on");
      ring.classList.remove("grown");
    };
    document.documentElement.addEventListener("mouseleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    (function cursorFrame() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate3d(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px,0)";
      dot.style.transform = "translate3d(" + mx.toFixed(2) + "px," + my.toFixed(2) + "px,0)";
      requestAnimationFrame(cursorFrame);
    })();

    document.addEventListener("mouseover", function (e) {
      var target = e.target.closest && e.target.closest("[data-cursor]");
      if (!target) return;
      cursorLabel.textContent = target.getAttribute("data-cursor") || "View";
      ring.classList.add("grown");
    });
    document.addEventListener("mouseout", function (e) {
      var target = e.target.closest && e.target.closest("[data-cursor]");
      if (!target) return;
      // Moving between a target's own children must not collapse the ring.
      if (e.relatedTarget && target.contains(e.relatedTarget)) return;
      ring.classList.remove("grown");
    });
  }

  /* ---------- mobile drawer ---------- */
  var burger = document.querySelector(".burger");
  var drawer = document.getElementById("drawer");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = drawer.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        drawer.classList.remove("open");
        document.body.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- hero gallery ---------- */
  var hero = document.querySelector(".hero");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var slideIndex = 0;
  var autoplayId = 0;
  var autoplayPaused = false;
  var pendingSlides = Object.create(null);

  function loadHeroSlide(index) {
    var slide = slides[index];
    if (!slide || !slide.dataset.bg || slide.dataset.loaded === "true") {
      return Promise.resolve(true);
    }
    var source = slide.dataset.bg;
    if (pendingSlides[source]) return pendingSlides[source];
    pendingSlides[source] = new Promise(function (resolve) {
      var image = new Image();
      image.onload = function () {
        slide.style.backgroundImage = 'url("' + source.replace(/"/g, "%22") + '")';
        slide.dataset.loaded = "true";
        resolve(true);
      };
      image.onerror = function () { resolve(false); };
      image.src = source;
    });
    return pendingSlides[source];
  }

  /* Each slide carries its own tagline, typed out character by character.
     The animated span is hidden from assistive tech; the sr-only label
     beside it gets the whole line at once so it is never read letter by
     letter. */
  var taglineTyped = document.querySelector(".hero-typed");
  var taglineLabel = document.querySelector("[data-tagline-label]");
  var taglineTimer = 0;

  function typeHeroTagline(index) {
    if (!taglineTyped) return;
    var slide = slides[index];
    var text = (slide && slide.dataset.tagline) || "";
    window.clearTimeout(taglineTimer);
    if (taglineLabel) taglineLabel.textContent = text;
    if (REDUCED) {
      taglineTyped.textContent = text;
      return;
    }
    var cursor = 0;
    (function step() {
      taglineTyped.textContent = text.slice(0, cursor);
      if (cursor++ >= text.length) return;
      taglineTimer = window.setTimeout(step, 42);
    })();
  }

  function updateHeroDots() {
    heroDots.forEach(function (dot, index) {
      var active = index === slideIndex;
      dot.classList.toggle("act", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function showHeroSlide(index) {
    var nextIndex = (index + slides.length) % slides.length;
    return loadHeroSlide(nextIndex).then(function (loaded) {
      if (!loaded) return false;
      slides[slideIndex].classList.remove("act");
      slideIndex = nextIndex;
      slides[slideIndex].classList.add("act");
      updateHeroDots();
      typeHeroTagline(slideIndex);
      loadHeroSlide((slideIndex + 1) % slides.length);
      return true;
    });
  }

  function stopHeroAutoplay() {
    window.clearTimeout(autoplayId);
    autoplayId = 0;
  }

  function scheduleHeroAutoplay() {
    stopHeroAutoplay();
    if (REDUCED || autoplayPaused || slides.length < 2) return;
    autoplayId = window.setTimeout(function () {
      showHeroSlide(slideIndex + 1).then(scheduleHeroAutoplay);
    }, 5200);
  }

  heroDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showHeroSlide(Number(dot.dataset.slide)).then(scheduleHeroAutoplay);
    });
  });

  if (hero) {
    hero.addEventListener("mouseenter", function () {
      autoplayPaused = true;
      stopHeroAutoplay();
    });
    hero.addEventListener("mouseleave", function () {
      autoplayPaused = false;
      scheduleHeroAutoplay();
    });
    hero.addEventListener("focusin", function () {
      autoplayPaused = true;
      stopHeroAutoplay();
    });
    hero.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!hero.contains(document.activeElement)) {
          autoplayPaused = false;
          scheduleHeroAutoplay();
        }
      }, 0);
    });

    var swipeX = 0;
    var swipeY = 0;
    hero.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      swipeX = event.clientX;
      swipeY = event.clientY;
    });
    hero.addEventListener("pointerup", function (event) {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      var deltaX = event.clientX - swipeX;
      var deltaY = event.clientY - swipeY;
      if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
        showHeroSlide(slideIndex + (deltaX < 0 ? 1 : -1)).then(scheduleHeroAutoplay);
      }
    });
  }

  if (slides.length) {
    loadHeroSlide(1 % slides.length);
    updateHeroDots();
    typeHeroTagline(slideIndex);
    scheduleHeroAutoplay();
  }

  /* ---------- reveal on scroll ---------- */
  var rvs = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- portfolio filters ---------- */
  var filterBtns = document.querySelectorAll(".filters button");
  var tiles = document.querySelectorAll(".masonry .tile");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("act"); });
      btn.classList.add("act");
      var f = btn.dataset.filter;
      tiles.forEach(function (t) {
        t.classList.toggle("hidden", f !== "all" && t.dataset.cat !== f);
      });
    });
  });

  /* ---------- films lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbFrame = lightbox ? lightbox.querySelector(".lightbox-frame") : null;
  function embedUrl(url) {
    var m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
    if (m) return "https://www.youtube.com/embed/" + m[1] + "?autoplay=1";
    m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return "https://player.vimeo.com/video/" + m[1] + "?autoplay=1";
    return url;
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    if (lbFrame) lbFrame.innerHTML = "";
  }
  document.querySelectorAll(".film").forEach(function (card) {
    card.addEventListener("click", function (ev) {
      ev.preventDefault();
      var url = card.dataset.video || "";
      var badge = card.querySelector(".film-play span");
      if (!url) { // no link yet — quiet "coming soon" pulse
        if (badge) {
          badge.textContent = "Soon";
          setTimeout(function () { badge.textContent = "▸"; }, 1400);
        }
        return;
      }
      if (lightbox && lbFrame) {
        lbFrame.innerHTML = '<iframe src="' + embedUrl(url) +
          '" title="Wedding film" allow="autoplay; fullscreen" allowfullscreen></iframe>';
        lightbox.classList.add("open");
      } else {
        window.open(url, "_blank", "noopener");
      }
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    var lbClose = lightbox.querySelector(".lightbox-close");
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------- testimonials rotation ---------- */
  var quotes = document.querySelectorAll(".quote");
  var qdots = document.querySelectorAll(".quote-dots button");
  var qi = 0, qTimer = null;
  function showQuote(n) {
    quotes.forEach(function (q, i) { q.classList.toggle("act", i === n); });
    qdots.forEach(function (d, i) { d.classList.toggle("act", i === n); });
    qi = n;
  }
  function nextQuote() { showQuote((qi + 1) % quotes.length); }
  if (quotes.length > 1) {
    if (!REDUCED) qTimer = setInterval(nextQuote, 6500);
    qdots.forEach(function (d, i) {
      d.addEventListener("click", function () {
        if (qTimer) clearInterval(qTimer);
        showQuote(i);
        if (!REDUCED) qTimer = setInterval(nextQuote, 6500);
      });
    });
  }

  /* ---------- inquiry form → WhatsApp ---------- */
  var form = document.getElementById("inquiry");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (name) {
        var el = form.elements[name];
        return el && el.value ? el.value.trim() : "";
      };
      // The date field submits ISO (2026-12-12); send it as "12 Dec 2026".
      var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      var readableDate = function (iso) {
        var parts = String(iso).split("-");
        if (parts.length !== 3) return iso;
        var month = MONTHS[parseInt(parts[1], 10) - 1];
        if (!month) return iso;
        return parseInt(parts[2], 10) + " " + month + " " + parts[0];
      };
      var lines = [
        "Hello Blurry Visuals Weddings! Wedding inquiry —",
        "Couple: " + v("names"),
        "Event: " + v("etype"),
        "Date: " + (readableDate(v("edate")) || "not fixed yet"),
        "City / venue: " + [v("city"), v("venue")].filter(Boolean).join(", "),
        v("message") ? "Details: " + v("message") : ""
      ].filter(Boolean);
      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- full-size photograph viewer ---------- */
  var photobox = document.getElementById("photobox");
  if (photobox) {
    var pbImg = photobox.querySelector(".photobox-img");
    var pbCount = photobox.querySelector("[data-photobox-count]");
    var pbLabel = photobox.querySelector("[data-photobox-label]");
    var pbPrev = photobox.querySelector(".photobox-step.prev");
    var pbNext = photobox.querySelector(".photobox-step.next");
    var pbClose = photobox.querySelector(".photobox-close");
    var pbSet = [];
    var pbIndex = 0;
    var pbLastFocus = null;

    /* The tiles ask the Unsplash CDN for only as many pixels as they render.
       Full size wants a bigger one, and both the homepage and the story data
       carry the size in the same query string. */
    function fullSize(url) {
      return url.replace(/([?&]w=)\d+/, "$12000").replace(/([?&]q=)\d+/, "$180");
    }
    function photoUrl(el) {
      var found = (el.style.backgroundImage || "").match(/url\((['"]?)(.*?)\1\)/);
      return found ? fullSize(found[2]) : "";
    }

    function showPhoto(i) {
      if (!pbSet.length) return;
      pbIndex = (i + pbSet.length) % pbSet.length;
      var el = pbSet[pbIndex];
      var caption = el.getAttribute("data-caption") || "";
      pbImg.src = photoUrl(el);
      pbImg.alt = caption;
      pbLabel.textContent = caption;
      pbCount.textContent = pbIndex + 1 + " / " + pbSet.length;
      var many = pbSet.length > 1;
      pbPrev.hidden = !many;
      pbNext.hidden = !many;
    }

    function openPhotobox(el) {
      /* Collected at open time, not at load: the portfolio filters hide tiles,
         and someone stepping through should only meet the ones on screen. */
      pbSet = Array.prototype.filter.call(
        document.querySelectorAll("[data-expand]"),
        function (n) { return n.offsetParent !== null; }
      );
      var at = pbSet.indexOf(el);
      if (at === -1) { pbSet = [el]; at = 0; }
      // The tile itself, not document.activeElement: a mouse click does not
      // reliably focus a button, and closing must still land back on the
      // photograph the visitor opened.
      pbLastFocus = el;
      photobox.hidden = false;
      document.body.classList.add("photobox-open");
      showPhoto(at);
      pbClose.focus();
    }

    function closePhotobox() {
      if (photobox.hidden) return;
      photobox.hidden = true;
      document.body.classList.remove("photobox-open");
      pbImg.removeAttribute("src");
      if (pbLastFocus && pbLastFocus.focus) pbLastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var target = e.target.closest && e.target.closest("[data-expand]");
      if (!target) return;
      e.preventDefault();
      openPhotobox(target);
    });
    pbPrev.addEventListener("click", function () { showPhoto(pbIndex - 1); });
    pbNext.addEventListener("click", function () { showPhoto(pbIndex + 1); });
    pbClose.addEventListener("click", closePhotobox);
    photobox.addEventListener("click", function (e) {
      if (e.target === photobox) closePhotobox();
    });
    document.addEventListener("keydown", function (e) {
      if (photobox.hidden) return;
      if (e.key === "Escape") closePhotobox();
      else if (e.key === "ArrowLeft") showPhoto(pbIndex - 1);
      else if (e.key === "ArrowRight") showPhoto(pbIndex + 1);
    });
  }

  /* ---------- Investment & FAQs modal ---------- */
  var investmentModal = document.getElementById("investment-modal");
  var investmentDialog = investmentModal ? investmentModal.querySelector(".investment-dialog") : null;
  var investmentClose = investmentModal ? investmentModal.querySelector("[data-close-investment]") : null;
  var investmentLastFocus = null;

  function investmentFocusable() {
    if (!investmentDialog) return [];
    return Array.prototype.slice.call(investmentDialog.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )).filter(function (el) { return !el.hidden && el.offsetParent !== null; });
  }

  function openInvestmentModal(updateHash) {
    if (!investmentModal || !investmentDialog || !investmentModal.hidden) return;
    investmentLastFocus = document.activeElement;
    investmentModal.hidden = false;
    investmentModal.setAttribute("aria-hidden", "false");
    investmentDialog.scrollTop = 0;
    document.body.classList.add("investment-open");
    if (updateHash && location.hash !== "#investment") {
      history.pushState(null, "", location.pathname + location.search + "#investment");
    }
    window.requestAnimationFrame(function () {
      if (investmentClose) investmentClose.focus();
      else investmentDialog.focus();
    });
  }

  function closeInvestmentModal(updateHash) {
    if (!investmentModal || investmentModal.hidden) return;
    investmentModal.hidden = true;
    investmentModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("investment-open");
    if (updateHash && location.hash === "#investment") {
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (investmentLastFocus && document.contains(investmentLastFocus)) investmentLastFocus.focus();
  }

  if (investmentModal) {
    document.querySelectorAll("[data-open-investment]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openInvestmentModal(true);
      });
    });

    if (investmentClose) {
      investmentClose.addEventListener("click", function () { closeInvestmentModal(true); });
    }

    investmentModal.addEventListener("click", function (e) {
      if (e.target === investmentModal) closeInvestmentModal(true);
    });

    investmentModal.querySelectorAll(".faq-question").forEach(function (button) {
      button.addEventListener("click", function () {
        var wasOpen = button.getAttribute("aria-expanded") === "true";
        investmentModal.querySelectorAll(".faq-question").forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
          var otherAnswer = document.getElementById(other.getAttribute("aria-controls"));
          if (otherAnswer) otherAnswer.hidden = true;
        });
        if (!wasOpen) {
          button.setAttribute("aria-expanded", "true");
          var answer = document.getElementById(button.getAttribute("aria-controls"));
          if (answer) answer.hidden = false;
        }
      });
    });

    investmentModal.querySelectorAll("[data-investment-contact]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        closeInvestmentModal(false);
        history.replaceState(null, "", location.pathname + location.search + "#contact");
        var contact = document.getElementById("contact");
        if (contact) contact.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
      });
    });

    document.addEventListener("keydown", function (e) {
      if (investmentModal.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeInvestmentModal(true);
        return;
      }
      if (e.key === "Tab") {
        var focusable = investmentFocusable();
        if (!focusable.length) {
          e.preventDefault();
          investmentDialog.focus();
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("hashchange", function () {
      if (location.hash === "#investment") openInvestmentModal(false);
      else closeInvestmentModal(false);
    });

    if (location.hash === "#investment") openInvestmentModal(false);
  }

  /* ---------- story page renderer (story.html?s=slug) ---------- */
  var storyRoot = document.getElementById("story-root");
  if (storyRoot && window.BLURRY_WEDDING_STORIES) {
    var slug = new URLSearchParams(location.search).get("s");
    var list = window.BLURRY_WEDDING_STORIES;
    var idx = list.findIndex(function (s) { return s.slug === slug; });
    if (idx === -1) { location.replace("index.html#stories"); return; }
    var st = list[idx];
    var esc = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    };
    document.title = st.couple[0] + " & " + st.couple[1] + " | Blurry Visuals Weddings";

    /* The day, in the order it happened. The five core rituals always appear,
       even with nothing under them yet, so a story reads as a complete plan
       rather than whatever happens to be uploaded. The rest — a nikah instead
       of pheras, a baraat, loose portraits — only appear when photographed. */
    var STORY_EVENTS = [
      { key: "haldi",     name: "Haldi",     core: true },
      { key: "mehndi",    name: "Mehndi",    core: true },
      { key: "sangeet",   name: "Sangeet",   core: true },
      { key: "baraat",    name: "Baraat",    core: false },
      { key: "nikah",     name: "Nikah",     core: false },
      { key: "pheras",    name: "Pheras",    core: true },
      { key: "vidaai",    name: "Vidaai",    core: false },
      { key: "reception", name: "Reception", core: true },
      { key: "portraits", name: "Portraits", core: false }
    ];

    /* Chapters alternate ground so the page reads as a sequence rather than
       one long scroll, and the photographs inside each one are laid on a
       twelve-column grid in a repeating wide/narrow rhythm. Two rhythms,
       swapped per chapter, keep neighbouring chapters from rhyming. */
    var CHAPTER_TONES = ["light", "dark", "light", "warm", "dark"];
    var GRID_RHYTHMS = [
      [[7, "16/11"], [5, "4/5"], [5, "4/5"], [7, "16/11"]],
      [[4, "4/5"], [8, "3/2"], [8, "3/2"], [4, "4/5"]]
    ];

    var byEvent = {};
    st.gallery.forEach(function (g) {
      var key = g.event || "portraits";
      (byEvent[key] = byEvent[key] || []).push(g);
    });

    var chapters = STORY_EVENTS.filter(function (ev) {
      return ev.core || (byEvent[ev.key] || []).length > 0;
    });

    function photoHtml(g, rhythm, i, total) {
      var cell = rhythm[i % rhythm.length];
      var span = cell[0];
      var ratio = cell[1];
      /* The rhythm pairs photographs into rows of twelve. An odd one out at
         the end would leave a hole, so it runs the full width instead — as a
         closing band under the others, or as a single feature frame when it
         is the only photograph in the chapter. */
      if (total % 2 === 1 && i === total - 1) {
        span = 12;
        ratio = total === 1 ? "16/9" : "21/9";
      }
      if (!g.img) {
        return '<figure class="chapter-shot ph ph-' + esc(g.tone || "smoke") +
          '" style="--span:' + span + ';--ratio:' + ratio + '">' +
          '<div class="ph-label"><em>' + esc(g.label) + "</em>Photograph placeholder</div></figure>";
      }
      // A button, not a figure: the photograph opens full size, so it has to
      // be reachable by keyboard as well as by pointer.
      return '<button class="chapter-shot" type="button" data-expand data-cursor="Expand"' +
        ' data-caption="' + esc(g.label) + '" aria-label="Expand photograph: ' + esc(g.label) +
        '" style="--span:' + span + ";--ratio:" + ratio +
        ";background-image:url('" + esc(g.img) + "')\">" +
        '<span class="chapter-shot-cap">' + esc(g.label) + "</span></button>";
    }

    var galleryHtml = chapters.map(function (ev, n) {
      var shots = byEvent[ev.key] || [];
      var copy = (st.chapters && st.chapters[ev.key]) || {};
      var tone = CHAPTER_TONES[n % CHAPTER_TONES.length];
      var rhythm = GRID_RHYTHMS[n % GRID_RHYTHMS.length];
      var id = "chapter-" + esc(ev.key);
      var num = ("0" + (n + 1)).slice(-2);

      var body = shots.length
        ? '<div class="chapter-grid">' +
            shots.map(function (g, i) { return photoHtml(g, rhythm, i, shots.length); }).join("") +
          "</div>"
        : '<p class="chapter-empty">Photographs from the ' + esc(ev.name) +
          " are still being edited.</p>";

      var quote = copy.quote
        ? '<figure class="chapter-quote"><blockquote>' + esc(copy.quote) + "</blockquote>" +
          "<figcaption>" + esc(copy.quoteWho || "") + "</figcaption></figure>"
        : "";

      return '<section class="chapter tone-' + tone + (shots.length ? "" : " is-empty") +
        '" id="' + id + '" aria-labelledby="' + id + '-head">' +
        '<div class="wrap">' +
          '<div class="chapter-head">' +
            "<div>" +
              '<div class="chapter-eyebrow"><b>' + num + "</b>" +
                (copy.time ? "<span>" + esc(copy.time) + "</span>" : "") +
                '<i aria-hidden="true"></i></div>' +
              '<h2 id="' + id + '-head">' + esc(copy.title || ev.name) + "</h2>" +
            "</div>" +
            (copy.note ? '<p class="chapter-note">' + esc(copy.note) + "</p>" : "") +
          "</div>" +
          body + quote +
        "</div></section>";
    }).join("");

    /* Sticky chapter rail. Every chapter on the page is listed, empty ones
       included, so the rail matches what a visitor actually scrolls past. */
    var chapterNavHtml = chapters.length > 1
      ? '<nav class="chapter-rail" aria-label="Chapters"><div class="wrap">' +
          '<span class="chapter-rail-label">Jump to</span>' +
          chapters.map(function (ev) {
            return '<a href="#chapter-' + esc(ev.key) + '" data-cursor="' + esc(ev.name) + '">' +
              esc(ev.name) + "</a>";
          }).join("") +
        "</div></nav>"
      : "";

    /* Opening note: the ask in the couple's words, how we answered it, and
       the three facts a visitor weighing us up actually wants. */
    var briefHtml = st.brief
      ? '<section class="story-brief"><div class="wrap">' +
          '<div class="story-brief-label">The brief</div>' +
          "<div>" +
            '<p class="story-brief-ask">' + esc(st.brief.ask) + "</p>" +
            '<p class="story-brief-text">' + esc(st.brief.text) + "</p>" +
            '<div class="story-brief-meta">' +
              (st.brief.meta || []).map(function (row) {
                return "<div><small>" + esc(row[0]) + "</small><b>" + esc(row[1]) + "</b></div>";
              }).join("") +
            "</div>" +
          "</div>" +
        "</div></section>"
      : "";

    var statsHtml = st.stats
      ? '<div class="story-stats">' + st.stats.map(function (row) {
          return "<div><b>" + esc(row[0]) + "</b><small>" + esc(row[1]) + "</small></div>";
        }).join("") + "</div>"
      : "";

    var wordsHtml = st.words
      ? '<section class="story-words">' +
          '<div class="story-words-media" aria-hidden="true"' +
            (st.cover ? ' style="background-image:url(\'' + esc(st.cover) + '\')"' : "") + "></div>" +
          '<div class="wrap">' +
            '<div class="story-words-label">In their words</div>' +
            "<blockquote>" + esc(st.words.quote) + "</blockquote>" +
            "<cite>" + esc(st.words.who) + " — " + esc(st.city) + "</cite>" +
          "</div>" +
        "</section>"
      : "";

    var creditsHtml = st.credits && st.credits.length
      ? '<section class="story-credits"><div class="wrap">' +
          '<div class="story-credits-label">Credits</div>' +
          "<div>" + st.credits.map(function (row) {
            return "<div><small>" + esc(row[0]) + "</small><b>" + esc(row[1]) + "</b></div>";
          }).join("") + "</div>" +
        "</div></section>"
      : "";

    var prev = list[(idx - 1 + list.length) % list.length];
    var next = list[(idx + 1) % list.length];

    /* The couple's cinematic highlight plays silently behind their name.
       Self-hosted: filmFile when the story names one, otherwise the shared
       placeholder. The poster shows before the first frame decodes, and when
       the visitor prefers reduced motion it is all they get. */
    var heroFilm = st.filmFile || "video/placeholder-highlight.mp4";
    var heroPoster = st.filmPoster || st.cover || "";
    var heroMedia =
      '<div class="story-hero-media" aria-hidden="true">' +
        "<video " + (REDUCED ? "" : "autoplay ") + 'muted loop playsinline preload="metadata"' +
        (heroPoster ? ' poster="' + esc(heroPoster) + '"' : "") + ">" +
        '<source src="' + esc(heroFilm) + '" type="video/mp4">' +
      "</video></div>";

    storyRoot.innerHTML =
      '<section class="story-hero">' + heroMedia + '<div class="wrap">' +
        '<nav class="story-crumbs" aria-label="Breadcrumb">' +
          '<a class="story-back" href="index.html" data-cursor="Home"><span aria-hidden="true">←</span> Home</a>' +
          '<a class="story-back" href="index.html#stories" data-cursor="Weddings">All weddings</a>' +
        "</nav>" +
        '<div class="phera"><b>Real wedding ' + ("0" + (idx + 1)).slice(-2) + "</b> — " + esc(st.city) + "</div>" +
        "<h1>" + esc(st.couple[0]) + " <em>&amp;</em> " + esc(st.couple[1]) + "</h1>" +
        '<div class="story-meta">' +
          "<div><small>Date</small><b>" + esc(st.date) + "</b></div>" +
          "<div><small>Venue</small><b>" + esc(st.venue) + "</b></div>" +
          "<div><small>City</small><b>" + esc(st.city) + "</b></div>" +
          "<div><small>Coverage</small><b>" + esc(st.type) + "</b></div>" +
        "</div>" + statsHtml +
      "</div></section>" +
      chapterNavHtml +
      briefHtml +
      '<section class="story-body"><div class="wrap">' +
        '<p class="lede">' + esc(st.lede) + "</p>" +
        '<p class="txt">' + esc(st.story) + "</p>" +
      "</div></section>" +
      galleryHtml +
      wordsHtml +
      creditsHtml +
      /* Closing pair: the next wedding on the left for anyone still browsing,
         the invitation on the right for anyone who has decided. */
      '<section class="story-close">' +
        '<a class="story-close-next" href="story.html?s=' + esc(next.slug) + '" data-cursor="Next story">' +
          '<span class="story-close-media" aria-hidden="true"' +
            (next.cover ? ' style="background-image:url(\'' + esc(next.cover) + '\')"' : "") + "></span>" +
          '<span class="story-close-next-in">' +
            "<small>Next story</small>" +
            "<b>" + esc(next.couple[0]) + " &amp; " + esc(next.couple[1]) + "</b>" +
            "<em>" + esc(next.city) + " · " + esc(next.date) + " →</em>" +
          "</span>" +
        "</a>" +
        '<div class="story-close-cta">' +
          "<small>Your turn</small>" +
          "<h2>Your story could be<br><em>next</em></h2>" +
          "<p>We take a handful of weddings each season so every one of them gets" +
            " this much attention. Send us the date and we will come back to you" +
            " honestly, within a day.</p>" +
          '<div class="story-close-actions">' +
            '<a class="btn btn-gold" href="index.html#contact" data-cursor="Enquire">Get in touch</a>' +
            '<a class="btn btn-line" href="index.html#stories" data-cursor="Weddings">All weddings</a>' +
          "</div>" +
        "</div>" +
      "</section>";

  }

  /* ---------- story page: floating way out ---------- */
  /* The hero breadcrumb is gone by the second photograph, so mirror it in a
     fixed control that appears once the breadcrumb has scrolled past. Driven
     by scroll position rather than IntersectionObserver so it still resolves
     in a tab that is not compositing frames. */
  var storyReturn = document.getElementById("story-return");
  if (storyReturn) {
    var crumbs = document.querySelector(".story-crumbs");
    var storyFooter = document.querySelector(".ftr");
    var returnAt = 320;          // fallback if the breadcrumb never rendered
    var returnUntil = Infinity;  // the footer carries its own way home
    var measureReturn = function () {
      if (crumbs) returnAt = crumbs.getBoundingClientRect().bottom + window.scrollY;
      if (storyFooter) returnUntil = storyFooter.getBoundingClientRect().top + window.scrollY;
    };
    var onReturnScroll = function () {
      var y = window.scrollY;
      storyReturn.classList.toggle("in", y > returnAt && y + window.innerHeight < returnUntil);
    };
    measureReturn();
    onReturnScroll();
    window.addEventListener("scroll", onReturnScroll, { passive: true });
    window.addEventListener("resize", function () { measureReturn(); onReturnScroll(); }, { passive: true });
  }

  /* ---------- index: build story cards from data ---------- */
  var storiesGrid = document.getElementById("stories-grid");
  if (storiesGrid && window.BLURRY_WEDDING_STORIES) {
    storiesGrid.innerHTML = window.BLURRY_WEDDING_STORIES.map(function (st) {
      var fig = st.cover
        ? '<figure class="ph ph-img" role="img" aria-label="' + st.couple[0] + " and " + st.couple[1] +
          '" style="background-image:url(\'' + st.cover + "')\"></figure>"
        : '<figure class="ph ph-' + (st.tone || "smoke") + '"><div class="ph-label"><em>' +
          st.couple[0] + " &amp; " + st.couple[1] + "</em>Cover photograph</div></figure>";
      return '<a class="story-card rv" href="story.html?s=' + st.slug + '" data-cursor="View story">' + fig +
        "<h3>" + st.couple[0] + " <em>&amp;</em> " + st.couple[1] + "</h3>" +
        "<p>" + st.venue + " · " + st.city + "</p>" +
        '<span class="more">Read their story →</span></a>';
    }).join("");
    // observe freshly added reveal nodes
    storiesGrid.querySelectorAll(".rv").forEach(function (el) {
      if ("IntersectionObserver" in window && !REDUCED) {
        var io2 = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add("in"); io2.unobserve(e.target); }
          });
        }, { threshold: 0.12 });
        io2.observe(el);
      } else {
        el.classList.add("in");
      }
    });
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
