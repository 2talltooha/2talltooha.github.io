# Taha El Ghadi — portfolio

A single-page personal site: biology student who builds things for health.

Plain HTML, CSS and JavaScript. No build step, no npm packages. Hosts free on GitHub Pages at **https://2talltooha.github.io/**.

---

## Preview locally

Double-click `index.html`, or from this folder:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/

On your own computer you will see a yellow bar listing unfinished placeholders and empty picture slots. Visitors never see that bar. Add `?live` to the address to hide it; add `?slots` to force it on.

---

## Deploy on GitHub Pages

You need the [GitHub CLI](https://cli.github.com/) (`gh`) logged in as `2talltooha`, or you can do the same steps on github.com.

### 1. Create the repo (once)

The repo **must** be named exactly `2talltooha.github.io` for the site to live at the root URL.

```powershell
cd path\to\portfolio
git add .
git commit -m "Initial portfolio site"
gh repo create 2talltooha.github.io --public --source=. --remote=origin --push
```

If the repo already exists empty on GitHub:

```powershell
git remote add origin https://github.com/2talltooha/2talltooha.github.io.git
git push -u origin main
```

### 2. Turn on Pages

1. Open https://github.com/2talltooha/2talltooha.github.io/settings/pages
2. Under **Source**, choose **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Save. The site is usually live within a minute at https://2talltooha.github.io/

### 3. Update later

```powershell
git add .
git commit -m "Describe the change"
git push
```

No build. Push and wait for Pages to refresh.

---

## Edit content

### Projects (easy)

All featured projects and the smaller-tools grid live in **`data/projects.js`**.

1. Open that file.
2. Copy one whole `{ ... }` block inside `featured`.
3. Paste it where you want it (order in the file = order on the page).
4. Change `id` (lowercase letters, numbers, hyphens only). That becomes the deep link: `yoursite/#your-id`
5. Fill in title, hook, role, tags, links, case study.
6. Save and refresh.

Leave a link’s `url` as `""` to hide that button. Unfinished bits can be wrapped so they stay highlighted until you replace them.

Site-wide links at the top of the same file:

| Field | What it does |
| --- | --- |
| `site.resume` | Path to your PDF, e.g. `"assets/Taha-El-Ghadi-Resume.pdf"` |
| `site.devpost` | Your Devpost profile URL |
| `site.photo.src` | About photo, e.g. `"assets/img/about/taha.jpg"` |

### Experience, research, about, hackathons

Those sections are written in **`index.html`**. Search for the section id (`research`, `experience`, `hackathons`, `about`, `contact`) and edit the text. Yellow highlighted notes show what still needs a real answer.

Optional rows that are switched off (Emergency Department volunteer, TreeHacks 2027) sit inside HTML comments labelled `SWITCH`. Delete the two `SWITCH` lines around a row to show it.

### Pictures

| Slot | Size | Where |
| --- | --- | --- |
| Project card / gallery | 1600 × 1000 px (16:10), JPG or WebP under ~300 KB | `assets/img/projects/` then set `image.src` / `gallery` in `data/projects.js` |
| About photo | 800 × 1000 px (4:5), under ~200 KB | `assets/img/about/taha.jpg` then set `site.photo.src` |
| Link preview (Open Graph) | 1200 × 630 px | `assets/img/og-image.png` (regenerate with `node tools/make-icons.mjs`) |

Demo GIFs and short `.mp4` / `.webm` clips work in gallery slots (keep GIFs under ~3 MB).

### Résumé PDF

1. Export a PDF **without your phone number** (the site is public).
2. Save it as `assets/Taha-El-Ghadi-Resume.pdf`.
3. In `data/projects.js`, set `site.resume` to `"assets/Taha-El-Ghadi-Resume.pdf"`.

---

## Folder map

```
.
├── index.html          # page structure + static sections
├── 404.html
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── .nojekyll           # tell GitHub Pages not to run Jekyll
├── css/style.css
├── js/main.js          # renders projects + case-study panel
├── data/projects.js    # ← edit this to add projects
├── assets/
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── fonts/          # Source Serif 4 + IBM Plex Mono (OFL)
│   └── img/
│       ├── og-image.png
│       ├── projects/   # drop project photos here
│       └── about/      # drop the optional portrait here
└── tools/
    ├── make-trace.mjs  # regenerates the hero signal paths
    ├── make-icons.mjs  # regenerates favicon + OG image
    └── og-image.html
```

---

## Design notes

- Palette: paper `#FAF8F3`, ink `#1B1D1A`, muted `#5A5F58`, accent `#1F6F54` (bottle green).
- Type: Source Serif 4 for text, IBM Plex Mono for labels and tags (self-hosted, SIL Open Font License; licence texts sit in `assets/fonts/`).
- Case studies open in a panel with a shareable hash, e.g. `https://2talltooha.github.io/#stillwave`.
- The hero waveform is illustrative, not recorded data. Caption says so.

---

## Licence

Site content © Taha El Ghadi. Fonts: SIL Open Font License (see `assets/fonts/`).
