```md
# NV — Natus Vincere (Frontend Demo)

This project is a **frontend-only demo** built to showcase **technical skill** in modern UI development: motion, 3D transforms, interactive components, and a premium “luxury brand” visual direction.

It is **not** a production e-commerce site and does **not** include payments, authentication, inventory, or a backend.

---

## What this demo includes

### ✅ Luxury landing page layout (Black marble + gold / Roman vibe)
- Multi-layer background composition (gradients + textures)
- Glassmorphism panels, shadows, and gold accents
- Responsive layout (desktop → tablet → mobile)

### ✅ HERO section
- Outlined typographic headline effect (`data-content` + `::after`)
- Compact hero image sizing (prevents heavy cropping)
- CTA buttons + “trust” highlights

### ✅ Featured products grid (UI only)
- Product cards with image, title, description, price
- “Add” button triggers a toast (demo feedback)

### ✅ 3D rotating carousel (core feature)
- Preserves the **original continuous rotation** behavior (`autoRun`)
- **Interactive control**:
  - **Drag** to rotate manually (adds `--manual-rotate` offset)
  - **Mouse wheel** for fine rotation
  - **Hover** pauses auto-rotation
  - **Click** opens a “Quick View” modal for product detail
- Uses `transform-style: preserve-3d` + perspective + ring positioning via CSS variables

### ✅ Lookbook parallax track (drag + wheel)
- Horizontal track movement (drag to move)
- Parallax illusion using per-image `object-position` animation
- Wheel also moves the track, without breaking parallax

### ✅ Quick View modal + Toast system
- Modal reads content from the clicked carousel item’s `data-*` attributes
- Toast displays quick UI feedback (demo actions)

### ✅ Reveal-on-scroll animations
- Uses `IntersectionObserver` to add `.show` to `.hidden` elements
- CSS handles blur/opacity/translate transitions

---

## Tech stack

- **HTML5**
- **CSS3** (variables, 3D transforms, responsive layouts)
- **Vanilla JavaScript** (no framework)
- Optional smooth scrolling integration (e.g., Lenis) if CDN is available

---

## Project structure (recommended)

> Your current links assume a structure like this:

```

nv-demo/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ app.js
└─ images/
└─ model.png

````

---

## How to run (local)

### Option A — Open directly (simple)
1. Open `index.html` in your browser.

> Note: Most features work, but some CDNs or assets might behave differently depending on browser security rules.

### Option B — Use a local server (recommended)
Using VS Code:
1. Install **Live Server**
2. Right-click `index.html` → **Open with Live Server**

Or using Node:
```bash
npx serve
````

---

## Controls (how to use)

### 3D Carousel

* **Drag**: rotates manually
* **Wheel**: rotates with fine control
* **Hover**: pauses auto-rotation
* **Click item**: opens Quick View modal

### Lookbook (parallax)

* **Drag horizontally**: move the track
* **Wheel**: shifts track left/right
* Image parallax happens automatically by animating `object-position`

---

## Notes / Limitations

This is a **demo** and intentionally **frontend-only**:

* No real cart logic or checkout
* No backend integration
* No product inventory / variants / size selection
* “Add to cart” is a toast-only UI feedback

---

## Where to extend (if you want production features)

If you later want to turn this into a real shop, the clean next steps are:

* Add a backend (Node/Express, Django, Laravel, etc.)
* Add a real product catalog + CMS (Shopify headless, Strapi, Sanity, etc.)
* Implement cart + checkout (Stripe, MercadoPago)
* Add routing (React/Next.js) and state management
* Performance improvements (image optimization, lazy-loading strategy, preloading critical assets)

---

## License / Credits

* Images are loaded from third-party sources (e.g., Pexels / Unsplash) for demo purposes.
* Fonts imported from cdnfonts.com.

Use responsibly and ensure proper licensing if you convert this into a commercial site.

```
::contentReference[oaicite:0]{index=0}
```
