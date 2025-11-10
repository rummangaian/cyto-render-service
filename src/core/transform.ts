// Transform upstream graph JSON -> Cytoscape payload
export type RemoteNode = { internalId?: number | string; id?: string; properties?: any };
export type RemoteEdge = { internalId?: number | string; start: number | string; end: number | string; type?: string; properties?: any };

export function toCytoscapePayload(remote: any) {
    // return remote
  const nodes = (remote?.nodes ?? []).map((n: RemoteNode) => {
    const id = String(n.internalId ?? n.id);
    const label = n?.properties?.name ?? n?.properties?.label ?? id;
    return { data: { id, label } };
  });

  const edges = (remote?.edges ?? []).map((e: RemoteEdge) => {
    const id = String(e.internalId ?? `${e.start}-${e.end}-${e.type ?? "edge"}`);
    return {
      data: {
        id,
        source: String(e.start),
        target: String(e.end),
        label: e.type ?? ""
      }
    };
  });

  // Deterministic default layout. Adjust if you need cola/elk later.
  const layout = { name: "cola", rankSep: 50, nodeSep: 30 };
  return { elements: [...nodes, ...edges], layout, width: 1000, height: 1000 };
}
