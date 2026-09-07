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
  /* A ring trails the pointer only over labelled hover targets; everywhere
     else the regular OS cursor stays visible. Pointer devices only, and never
     under reduced motion — the class that scopes native cursor hiding goes on
     only once the replacement exists, so nobody is left without a pointer if
     this block does not run.

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
      ring.classList.add("on");
      dot.classList.add("on");
      ring.classList.add("grown");
    });
    document.addEventListener("mouseout", function (e) {
      var target = e.target.closest && e.target.closest("[data-cursor]");
      if (!target || (e.relatedTarget && target.contains(e.relatedTarget))) return;
      ring.classList.remove("on");
      dot.classList.remove("on");
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

  /* ---------- hero: previews of what is coming ---------- */
  /* Three frames showing the next slides. They are built only after the page
     has loaded, because populating them fetches images the slideshow would
     otherwise not have touched yet — doing it earlier would put them in
     competition with the first slide, which is the largest paint on the
     page. Hidden from assistive tech: the dots already reach every
     photograph, so these would announce the same destinations a second
     time. */
  var heroThumbStrip = document.querySelector(".hero-thumbs");
  var heroThumbs = [];
  var HERO_THUMB_COUNT = 3;

  function heroSlideSource(index) {
    var slide = slides[index];
    if (!slide) return "";
    if (slide.dataset.bg) return slide.dataset.bg;
    var inline = (slide.style.backgroundImage || "").match(/url\(["']?(.*?)["']?\)/);
    return inline ? inline[1] : "";
  }

  function updateHeroThumbs() {
    heroThumbs.forEach(function (thumb, offset) {
      var target = (slideIndex + offset + 1) % slides.length;
      var source = heroSlideSource(target);
      thumb.dataset.slide = String(target);
      if (source) thumb.style.backgroundImage = 'url("' + source.replace(/"/g, "%22") + '")';
    });
  }

  function buildHeroThumbs() {
    if (!heroThumbStrip || slides.length <= HERO_THUMB_COUNT) return;
    for (var i = 0; i < HERO_THUMB_COUNT; i += 1) {
      var thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "hero-thumb";
      thumb.tabIndex = -1;
      heroThumbStrip.appendChild(thumb);
      heroThumbs.push(thumb);
    }
    heroThumbStrip.addEventListener("click", function (e) {
      var thumb = e.target.closest && e.target.closest(".hero-thumb");
      if (!thumb) return;
      chooseHeroSlide(Number(thumb.dataset.slide));
    });
    updateHeroThumbs();
    heroThumbStrip.classList.add("in");
  }

  function showHeroSlide(index) {
    var nextIndex = (index + slides.length) % slides.length;
    return loadHeroSlide(nextIndex).then(function (loaded) {
      if (!loaded) return false;
      slides[slideIndex].classList.remove("act");
      slideIndex = nextIndex;
      slides[slideIndex].classList.add("act");
      updateHeroDots();
      updateHeroThumbs();
      loadHeroSlide((slideIndex + 1) % slides.length);
      return true;
    });
  }

  function stopHeroAutoplay() {
    window.clearTimeout(autoplayId);
    autoplayId = 0;
  }

  /* Two independent reasons to hold the slideshow, tracked separately. A
     single shared flag meant whichever reason cleared first restarted it,
     and — worse — a reason that could never clear stopped it for good. */
  var hoverPaused = false;
  var keyboardPaused = false;
  /* Choosing a slide by hand is a statement of intent, so it overrides the
     hover hold until the pointer actually leaves and re-enters. Without this
     the hero, which fills the viewport, sits frozen under a resting cursor
     even though the visitor just asked to move. */
  var hoverOverridden = false;
  /* Only devices that genuinely hover may set the hover hold. A touch screen
     fires an emulated mouseenter on tap and then no mouseleave ever, which
     left the slideshow stopped for the rest of the visit. */
  var CAN_HOVER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function heroAutoplayHeld() {
    if (REDUCED || slides.length < 2) return true;
    if (keyboardPaused) return true;
    return hoverPaused && !hoverOverridden;
  }

  function scheduleHeroAutoplay() {
    stopHeroAutoplay();
    if (heroAutoplayHeld()) return;
    autoplayId = window.setTimeout(function () {
      showHeroSlide(slideIndex + 1).then(scheduleHeroAutoplay);
    }, 5200);
  }

  // Every deliberate move through the slideshow goes through here.
  function chooseHeroSlide(index) {
    hoverOverridden = true;
    return showHeroSlide(index).then(scheduleHeroAutoplay);
  }

  heroDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      chooseHeroSlide(Number(dot.dataset.slide));
    });
  });

  if (hero) {
    if (CAN_HOVER) {
      hero.addEventListener("mouseenter", function () {
        hoverPaused = true;
        hoverOverridden = false;
        stopHeroAutoplay();
      });
      hero.addEventListener("mouseleave", function () {
        hoverPaused = false;
        hoverOverridden = false;
        scheduleHeroAutoplay();
      });
    }

    /* Keyboard focus only. A pointer click also focuses the control it hits,
       and holding the slideshow for that is what made clicking a dot look
       like it had switched autoplay off. */
    hero.addEventListener("focusin", function (event) {
      var target = event.target;
      if (!target || !target.matches || !target.matches(":focus-visible")) return;
      keyboardPaused = true;
      stopHeroAutoplay();
    });
    hero.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!hero.contains(document.activeElement)) {
          keyboardPaused = false;
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
        chooseHeroSlide(slideIndex + (deltaX < 0 ? 1 : -1));
      }
    });
  }

  if (slides.length) {
    loadHeroSlide(1 % slides.length);
    updateHeroDots();
    scheduleHeroAutoplay();

    // The copy has to clear the proof bar, whatever height it wraps to.
    var heroFoot = document.querySelector(".hero-foot");
    if (heroFoot && hero) {
      var measureHeroFoot = function () {
        hero.style.setProperty("--hero-foot-h", Math.round(heroFoot.offsetHeight) + "px");
      };
      measureHeroFoot();
      window.addEventListener("resize", measureHeroFoot, { passive: true });
    }

    if (document.readyState === "complete") buildHeroThumbs();
    else window.addEventListener("load", buildHeroThumbs, { once: true });
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
  function escAttr(url) {
    return String(url).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function isYouTubeUrl(url) {
    return /(?:^https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\//i.test(url);
  }
  function embedUrl(url) {
    var m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return "https://player.vimeo.com/video/" + m[1] + "?autoplay=1";
    return "";
  }
  function canPlayInLightbox(url) {
    if (isYouTubeUrl(url)) return false;
    return /\.mp4(?:[?#]|$)/i.test(url) || !!embedUrl(url);
  }
  function lightboxMarkup(url) {
    if (/\.mp4(?:[?#]|$)/i.test(url)) {
      return '<video class="lightbox-video" controls autoplay playsinline preload="metadata">' +
        '<source src="' + escAttr(url) + '" type="video/mp4">' +
        "</video>";
    }
    var embedded = embedUrl(url);
    if (!embedded) return "";
    return '<iframe src="' + escAttr(embedded) +
      // allow="fullscreen" supersedes the legacy allowfullscreen attribute;
      // carrying both only earned a console warning on every open.
      '" title="Wedding film" allow="autoplay; fullscreen"></iframe>';
  }
  /* The film viewer is a modal in every way that matters to a sighted visitor,
     so it has to behave like one for everybody else too: announced as a dialog,
     Tab held inside it while it is open, and focus handed back to the card that
     opened it on close. The photograph viewer and the investment panel already
     work this way; this one carried a hardcoded aria-hidden="true" that never
     flipped, which hid the whole dialog from screen readers even while open. */
  var lbLastFocus = null;
  function lightboxOpen() {
    return !!lightbox && lightbox.classList.contains("open");
  }
  function openLightbox(url, opener) {
    if (!lightbox || !lbFrame) return false;
    var markup = lightboxMarkup(url);
    if (!markup) return false;
    lbLastFocus = opener || document.activeElement;
    lbFrame.innerHTML = markup;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    var lbCloseBtn = lightbox.querySelector(".lightbox-close");
    if (lbCloseBtn) lbCloseBtn.focus();
    return true;
  }
  function closeLightbox() {
    if (!lightbox) return;
    var wasOpen = lightbox.classList.contains("open");
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    // Emptying the frame is what actually stops the audio; the iframe keeps
    // playing behind a hidden overlay otherwise.
    if (lbFrame) lbFrame.innerHTML = "";
    if (wasOpen && lbLastFocus && document.contains(lbLastFocus) && lbLastFocus.focus) {
      lbLastFocus.focus();
    }
    lbLastFocus = null;
  }
  document.querySelectorAll(".film").forEach(function (card) {
    card.addEventListener("click", function (ev) {
      /* Each card is now a real link to its film, so a visitor who asks for a
         new tab gets one and a visitor with no JavaScript still reaches the
         video. Only a plain left click is ours to intercept for the lightbox. */
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
      var url = card.dataset.video || "";
      if (url && !canPlayInLightbox(url)) return;
      ev.preventDefault();
      var badge = card.querySelector(".film-play span");
      if (!url) { // no link yet — quiet "coming soon" pulse
        if (badge) {
          badge.textContent = "Soon";
          setTimeout(function () { badge.textContent = "▸"; }, 1400);
        }
        return;
      }
      if (!openLightbox(url, card)) window.open(url, "_blank", "noopener");
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    var lbClose = lightbox.querySelector(".lightbox-close");
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (!lightboxOpen()) return;
      if (e.key === "Escape") { closeLightbox(); return; }
      if (e.key !== "Tab") return;
      /* Two stops only — the close button and the player — but without this,
         Tab walks straight out of the overlay and into the page behind it. */
      var focusable = [].slice.call(lightbox.querySelectorAll(
        'button, iframe, a[href], [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) { return el.offsetParent !== null || el.tagName === "IFRAME"; });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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

      /* This is the only enquiry path on the site, and it used to end at a bare
         window.open: when a popup blocker or an in-app browser swallowed that,
         nothing moved and the visitor concluded the form was broken. Say what
         happened either way, and leave a link they can press themselves. */
      var opened = null;
      try { opened = window.open(url, "_blank", "noopener"); } catch (err) { opened = null; }
      var status = document.getElementById("form-status");
      if (!status) return;
      status.hidden = false;
      if (opened) {
        status.className = "form-status ok";
        status.innerHTML = "Opening WhatsApp with your details. " +
          '<a href="' + url + '" target="_blank" rel="noopener">Nothing happened? Tap here.</a>';
      } else {
        status.className = "form-status blocked";
        status.innerHTML = "Your browser blocked the WhatsApp window. " +
          '<a href="' + url + '" target="_blank" rel="noopener">Open the chat here.</a>';
      }
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

    /* Placeholder tiles ask the Unsplash CDN for only as many pixels as they
       render. Full size requests a bigger one when those query parameters are
       present; local gallery files pass through unchanged. */
    function fullSize(url) {
      return url.replace(/([?&]w=)\d+/, "$12000").replace(/([?&]q=)\d+/, "$180");
    }
    function photoUrl(el) {
      var inlineImg = el.querySelector && el.querySelector("img");
      if (inlineImg) return fullSize(inlineImg.currentSrc || inlineImg.src || inlineImg.getAttribute("src") || "");
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

    /* Point the sharing card at this couple rather than the studio's default.
       A story link pasted into WhatsApp is the commonest way one couple sends
       another here, and the preview should show the wedding they are talking
       about. Crawlers that never run scripts keep the static tags in the head;
       every browser-driven share gets these. */
    (function storyMeta() {
      var pair = st.couple[0] + " & " + st.couple[1];
      var summary = pair + " — " + st.venue + ", " + st.city +
        ", photographed by Blurry Visuals Weddings.";
      var setMeta = function (attr, key, value) {
        if (!value) return;
        var el = document.head.querySelector("meta[" + attr + '="' + key + '"]');
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, key);
          document.head.appendChild(el);
        }
        el.setAttribute("content", value);
      };
      // Story covers may be absolute placeholder URLs or site-relative local
      // photographs; new URL() resolves both.
      var cover = st.cover ? new URL(st.cover, location.href).href : "";
      setMeta("property", "og:title", pair + " | Blurry Visuals Weddings");
      setMeta("property", "og:description", summary);
      setMeta("property", "og:url", location.href);
      setMeta("name", "description", summary);
      setMeta("name", "twitter:title", pair + " | Blurry Visuals Weddings");
      setMeta("name", "twitter:description", summary);
      if (cover) {
        setMeta("property", "og:image", cover);
        setMeta("property", "og:image:alt", pair + " at their wedding.");
        setMeta("name", "twitter:image", cover);
        // The static dimensions describe the studio's default card, not this
        // cover. Stale numbers make a scraper crop to the wrong box, so drop
        // them rather than guess at the replacement.
        document.head.querySelectorAll(
          'meta[property="og:image:width"],meta[property="og:image:height"]'
        ).forEach(function (el) { el.remove(); });
      }
    })();

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

    /* Two ways to lay a story out, both live code.

       "flat"     — every photograph in one uninterrupted grid. No chapter
                    headings, notes, quotes, tone bands or jump rail; the
                    pictures and nothing between them. This is what the studio
                    asked for: a visitor scrolls photographs, not a document.
       "chapters" — the ritual-by-ritual layout below, each chapter titled,
                    toned and timed, with the sticky "Jump to" rail.

       Flip this one value to switch. Everything the chaptered layout needs is
       still here and still exercised by the same data, so turning it back on
       is a one-word change rather than an archaeology exercise. */
    var STORY_LAYOUT = "flat";

    /* Chapters alternate ground so the page reads as a sequence rather than
       one long scroll, and the photographs inside each one are laid on a
       twelve-column grid in a repeating wide/narrow rhythm. Two rhythms,
       swapped per chapter, keep neighbouring chapters from rhyming. */
    var CHAPTER_TONES = ["light", "dark", "light", "warm", "dark"];
    var GRID_RHYTHMS = [
      [[7, "16/11"], [5, "4/5"], [5, "4/5"], [7, "16/11"]],
      [[4, "4/5"], [8, "3/2"], [8, "3/2"], [4, "4/5"]],
      [[6, "1/1"], [6, "1/1"], [8, "16/11"], [4, "4/5"]],
      [[5, "4/5"], [7, "3/2"], [4, "1/1"], [8, "16/11"]]
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
        '" style="--span:' + span + ";--ratio:" + ratio + '">' +
        '<img src="' + esc(g.img) + '" alt="" loading="lazy" decoding="async">' +
        '<span class="chapter-shot-cap">' + esc(g.label) + "</span></button>";
    }

    /* Flat layout. A repeating pair-then-band rhythm: two half-width frames
       side by side, then one full-width frame, over and over. It fills every
       row of the twelve-column grid exactly, so the wall never leaves a hole,
       and it gives the scroll a pulse without needing a single word. */
    var FLAT_PATTERN = [[6, "3/2"], [6, "3/2"], [12, "3/2"]];

    function flatPhotoHtml(g, i, total) {
      var cell = FLAT_PATTERN[i % FLAT_PATTERN.length];
      var span = cell[0];
      var ratio = cell[1];
      // A half-width frame with nothing to pair with would sit beside a gap.
      if (i === total - 1 && span === 6 && i % FLAT_PATTERN.length === 0) span = 12;
      if (!g.img) {
        return '<figure class="chapter-shot ph ph-' + esc(g.tone || "smoke") +
          '" style="--span:' + span + ';--ratio:' + ratio + '">' +
          '<div class="ph-label"><em>' + esc(g.label) + "</em>Photograph placeholder</div></figure>";
      }
      /* The caption goes to assistive tech only. On screen this layout is
         meant to be wordless, but the photobox still needs the label and a
         screen reader still needs to know which photograph this is. */
      return '<button class="chapter-shot" type="button" data-expand data-cursor="Expand"' +
        ' data-caption="' + esc(g.label) + '" aria-label="Expand photograph: ' + esc(g.label) +
        '" style="--span:' + span + ";--ratio:" + ratio + '">' +
        '<img src="' + esc(g.img) + '" alt="" loading="lazy" decoding="async">' +
        '<span class="sr-only">' + esc(g.label) + "</span></button>";
    }

    /* Chapter order still decides the sequence, so the day reads in the order
       it happened — the headings are gone, the chronology is not. */
    function flatGalleryHtml() {
      var shots = chapters.reduce(function (all, ev) {
        return all.concat(byEvent[ev.key] || []);
      }, []);
      if (!shots.length) return "";
      return '<section class="story-gallery" aria-label="Photographs"><div class="wrap">' +
        '<div class="chapter-grid">' +
          shots.map(function (g, i) { return flatPhotoHtml(g, i, shots.length); }).join("") +
        "</div></div></section>";
    }

    function chaptersGalleryHtml() {
      return chapters.map(function (ev, n) {
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
    }

    /* Sticky chapter rail. Every chapter on the page is listed, empty ones
       included, so the rail matches what a visitor actually scrolls past.
       It names chapters, so it only makes sense when chapters are showing. */
    function chapterRailHtml() {
      if (chapters.length < 2) return "";
      return '<nav class="chapter-rail" aria-label="Chapters"><div class="wrap">' +
          '<span class="chapter-rail-label">Jump to</span>' +
          chapters.map(function (ev) {
            return '<a href="#chapter-' + esc(ev.key) + '" data-cursor="' + esc(ev.name) + '">' +
              esc(ev.name) + "</a>";
          }).join("") +
        "</div></nav>";
    }

    var useChapters = STORY_LAYOUT === "chapters";
    var galleryHtml = useChapters ? chaptersGalleryHtml() : flatGalleryHtml();
    var chapterNavHtml = useChapters ? chapterRailHtml() : "";
    var showStoryText = !st.textlessStory;
    var minimalHero = !!st.textlessStory;
    document.body.classList.toggle("story-minimal", minimalHero);

    /* Opening note: the ask in the couple's words, how we answered it, and
       the three facts a visitor weighing us up actually wants. */
    var briefHtml = showStoryText && st.brief
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

    var statsHtml = st.stats && !st.hideHeroStats
      ? '<div class="story-stats">' + st.stats.map(function (row) {
          return "<div><b>" + esc(row[0]) + "</b><small>" + esc(row[1]) + "</small></div>";
        }).join("") + "</div>"
      : "";

    var storyCopyHtml = showStoryText
      ? '<section class="story-body"><div class="wrap">' +
          '<p class="lede">' + esc(st.lede) + "</p>" +
          '<p class="txt">' + esc(st.story) + "</p>" +
        "</div></section>"
      : "";

    var wordsHtml = showStoryText && st.words
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

    var creditsHtml = showStoryText && st.credits && st.credits.length
      ? '<section class="story-credits"><div class="wrap">' +
          '<div class="story-credits-label">Credits</div>' +
          "<div>" + st.credits.map(function (row) {
            return "<div><small>" + esc(row[0]) + "</small><b>" + esc(row[1]) + "</b></div>";
          }).join("") + "</div>" +
        "</div></section>"
      : "";

    var prev = list[(idx - 1 + list.length) % list.length];
    var next = list[(idx + 1) % list.length];
    var crumbsHtml = minimalHero ? "" :
      '<nav class="story-crumbs" aria-label="Breadcrumb">' +
        '<a class="story-back" href="index.html" data-cursor="Home"><span aria-hidden="true">←</span> Home</a>' +
        '<a class="story-back" href="index.html#stories" data-cursor="Weddings">All weddings</a>' +
      "</nav>";
    var storyKickerHtml = minimalHero ? "" :
      '<div class="phera"><b>Real wedding ' + ("0" + (idx + 1)).slice(-2) + "</b> — " + esc(st.city) + "</div>";
    var storyMetaHtml = minimalHero ? "" :
      '<div class="story-meta">' +
        "<div><small>Date</small><b>" + esc(st.date) + "</b></div>" +
        "<div><small>Venue</small><b>" + esc(st.venue) + "</b></div>" +
        "<div><small>City</small><b>" + esc(st.city) + "</b></div>" +
        "<div><small>Coverage</small><b>" + esc(st.type) + "</b></div>" +
      "</div>";

    /* The couple's cover photograph anchors the story hero. A self-hosted
       film can take over when a story names `filmFile`; a heroSequence can
       stand in as a video-like still montage until the real film arrives. */
    var heroPoster = st.filmPoster || st.cover || "";
    var heroSequence = st.heroSequence && st.heroSequence.length ? st.heroSequence : null;
    var heroFocalPoints = st.heroFocalPoints || [];
    var heroMedia = '<div class="story-hero-media" aria-hidden="true">';
    if (st.filmFile) {
      heroMedia += "<video " + (REDUCED ? "" : "autoplay ") + 'muted loop playsinline preload="metadata"' +
        (heroPoster ? ' poster="' + esc(heroPoster) + '"' : "") + ">" +
        '<source src="' + esc(st.filmFile) + '" type="video/mp4">' +
      "</video>";
    } else if (heroSequence) {
      heroMedia += '<div class="story-hero-sequence' + (REDUCED ? "" : " is-animated") + '">';
      heroMedia += heroSequence.map(function (src, i) {
        var focus = heroFocalPoints[i] || "center 45%";
        return '<img class="story-hero-slide' + (i === 0 ? " is-active" : "") +
          '" style="--hero-focus:' + esc(focus) + ';" src="' + esc(src) +
          '" alt="" loading="' + (i === 0 ? "eager" : "lazy") +
          '" decoding="async">';
      }).join("");
      heroMedia += "</div>";
    } else if (heroPoster) {
      heroMedia += '<img src="' + esc(heroPoster) + '" alt="">';
    }
    heroMedia += "</div>";

    storyRoot.innerHTML =
      '<section class="story-hero' + (minimalHero ? " story-hero-minimal" : "") + '">' +
        heroMedia + '<div class="wrap">' + crumbsHtml + storyKickerHtml +
        "<h1>" + esc(st.couple[0]) + " <em>&amp;</em> " + esc(st.couple[1]) + "</h1>" +
        storyMetaHtml + statsHtml +
      "</div></section>" +
      chapterNavHtml +
      briefHtml +
      storyCopyHtml +
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

    var heroSlides = storyRoot.querySelectorAll(".story-hero-sequence .story-hero-slide");
    if (!REDUCED && heroSlides.length > 1) {
      var heroSlideIndex = 0;
      window.setInterval(function () {
        heroSlides[heroSlideIndex].classList.remove("is-active");
        heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
        heroSlides[heroSlideIndex].classList.add("is-active");
      }, 3600);
    }

    /* ---- flat gallery: keep the shooting order while packing the wall ----
       The tiles render in order in the DOM; a CSS multi-column layout reflows
       them into top-to-bottom columns and loses that, so the day looks
       shuffled. Lay them on a fine 8px grid instead and give each tile a row
       span from its own height — the gallery still reads 1, 2, 3 across and
       down, with no ragged gaps between mixed portrait and landscape frames. */
    var flatGrid = storyRoot.querySelector(".story-gallery .chapter-grid");
    if (flatGrid) {
      var FLAT_GAP = 18;
      var flatTiles = [].slice.call(flatGrid.querySelectorAll(".chapter-shot"));
      var spanFor = function (h, rowPx) {
        return "span " + Math.max(1, Math.round((h + FLAT_GAP) / rowPx));
      };
      var ratioOf = function (el) {
        var m = /^\s*([\d.]+)\s*\/\s*([\d.]+)/.exec(window.getComputedStyle(el).aspectRatio);
        return m ? parseFloat(m[1]) / parseFloat(m[2]) : 0.75;
      };
      var flatMetrics = function () {
        var gs = window.getComputedStyle(flatGrid);
        var cols = (gs.gridTemplateColumns.match(/px/g) || [0]).length || 1;
        var colW = (flatGrid.clientWidth - (parseFloat(gs.columnGap) || 0) * (cols - 1)) / cols;
        return { rowPx: parseFloat(gs.gridAutoRows) || 8, colW: colW };
      };
      /* One read pass, then one write pass, so a 240-frame wall never thrashes
         layout. A tile that has not been laid out yet reports height 0, so fall
         back to its column width times its aspect ratio — the placeholder 3/4
         until the photo loads, its true shape after. */
      var relayoutFlat = function () {
        var m = flatMetrics();
        var heights = flatTiles.map(function (t) {
          return t.getBoundingClientRect().height || (m.colW / ratioOf(t));
        });
        flatTiles.forEach(function (t, i) {
          t.style.gridRowEnd = spanFor(heights[i], m.rowPx);
        });
      };
      flatTiles.forEach(function (tile) {
        var img = tile.querySelector("img");
        if (!img) return;
        var onReady = function () {
          if (!img.naturalWidth) return;
          tile.style.aspectRatio = img.naturalWidth + " / " + img.naturalHeight;
          var m = flatMetrics();
          var h = tile.getBoundingClientRect().height || (m.colW * img.naturalHeight / img.naturalWidth);
          tile.style.gridRowEnd = spanFor(h, m.rowPx);
        };
        if (img.complete && img.naturalWidth) onReady();
        else img.addEventListener("load", onReady, { once: true });
      });
      window.requestAnimationFrame(function () { window.requestAnimationFrame(relayoutFlat); });
      window.addEventListener("load", relayoutFlat);
      var flatRAF;
      window.addEventListener("resize", function () {
        window.cancelAnimationFrame(flatRAF);
        flatRAF = window.requestAnimationFrame(relayoutFlat);
      }, { passive: true });
    }

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
    storiesGrid.innerHTML = window.BLURRY_WEDDING_STORIES.filter(function (st) {
      return st.noPlaceholders || st.homepageTeaser;
    }).map(function (st) {
      var fig = st.cover
        ? '<figure class="ph ph-img" role="img" aria-label="' + st.couple[0] + " and " + st.couple[1] +
          '" style="background-image:url(\'' + st.cover + "')\"></figure>"
        : '<figure class="ph ph-' + (st.tone || "smoke") + '"><div class="ph-label"><em>' +
          st.couple[0] + " &amp; " + st.couple[1] + "</em>Cover photograph</div></figure>";
      if (st.homepageTeaser) {
        return '<article class="story-card rv story-card-soon" data-cursor="Coming soon" aria-disabled="true">' + fig +
          "<h3>" + st.couple[0] + " <em>&amp;</em> " + st.couple[1] + "</h3>" +
          "<p>" + st.venue + " · " + st.city + "</p>" +
          '<span class="more">Coming soon</span></article>';
      }
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
