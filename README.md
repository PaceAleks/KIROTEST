# KIROTEST — Activity Suggester

A tiny web app that suggests things to do when you're bored. It pulls activities
from the [Bored API](https://bored-api.appbrewery.com) and lets you filter by
category, number of participants, and budget.

## Features

- **Random suggestions** — one click gives you a fresh activity idea.
- **Filters** — narrow results by category, participant count, and max budget.
- **Details at a glance** — type, people, cost, duration, kid-friendliness, and accessibility shown as chips.
- **Recent history** — keeps your last 5 suggestions.
- **No build step** — plain HTML, CSS, and JavaScript.

## Run it

Because it's static, just serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

Or enable **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root)
to host it live.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and filter controls |
| `styles.css` | Styling (dark theme) |
| `app.js` | Fetches from the Bored API and renders results |

Activities courtesy of [bored-api.appbrewery.com](https://bored-api.appbrewery.com).
