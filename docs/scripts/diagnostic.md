# Live diagnostic check

Run this **once** after you sign in (see [Exercise 1](../exercises/account-setup.md))
to confirm, live in your own account, that:

- **(A)** which Pacific country names exist as polygons in `LSIB_SIMPLE`, and
- **(B)** every climate dataset used in the course loads correctly.

Paste the whole script into the
[Earth Engine Code Editor](https://code.earthengine.google.com) and click
**Run**. Read the results in the **Console**. Nothing is exported or changed —
it only prints.

!!! tip "Facilitators"
    Run this before a workshop. All 14 SPREP member countries should report
    **1 feature** (every name is verified to exist in `LSIB_SIMPLE`). The scripts
    still use a point + buffer for small / atoll nations because the LSIB polygon
    is too coarse for the climate grids — that is by design, not an error. Every
    band list in section (B) should also print.

```javascript title="99_diagnostic_check.js"
--8<-- "scripts/javascript/99_diagnostic_check.js"
```
