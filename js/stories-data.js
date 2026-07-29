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
        { label: "Bride portrait, golden hour", img: U("1587271315307-eaebc181c749"), wide: false },
        { label: "Baraat energy on the bandstand", img: U("1597157639073-69284dc0fdaf"), wide: false },
        { label: "Pheras by the sea", img: U("1587271636175-90d58cdad458", 1600), wide: true },
        { label: "Mangalsutra moment", img: U("1621801306185-8c0ccf9c8eb8"), wide: false },
        { label: "First look, corridor light", img: U("1537633552985-df8429e8048b"), wide: false },
        { label: "Vidaai, held together", img: U("1599462616558-2b75fd26a283", 1600), wide: true }
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
        { label: "Couple at the waterline", img: U("1460364157752-926555421a7e", 1600), wide: true },
        { label: "Nikah at dusk", img: U("1591604466107-ec97de577aff"), wide: false },
        { label: "Mehndi detail, sea breeze", img: U("1505932794465-147d1f1b2c97"), wide: false },
        { label: "Dinner under string lights", img: U("1519225421980-715cb0215aed", 1600), wide: true }
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
        { label: "Palace facade, first light", img: U("1727430256509-0f897d6f4765", 1600), wide: true },
        { label: "Bridal portrait, jharokha", img: U("1610173827043-9db50e0d8ef9"), wide: false },
        { label: "Sangeet courtyard", img: U("1502635385003-ee1e6a1a742d"), wide: false },
        { label: "Couple portrait, sunrise", img: U("1519671482749-fd09be7ccebf"), wide: false },
        { label: "Pheras under the canopy", img: U("1665960213508-48f07086d49c"), wide: false },
        { label: "Farewell arch, marigold", img: U("1587271636175-90d58cdad458", 1600), wide: true }
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
        { label: "Stage wide, sangeet night", img: U("1494955870715-979ca4f13bf0", 1600), wide: true },
        { label: "Couple entry, sparklers", img: U("1722952934708-749c22eb2e58"), wide: false },
        { label: "Choreography mid-air", img: U("1529636798458-92182e662485"), wide: false },
        { label: "Skyline pheras", img: U("1583939003579-730e3918a45a", 1600), wide: true }
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
        { label: "Haldi hands, mid-throw", img: U("1634693343333-9b6013c30d57"), wide: false },
        { label: "Yellow, everywhere", img: U("1681717075175-19feb7a6f664"), wide: false },
        { label: "Mango-tree mandap", img: U("1727430256509-0f897d6f4765", 1600), wide: true },
        { label: "Lawn lunch, long table", img: U("1525772764200-be829a350797"), wide: false },
        { label: "Couple, golden field", img: U("1735052712464-9d24b69be5f5"), wide: false }
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
        { label: "Boat entry, Lake Pichola", img: U("1537633552985-df8429e8048b", 1600), wide: true },
        { label: "Bride, ghat steps", img: U("1587271315307-eaebc181c749"), wide: false },
        { label: "Blue-hour couple portrait", img: U("1515934751635-c81c6bc9a2d8"), wide: false },
        { label: "Jaimala, lakeside", img: U("1583939003579-730e3918a45a", 1600), wide: true }
      ],
      film: "https://www.youtube.com/watch?v=Pm3NfZDC48k"
    }
  ];
})();
