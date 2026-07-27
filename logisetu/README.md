# LogiSetu — Corporate Website

PHP corporate site for LogiSetu, built to the approved design preview, with a
WebGL (Three.js) logistics world running behind every hero and 3D replacements
for the flat diagrams in the original comps.

## Running it

Requires **PHP 8.0+**. No database, no Composer, no build step.

```bash
php -S localhost:8000 -t logisetu
```

Then open <http://localhost:8000>.

On XAMPP/WAMP, drop the `logisetu` folder into `htdocs/` and visit
`http://localhost/logisetu/`. Links resolve from `BASE_URL`, which detects the
subdirectory automatically.

### Running it without installing PHP

This machine has no native PHP, so `../.tools/serve.mjs` serves the site using
real PHP 8.3 compiled to WebAssembly (`@php-wasm/node`). The project folder is
mounted into the PHP filesystem, so `.php` edits apply without a restart.

```bash
node .tools/serve.mjs 8000      # run from the parent folder
```

This is a development convenience only — ship the site to a normal PHP host.
One behavioural difference to know about: `flock`/`LOCK_EX` is unsupported
under WASM, which is why `record_enquiry()` falls back to an unlocked append.

## Layout

```
logisetu/
├── index.php  about.php  solutions.php  network.php  insights.php  contact.php
├── includes/
│   ├── config.php      constants + BASE_URL detection
│   ├── content.php     every line of site copy (edit here, not in templates)
│   ├── functions.php   escaping, asset versioning, icon set, CSRF
│   ├── header.php  footer.php
│   └── components/     hero, section-head, feature-card, cta
├── handlers/
│   └── contact-submit.php   POST → validate → storage/enquiries.log → redirect
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── scene.js        lazily mounts each WebGL surface
│   │   ├── stage.js        renderer/camera/resize/RAF/label plumbing
│   │   ├── hero-scene.js   the container-yard hero world
│   │   ├── visuals.js      globe, demand cluster, phase bars
│   │   └── main.js         nav, scroll reveals, card tilt
│   └── vendor/three/       Three.js r160, vendored so the site works offline
└── storage/               enquiry log (not web-accessible)
```

## The hero film

The hero background is a rendered cinematic loop, generated with Higgsfield
(still: `nano_banana_pro`, motion: `kling3_0`) and stored in `assets/video/`:

| File | Size | Use |
|---|---|---|
| `hero.mp4` | 620 KB | 1284×716 loop, desktop |
| `hero-mobile.mp4` | 204 KB | 854×476, served under 860px via `<source media>` |
| `hero-poster.jpg` | 161 KB | Poster — covers first paint, reduced motion, blocked autoplay |

The source clip was 5s and did not loop cleanly (first and last frames differ),
so it is concatenated with a reversed copy to ping-pong — 10.08s, seamless, and
smaller than the 3.5 MB original after re-encoding at CRF 27.

Composition matters here: the left third of the frame is deliberately empty so
the headline has somewhere to sit. Keep that in mind if the film is ever
re-generated — `.hero--film .hero-veil` also carries a stronger scrim on that
side to hold text contrast.

`components/hero.php` falls back to the WebGL scene automatically if
`assets/video/hero.mp4` is absent, so both paths stay working.

Autoplay is not guaranteed (iOS Low Power Mode, data saver, enterprise policy),
so `main.js` retries on visibility change and first interaction, pauses the
film when it scrolls out of view, and leaves the poster in place under
`prefers-reduced-motion`.

## The 3D layer

`body[data-scene]` selects a hero preset, set per page in each template:

| Preset     | Page                 | Character                              |
|------------|----------------------|----------------------------------------|
| `yard`     | Home                 | Full container yard, cranes, traffic   |
| `terminal` | Solutions            | Dense stacks, camera pulled in close   |
| `corridor` | Insights             | Long freight corridor, faster traffic  |
| `grid`     | About, Contact       | Sparse and airy                        |
| `orbit`    | Network & Investment | Wire trade globe above the yard        |

Each hero scene layers a lit tarmac ground plane, instanced container stacks
(one draw call), gantry cranes, trucks with working headlamps, glowing trade
arcs, and drifting dust in exponential fog. The camera drifts forward
continuously, parallaxes with the pointer, and rises as you scroll.

