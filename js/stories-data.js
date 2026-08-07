/* ============================================================
   Blurry Visuals Weddings — real wedding stories data
   Stock photos (Unsplash CDN) for now — replace `cover` and
   gallery `img` URLs with img/stories/<slug>/NN.jpg when real
   photos arrive (see img/README.md). Order = prev/next order.
   ============================================================ */

(function () {
  var U = function (id, w) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 1200) + "&q=70";
  };

  window.BLURRY_WEDDING_STORIES = [
    {
      slug: "anaya-rohan",
      couple: ["Anaya", "Rohan"],
      date: "December 2025",
      venue: "Taj Lands End",
      city: "Bandra, Mumbai",
      type: "Three-day classic wedding",
      cover: U("1610173827043-9db50e0d8ef9", 900),
      oneLiner: "A sea-facing shaadi where the baraat outdanced the DJ.",
      lede: "Some weddings arrive quietly. This one arrived with two hundred dancers and a horse that refused to hurry.",
      story: "Anaya and Rohan met in a Bandra bookshop and married ten minutes from it, over three days that moved from an intimate haldi on the lawns to a sangeet that ran ninety minutes over schedule — nobody minded. We photographed the rituals close and the sea wide, keeping the pheras unhurried and the dance floor loud.",
      gallery: [
        { label: "Bride portrait, golden hour", event: "portraits", img: U("1587271315307-eaebc181c749"), wide: false },
        { label: "Baraat energy on the bandstand", event: "baraat", img: U("1597157639073-69284dc0fdaf"), wide: false },
        { label: "Pheras by the sea", event: "pheras", img: U("1587271636175-90d58cdad458", 1600), wide: true },
        { label: "Mangalsutra moment", event: "pheras", img: U("1621801306185-8c0ccf9c8eb8"), wide: false },
        { label: "First look, corridor light", event: "portraits", img: U("1537633552985-df8429e8048b"), wide: false },
        { label: "Vidaai, held together", event: "vidaai", img: U("1599462616558-2b75fd26a283", 1600), wide: true }
      ],
      film: "https://www.youtube.com/watch?v=a9uRfuujFY8"
    },
    {
      slug: "meher-zain",
      couple: ["Meher", "Zain"],
      date: "November 2025",
      venue: "Private beach house",
      city: "Alibaug",
      type: "Intimate coastal wedding",
      cover: U("1523438885200-e635ba2c371e", 900),
      oneLiner: "Forty guests, one shoreline, zero schedules.",
      lede: "They wanted a wedding that felt like a long dinner with the people they love. The sea agreed to host.",
      story: "A ferry, a beach house, and a nikah at dusk. Meher and Zain kept the guest list at forty and the plans loose, which gave us room to work like documentarians — barefoot processions, quiet duas, and a dance floor made of sand. The frames stay soft, salt-aired, and unposed.",
      gallery: [
        { label: "Couple at the waterline", event: "portraits", img: U("1460364157752-926555421a7e", 1600), wide: true },
        { label: "Nikah at dusk", event: "nikah", img: U("1591604466107-ec97de577aff"), wide: false },
        { label: "Mehndi detail, sea breeze", event: "mehndi", img: U("1505932794465-147d1f1b2c97"), wide: false },
        { label: "Dinner under string lights", event: "reception", img: U("1519225421980-715cb0215aed", 1600), wide: true }
      ],
      film: ""
    },
    {
      slug: "ishita-arjun",
      couple: ["Ishita", "Arjun"],
      date: "February 2026",
      venue: "Heritage palace",
      city: "Jaipur",
      type: "Destination wedding",
      cover: U("1604017011826-d3b4c23f8914", 900),
      oneLiner: "A palace wedding photographed like period cinema.",
      lede: "Jaipur gave us sandstone, brass bands, and light that behaves like it studied art direction.",
      story: "Ishita and Arjun flew ninety guests to a heritage palace and let the city set the palette. We shot the pheras against carved jharokhas, the sangeet under a courtyard moon, and stole the couple away at sunrise for portraits before the palace woke. Every frame leans warm, formal, and a little grand — like the wedding itself.",
      gallery: [
        { label: "Palace facade, first light", event: "portraits", img: U("1727430256509-0f897d6f4765", 1600), wide: true },
        { label: "Bridal portrait, jharokha", event: "portraits", img: U("1610173827043-9db50e0d8ef9"), wide: false },
        { label: "Sangeet courtyard", event: "sangeet", img: U("1502635385003-ee1e6a1a742d"), wide: false },
        { label: "Couple portrait, sunrise", event: "portraits", img: U("1519671482749-fd09be7ccebf"), wide: false },
        { label: "Pheras under the canopy", event: "pheras", img: U("1665960213508-48f07086d49c"), wide: false },
        { label: "Farewell arch, marigold", event: "vidaai", img: U("1587271636175-90d58cdad458", 1600), wide: true }
      ],
      film: "https://www.youtube.com/watch?v=UpZI5dOFGM0"
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
    "anaya-rohan": {
      baraat: {
        time: "Day two · 6:20 pm",
        title: "The baraat took the bandstand.",
        note: "Two hundred dancers, one horse with no intention of hurrying, and a stretch of Bandra seafront that stopped to watch. We walked backwards for most of it."
      },
      pheras: {
        time: "Day three · 7:05 pm",
        title: "Pheras, with the sea for a witness.",
        note: "The mandap faced west on purpose. Seven rounds against a falling tide, unhurried, while the last of the light did the work for us.",
        quote: "We had planned every minute of that day except this one. It is the only part I remember properly.",
        quoteWho: "Anaya, on the pheras"
      },
      vidaai: {
        time: "Day three · 11:40 pm",
        title: "Vidaai, and nobody let go first.",
        note: "The hardest frames of any wedding, and the ones families come back to years later. We stay close and say nothing."
      },
      portraits: {
        time: "Across three days",
        title: "The two of them, unhurried.",
        note: "Stolen between events — a corridor, a golden hour, ten minutes with the door shut. No posing, just somewhere quiet to stand."
      }
    },
    "meher-zain": {
      mehndi: {
        time: "Day one · 5:30 pm",
        title: "Mehndi with salt in the air.",
        note: "Forty guests on a veranda, henna drying in a sea breeze that kept threatening to smudge it. Nobody hurried the artists."
      },
      nikah: {
        time: "Day two · 6:48 pm",
        title: "A nikah at the last of the light.",
        note: "Barefoot, unamplified, and over in nine minutes. The quietest ceremony we have photographed, and the one we talk about most.",
        quote: "There was no stage and no schedule. Just everyone we love, standing on sand.",
        quoteWho: "Zain, on the nikah"
      },
      reception: {
        time: "Day two · 9:15 pm",
        title: "Dinner ran until the tide came in.",
        note: "One long table, string lights, and a dance floor made of sand. It ended when the sea decided it should."
      },
      portraits: {
        time: "Day two · golden hour",
        title: "At the waterline, before anyone noticed.",
        note: "Twenty minutes away from the party while the light held. They talked to each other and forgot we were there."
      }
    },
    "ishita-arjun": {
      sangeet: {
        time: "Day two · 9:00 pm",
        title: "A sangeet under a courtyard moon.",
        note: "Sandstone walls, a brass band, and choreography that survived roughly one verse before the aunts took over."
      },
      pheras: {
        time: "Day three · 5:15 am",
        title: "Pheras beneath carved jharokhas.",
        note: "The palace at its emptiest. Firelight on stone, a pandit's voice, and ninety guests trying very hard to stay awake.",
        quote: "We flew everyone across the country for four minutes that felt like this. Worth it.",
        quoteWho: "Ishita, on the pheras"
      },
      vidaai: {
        time: "Day three · 10:20 am",
        title: "Out through the marigold arch.",
        note: "The last frames of the wedding, made under eight feet of flowers while the family formed a corridor neither of them could see the end of."
      },
      portraits: {
        time: "Day three · first light",
        title: "The palace, before it woke.",
        note: "We stole them at sunrise. Empty courtyards, warm stone, and the only hour all week when nobody needed either of them."
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
    "anaya-rohan": {
      brief: {
        ask: "Anaya asked for one thing: don't make us pose.",
        text: "So for three days in Bandra we stayed at the edge of the room. A haldi on the lawns, a sangeet that ran ninety minutes over, pheras facing the sea. Everything below is in the order it happened.",
        meta: [["Coverage", "Photo & film"], ["Venue", "Taj Lands End"], ["Delivered in", "21 days"]]
      },
      stats: [["642", "Frames delivered"], ["5", "Events"], ["4", "Crew on ground"]],
      words: { quote: "We stopped noticing you were there. Then the gallery arrived and we cried through all six hundred pictures.", who: "Anaya & Rohan" }
    },
    "meher-zain": {
      brief: {
        ask: "They wanted a wedding that felt like a long dinner.",
        text: "Forty guests, one shoreline, and no schedule to speak of. We worked like documentarians — barefoot processions, quiet duas, and a dance floor made of sand.",
        meta: [["Coverage", "Photography"], ["Venue", "Private beach house"], ["Delivered in", "16 days"]]
      },
      stats: [["380", "Frames delivered"], ["3", "Events"], ["2", "Crew on ground"]],
      words: { quote: "You photographed our nikah like it was a private thing you had been let into. Which is exactly what it was.", who: "Meher & Zain" }
    },
    "ishita-arjun": {
      brief: {
        ask: "Ishita wanted it to look like period cinema.",
        text: "Jaipur gave us sandstone, brass bands, and light that behaves like it studied art direction. We let the city set the palette and shot it a little formal, a little grand.",
        meta: [["Coverage", "Photo & film"], ["Venue", "Heritage palace"], ["Delivered in", "24 days"]]
      },
      stats: [["710", "Frames delivered"], ["6", "Events"], ["5", "Crew on ground"]],
      words: { quote: "Our families still argue about which frame goes above the stairs. That is the highest compliment we have.", who: "Ishita & Arjun" }
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
})();
