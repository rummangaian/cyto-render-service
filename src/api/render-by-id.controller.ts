import { FastifyReply, FastifyRequest } from "fastify";
import { toCytoscapePayload } from "../core/transform.js";
import { cytoSnap } from "../core/cyto-snap.js";
import { centerSvg } from "../core/svg-center.js";
import sampleDummy from "../../examples/by-id-dummy-request.json" with {type:'json'}

type Body = { id: string; domain: string; dummy?: any };

function composeUrl(base: string, id: string) {
  const b = base.replace(/\/+$/, "");
  return `${b}/yaml-compiler/v1.0/meta-model/graph/${id}`;
}

export async function postRenderById(
  req: FastifyRequest<{ Body: Body }>,
  reply: FastifyReply
) {
  const { id, domain, dummy } = req.body || ({} as Body);
  if (!id || !domain) return reply.code(400).send({ error: "Provide 'id' and 'domain'." });

  const url = composeUrl(domain, id);
  const auth = req.headers["authorization"] ? String(req.headers["authorization"]) : undefined;

  let upstream: any;
  try {
    const res = await fetch(url, { headers: auth ? { authorization: auth } : undefined });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    upstream = await res.json();
  } catch {
    // if (!dummy) return reply.code(502).send({ error: "Upstream fetch failed", url });
    upstream = sampleDummy;
  }
// return upstream
  const cyPayload = toCytoscapePayload(upstream);
//   return cyPayload
  const rawSvg = await cytoSnap(cyPayload);
  const svg = centerSvg(rawSvg, 1000, 700, 24);
  reply.type("image/svg+xml; charset=utf-8").send(svg);
}
