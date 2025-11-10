// Visuals similar to your screenshot
export function cyStyle() {
  return [
    // Defaults
    {
      selector: "node",
      style: {
        shape: "ellipse",
        width: 36,
        height: 36,
        "background-color": "#0ea5a4",   // teal
        "border-width": 1,
        "border-color": "#0b5c56",
        color: "#ffffff",
        label: "data(label)",
        "font-size": 12,
        "text-wrap": "wrap",
        "text-max-width": "90px",
        "text-valign": "center",
        "text-halign": "center",
        "overlay-opacity": 0
      }
    },
    {
      selector: "edge",
      style: {
        width: 1.5,
        "line-color": "#9aa5b1",
        "curve-style": "bezier",
        "target-arrow-shape": "vee",
        "target-arrow-color": "#9aa5b1"
      }
    },

    // Types
    { selector: 'node[type = "AGENT"]',  style: { width: 48, height: 48, "background-color": "#0f766e", "border-color": "#0b5c56", "font-weight": "700" } },
    { selector: 'node[type = "NEURON"]', style: { width: 34, height: 34, "background-color": "#86e1d8", color: "#093a36", "border-color": "#2aa39a" } },
    { selector: 'node[type = "LITERAL"]',style: { width: 28, height: 28, "background-color": "#b5cb00", color: "#24310b", "border-color": "#8aa000" } },
    // Tag-like rectangular nodes (purple chips)
    { selector: 'node[type = "TAG"]',    style: { shape: "round-rectangle", width: "label", height: "label", padding: "6px",
                                                  "background-color": "#6c3cff", color: "#ffffff", "font-size": 11 } },

    // Edge types
    { selector: 'edge[type = "DEPENDS_ON"]', style: { "line-style": "dashed" } }
  ];
}