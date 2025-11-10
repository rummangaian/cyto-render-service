# Cyto Render Service

Render graphs to **SVG** on the server, using **Cytoscape.js** via the `@stereobooster/cyto-nodejs` CLI.  
Exposes HTTP endpoints to:
- render arbitrary Cytoscape payloads,
- fetch-and-render graphs by id from a remote domain,
- transform your **Science** JSON into styled, centered SVG,
- optionally upload the SVG to your CDN (Mobius Content Service).

---

## TL;DR

```bash
# install system deps for node-canvas (Ubuntu)
sudo apt-get update && sudo apt-get install -y \
  build-essential libcairo2-dev libpango1.0-dev libjpeg-dev \
  libgif-dev librsvg2-dev

# install node deps
npm install

# dev
npm run dev

# docs
open http://localhost:3000/docs   # or xdg-open ...

# quick health check
curl -s http://localhost:3000/health

deplayed url -s https://cyto-render-service.onrender.com
