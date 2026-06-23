# Pacific Climate Data in Google Earth Engine

A hands-on training course for finding, processing and localizing global climate
datasets for Pacific Island nations using Google Earth Engine.

**SPREP / UNEP CIS-Pac5 — Regional Capacity Building on GIS & Data Management (2026).**

This repository is a [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
documentation site. Pushing to the `main` branch automatically builds and
publishes it to **GitHub Pages** via GitHub Actions.

---

## Publish it (one-time setup)

> Run these on **your own computer**, where you are signed in to GitHub.
> Replace `YOUR-GITHUB-USERNAME` with your GitHub username.

### 1. Point the site at your GitHub account

```bash
cd "sprep-gee-climate-workshop"
# macOS:
sed -i '' 's/YOUR-GITHUB-USERNAME/your-username/g' mkdocs.yml docs/course-details/downloads.md
# Linux:
# sed -i 's/YOUR-GITHUB-USERNAME/your-username/g' mkdocs.yml docs/course-details/downloads.md
```

### 2. Create the GitHub repo and push

Using the GitHub CLI (easiest):

```bash
git init
git add .
git commit -m "Initial commit: Pacific Climate GEE course site"
git branch -M main
gh repo create sprep-gee-climate-workshop --public --source=. --remote=origin --push
```

…or without the CLI: create an empty repo named `sprep-gee-climate-workshop` on
github.com, then:

```bash
git init
git add .
git commit -m "Initial commit: Pacific Climate GEE course site"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/sprep-gee-climate-workshop.git
git push -u origin main
```

### 3. Turn on GitHub Pages

On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions.**
The included workflow (`.github/workflows/deploy.yml`) builds and deploys on
every push to `main`.

Your site will be live at:
**https://YOUR-GITHUB-USERNAME.github.io/sprep-gee-climate-workshop/**

---

## Edit and preview locally

```bash
pip install -r requirements.txt
mkdocs serve      # live preview at http://127.0.0.1:8000
mkdocs build      # static site in ./site
```

## Repository layout

```
sprep-gee-climate-workshop/
├─ docs/                 # all course pages (Markdown)
│  ├─ index.md           # home
│  ├─ course-details/    # overview, navigation, downloads
│  ├─ datasets/          # what is GEE, themes, dataset reference
│  ├─ exercises/         # the five hands-on exercises
│  ├─ scripts/           # script reference pages (embed the real scripts)
│  ├─ resources/         # glossary, validation report
│  └─ downloads/         # slide deck + cheat sheet
├─ scripts/              # the actual JavaScript + Python scripts
│  ├─ javascript/
│  └─ python/
├─ .github/workflows/    # GitHub Pages deploy
├─ mkdocs.yml            # site configuration
└─ requirements.txt
```

The pages under `docs/scripts/` embed the files in `scripts/` directly, so the
code shown on the site always matches the downloadable scripts.

## Licence

Course content is shared for educational use by SPREP / UNEP CIS-Pac5. Climate
datasets remain under their original providers' terms (all free for
noncommercial use).
