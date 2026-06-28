# Set up Colab & Earth Engine

This one-time setup connects a Google Colab notebook to **your** Earth Engine
Cloud project. It takes about 5 minutes. Do it once at the start of each Colab
session.

!!! note "Before you start"
    Finish [Exercise 1 — Set up your account](../exercises/account-setup.md) so
    you have an Earth Engine account and a **Cloud project** (it looks like
    `ee-yourname`). You will paste that project ID in **Step 4**.

## Step 1 — Open a new notebook
1. Go to **[colab.research.google.com](https://colab.research.google.com)** and
   sign in with the **same Google account** you registered for Earth Engine.
2. Choose **File → New notebook**.
3. Rename it (top-left), e.g. `gee-workshop`.

A notebook is a list of **cells**. Type code into a cell and press
**Shift + Enter** (or click :material-play:) to run it.

## Step 2 — Get geemap (already there)
`geemap` and the Earth Engine API come **pre-installed** in Colab, so usually
there is nothing to do. To make sure you have the latest version, run this in a
cell:
```python
%pip install -U geemap
```
If it installs an update, choose **Runtime → Restart session** once, then carry on.

## Step 3 — Import the libraries
```python
import ee
import geemap
```

## Step 4 — Authenticate and connect to your project
Run this cell. The first time, it opens a Google sign-in link — click it, allow
access, and paste the code back when prompted.
```python
# First time per session: opens a Google sign-in.
ee.Authenticate()

# Connect to YOUR Cloud project from Exercise 1 (change the id!).
ee.Initialize(project='ee-yourname')   # <-- replace with your project id

print('Earth Engine is ready!')
print('Test value (should print 42):', ee.Number(40).add(2).getInfo())
```

!!! danger "Use your own project id"
    `ee-yourname` is a placeholder. If you get a *"Caller does not have
    permission to use project…"* error, the project id is wrong, or you signed
    in to Colab with a different Google account than the one you registered for
    Earth Engine.

## Step 5 — Test the map
```python
Map = geemap.Map(center=[-17.7, 178.0], zoom=6)   # centred on Fiji
Map.add_basemap('SATELLITE')
Map   # displays the interactive map
```
You should see an interactive satellite map. If you do, **you're set** — go on
to [Run the workshop scripts](run-scripts.md).

---

## The whole setup, as one script

This is `00_setup_geemap.py` — paste it into a cell and run it (after changing
the project id):

```python title="00_setup_geemap.py"
--8<-- "scripts/python/00_setup_geemap.py"
```

??? tip "Optional: skip the sign-in every time (EARTHENGINE_TOKEN)"
    Re-typing the sign-in each session is tedious. With **geemap 0.29.3+** you can
    store your Earth Engine token as a Colab **Secret** so it authenticates
    automatically:

    1. After authenticating once, get your token from the file
       `~/.config/earthengine/credentials`.
    2. In Colab, open the **:material-key: Secrets** panel (left sidebar),
       add a secret named **`EARTHENGINE_TOKEN`**, paste the token as the value,
       and enable **Notebook access**.
    3. New notebooks then initialise without the sign-in prompt.

## Resources
- [geemap — official site & notebooks](https://geemap.org)
- [Get started with Earth Engine for Python](https://developers.google.com/earth-engine/guides/quickstart_python)
- [Earth Engine authentication guide](https://developers.google.com/earth-engine/guides/auth)
- [Geospatial Data Science with Earth Engine and geemap (free book)](https://book.geemap.org)

**Next:** [Run the workshop scripts in Colab →](run-scripts.md)
