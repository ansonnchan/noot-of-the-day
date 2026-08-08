# Noot of the Day

One penguin. One little fact. Once a day.

Noot of the Day is a deliberately tiny daily website. On the first visit of a
local calendar day, a visitor reveals one real penguin photo and one sourced
fact. That Noot remains on the device until local midnight—no accounts, feed,
streaks, or endless shuffle button.

## Run it locally

Requires a current Node.js release (Node 20+ recommended).

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm test
npm run build
npm run preview
```

No environment variable is required. `BOATMAN_API_URL` can optionally override
the upstream URL used by the development proxy and serverless function; see
[`.env.example`](.env.example).

## How the daily Noot works

1. The app creates a `YYYY-MM-DD` key from the visitor's local calendar fields.
2. A valid Noot already stored under `noot.daily` is shown immediately.
3. Otherwise the reveal requests one fact through the same-origin `/api/noot`
   adapter, normalizes it, attaches a separate real-photo result, and stores the
   completed `DailyNoot`.
4. At the next local midnight the cached date expires and a new reveal becomes
   available.

Malformed or unavailable local storage is treated as an empty cache. If the
upstream API is unavailable, a small date-selected set of sourced fallback facts
and bundled photos keeps the experience usable.

## Penguin data and photos

Facts are requested first from the
[Boatman Penguin API](https://github.com/boatman-27/SaaS_Penguin_API). The
integration follows its current source route, `/api/v1/fact/random`, and current
response shape rather than the older paths in its README. A same-origin adapter
is used because Boatman's deployed CORS policy is limited to its own domains.

Boatman responses are converted at the boundary into the small internal
`DailyNoot` type. UI code never depends on Boatman's raw types. Formatting only
trims whitespace, removes simple markup, and normalizes punctuation spacing.

Bundled real penguin photos come from Wikimedia Commons. Per-image author,
license, and source-page metadata lives in `src/data/images.ts` and is shown
below each photo. The supplied watercolor mascots remain UI personality rather
than factual content.

## Mascot assets

Original artwork is preserved in `assets/images/`. Web-sized state variants are
in `public/images/mascots/`:

- `penguin-default.png`
- `penguin-sleeping.png`
- `penguin-searching.png`
- `penguin-confused.png`

`PenguinMascot` maps unsupported optional states to the closest available piece,
so a missing camera or pebble illustration does not break the UI.

## Project shape

```text
api/noot.ts                 same-origin production adapter
server/boatmanProxy.ts      Boatman request shared with local development
src/components/             reveal, daily view, photo, mascot, countdown
src/lib/daily/              local date, midnight, and storage helpers
src/lib/penguins/           Boatman adapter, normalizer, domain types
src/data/                   captions, fallback facts, image registry
public/images/              optimized mascots and real photos
```

The app is a Vite + React + TypeScript client with one small Vercel-compatible
serverless function and no database.
