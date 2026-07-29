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

  /* ---------- hero slideshow ---------- */
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1 && !REDUCED) {
    var si = 0;
    setInterval(function () {
      slides[si].classList.remove("act");
      si = (si + 1) % slides.length;
      slides[si].classList.add("act");
    }, 5200);
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
      var lines = [
        "Hello Blurry Visuals Weddings! Wedding inquiry —",
        "Couple: " + v("names"),
        "Event: " + v("etype"),
        "Date: " + (v("edate") || "not fixed yet"),
        "City / venue: " + [v("city"), v("venue")].filter(Boolean).join(", "),
        v("message") ? "Details: " + v("message") : ""
      ].filter(Boolean);
      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
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

    var galleryHtml = st.gallery.map(function (g) {
      if (g.img) {
        return '<figure class="ph ph-img' + (g.wide ? " g-wide" : "") + '" role="img" aria-label="' +
          esc(g.label) + '" style="background-image:url(\'' + esc(g.img) + "')\"></figure>";
      }
      return '<figure class="ph ph-' + esc(g.tone || "smoke") + (g.wide ? ' g-wide"' : '"') + '>' +
        '<div class="ph-label"><em>' + esc(g.label) + "</em>Photograph placeholder</div></figure>";
    }).join("");

    var prev = list[(idx - 1 + list.length) % list.length];
    var next = list[(idx + 1) % list.length];

    storyRoot.innerHTML =
      '<section class="story-hero"><div class="wrap">' +
        '<div class="phera"><b>Real wedding ' + ("0" + (idx + 1)).slice(-2) + "</b> — " + esc(st.city) + "</div>" +
        "<h1>" + esc(st.couple[0]) + " <em>&amp;</em> " + esc(st.couple[1]) + "</h1>" +
        (st.film ? '<div class="hero-cta" style="margin-top:30px;"><a class="btn btn-line" href="' +
          esc(st.film) + '" target="_blank" rel="noopener">▸&#160; Watch their film</a></div>' : "") +
        '<div class="story-meta">' +
          "<div><small>Date</small><b>" + esc(st.date) + "</b></div>" +
          "<div><small>Venue</small><b>" + esc(st.venue) + "</b></div>" +
          "<div><small>City</small><b>" + esc(st.city) + "</b></div>" +
          "<div><small>Coverage</small><b>" + esc(st.type) + "</b></div>" +
        "</div>" +
      "</div></section>" +
      '<section class="story-body"><div class="wrap">' +
        '<p class="lede">' + esc(st.lede) + "</p>" +
        '<p class="txt">' + esc(st.story) + "</p>" +
      "</div></section>" +
      '<div class="wrap"><div class="story-gallery">' + galleryHtml + "</div></div>" +
      '<section class="story-nav"><div class="wrap" style="display:flex;justify-content:space-between;gap:20px;width:min(1180px,92vw);">' +
        '<a class="prev" href="story.html?s=' + esc(prev.slug) + '"><small>← Previous wedding</small><b>' +
          esc(prev.couple[0]) + " &amp; " + esc(prev.couple[1]) + "</b></a>" +
        '<a class="next" href="story.html?s=' + esc(next.slug) + '"><small>Next wedding →</small><b>' +
          esc(next.couple[0]) + " &amp; " + esc(next.couple[1]) + "</b></a>" +
      "</div></section>";
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
      return '<a class="story-card rv" href="story.html?s=' + st.slug + '">' + fig +
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
