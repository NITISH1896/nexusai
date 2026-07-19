# NexusAI - High-Performance Enterprise Agent Landing Page

NexusAI is a world-class, fully responsive, semantic, and highly interactive landing page showcasing autonomous AI agent infrastructure for enterprise workflows.

Built with clean, developer-crafted aesthetics (avoiding plain "AI-generated" tropes), it serves as a benchmark for pristine frontend quality, premium UI/UX interactions, and fluid dark/light transitions.

---

## Live Demo & Deployment
This project is fully static and configured for immediate deployment. You can host it instantly via **GitHub Pages**:

1. Push this codebase to your repository: `https://github.com/NITISH1896/nexusai.git`
2. Go to your repository settings on GitHub.
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Set the branch to `main` (and folder to `/root`), and click **Save**.
6. GitHub will generate a live link (e.g., `https://nitish1896.github.io/nexusai/`) in less than a minute!

---

## Directory Layout
```text
nexusai/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── animations.js
│       └── validation.js
```

---

## Core Developer-Crafted Features

### 1. Staggered "Random Letter Swap" Animation
* **Description:** A premium text hover effect implemented in raw Vanilla JS ([animations.js](file:///Users/nitishv/nexusai/assets/js/animations.js)). Hovering over headings swaps letters vertically in a randomized, staggered sequence.
* **Accessibility Integration:** The original text copy is preserved inside a screen-reader-only (`sr-only`) tag, ensuring search engine indexability and full screen-reader support.
* **Target Elements:** 
  - Hero: *Autonomous Agents*
  - Infrastructure: *Unbounded* (Blue)
  - Platform Vision: *Next-Gen* (Blue)
  - Testimonials: *Leading* (Blue)

### 2. Frosted Glass Bento Content Cards (No Text Overlap)
* **Description:** The capability grid cards split text content and interactive triggers into a nested, glassmorphic panel (`backdrop-blur-[6px]`).
* **Design Purpose:** This frosted glass backplate masks background movements, preventing floating ambient bubbles from overlapping or mixing with the text layout, maintaining perfect reading contrast.

### 3. Conic Gradient "Rotating Laser Border"
* **Description:** The Platform Vision metric cards feature a sleek, 1.5px laser border that rotates dynamically on hover.
* **Mechanism:** Achieved using a custom CSS `::before` pseudo-element with a `conic-gradient` that sweeps across colors. An inner content container masks the center, leaving only the razor-sharp rotating border active.

### 4. Interactive Telemetry Canvas
* **Description:** A scroll-responsive canvas drawing elegant organic wave curves that follow the cursor coordinates.
* **Performance Safeguards:** Utilizes `{ passive: true }` event listeners to prevent scroll latency. An `IntersectionObserver` pauses canvas execution when scrolled out of viewport bounds, completely freeing client CPU and battery resources when off-screen.

---

## Design System Tokens

Color variables are centralized in [style.css](file:///Users/nitishv/nexusai/assets/css/style.css):
* **Dark Mode:**
  - Primary Canvas: `#000000` (Pure Black)
  - Section Canvas: `#070708`
  - Bento Cards: `#141416` (Graphite Grey)
* **Light Mode:**
  - Primary Background: `#FFFFFF`
  - Section Canvas: `#F5F5F7`
  - Bento Cards: `#F5F5F7` (Apple Light Grey)
* **Accent Color:**
  - Premium iOS-style Blue (`#0071E3` Light / `#2997FF` Dark)

---

## Local Development
To view the site locally:
1. Open a terminal in the project directory.
2. Serve static files using Python:
   ```bash
   python3 -m http.server 8088
   ```
3. Open [http://localhost:8088](http://localhost:8088) in your browser.
