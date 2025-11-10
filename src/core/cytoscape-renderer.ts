import cytoscape from "cytoscape";
import cytoscapeSvg from "cytoscape-svg";
import dagre from "cytoscape-dagre";
import { JSDOM } from "jsdom";
import { RenderRequest } from "./types.js";

// Register plugins
cytoscape.use(cytoscapeSvg);
cytoscape.use(dagre);

// One jsdom per process is enough
const dom = new JSDOM(`<!doctype html><html><body><div id="cy"></div></body></html>`);
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
(globalThis as any).navigator = dom.window.navigator;

export async function renderToSvg(req: RenderRequest): Promise<string> {
  const { elements, style, layout } = req;

  const cy = cytoscape({
    headless: true,
    container: dom.window.document.getElementById("cy") as any,
    elements: [...(elements.nodes || []), ...(elements.edges || [])],
    style,
    // Use a safe default if layout unspecified
    layout: layout ?? { name: "breadthfirst" }
  });

  // Ensure layout executed before svg export
  if (layout) {
    cy.layout(layout).run();
  } else {
    cy.layout({ name: "breadthfirst" }).run();
  }

  // full:true exports entire graph, not just viewport
  const svg = (cy as any).svg({ full: true });
  cy.destroy();
  return svg as string;
}
