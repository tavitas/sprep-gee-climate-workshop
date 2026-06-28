# AI assistant (Ask)

The Earth Engine Code Editor has a built-in **AI assistant**, powered by Google
**Gemini**, in the **Ask** tab on the right (next to *Inspector*, *Console* and
*Tasks*). It "uses Gemini to assist you with **writing, understanding, debugging,
and optimizing** your scripts" — so you can describe what you want in plain
English and get ready-to-run Earth Engine code.

For a workshop like this, that **lowers the barrier to entry** enormously: you
can ask for a map, ask *why* a line of code does what it does, or paste an error
and ask for a fix — all without leaving the Code Editor.

!!! warning "Always review and test the code"
    Google's own note: *"The AI assistant is still learning and may occasionally
    provide incorrect or unexpected responses. Always review and test any code or
    advice provided before relying on it."* See [Using Ask **with** this
    workshop](#using-ask-with-this-workshop) below — the assistant doesn't know
    our specific dataset choices unless you tell it.

## What it can do

- **Generate scripts** from a natural-language description.
- **Modify / refactor** an existing script (e.g. *"give me the same map but
  export it as a PNG"*).
- **Explain** what a block of code or an Earth Engine method does.
- **Debug** — fix runtime errors and logic problems. When a script fails, the
  assistant can pull in the **console error message and your script context** to
  diagnose it faster.

## One-time setup — add a Gemini API key

The Ask assistant runs on the **Gemini API**, so it needs your own free API key.

1. Go to **[Google AI Studio](https://aistudio.google.com/)** and click
   **Get API key** → create a key (a free tier is available).
2. In the Code Editor's **Ask** tab, click the **:material-key: key icon** in the
   chat box, paste your key, and (optionally) save it for future sessions.

!!! danger "Keep your API key private"
    Google's warning: *"Keep your API key secure. If compromised, others can use
    your project's quota, incur charges (if billing is enabled), and access
    private data."* Never paste your key into a shared script or screenshot.

## How to use it

1. Click the **Ask** tab in the right panel.
2. Type a request in the box and send it. The assistant automatically includes
   your **current script, imported assets, geometries and the conversation so
   far** as context.
3. Keep going with **follow-ups** ("now clip it to Fiji", "add a legend").
4. Use **:material-plus: New chat** to start fresh and clear the history.

### Models and Tools

- **Model selector** — pick a Gemini model from the dropdown (which models you
  see depends on your API key tier); your choice is remembered.
- **Tools** (optional — they add context but use more tokens):
    - **Docs** — searches the official Earth Engine documentation.
    - **Dataset search** — queries the Earth Engine Data Catalog.
    - **Google Search** — grounds answers in the web (can't be combined with Docs
      or Dataset search).

A **token counter** shows how much of your Gemini quota the session has used.

## Writing good prompts

Be **specific** — name the dataset, the place, the time period, the processing
and the output you want. Vague prompts give vague code.

| Instead of… | Try… |
|---|---|
| "map rainfall for my country" | "Map mean annual rainfall for **Tuvalu** from **GPM IMERG monthly** (`NASA/GPM_L3/IMERG_MONTHLY_V07`), averaged **2001–2020**, and add a legend." |
| "fix my script" | (run it first, then) "**Fix the error in the Console** and explain what was wrong." |
| "add an export" | "Add an `Export.image.toDrive` for this layer at 30 m, with a description that has **no spaces**." |

## Using Ask *with* this workshop

The assistant is a general Earth Engine helper — it **doesn't know the specific
choices** we made in this course. Left to itself it may, for example, reach for
**CHIRPS** (which has data holes at Palau/Tokelau) instead of **IMERG**, or use a
country name like `Cook Islands` instead of the exact LSIB spelling `Cook Is`.

Get the best of both by combining them:

- **Start from our verified [scripts](javascript.md)** for the dataset choices,
  the country selector and the unit conversions, and use **Ask to adapt them** —
  change the country, add a chart, change the palette, export a PNG.
- **Tell Ask the dataset to use** (e.g. "use IMERG, not CHIRPS") so its code
  matches the workshop.
- **Cross-check** any AI-generated dataset IDs, band names and country names
  against the [Dataset quick reference](../datasets/reference.md) and
  [Code Editor basics](../exercises/code-editor.md), and **run the
  [diagnostic check](diagnostic.md)** to confirm everything loads.

!!! tip "A great first thing to ask"
    Paste one of our scripts into the editor, then ask Ask:
    *"Explain what this script does, line by line."* It's one of the fastest ways
    to learn what the code is doing.

## Cost, quota and privacy

- The assistant bills against your **Gemini API** key: a **free tier** is
  available, and a **paid tier** charges by usage (independent of your free Earth
  Engine registration). Check your tier, usage and limits — and set a **monthly
  spend cap** — in the AI Studio interface.
- Your prompts are handled under the **Gemini API Terms of Service**.

## Resources
- [AI assistant in the Earth Engine Code Editor (official guide)](https://developers.google.com/earth-engine/guides/code_editor_assistant)
- [Earth Engine Code Editor guide](https://developers.google.com/earth-engine/guides/playground)
- [Google AI Studio (get an API key)](https://aistudio.google.com/)
