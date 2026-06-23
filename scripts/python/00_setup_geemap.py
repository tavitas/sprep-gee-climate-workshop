"""
00_setup_geemap.py  —  One-time Python setup for Google Earth Engine
SPREP / UNEP GEE Climate Workshop 2026

The GEE Code Editor (JavaScript) needs nothing installed. To use Earth
Engine from PYTHON (e.g. in Google Colab or a Jupyter notebook), run the
steps below once. Colab is the easiest option for the workshop — it runs
in the browser with nothing to install on your laptop.

------------------------------------------------------------------
OPTION A — Google Colab (recommended, nothing to install)
------------------------------------------------------------------
1. Go to https://colab.research.google.com  and start a new notebook.
2. Paste and run the cell below.

OPTION B — Your own computer (Anaconda / pip)
------------------------------------------------------------------
    pip install earthengine-api geemap
Then run the same authenticate/initialize lines.
------------------------------------------------------------------
IMPORTANT: replace 'your-project-id' with the Cloud project you
registered during Exercise 1 (it looks like 'ee-yourname').
"""

# In Colab, geemap is usually pre-installed. If not, uncomment:
# !pip install -q geemap earthengine-api

import ee
import geemap

# First time only: opens a Google sign-in and pastes back a token.
ee.Authenticate()

# Connect to YOUR registered Cloud project (from Exercise 1).
ee.Initialize(project='your-project-id')   # <-- change me, e.g. 'ee-tavita'

print('Earth Engine is ready!')
print('Test value (should print a number):',
      ee.Number(40).add(2).getInfo())

# Quick interactive map test.
Map = geemap.Map(center=[-17.7, 178.0], zoom=6)   # centred on Fiji
Map.add_basemap('SATELLITE')
Map   # in a notebook this displays the map
