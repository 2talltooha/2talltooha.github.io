/*
  SITE DATA
  ---------
  The "Projects" section is built from this file, and so are the résumé and
  Devpost links. Edit the text here, save and refresh the page. You never need
  to touch index.html to add or change a project.

  HOW TO ADD A PROJECT
  1. Copy one whole { ... } block from `featured` below, including the comma
     after the closing brace. Paste it where you want it to appear (the order
     in this file is the order on the page) and change the text.
  2. Give it a new `id`: lowercase letters, numbers and hyphens only.
     The id becomes the direct link to the case study: yoursite/#your-id
  3. Save and refresh. If the page shows an error box instead of projects, a
     comma or a quote is missing near the line you just edited.

  FIELDS
    id          Unique, lowercase-with-hyphens. Do not reuse a section name
                (projects, research, experience, hackathons, about, contact).
    title       Project name.
    status      "shipped", "award" or "progress". Sets the badge style.
    statusLabel Optional badge text. Leave "" for Shipped / Award / In progress.
    context     Small line under the title: where, when, solo or team.
    hook        One sentence. This is what a skimming reader sees.
    role        What YOU did. Always fill this in, especially for team projects.
    tags        Tech tags. Four or five is plenty.
    links       Links on the card. A link with url: "" stays hidden until you
                paste the address in.
    image       Card picture. With src: "" nothing shows on the live site, and
                an empty labelled slot shows when you preview on your computer.
                Recommended: 1600 x 1000 px (16:10), JPG or WebP, under 300 KB.
    gallery     Pictures for the case study, same size as above. A demo GIF
                works (keep it under 3 MB), and so does an .mp4 or .webm clip.
                Up to three looks best.
    note        Optional highlighted box, shown on the card and in the case study.
    caseStudy   Four parts, each a list of paragraphs. A paragraph that starts
                with "- " becomes a bullet point.

  PLACEHOLDERS
    Anything written as [PLACEHOLDER: ...] shows up highlighted in yellow on
    the page. Replace each one with real text, or delete the sentence.

  QUOTES
    To put a double quote inside text, write \" (backslash, then the quote).
*/

