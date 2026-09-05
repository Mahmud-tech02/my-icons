# My Icons

A small, reusable, **outline-style SVG icon library** you host once on GitHub and use on any website with a single script tag and an `<i>` tag — no copy-pasting SVG code ever again.

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/dist/icons.min.js"
        data-icons-url="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/icons/icons.svg"></script>

<i data-icon="search"></i>
<i data-icon="cart"></i>
<i data-icon="user"></i>
<i data-icon="heart"></i>
```

That's the whole system.

---

## How it works

```text
GitHub Repository
       ↓
icons/icons.svg      ← one SVG file, every icon as a <symbol>
       ↓
dist/icons.js         ← tiny loader script
       ↓
Your website
       ↓
<i data-icon="search"></i>
       ↓
Loader fetches icons.svg once, injects it hidden in the page,
then swaps every <i data-icon="..."> for a real <svg><use>.
```

No build step, no framework, no per-icon downloads. 51 icons ship in the sprite today; adding a new one later requires **zero JavaScript changes** — see [Adding new icons](#adding-new-icons).

---

## Folder structure

```text
my-icons/
│
├── icons/
│   └── icons.svg        # all icons as <symbol> elements (the source of truth)
│
├── dist/
│   ├── icons.js          # loader, human-readable (development)
│   └── icons.min.js      # loader, minified (production)
│
├── demo/
│   └── index.html         # searchable icon gallery with copy-to-clipboard
│
├── README.md
└── LICENSE
```

---

## Installation

### 1. Put this repo on GitHub

Create a public repository (e.g. `my-icons`) and push these files to it. See [GitHub setup](#github-setup) below if you haven't done this before.

### 2. Add two things to any website

**A script tag**, pointing at `icons.min.js` and telling it where `icons.svg` lives via `data-icons-url`:

```html
<script
  src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/dist/icons.min.js"
  data-icons-url="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/icons/icons.svg">
</script>
```

**Icon tags**, anywhere in your HTML:

```html
<i data-icon="search"></i>
```

That's it — the icon renders automatically as an inline `<svg>`.

> If you omit `data-icons-url`, the loader guesses the sprite lives at `../icons/icons.svg` relative to `dist/icons.js` (this matches the folder layout above, and is what `demo/index.html` uses).

---

## Usage

```html
<i data-icon="cart"></i>
<i data-icon="user"></i>
<i data-icon="heart"></i>
```

### Inside a button (with an accessible label)

```html
<button aria-label="Search">
  <i data-icon="search" aria-hidden="true"></i>
</button>
```

### Added dynamically with JavaScript

The loader watches the page for new elements, so this also works without any extra code:

```javascript
element.innerHTML = '<i data-icon="heart"></i>';
```

### Manually re-scanning the page

If you ever need to force a re-scan (e.g. after injecting a large chunk of HTML at once):

```javascript
window.Icons.render(); // whole document
window.Icons.render(someContainerEl); // just one container
```

---

## Styling with CSS

Every icon becomes a real `<svg class="icon">` that uses `stroke="currentColor"`, so normal CSS controls it — width, height, color, opacity, margin, transitions, everything.

```css
.icon {
  width: 24px;
  height: 24px;
  color: #222;
}

.icon:hover {
  color: #5b8cff;
}
```

```html
<i data-icon="search" class="icon"></i>
```

Because color comes from `currentColor`, setting `color` on the icon (or inheriting it from a parent) changes the icon's color — no `fill` overrides needed.

### Optional size utility classes

Add these to your site's stylesheet if you want quick size variants:

```css
.icon-xs { width: 14px; height: 14px; }
.icon-sm { width: 18px; height: 18px; }
.icon-md { width: 24px; height: 24px; } /* default */
.icon-lg { width: 32px; height: 32px; }
.icon-xl { width: 48px; height: 48px; }
```

```html
<i data-icon="search" class="icon icon-lg"></i>
```

(These are plain CSS classes, not built into `icons.js` — keeping the loader dependency-free and letting you theme sizes however your site already works.)

---

## Accessibility

- Purely decorative icons: add `aria-hidden="true"` (the loader adds this automatically if you don't set `aria-hidden` or `aria-label` yourself).
- Meaningful icons (e.g. a standalone icon button): wrap in a `<button>`/`<a>` with `aria-label`, and keep `aria-hidden="true"` on the icon itself so screen readers read the label once, not twice.
- All attributes you put on the `<i>` tag (`class`, `id`, `aria-*`, `data-*`, `style`, ...) are copied onto the rendered `<svg>`, so your existing accessibility markup is preserved.

---

## Error handling

An unknown icon name never breaks your layout:

```html
<i data-icon="does-not-exist"></i>
```

The element is simply left alone (removed from the render queue) and the browser console shows:

```text
[Icons] Icon "does-not-exist" not found.
```

---

## Performance

- One network request loads the entire sprite (`icons.svg`), which the browser caches — every `<i data-icon="...">` after that is free.
- No framework, no dependencies, no build step.
- `icons.js` (~6 KB) is for development/debugging; ship `icons.min.js` (~4 KB) in production.
- Both files gzip to a few KB.

---

## Adding new icons

You can add icons like `youtube`, `facebook`, `instagram`, `whatsapp`, `telegram`, `tiktok` — or anything else — without touching `icons.js` at all.

1. Open `icons/icons.svg`.
2. Add a new `<symbol>` with a unique `id` (this `id` is the name you'll use in `data-icon`):

   ```html
   <symbol id="youtube" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
     <!-- your path data here -->
   </symbol>
   ```

3. Keep the same style as the rest of the library so it looks consistent:
   - `viewBox="0 0 24 24"`
   - `fill="none"`, `stroke="currentColor"`
   - `stroke-width="1.8"` (adjust slightly only if the shape needs it)
   - `stroke-linecap="round"`, `stroke-linejoin="round"`
4. Save the file and re-upload it to GitHub (or bump the version — see below).
5. Use it immediately:

   ```html
   <i data-icon="youtube"></i>
   ```

No JavaScript change, no rebuild — the loader reads whatever symbols exist in `icons.svg` at request time.

---

## Versioning

Tag releases on GitHub (`v1.0.0`, `v1.1.0`, `v1.2.0`, …) so existing sites can pin to a version and never break when you add or change icons later.

```html
<!-- pinned to v1.0.0 forever -->
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/dist/icons.min.js"
        data-icons-url="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/icons/icons.svg"></script>

