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
    Run this before a workshop. If a country shows **0 features**, it is not in
    `LSIB_SIMPLE` — the scripts already use a point + buffer for those, so no
    action is needed unless you want to add a new nation.

```javascript title="99_diagnostic_check.js"
--8<-- "scripts/javascript/99_diagnostic_check.js"
```
