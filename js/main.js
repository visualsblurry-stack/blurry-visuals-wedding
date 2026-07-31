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
