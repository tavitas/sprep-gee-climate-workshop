# What is Google Colab?

**Google Colab** (Colaboratory) is a free service that runs **Python notebooks
in your browser** on Google's servers — nothing to install on your laptop. A
notebook mixes runnable code cells with notes and outputs (maps, charts,
tables), so it is an excellent way to run the **Python / geemap** versions of
this workshop's scripts.

You have two ways to do every exercise in this course:

| Path | Where it runs | Best for |
|------|---------------|----------|
| **JavaScript** | [Earth Engine Code Editor](https://code.earthengine.google.com) | The main workshop path — nothing to install |
| **Python (geemap)** | **Google Colab** (this section) | Notebooks, reproducible analysis, joining Earth Engine with `pandas` / `matplotlib`, and automation |

Both paths use the **same datasets** and the **same country selector**, and
produce the same maps. The Python versions also save charts as **PNG files** you
can download.

## Why use Colab for this workshop?

- **Nothing to install** — it runs in the browser, like the Code Editor.
- **geemap is pre-installed** in Colab, so the Earth Engine map tools work out of
  the box.
- **Reproducible** — your notebook keeps the code, the map and the chart together,
  ready to re-run or share.
- **A stepping stone** — once you are comfortable here, the same code runs in
  Jupyter on your own computer, or in an automated pipeline.

## How it fits with the rest of the workshop

```
Exercise 1  →  create your Earth Engine account + Cloud project   (required first)
      │
      ├─ JavaScript path →  Code Editor  →  Exercises 2–6
      │
      └─ Python path      →  Google Colab  →  the same scripts, in Python
```

!!! warning "You still need Exercise 1 first"
    Colab talks to Earth Engine through **your** registered Google Cloud project.
    Finish [Exercise 1 — Set up your account](../exercises/account-setup.md)
    first and keep your project ID handy (it looks like `ee-yourname`).

**Next:** [Set up Colab & Earth Engine →](setup.md)
