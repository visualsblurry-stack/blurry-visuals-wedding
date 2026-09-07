/* ============================================================
   Blurry Visuals Weddings — real wedding stories data
   The first two stories use full local real wedding galleries. The remaining
   portfolio slots still use stock placeholders until their real photos land.
   ============================================================ */

(function () {
  var U = function (id, w) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 1200) + "&q=70";
  };
  var localGallery = function (slug, count, pair) {
    var shots = [];
    for (var i = 1; i <= count; i += 1) {
      var n = String(i).padStart(3, "0");
      shots.push({
        label: pair + " photograph " + n,
        event: "portraits",
        img: "img/stories/" + slug + "/" + n + ".webp"
      });
    }
    return shots;
  };

  window.BLURRY_WEDDING_STORIES = [
    {
      slug: "shachi-vedant",
      couple: ["Shachi", "Vedant"],
      date: "Wedding story",
      venue: "Mumbai",
      city: "India",
      type: "Photography coverage",
      cover: "img/stories/shachi-vedant/cover.webp?v=20260907h",
      heroSequence: [
        "img/stories/shachi-vedant/257.webp",
        "img/stories/shachi-vedant/264.webp",
        "img/stories/shachi-vedant/268.webp",
        "img/stories/shachi-vedant/303.webp",
        "img/stories/shachi-vedant/304.webp",
        "img/stories/shachi-vedant/306.webp",
        "img/stories/shachi-vedant/307.webp",
        "img/stories/shachi-vedant/356.webp",
        "img/stories/shachi-vedant/369.webp",
        "img/stories/shachi-vedant/418.webp"
      ],
      heroFocalPoints: [
        "center 42%",
        "center 43%",
        "center 44%",
        "center 43%",
        "center 43%",
        "center 43%",
        "center 43%",
        "center 43%",
        "center 44%",
        "center 44%"
      ],
      oneLiner: "A real wedding gallery told through the studio's full web selection.",
      lede: "Shachi and Vedant's page is now built from real photographs, arranged as one uninterrupted visual story.",
      story: "The gallery below uses a tighter edit from their web-ready image selection: ten frames, no chapter breaks, and no interruptions between photographs.",
      gallery: localGallery("shachi-vedant", 484, "Shachi & Vedant"),
      noPlaceholders: true,
      textlessStory: true,
      hideHeroStats: true,
      film: ""
    },
    {
      slug: "vedin-megha",
      couple: ["Vedin", "Megha"],
      date: "Wedding story",
      venue: "Hyderabad",
      city: "India",
      type: "Photography coverage",
      cover: "img/stories/vedin-megha/cover.webp?v=20260907h",
      heroSequence: [
        "img/stories/vedin-megha/081.webp",
        "img/stories/vedin-megha/084.webp",
        "img/stories/vedin-megha/124.webp",
        "img/stories/vedin-megha/125.webp",
        "img/stories/vedin-megha/195.webp",
        "img/stories/vedin-megha/196.webp",
        "img/stories/vedin-megha/208.webp",
        "img/stories/vedin-megha/209.webp",
        "img/stories/vedin-megha/224.webp",
        "img/stories/vedin-megha/238.webp"
      ],
      heroFocalPoints: [
        "center 43%",
        "center 43%",
        "center 45%",
        "center 45%",
        "center 44%",
        "center 43%",
        "center 45%",
        "center 45%",
        "center 44%",
        "center 44%"
      ],
      oneLiner: "A bright real wedding gallery told through the studio's full web selection.",
      lede: "Vedin and Megha's page is built from real photographs from their celebration.",
      story: "The gallery keeps the edit direct and visual: ten selected WebP frames, no chapter breaks, and no long copy between the images.",
      gallery: localGallery("vedin-megha", 278, "Vedin & Megha"),
      noPlaceholders: true,
      textlessStory: true,
      hideHeroStats: true,
      film: ""
    },
    {
      slug: "niki-swapnesh",
      couple: ["Niki", "Swapnesh"],
      date: "Wedding story",
      // TODO: real venue/city from the owner - placeholder until supplied,
      // same as Shachi/Vedin carried before their locations were confirmed.
      venue: "Real wedding",
      city: "India",
      type: "Photography coverage",
      cover: "img/stories/niki-swapnesh/cover.webp?v=20260907h",
      heroSequence: [
        "img/stories/niki-swapnesh/001.webp",
        "img/stories/niki-swapnesh/004.webp",
        "img/stories/niki-swapnesh/030.webp",
        "img/stories/niki-swapnesh/056.webp",
        "img/stories/niki-swapnesh/081.webp",
        "img/stories/niki-swapnesh/157.webp",
        "img/stories/niki-swapnesh/169.webp",
        "img/stories/niki-swapnesh/207.webp",
        "img/stories/niki-swapnesh/235.webp",
        "img/stories/niki-swapnesh/243.webp"
      ],
      heroFocalPoints: [
        "center 40%",
        "center 50%",
        "center 40%",
        "center 35%",
        "center 12%",
        "center 45%",
        "center 50%",
        "center 35%",
        "center 30%",
        "center 42%"
      ],
      oneLiner: "A real wedding gallery, from haldi to the last dance.",
      lede: "Niki and Swapnesh's page is now built from real photographs, arranged as one uninterrupted visual story.",
      story: "The gallery below uses a tighter edit from their web-ready image selection: ten frames, no chapter breaks, and no interruptions between photographs.",
      gallery: localGallery("niki-swapnesh", 243, "Niki & Swapnesh"),
      noPlaceholders: true,
      textlessStory: true,
      hideHeroStats: true,
      film: ""
    },
    {
      slug: "sana-dev",
      couple: ["Sana", "Dev"],
      date: "January 2026",
      venue: "Mahalaxmi Racecourse",
      city: "Mumbai",
      type: "Grand sangeet & wedding",
      cover: U("1529636798458-92182e662485", 900),
      oneLiner: "Eight hundred guests and a skyline for a backdrop.",
      lede: "Big weddings are logistics. Great big weddings are logistics you never see in the photographs.",
      story: "Sana and Dev's week was built at scale — a sangeet with a live band, a wedding under the open Mumbai sky, and a guest list that filled the racecourse lawns. We ran a two-photographer, one-filmmaker crew and mapped every ritual in advance, so the coverage feels calm even where the evening wasn't.",
      gallery: [
        { label: "Stage wide, sangeet night", event: "sangeet", img: U("1494955870715-979ca4f13bf0", 1600), wide: true },
        { label: "Couple entry, sparklers", event: "reception", img: U("1722952934708-749c22eb2e58"), wide: false },
        { label: "Choreography mid-air", event: "sangeet", img: U("1529636798458-92182e662485"), wide: false },
        { label: "Skyline pheras", event: "pheras", img: U("1583939003579-730e3918a45a", 1600), wide: true }
      ],
      textlessStory: true,
      hideHeroStats: true,
      film: ""
    },
    {
      slug: "ria-kabir",
      couple: ["Ria", "Kabir"],
      date: "March 2026",
      venue: "Farmhouse estate",
      city: "Karjat",
      type: "Day wedding & haldi",
      cover: U("1681717166573-f71589207785", 900),
      oneLiner: "A turmeric-yellow morning that never calmed down.",
      lede: "The haldi began politely. It did not end that way, and the photographs are better for it.",
      story: "Ria and Kabir married in daylight on a Karjat farmhouse lawn — a haldi that turned into a water fight, a noon ceremony under a mango tree, and a lunch that lasted till sunset. The set is bright, yellow-soaked, and full of motion; we let the mess in, because the mess was the memory.",
      gallery: [
        { label: "Haldi hands, mid-throw", event: "haldi", img: U("1634693343333-9b6013c30d57"), wide: false },
        { label: "Yellow, everywhere", event: "haldi", img: U("1681717075175-19feb7a6f664"), wide: false },
        { label: "Mango-tree mandap", event: "pheras", img: U("1727430256509-0f897d6f4765", 1600), wide: true },
        { label: "Lawn lunch, long table", event: "reception", img: U("1525772764200-be829a350797"), wide: false },
        { label: "Couple, golden field", event: "portraits", img: U("1735052712464-9d24b69be5f5"), wide: false }
      ],
      textlessStory: true,
      hideHeroStats: true,
      film: ""
    },
    {
      slug: "tara-vikram",
      couple: ["Tara", "Vikram"],
      date: "April 2026",
      venue: "Lakeside heritage hotel",
      city: "Udaipur",
      type: "Destination wedding & film",
      cover: U("1665960213508-48f07086d49c", 900),
      oneLiner: "Two families, one lake, and a film they cry at annually.",
      lede: "Udaipur is the easiest city in India to photograph and the hardest one to leave.",
      story: "Tara and Vikram booked us film-first: a cinematic wedding film with stills built around it. Boat entries, ghat-side portraits, a pichola-blue hour that lasted exactly eleven minutes — we planned the whole wedding around light and it shows. The photographs read like stills pulled from the film, because that's what they are.",
      gallery: [
        { label: "Boat entry, Lake Pichola", event: "baraat", img: U("1537633552985-df8429e8048b", 1600), wide: true },
        { label: "Bride, ghat steps", event: "portraits", img: U("1587271315307-eaebc181c749"), wide: false },
        { label: "Blue-hour couple portrait", event: "portraits", img: U("1515934751635-c81c6bc9a2d8"), wide: false },
        { label: "Jaimala, lakeside", event: "pheras", img: U("1583939003579-730e3918a45a", 1600), wide: true }
      ],
      textlessStory: true,
      hideHeroStats: true,
      film: "https://www.youtube.com/watch?v=Pm3NfZDC48k"
    }
  ];

  /* ------------------------------------------------------------------
     Chapter copy. Each ritual gets the time it happened, a sentence for a
     headline, and a note beside it — the parts a caption cannot carry.
     Keyed by slug, then by the event tags used in `gallery` above. Anything
     missing falls back to the ritual's own name, so a wedding can be written
     up gradually instead of all at once.
     ------------------------------------------------------------------ */
  var CHAPTERS = {
    "shachi-vedant": {
      portraits: {
        time: "Across the celebration",
        title: "Shachi and Vedant, frame by frame.",
        note: "A real gallery from the studio's web selection, kept as one continuous visual story."
      }
    },
    "vedin-megha": {
      portraits: {
        time: "Across the celebration",
        title: "Vedin and Megha, frame by frame.",
        note: "A real gallery from the studio's web selection, kept as one continuous visual story."
      }
    },
    "niki-swapnesh": {
      portraits: {
        time: "Across the celebration",
        title: "Niki and Swapnesh, frame by frame.",
        note: "A real gallery from the studio's web selection, kept as one continuous visual story."
      }
    },
    "sana-dev": {
      sangeet: {
        time: "Day one · 9:30 pm",
        title: "A live band and eight hundred people.",
        note: "Built at scale and run to the minute. Two photographers, one filmmaker, and a plan for every ritual so the evening never had to wait for us."
      },
      pheras: {
        time: "Day two · 8:40 pm",
        title: "Pheras against the Mumbai skyline.",
        note: "An open sky over the racecourse, the city lit behind the mandap, and a ceremony that stayed calm in the middle of all of it.",
        quote: "Everyone warned us a wedding this size would feel like a production. In the photographs it does not.",
        quoteWho: "Sana, on the wedding day"
      },
      reception: {
        time: "Day two · 10:05 pm",
        title: "An entrance, and then sparklers.",
        note: "A receiving line that took ninety minutes and a room that never once emptied out."
      }
    },
    "ria-kabir": {
      haldi: {
        time: "Day one · 9:50 am",
        title: "Haldi, and then a water fight.",
        note: "It was meant to last forty minutes. Two hours in, a cousin found the garden hose and the lawn turned yellow. Nobody changed clothes.",
        quote: "The turmeric handprint on Kabir's back is my favourite photograph of the entire wedding.",
        quoteWho: "Ria, on the haldi"
      },
      pheras: {
        time: "Day one · 12:30 pm",
        title: "A noon ceremony under a mango tree.",
        note: "Daylight weddings give you nowhere to hide, which is the point. Hard sun, real faces, no lighting rig anywhere in sight."
      },
      reception: {
        time: "Day one · 2:00 pm",
        title: "Lunch on one very long table.",
        note: "It was billed as an hour. It ran until sunset, which everybody had quietly expected."
      },
      portraits: {
        time: "Day one · 5:40 pm",
        title: "Golden field, end of the day.",
        note: "Twenty minutes at the far end of the estate, both of them still faintly yellow."
      }
    },
    "tara-vikram": {
      baraat: {
        time: "Day one · 4:30 pm",
        title: "He arrived by boat.",
        note: "Lake Pichola at half past four, a baraat spread across three boats, and a drummer who kept time with the oars."
      },
      pheras: {
        time: "Day two · 7:10 pm",
        title: "Jaimala at the water's edge.",
        note: "Planned around the light rather than the schedule — which is what happens when a wedding is booked film-first.",
        quote: "We watch the film every anniversary. The photographs are the film, held still.",
        quoteWho: "Tara, a year on"
      },
      portraits: {
        time: "Day two · blue hour",
        title: "Eleven minutes of Pichola blue.",
        note: "That is genuinely how long it lasts on that lake in April. We had the ghat steps cleared and waiting."
      }
    }
  };

  /* The opening note, the couple's own words, and the numbers behind the
     coverage. Everything here is optional; a story drops the section it
     lacks rather than rendering an empty one. */
  var EXTRAS = {
    "shachi-vedant": {
      stats: [["484", "Photographs"]]
    },
    "vedin-megha": {
      stats: [["278", "Photographs"]]
    },
    "niki-swapnesh": {
      stats: [["243", "Photographs"]]
    },
    "sana-dev": {
      brief: {
        ask: "Big weddings are logistics.",
        text: "Great big weddings are logistics you never see in the photographs. We mapped every ritual in advance so the coverage feels calm even where the evening was not.",
        meta: [["Coverage", "Photo & film"], ["Venue", "Mahalaxmi Racecourse"], ["Delivered in", "26 days"]]
      },
      stats: [["980", "Frames delivered"], ["4", "Events"], ["6", "Crew on ground"]],
      words: { quote: "Eight hundred guests and not one photograph that looks like a crowd shot. We still do not know how.", who: "Sana & Dev" }
    },
    "ria-kabir": {
      brief: {
        ask: "The haldi began politely.",
        text: "It did not end that way, and the photographs are better for it. A daylight wedding on a Karjat lawn, shot bright and yellow-soaked, with the mess left in.",
        meta: [["Coverage", "Photography"], ["Venue", "Farmhouse estate"], ["Delivered in", "18 days"]]
      },
      stats: [["520", "Frames delivered"], ["3", "Events"], ["3", "Crew on ground"]],
      words: { quote: "You left in every bit of the chaos. That is the wedding we actually had.", who: "Ria & Kabir" }
    },
    "tara-vikram": {
      brief: {
        ask: "They booked us film-first.",
        text: "A cinematic wedding film with stills built around it. We planned the whole wedding around light, which is why the photographs read like frames pulled from the film.",
        meta: [["Coverage", "Film & photo"], ["Venue", "Lakeside heritage hotel"], ["Delivered in", "28 days"]]
      },
      stats: [["465", "Frames delivered"], ["4", "Events"], ["4", "Crew on ground"]],
      words: { quote: "We watch the film every anniversary and cry every single time. Thank you for making us slow down.", who: "Tara & Vikram" }
    }
  };

  window.BLURRY_WEDDING_STORIES.forEach(function (story) {
    var extra = EXTRAS[story.slug] || {};
    story.chapters = CHAPTERS[story.slug] || {};
    story.brief = extra.brief || null;
    story.stats = extra.stats || null;
    story.words = extra.words || null;
    story.credits = [
      ["Photography", "Blurry Visuals Weddings"],
      ["Films", "Blurry Visuals Weddings"],
      ["Venue", story.venue],
      ["City", story.city],
      ["Coverage", story.type]
    ];
  });

  /* ==================================================================
     PLACEHOLDER PHOTOGRAPHS — delete this whole block when the studio's
     own galleries land, and nothing else has to change.

     Stock frames from the Pexels CDN, grouped by ritual so every chapter
     has a look of its own rather than a shared soup of wedding pictures.
     Each chapter is topped up to four frames; anything the studio has
     already filed keeps its place at the front.
     ================================================================== */
  var P = function (id, w) {
    return "https://images.pexels.com/photos/" + id + "/pexels-photo-" + id +
      ".jpeg?auto=compress&cs=tinysrgb&w=" + (w || 800);
  };

  var FILLER = {
    haldi: [
      [36098386, "First smear, from her mother"],
      [36098363, "Waiting in the doorway"],
      [19613666, "Marigold and turmeric"],
      [36098378, "The hose arrives"],
      [36248930, "Yellow on every hand"],
      [36098379, "Washing it off, eventually"]
    ],
    mehndi: [
      [30707334, "Hands, hour three"],
      [6023737, "Her grandmother's song"],
      [25677252, "Lamps on the terrace"],
      [19613670, "Last detail before dinner"],
      [19780151, "Cones, and a long queue"]
    ],
    sangeet: [
      [29497170, "The eleven seconds"],
      [32107250, "Watching from the side"],
      [29153204, "Laughing mid-song"],
      [33427272, "Fireworks over the lawn"],
      [28210870, "The floor never emptied"]
    ],
    baraat: [
      [33427272, "The arrival, and the noise"],
      [29497170, "Dancing the last hundred metres"],
      [28210870, "Drummers at the front"],
      [32107250, "The family, waiting"],
      [36098378, "Rose petals, all of them"]
    ],
    nikah: [
      [17657612, "The qabool"],
      [12968722, "Signing, with witnesses"],
      [8621982, "First look afterwards"],
      [36836727, "Duas from both sides"],
      [36836726, "The room, held quiet"]
    ],
    pheras: [
      [36836726, "Under the mandap"],
      [12968722, "The fourth round"],
      [8621982, "After the last vow"],
      [17657612, "Walking out at sunrise"],
      [36836727, "Fire, and the pandit's hands"]
    ],
    vidaai: [
      [9778787, "Her father, not managing"],
      [8621982, "The long goodbye"],
      [17657612, "Rice over the shoulder"],
      [36098369, "The car, and the crowd"],
      [12968722, "Looking back once"]
    ],
    reception: [
      [32483856, "Entrance"],
      [36098383, "Between courses"],
      [9778787, "Her hand, his mother's ring"],
      [36098369, "The goodbye at the car"],
      [28210870, "The floor, near midnight"]
    ],
    portraits: [
      [36098383, "Ten minutes, door shut"],
      [36098363, "Doorway light"],
      [19780151, "Neither of them posing"],
      [28210870, "The last frame of the night"],
      [8621982, "Whatever they were laughing at"]
    ]
  };

  /* Copy for a ritual the studio has not written up yet. Specific enough to
     read properly, generic enough to be true of any wedding — and always
     beaten by anything in CHAPTERS above. */
  var GENERIC_CHAPTER = {
    haldi: {
      time: "Morning, day one",
      title: "Turmeric, and the mess it makes.",
      note: "It is scheduled for forty minutes and it never takes forty minutes. We photograph it close, because this is the hour nobody is performing yet."
    },
    mehndi: {
      time: "Evening, day one",
      title: "Henna, and hours of it.",
      note: "The slowest event of any wedding and the most photographable — hands held still, everyone else talking, and light that keeps dropping."
    },
    sangeet: {
      time: "Night, day two",
      title: "The night both families competed.",
      note: "Weeks of rehearsal, about a verse of it remembered. What replaces the choreography is always better than the choreography."
    },
    baraat: {
      time: "Late afternoon",
      title: "The arrival, and the noise.",
      note: "A procession that covers two hundred metres in an hour. We walk backwards through most of it."
    },
    nikah: {
      time: "Dusk",
      title: "The vows, unamplified.",
      note: "Short, quiet, and over before most guests have settled. We stay still and let it happen."
    },
    pheras: {
      time: "The ceremony",
      title: "Seven rounds, one promise.",
      note: "Firelight, a pandit's voice, and the part of the day the whole thing was built around. We keep it unhurried."
    },
    vidaai: {
      time: "The farewell",
      title: "The hardest frames of the day.",
      note: "Families come back to these years later, which is why we stay close and say nothing at all."
    },
    reception: {
      time: "Night, last day",
      title: "Where the celebration lands.",
      note: "A receiving line, a room that never empties, and a goodbye at the car that takes far longer than anyone planned."
    },
    portraits: {
      time: "Between events",
      title: "The two of them, unhurried.",
      note: "Stolen wherever the light was — a corridor, a lawn, ten minutes with the door shut. No posing, just somewhere quiet to stand."
    }
  };

  var CORE_RITUALS = ["haldi", "mehndi", "sangeet", "pheras", "reception"];
  var FRAMES_PER_CHAPTER = 4;

  window.BLURRY_WEDDING_STORIES.forEach(function (story, si) {
    if (story.noPlaceholders) return;

    var counted = {};
    story.gallery.forEach(function (g) {
      counted[g.event] = (counted[g.event] || 0) + 1;
    });

    // Every ritual that will render a chapter: the core five, plus whatever
    // else this wedding actually had.
    var keys = CORE_RITUALS.concat(
      Object.keys(counted).filter(function (k) { return CORE_RITUALS.indexOf(k) === -1; })
    );

    keys.forEach(function (key) {
      var pool = FILLER[key] || FILLER.portraits;
      var need = FRAMES_PER_CHAPTER - (counted[key] || 0);
      for (var i = 0; i < need; i += 1) {
        // Offset by story so two weddings do not open with the same frame.
        var pick = pool[(si + i) % pool.length];
        story.gallery.push({
          label: pick[1],
          event: key,
          img: P(pick[0]),
          placeholder: true
        });
      }
      if (!story.chapters[key]) story.chapters[key] = GENERIC_CHAPTER[key];
    });
  });
})();
