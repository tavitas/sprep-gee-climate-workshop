# Run the workshop scripts in Colab

Once your notebook is [set up](setup.md), you can run any of the Python versions
of the workshop scripts. They produce the **same maps** as the JavaScript
versions, plus **saved PNG charts**.

## Step 1 — Load the shared country selector
Scripts `01`–`05` import a small helper, `_pacific_aoi.py`, that turns a
friendly country name into the right map area. Get it into your Colab session in
**one line** — run this in a cell:
```python
!wget -q https://raw.githubusercontent.com/tavitas/sprep-gee-climate-workshop/main/scripts/python/_pacific_aoi.py
```
??? note "Prefer to upload it by hand?"
    Open the **:material-folder: Files** panel (left sidebar) → **Upload**, and
    upload `_pacific_aoi.py` from the
    [downloads](../course-details/downloads.md) / the `scripts/python/` folder.
    It must sit next to your notebook for `import` to find it.

Check it loaded:
```python
from _pacific_aoi import get_country, get_outline
print('Helper loaded ✔')
```

## Step 2 — Paste and run a script
1. Open the [Python scripts page](../scripts/python.md) and copy a script — for
   example **`05_coral_reefs_aca.py`**.
2. Paste it into a new cell.
3. Change **one line** — the project id — to your own:
   ```python
   ee.Initialize(project='ee-yourname')   # <-- your project from Exercise 1
   ```
4. Set `COUNTRY` to your nation (use the **friendly name** — the selector
   handles the spelling):
   ```python
   COUNTRY = 'Cook Islands'   # or 'Fiji', 'Solomon Islands', 'Tuvalu', ...
   ```
5. Run the cell (**Shift + Enter**).

!!! tip "Friendly names work here"
    Unlike the simplified Code-Editor snippets in the exercises, the Python
    scripts use the built-in selector, so `'Cook Islands'`, `'Solomon Islands'`
    and `'Marshall Islands'` all work — no need for the exact LSIB spelling.

## Step 3 — See your results
- **Interactive map:** the `Map` object displays inline at the bottom of the cell.
- **Charts:** each script saves a PNG (e.g. `Fiji_coral_habitat.png`) into the
  session. Find it in the **:material-folder: Files** panel and download it
  (right-click → Download).
- **Numbers:** printed under the cell (e.g. coral habitat area in km²).

## Step 4 — (Optional) export a GeoTIFF to Google Drive
The scripts include an `ee.batch.Export.image.toDrive(...)` block. Running it
starts a task; open the **Tasks** panel at
[code.earthengine.google.com](https://code.earthengine.google.com) to watch it
finish. The GeoTIFF lands in your Google Drive `GEE_Workshop_2026` folder, ready
for **QGIS** or **ArcGIS**.

## Order to try them

| Script | Theme | Exercise |
|--------|-------|:--------:|
| `05_coral_reefs_aca.py` | Coral reef habitats | [3](../exercises/coral-reefs.md) |
| `01_rainfall_chirps.py` | Rainfall & drought | [4](../exercises/rainfall.md) |
| `02_temperature_era5_modis.py` | Temperature & heat | [5](../exercises/temperature.md) |
| `03_sst_reef_heat.py` | Ocean & SST | [6](../exercises/ocean-coast.md) |
| `04_coastal_exposure.py` | Sea level & coast | [6](../exercises/ocean-coast.md) |

!!! note "Keep all the files together"
    `_pacific_aoi.py` must be in the session for `01`–`05` to import it. If you
    **Runtime → Disconnect** or start a fresh notebook, re-run Step 1.

**See also:** the full [Python scripts](../scripts/python.md), and the
[live diagnostic check](../scripts/diagnostic.md) to confirm every dataset loads
in your account.
