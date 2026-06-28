# Pacific Climate Data in Google Earth Engine

A hands-on training course that takes GIS and data officers in Pacific Island
countries from creating their first Google Earth Engine account to producing a
localized climate map for **their own country** — Samoa, Fiji, Tonga, Cook
Islands, Palau, the Marshall Islands, Niue, Tuvalu, Kiribati and the rest of
the Pacific.

> **SPREP / UNEP CIS-Pac5 — Regional Capacity Building on GIS & Data Management (2026)**

---

## What this course covers

Google Earth Engine puts decades of free satellite and climate data on Google's
servers — ready to analyse from your browser, with no large downloads and no
powerful computer required. By the end of the course you can sign in, find a
dataset, clip it to your country, map it, chart change over decades, and export
the result for use in QGIS or ArcGIS.

The course focuses on the four climate themes that matter most for Pacific
contexts:

| Theme | What you map | Main dataset |
|-------|--------------|--------------|
| Rainfall & drought | Long-term rainfall and dry-year signals | GPM IMERG |
| Temperature & heat | Where heat sits + the warming trend | ERA5, MODIS |
| Ocean & reefs | Sea-surface temperature & bleaching heat stress | NOAA OISST |
| Sea level & coast | Low-lying land exposed to sea-level rise | NASADEM, JRC Water |

**Time required:** ~2.5–3 hours for the five exercises, or one workshop day with
discussion and your own data. No programming experience is assumed.

---

## The course site

The published course lives at
**[tavitas.github.io/sprep-gee-climate-workshop](https://tavitas.github.io/sprep-gee-climate-workshop/)**
and is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

| Section | What you'll find |
|---------|------------------|
| [Home](https://tavitas.github.io/sprep-gee-climate-workshop/) | Course overview, the four themes, where to start |
| [Course details](https://tavitas.github.io/sprep-gee-climate-workshop/course-details/overview/) | Overview, navigation guide, slide deck & cheat sheet |
| [Climate datasets](https://tavitas.github.io/sprep-gee-climate-workshop/datasets/what-is-gee/) | What GEE is, the themes, and a dataset quick-reference |
| [Exercises](https://tavitas.github.io/sprep-gee-climate-workshop/exercises/account-setup/) | Five hands-on activities, building step by step |
| [Scripts & code](https://tavitas.github.io/sprep-gee-climate-workshop/scripts/) | Every script, in JavaScript and Python, ready to copy |
| [Resources](https://tavitas.github.io/sprep-gee-climate-workshop/resources/glossary/) | Glossary and a validation report |

---

## Repository layout

```
sprep-gee-climate-workshop/
├─ docs/                   # all course pages (Markdown)
│  ├─ index.md             # home
│  ├─ course-details/      # overview, navigation, downloads
│  ├─ datasets/            # what is GEE, themes, dataset reference
│  ├─ exercises/           # the five hands-on exercises
│  ├─ scripts/             # script reference pages (embed the real scripts)
│  ├─ resources/           # glossary, validation report
│  └─ downloads/           # slide deck + cheat sheet (PDF, PPTX)
├─ scripts/                # the actual JavaScript + Python scripts
│  ├─ javascript/          # 00 helpers + 4 theme scripts + 99 diagnostic check
│  └─ python/              # paired Python / geemap versions
├─ .github/workflows/      # GitHub Pages deploy
├─ mkdocs.yml              # site configuration
└─ requirements.txt
```

The pages under `docs/scripts/` embed the files in `scripts/` directly using
PyMdown snippets, so the code shown on the site **always matches the
downloadable scripts**.

---

## Local preview

```bash
pip install -r requirements.txt
mkdocs serve      # live preview at http://127.0.0.1:8000
mkdocs build      # static site in ./site
```

## Publish to your own GitHub Pages

Pushing to the `main` branch automatically builds and publishes the site via
GitHub Actions.

```bash
# 1. Point the site at your GitHub account
# macOS:
sed -i '' 's/YOUR-GITHUB-USERNAME/your-username/g' mkdocs.yml docs/course-details/downloads.md
# Linux:
# sed -i 's/YOUR-GITHUB-USERNAME/your-username/g' mkdocs.yml docs/course-details/downloads.md

# 2. Create the repo and push
git init
git add .
git commit -m "Initial commit: Pacific Climate GEE course site"
git branch -M main
gh repo create sprep-gee-climate-workshop --public --source=. --remote=origin --push

# 3. On GitHub: Settings → Pages → Build and deployment → Source: GitHub Actions
```

Your site will be live at
**`https://YOUR-GITHUB-USERNAME.github.io/sprep-gee-climate-workshop/`**.

---

## Acknowledgements

Built for SPREP and the UNEP CIS-Pac5 programme. Climate datasets are provided
free of charge by their producers — the UCSB Climate Hazards Center, ECMWF /
Copernicus, NASA, NOAA, EC JRC and the US Department of State — via the Google
Earth Engine Data Catalog. Earth Engine is free for research, education and
noncommercial use.

## Licence

Course content is shared for educational use by SPREP / UNEP CIS-Pac5. Climate
datasets remain under their original providers' terms.
