import { cyStyle } from "./style.js";

export type RemoteNode = {
  internalId?: number | string;
  id?: string;
  properties?: Record<string, any>;
  labels?: string[];
};
export type RemoteEdge = {
  internalId?: number | string;
  start: number | string;
  end: number | string;
  type?: string;
  properties?: Record<string, any>;
};

export function toCytoscapePayload(remote: any) {
  const nodes = (remote?.nodes ?? []).map((n: RemoteNode) => {
    const id = String(n.internalId ?? n.id);
    const type =
      n?.properties?.label ??
      (Array.isArray(n?.labels) && n.labels.length ? n.labels[0] : "UNKNOWN");
    const label = n?.properties?.name ?? type ?? id;
    return { data: { id, label, type } };
  });

  const edges = (remote?.edges ?? []).map((e: RemoteEdge) => {
    const id = String(e.internalId ?? `${e.start}-${e.end}-${e.type ?? "E"}`);
    return {
      data: {
        id,
        source: String(e.start),
        target: String(e.end),
        type: e.type ?? ""
      }
    };
  });

  // Centered radial layout; deterministic and “graph in center” feel
  const layout = {
    name: "concentric",
    fit: true,
    padding: 40,
    sweep: 6.28318,       // 2π
    startAngle: 4.71239,  // 3π/2 (top)
    minNodeSpacing: 30,
    animate: false
  };

  return {
    elements: [...nodes, ...edges],
    style: cyStyle(),
    layout,
    width: 1000,
    height: 700
  };
}