<!-- always latest (use only for personal/dev projects) -->
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@latest/dist/icons.min.js"
        data-icons-url="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@latest/icons/icons.svg"></script>
```

To cut a release:

```bash
git tag v1.1.0
git push origin v1.1.0
```

jsDelivr automatically picks up new GitHub tags within a few minutes (and caches them on a global CDN, which is faster and more reliable than raw GitHub URLs).

---

## GitHub setup

```bash
# from inside the my-icons/ folder
git init
git add .
git commit -m "Initial commit: My Icons v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-icons.git
git push -u origin main

# tag the first release so CDN URLs can pin to it
git tag v1.0.0
git push origin v1.0.0
```

Make the repository **public** so `raw.githubusercontent.com` and `cdn.jsdelivr.net` can serve it to any website.

---

## CDN options

### Option A — jsDelivr (recommended)

Fast, cached globally, sends correct CORS headers, and supports version tags out of the box:

```text
https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/dist/icons.min.js
https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/icons/icons.svg
```

### Option B — GitHub raw

Works too, but is not a real CDN (slower, rate-limited, no edge caching):

```text
https://raw.githubusercontent.com/YOUR-USERNAME/my-icons/main/dist/icons.min.js
https://raw.githubusercontent.com/YOUR-USERNAME/my-icons/main/icons/icons.svg
```

Use jsDelivr for anything beyond quick personal testing.

---

## Example: a full website

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
  <style>
    .icon { width: 22px; height: 22px; color: #222; }
    .icon-lg { width: 32px; height: 32px; }
  </style>
</head>
<body>

  <nav>
    <i data-icon="menu" class="icon"></i>
    <i data-icon="search" class="icon"></i>
    <i data-icon="cart" class="icon"></i>
    <i data-icon="user" class="icon"></i>
  </nav>

  <button aria-label="Add to favorites">
    <i data-icon="heart" class="icon icon-lg" aria-hidden="true"></i>
  </button>

  <script
    src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/dist/icons.min.js"
    data-icons-url="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/my-icons@v1.0.0/icons/icons.svg">
  </script>
</body>
</html>
```

---

## Available icons (v1.0.0)

`search` `user` `cart` `heart` `home` `menu` `close` `check` `star` `phone`
`email` `location` `truck` `calendar` `clock` `plus` `minus` `arrow-left`
`arrow-right` `chevron-down` `chevron-up` `edit` `delete` `settings` `download`
`upload` `eye` `eye-off` `lock` `unlock` `bell` `filter` `share` `copy`
`external-link` `refresh` `play` `pause` `image` `camera` `shopping-bag`
`credit-card` `wallet` `package` `map` `globe` `info` `warning` `help`
`logout` `login`

Open `demo/index.html` to browse all of them visually with a search box and a one-click copy button for each icon's markup.

> **Local testing note:** the loader fetches `icons.svg` over HTTP, so double-clicking `demo/index.html` to open it as a `file://` URL won't work in most browsers (fetch is blocked for local files). Serve the folder instead, e.g. `python3 -m http.server` from the repo root, then open `http://localhost:8000/demo/`. Once hosted on GitHub Pages, jsDelivr, or any real web server, this isn't an issue.

---

## License

MIT — see [LICENSE](./LICENSE).