window.PORTFOLIO = {
  /*
    SITE-WIDE LINKS
    Leave a value as "" and its links stay hidden on the page.
  */
  site: {
    // Put your résumé PDF in the assets folder, then write its path here,
    // for example "assets/Taha-El-Ghadi-Resume.pdf".
    resume: "",
    // The address of your Devpost profile, for example "https://devpost.com/yourname".
    devpost: "",
    // Optional photo for the About section. Save a portrait as
    // assets/img/about/taha.jpg (800 x 1000 px, under 200 KB) and write that path in src.
    photo: {
      src: "",
      alt: "Taha El Ghadi",
    },
  },

  featured: [
    /* ------------------------------------------------------------------ */
    {
      id: "stillwave",
      title: "Stillwave",
      status: "shipped",
      statusLabel: "",
      context: "Hack Western 13 · Nov 2026 · Solo",
      hook: "A bedside orb that tracks breathing during sleep with 60 GHz radar and flags possible pauses, with nothing to wear and no camera.",
      role: "Built solo: the wiring, ESP32 firmware, FastAPI server, detection logic, web dashboard and 3D-printed orb. It made it through all three judging rounds.",
      tags: ["ESP32", "60 GHz mmWave radar", "C++ (Arduino)", "Python", "FastAPI"],
      links: [
        { label: "GitHub", url: "https://github.com/2talltooha/stillwave" },
        { label: "Devpost", url: "" },
      ],
      image: {
        src: "",
        alt: "The Stillwave orb on a bedside table.",
      },
      gallery: [
        { src: "", alt: "", caption: "" },
      ],
      caseStudy: {
        problem: [
          "Checking someone's breathing overnight usually means wearing something, such as a chest belt, a nasal sensor or a watch, or pointing a camera at the bed. I wanted to see how much a small radar module on a nightstand could pick up with neither.",
        ],
        built: [
          "Stillwave is a bedside unit: an ESP32 reading a DFRobot C1001 60 GHz mmWave radar, inside an orb I designed and 3D-printed. A FastAPI server saves every session to CSV and streams breathing rate and sleep state to a live web dashboard over WebSockets.",
          "Ten minutes after I get up, it sends a short plain-language summary of the night to my phone. Gemini writes the summary under guardrails, so it describes the night and never diagnoses.",
          "I built it solo at Hack Western 13 in November 2026, and it made it through all three judging rounds.",
        ],
        how: [
          "The radar sits about a metre from the bed. From its readings the server labels each moment as nobody, moving, breathing or paused.",
          "My first plan was to rely on the radar's built-in sleep features, and testing ruled that out. Its breathing rate is a slow average, about one reading every 6 seconds, and it never dropped to zero during a breath hold. Its breathing-waveform output stayed flat and its apnea counter stayed at 0.",
          "What the data did show was a sharp drop in the rate around each hold. So Stillwave flags a \"breathing dip\" when the rate falls by 6 or more breaths per minute within 30 seconds while the person is lying still.",
        ],
        learned: [
          "In a 15-minute test on myself, the dip detector caught 8 of 8 deliberate breath holds, most of them 25 to 40 seconds long, with 1 false alarm. It has also tracked a full 6.5-hour night of real sleep.",
          "The limits matter more than the hit rate. All of the testing was informal and on one person. A normal slow-down in breathing looks the same as a hold, and the detector flags more when I'm awake and fidgeting, so a dip count is not an apnea count. Stillwave has not been compared against a reference sensor, and it is not a medical device.",
          "What I took from it: test what a sensor really outputs before designing around its listed features. The features I planned to rely on never fired, and the usable signal was somewhere else.",
        ],
      },
    },

    /* ------------------------------------------------------------------ */
    {
      id: "aegis",
      title: "Aegis",
      status: "award",
      statusLabel: "Market Master Award",
      context: "OpenClaw Hack Toronto · May 2026 · Team project",
      hook: "A medication support agent that lives in WhatsApp: a patient sends a photo of a medication or a text, and a caregiver sees the structured record on a dashboard.",
      role: "[PLACEHOLDER: what you personally built, for example the FastAPI and Twilio backend, the Claude vision step or the React dashboard. Add the team size.]",
      tags: ["FastAPI", "Twilio (WhatsApp)", "Claude vision", "SQLite", "React"],
      links: [
        { label: "Devpost", url: "" },
        { label: "GitHub", url: "" },
      ],
      image: {
        src: "",
        alt: "A WhatsApp conversation with Aegis next to the caregiver dashboard.",
      },
      gallery: [
        { src: "", alt: "", caption: "" },
      ],
      caseStudy: {
        problem: [
          "Aegis is meant to help seniors and their caregivers keep track of medications.",
          "[PLACEHOLDER: one or two sentences on the specific problem your team saw, and why you chose WhatsApp instead of a new app.]",
        ],
        built: [
          "Aegis is a care agent that lives in WhatsApp. A patient sends a photo of a medication or a text message. The system extracts the details, logs them and shows them as structured medication data on a caregiver dashboard.",
          "We built it as a team in one day at OpenClaw Hack Toronto in May 2026 and demoed it live to judges at Toronto Tech Week, where it won the Market Master Award.",
          "[PLACEHOLDER: \"My part was ...\" and the pieces you built yourself.]",
        ],
        how: [
          "WhatsApp messages reach a FastAPI backend through Twilio webhooks. Photos go to Claude's vision model, which reads the prescription details. The results are stored in SQLite and shown to the caregiver on a React dashboard.",
        ],
        learned: [
          "Aegis is a one-day hackathon prototype, not a product.",
          "[PLACEHOLDER: one thing you learned building it and its main limitation. For example: what happens when the model misreads a label, and whether it was ever tested with real patients.]",
        ],
      },
    },

    /* ------------------------------------------------------------------ */
    {
      id: "tremor-sensor",
      title: "Wearable tremor measurement device",
      status: "progress",
      statusLabel: "",
      context: "Self-directed · 2026 · Solo",
      hook: "An ESP32 wearable designed to measure tremor at rest, in posture and in motion, with validation planned against known-frequency vibration instead of human subjects.",
      role: "Solo: the hardware, the C++ firmware and the validation plan.",
      tags: ["ESP32", "MPU-6500 IMU", "OLED", "C++", "FFT"],
      links: [
        { label: "GitHub", url: "" },
      ],
      image: {
        src: "",
        alt: "The tremor device prototype: an ESP32, a motion sensor and an OLED display.",
      },
      gallery: [
        { src: "", alt: "", caption: "" },
      ],
      note: {
        label: "Method note",
        text: "Validation is planned against vibration sources of known frequency, not people. Research on human subjects needs ethics approval, so I make no claims about patients.",
      },
      caseStudy: {
        problem: [
          "Tremor is usually assessed by eye, with rating scales. A motion sensor can add a number: the dominant frequency, and how it changes between rest, holding a posture and moving. I wanted to find out whether a wearable built from hobby parts can measure that frequency accurately.",
        ],
        built: [
          "A wearable prototype. An ESP32 reads a 6-axis MPU-6500 inertial measurement unit and shows live readings on a small OLED display. It is designed to measure tremor in three conditions: at rest, while holding a posture and during movement (kinetic tremor).",
          "[PLACEHOLDER: where it is worn, how it is powered and what works today.]",
        ],
        how: [
          "The IMU measures acceleration and rotation on three axes each. An FFT (fast Fourier transform) turns a recording of that motion into a frequency spectrum, and the tallest peak is the dominant tremor frequency.",
          "[PLACEHOLDER: sampling rate, recording length and whether the FFT runs on the device or on a computer.]",
        ],
        learned: [
          "Validation is planned, not finished. The plan is to run the device against vibration sources of known frequency, compare the measured peak with the true value and report the error.",
          "[PLACEHOLDER: which vibration sources and frequencies. Add the results once you have them.]",
          "I'm not testing it on people. Research on human subjects needs ethics approval, so everything this project can show is about the instrument, not about patients.",
          "Limits I already know about: a bench source vibrates at one clean frequency and a real tremor does not. Nothing here says whether the device would be useful in a clinic.",
        ],
      },
    },

    /* ------------------------------------------------------------------ */
    {
      id: "rnaseq-reanalysis",
      title: "RNA-seq reanalysis",
      status: "progress",
      statusLabel: "",
      context: "Self-directed · Solo",
      hook: "Rerunning the differential expression analysis of a public bulk RNA-seq dataset with DESeq2, then comparing my results with the original paper's.",
      role: "Solo. Dataset: [PLACEHOLDER: GEO accession]. Paper: [PLACEHOLDER: first author, journal, year].",
      tags: ["R", "DESeq2", "Bulk RNA-seq"],
      links: [
        { label: "GitHub", url: "" },
        { label: "Dataset", url: "" },
        { label: "Paper", url: "" },
      ],
      image: {
        src: "",
        alt: "",
      },
      gallery: [
        { src: "", alt: "", caption: "" },
      ],
      caseStudy: {
        problem: [
          "Differential expression results depend on analysis choices: how counts are filtered and normalized, what the model includes and where the significance cut-offs sit. I want to learn the method properly, and the most honest way I can think of is to repeat a published analysis and see whether I get the same answer.",
        ],
        built: [
          "This project is in progress.",
          "[PLACEHOLDER: the dataset, what it compares and the paper it comes from.]",
          "The repository will hold the code, a comparison with the paper's reported results and a limitations section.",
        ],
        how: [
          "The plan: start from the public data, run differential expression with DESeq2 in R, then line my results up against the paper's. Which genes are called significant, in which direction and by how much.",
          "[PLACEHOLDER: whether you start from raw reads or from the deposited count matrix.]",
        ],
        learned: [
          "[PLACEHOLDER: what is done so far, or \"No results yet.\"]",
          "When it's finished, this section will say how closely my results match the paper's, where they differ and what I think explains the difference.",
          "Limits I can state now: I'm working from someone else's deposited data, so I can't check anything upstream of it. And one reanalysis by a second-year student is a learning exercise, not a replication study.",
        ],
      },
    },

    /* ------------------------------------------------------------------ */
    {
      id: "localjobscout",
      title: "LocalJobScout CLI",
      status: "shipped",
      statusLabel: "",
      context: "Personal tool · 2026 · Solo",
      hook: "A Python command-line tool that scrapes job boards, scores each posting against my résumé and drafts cover letters that are checked for claims my résumé doesn't support.",
      role: "Solo: the scrapers, the scoring, the cover-letter validator and a 577-test suite.",
      tags: ["Python", "TF-IDF", "SQLite", "Playwright", "pytest"],
      links: [
        { label: "GitHub", url: "https://github.com/2talltooha/localjobscout-cli" },
      ],
      image: {
        src: "",
        alt: "LocalJobScout in a terminal, showing a ranked list of job postings.",
      },
      gallery: [
        { src: "", alt: "", caption: "" },
      ],
      caseStudy: {
        problem: [
          "Entry-level research, lab and clinical postings around Waterloo are spread over national job boards, university career pages and hospital sites. I wanted one ranked list instead of a dozen tabs.",
          "I also wanted help drafting cover letters without the draft claiming experience I don't have.",
        ],
        built: [
          "A command-line tool with scrapers for 13 job boards. It runs on a schedule, removes duplicates, filters out postings I can't apply for and scores the rest against my résumé. Strong matches trigger a desktop notification. It drafts a tailored cover letter for any posting and tracks what I've applied to, all in a SQLite database on my own machine.",
          "Scoring and cover-letter rules are configurable per job category. The public version ships with four: general development, lab and research, retail and service, and admin.",
        ],
        how: [
          "Each source has its own scraper, and every scraper checks robots.txt and waits between requests. New postings pass through filters for province, seniority and required years of experience.",
          "Each remaining posting is scored against my résumé with TF-IDF cosine similarity, plus a boost for focus keywords. With an API key, a Claude model adds a suitability score from 0 to 1 and a one-sentence reason.",
          "Cover letters come from a template or from Claude. Either way, a validator checks the letter against a list of claims my résumé doesn't support, such as a certification or lab experience I don't have, and flags them before I read the draft.",
        ],
        learned: [
          "The test suite has 577 tests. The scraper tests run against saved HTML fixtures instead of live sites.",
          "Limits: a scraper breaks whenever its site changes its HTML. LinkedIn and Indeed often block automated requests, and then the tool returns nothing for them. TF-IDF matches words, not meaning, so a posting that describes my skills in different words scores low. And the validator only catches the kinds of claims on its list. It reduces invented qualifications. It can't rule them out.",
          "The idea I'd reuse elsewhere: check generated text against a source of truth before a person reads it.",
        ],
      },
    },
  ],

  /*
    SMALLER TOOLS
    The compact grid under the featured projects. These have no case study.
    Fields: title, text, tags, link (url: "" hides the link).
  */
  smallTools: [
    {
      title: "TicketScout",
      text: "Watches resale prices for one World Cup match through the SeatGeek API, converts them to all-in Canadian dollars and alerts me by desktop notification, sound and phone push when the cheapest ticket drops below my target. It only monitors. I buy by hand.",
      tags: ["Python", "SeatGeek API", "SQLite"],
      link: { label: "GitHub", url: "" },
    },
    {
      title: "StudyLock",
      text: "Started as a Windows app that closes distracting programs until I finish a study task. StudyLock adds my phone: opening a distracting app there pings the PC, which escalates from a warning to an alarm to a timed lock.",
      tags: ["Python", "Windows", "iOS Shortcuts"],
      link: { label: "GitHub", url: "" },
    },
    {
      title: "CourseLink tracker",
      text: "A Chrome extension that pulls my assignments, quizzes and calendar events from CourseLink, Guelph's D2L site, into one dashboard. It reminds me 24 hours and 3 hours before each deadline and exports to my calendar. No backend: the data stays in my browser.",
      tags: ["JavaScript", "Chrome extension", "Brightspace API"],
      link: { label: "GitHub", url: "" },
    },
    {
      title: "StickyNotesApp",
      text: "A frameless checklist widget for Windows that shows only when the desktop is in view and hides when I switch to another app. Standard-library Python, so there are no packages to install.",
      tags: ["Python", "tkinter"],
      link: { label: "GitHub", url: "https://github.com/2talltooha/stickynoteapp" },
    },
  ],
};
