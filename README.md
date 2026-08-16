# Qahira Cuisine — Fine Dining & Accommodation

A hackathon website — **pure HTML + CSS + JavaScript, no install, no server needed.**
Now split into real, separate pages.

## How to run it
Double-click `index.html` and it opens in your browser. Navigate using the
menu at the top — each link goes to a real page with its own file.

## Pages
- `index.html` — Home
- `dining.html` — Menu (Starters / Mains / Desserts tabs)
- `rooms.html` — Suites, each with a "Book" button
- `experience.html` — The evening timeline
- `reserve.html` — Booking form (table or room)
- `admin.html` — Staff view of saved reservations

## How booking works
Clicking "Book" on a room in `rooms.html` takes you to `reserve.html` with
that room and the "Room" tab already selected. Submissions are saved in the
browser's `localStorage` — no backend needed. Open `admin.html` afterward
(same browser) to see them listed.

## Editing text
Each page is its own HTML file, so edit the one you want to change directly:
- Home hero text → `index.html`
- Menu items/prices → the `MENU` object at the top of `script.js`
- Room names/prices → `rooms.html`
- Evening timeline → `experience.html`
Colors and fonts are controlled by variables at the top of `style.css`
(`--ink`, `--brass`, etc.) — change one, it updates everywhere.

## Adding your own photos
Rename your photos to match these exact filenames and drop them into the
`images/` folder. Missing ones just fall back to the current design.

**Hero:** `hero.jpg`
**Rooms:** `room-almuizz.jpg`, `room-zamalek.jpg`, `room-nile-terrace.jpg`
**Dishes:** `dish-duqqa-halloumi.jpg`, `dish-molokhia-veloute.jpg`,
`dish-sambousek-trio.jpg`, `dish-nile-perch-sayadeya.jpg`,
`dish-hamam-mahshi.jpg`, `dish-kofta-royale.jpg`, `dish-koshari-deluxe.jpg`,
`dish-om-ali.jpg`, `dish-basbousa-rose.jpg`, `dish-cardamom-affogato.jpg`

## Make it live (still free, no install)
- **GitHub Pages** — push the folder to a GitHub repo, enable Pages in
  Settings → Pages (source: main branch, root), get a free public URL.
- **Netlify Drop** (netlify.com/drop) — drag the folder onto the page for
  an instant live URL, no account required.

## Note on reservations
`localStorage` only saves data on the device/browser it was submitted from
— it's not shared across visitors. Great for a hackathon demo; a natural
"next step" to mention to judges is adding a real backend + database so
bookings sync across everyone visiting the live site.
