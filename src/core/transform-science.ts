export type ScienceNode = {
  internalId: number | string;
  id: string;
  labels: string[];
  properties?: {
    sciences?: string[];
    nodeActivateMetadata?: string;
    outputs?: string;
    inputs?: string;
    ladderOfDecentDef?: string;
    llmGeneratedDescription?: string;
    id: string;
    label: string;   // e.g., "AGENT", "NEURON"
    contentRef?: string;
    name?: string;   // e.g., "HOLACRACY_2"
  };
};

export type ScienceEdge = {
  start: number | string;       // node.internalId
  end: number | string;         // node.internalId
  internalId?: number | string; // present in your sample
  id?: number | string;         // sometimes used elsewhere
  properties?: Record<string, string>;
  type?: string;                // e.g., "AGENT_HAS_NEURON", "DEPENDS_ON"
};

export type ScienceData = {
  meta?: { nodes?: number; edges?: number };
  nodes: ScienceNode[];
  edges: ScienceEdge[];
};

const BUSINESS_CODES = new Set(["BE", "BP", "BEv", "BM", "BT", "BR", "BL"]);
const BUSINESS_LABEL_TO_CODE: Record<string, string> = {
  BUSINESS_ENTITY: "BE",
  BUSINESS_PROCESS: "BP",
  BUSINESS_EVENTS: "BEv",
  BUSINESS_MODEL: "BM",
  BUSINESS_TRACE: "BT",
  BUSINESS_RESULT: "BR",
  BUSINESS_LAW: "BL",
};

function toBusinessCode(label?: string): string | undefined {
  if (!label) return;
  const up = label.toUpperCase();
  if (BUSINESS_CODES.has(label)) return label;
  return BUSINESS_LABEL_TO_CODE[up];
}

function nodeKind(n: ScienceNode): "AGENT" | "NEURON" | "UNKNOWN" {
  const lbl = n.properties?.label || n.labels?.[0] || "";
  const up = lbl.toUpperCase();
  if (up === "AGENT") return "AGENT";
  if (up === "NEURON") return "NEURON";
  return "UNKNOWN";
}

export function transformScienceToCytoscape(data: ScienceData) {
  const idByInternal = new Map<string | number, string>();
  for (const n of data.nodes ?? []) {
    idByInternal.set(n.internalId ?? n.id, n.id);
  }

  // nodes
  const cyNodes = (data.nodes ?? []).map((n) => {
    const label = n.properties?.name || n.properties?.label || n.id;
    const kind = nodeKind(n);
    const businessCode =
      toBusinessCode(n.properties?.label) ||
      (n.labels?.map(toBusinessCode).find(Boolean) as string | undefined);

    return {
      data: {
        id: n.id,                                   // visible id
        internalId: String(n.internalId ?? n.id),   // for tracing
        label,
        kind,                                       // AGENT | NEURON | UNKNOWN
        typeCode: businessCode || "UNKNOWN"         // BE/BP/... if present
      }
    };
  });

  // edges
  const cyEdges = (Array.isArray(data.edges) ? data.edges : [])
    .filter((e) => idByInternal.has(e.start) && idByInternal.has(e.end))
    .map((e) => ({
      data: {
        id: String(e.internalId ?? e.id ?? `${e.start}-${e.end}-${e.type ?? "E"}`),
        source: idByInternal.get(e.start)!,
        target: idByInternal.get(e.end)!,
        type: e.type || ""
      }
    }));

  const elements = [...cyNodes, ...cyEdges];

  // centered layout
  const layout = {
    name: "concentric",
    fit: true,
    padding: 24,
    minNodeSpacing: 28,
    animate: false
  };

  // style keyed by kind + business code
  const style = [
    { selector: "node", style: {
        shape: "ellipse", width: 36, height: 36,
        "background-color": "#0ea5a4", "border-color": "#0b5c56", "border-width": 1,
        color: "#ffffff", label: "data(label)", "font-size": 12,
        "text-wrap": "wrap", "text-max-width": "120px",
        "text-valign": "center", "text-halign": "center", "overlay-opacity": 0
    }},
    { selector: "edge", style: {
        width: 1.5, "line-color": "#9aa5b1", "curve-style": "bezier",
        "target-arrow-shape": "vee", "target-arrow-color": "#9aa5b1"
    }},
    // Domain kinds
    { selector: 'node[kind = "AGENT"]',  style: { width: 48, height: 48, "background-color": "rgba(3, 102, 114, 1)", "border-color": "#0b5c56", "font-weight": "700" } },
    { selector: 'node[kind = "NEURON"]', style: { width: 34, height: 34, "background-color": "#9AB106", color: "#093a36", "border-color": "#2aa39a" } },
    // Business code overlays if present
    { selector: 'node[ typeCode = "BE" ]',  style: { "background-color": "#623DC1" } },
    { selector: 'node[ typeCode = "BP" ]',  style: { "background-color": "#DC7719" } },
    { selector: 'node[ typeCode = "BEv"]',  style: { "background-color": "#9AB106", color: "#0b2740" } },
    { selector: 'node[ typeCode = "BM" ]',  style: { "background-color": "#036672", color: "#093a36" } },
    { selector: 'node[ typeCode = "BT" ]',  style: { "background-color": "#62317B" } },
    { selector: 'node[ typeCode = "BR" ]',  style: { "background-color": "#E7B112", color: "#3f2e00" } },
    { selector: 'node[ typeCode = "BL" ]',  style: { "background-color": "#759199", color: "#24310b" } },
    // Edge types
    { selector: 'edge[ type = "DEPENDS_ON" ]', style: { "line-style": "dashed" } }
  ];

  const nodeCount = cyNodes.length;
  const edgeCount = cyEdges.length;
  const bCount = cyNodes.filter((n) => BUSINESS_CODES.has(n.data.typeCode)).length;

  return {
    cyPayload: { elements, style, layout, width: 1000, height: 700 },
    counters: { nodeCount, edgeCount, bCount }
  };
}