In-page visuals replace the flat SVG diagrams:

- **Route globe** (Home, Network) — a real Earth with LogiSetu's multimodal
  freight network on it. Drag to spin. See below.
- **Demand cluster** (Home) — 3D nodes feeding an India-wide hub along curved
  connectors with travelling pulses. Drag to spin.
- **Phase bars** (About) — capacity build-out bars that grow on reveal.

Labels are HTML projected onto 3D positions each frame, so they stay crisp and
readable by screen readers.

### The route globe

Geography is real: `assets/img/earth-map.png` is generated from Natural Earth
data, so coastlines and country borders are accurate. It is styled to the site
palette rather than photographic, so the globe sits inside the design.

Four transport modes are drawn, each with its own colour, arc height and
travelling cargo marker, plus an on-canvas legend:

| Mode | Colour | Behaviour |
|---|---|---|
| Air Cargo | `#F1731F` | High arcs — Delhi/Mumbai ↔ Dubai ↔ London |
| Sea Freight | `#38BDF8` | Hugs the surface along real lanes — Nhava Sheva → Jebel Ali → Gulf of Aden → Suez → Gibraltar → Felixstowe |
| Rail Freight | `#A78BFA` | Dedicated Freight Corridor alignments, plus UK inland haul |
| Road Freight | `#34D399` | Expressway and trunk corridors in India, UAE and the UK |

Routes and hubs live in [`assets/js/routes.js`](assets/js/routes.js) as
`[lat, lon]` waypoints — edit those arrays to change what the globe shows.

Two implementation notes worth keeping if you touch this code:

- Tone mapping is **off** for the globe. Filmic tone mapping shifts each route
  away from its declared colour, which would break the legend's colour key.
- The halo tube renders `BackSide` only. Its near faces would otherwise blend
  additively over the opaque core line and shift it off-colour.

## Brand assets

The supplied logo artwork lives in `.tools/source/logisetu-logo.jpeg` and is
used **as provided** — not recomposed. `.tools/make-logo-assets.py` trims it,
keys the white background to transparency, and derives:

| File | Use |
|---|---|
| `logo-full.png` | Header and general use — the complete supplied lockup |
| `logo-full-light.png` | Footer — navy recoloured to white for the dark background, orange preserved |
| `logo-mark.png` | The bridge mark alone, used as a small decorative element |
| `favicon.png` | Browser tab |

Logo colours: navy `#011945`, orange `#F1731F`.

## Regenerating generated assets

```bash
python .tools/make-logo-assets.py     # logo variants + favicon
node   .tools/make-earth-texture.mjs  # Natural Earth TopoJSON -> ring list
python .tools/rasterise-earth.py      # ring list -> earth-map.png
```

### Performance and fallbacks

- Scenes mount only when scrolled near, and pause when off screen or the tab is
  hidden.
- Device pixel ratio capped at 1.75 (2 for the smaller in-page visuals).
- `prefers-reduced-motion` freezes all motion; scenes still render one frame.
- No WebGL: `body.no-webgl` is set, the hero falls back to its CSS gradient and
  the diagram panels are hidden. All content stays readable.

## Design tokens

Sampled from the approved comps and defined at the top of `style.css`:

| Token | Value | Use |
|---|---|---|
| `--gold` | `#C9A227` | Buttons, eyebrows, accents |
| `--gold-bright` | `#E4C55E` | Accents on navy |
| `--navy-900` | `#0A1A33` | Footer, deepest ground |
| `--navy-800` → `--navy-600` | `#0C203F` → `#1E355B` | Hero gradient |
| `--mist` | `#F7F8FB` | Alternating light sections |
| `--navy-ink` | `#0F2140` | Headings on light |

Typeface is **Inter** (400–800) via Google Fonts, with a system stack fallback.

## Contact form

Posts to `handlers/contact-submit.php`, which checks a CSRF token and a
honeypot field, validates, then appends the enquiry as one JSON line to
`storage/enquiries.log`. Success and error state come back via session flash.

To send email instead, replace the body of `record_enquiry()` in that handler
with your `mail()` or SMTP call.

## Editing content

All copy lives in `includes/content.php` as named constants — one per section.
Templates only lay it out, so wording changes never mean touching markup.
