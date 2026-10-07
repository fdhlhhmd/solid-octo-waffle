# Petal Habits

A cute, pink-and-white daily habit tracker. Tick off your habits, build streaks, and watch a flower grow in your garden every day you finish them all.

It's plain HTML, CSS and JavaScript with no build step, no framework and no backend.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup, the SVG icon sprite and the mascot. |
| `style.css` | All styling: design tokens for light and dark themes, desktop and mobile layouts, animations. |
| `script.js` | All behaviour: state and storage, habits, streaks, garden drawing, log grid, theme toggle, dialogs. |

Keep the three files in the same folder.

## Features

**Daily habits**
- Add, tick off and delete habits. Deleting asks for confirmation in a custom dialog.
- Pick an icon for each habit from nine line icons: droplet, leaf, book, moon, heart, coffee, music, star and sun.
- Each habit shows its own streak with a flame icon.
- A striped progress bar and a bunny mascot react to how much you've finished today. The mascot smiles wider as the day fills up.

**Streaks and stats**
- *Day streak*: consecutive days on which you completed every habit.
- *Best streak*: your longest run of perfect days.
- *Flowers*: the total number of perfect days.

**Garden**
- Every perfect day grows one flower. Flowers vary in colour and height, and the newest one grows in with an animation.
- Today's plant grows as you tick habits: a seed mound, then a sprout, then a bud at half done, then a full bloom.
- The garden shows your most recent flowers, about 75 on desktop and 35 on mobile.

**Log grid**
- A GitHub-style contribution grid covering the last 26 weeks (weeks as columns, Sunday to Saturday as rows).
- Cells get pinker with progress, and a perfect day glows neon pink.
- Click any past day to view and edit it. Future days are hidden.

**Theme**
- Pure white in light mode, pure black in dark mode.
- A toggle in the header switches between them. On first visit it follows your device setting, and after that it remembers your choice.

**Reset**
- The Reset button next to "Today's habits" wipes everything: habits, progress, streaks and flowers. It asks for confirmation first.

## Layout

| Screen | Layout |
| --- | --- |
| Desktop (760px and wider) | Header with stats and theme toggle on top. Habits on the left, the log on the right, and the garden as a full-width banner at the bottom. Content is up to 1440px wide. |
| Mobile (under 760px) | App-style layout with a bottom tab bar (Today, Garden, Log). One section is shown at a time, and tapping a past day in the log jumps to Today for editing. |

## Running it

Open `index.html` in any modern browser. To host it, upload the three files together to any static host.

The fonts (Fredoka and Nunito) load from Google Fonts. Without a connection the page falls back to system fonts and works the same.

## How your data is stored

Everything is saved in the browser's `localStorage`, on your device only. Nothing is sent anywhere.

| Key | Contents |
| --- | --- |
| `petal-habits-v1` | `{ habits: [{ id, name, icon }], log: { "YYYY-MM-DD": [habitId, ...] } }` |
| `petal-theme` | `"light"` or `"dark"` |

Because it's browser storage, progress doesn't sync between devices or browsers, and clearing site data erases it.

## How streaks work

- A day is **perfect** when every current habit is ticked.
- A habit's streak counts consecutive days it was done, ending today. If today isn't done yet, it counts back from yesterday, so the streak doesn't drop to zero before the day is over.
- Adding or deleting a habit changes what counts as "every habit", which can change which past days are perfect.

## Customising

Where to change things:

- **Starter habits** (`script.js`): edit the `DEFAULTS` array.
- **Available icons**: edit the `ICONS` array in `script.js` and add a matching `<symbol id="i-name">` to the SVG sprite at the top of the body in `index.html`.
- **Colours** (`style.css`): the design tokens are CSS variables on `:root`, with dark values under `[data-theme="dark"]` (neon colours are `--c1`, `--c2`, `--c3` and `--glow`).
- **Log length** (`script.js`): change `W` in `renderCal` (default 26 weeks).
- **Garden size** (`script.js`): the flower cap is derived from the number of flowers per row in `renderGarden`.

## Accessibility

Buttons have text labels or ARIA labels, keyboard focus is visible, the dialog closes with Esc, and animations are turned off for people who prefer reduced motion.

## Notes

- Some sandboxed or embedded pages block the browser's built-in `confirm()` popup, so deletes and resets use a custom dialog instead.
- There are no dependencies apart from the Google Fonts stylesheet.