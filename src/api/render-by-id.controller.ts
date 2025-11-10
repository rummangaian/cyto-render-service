import { FastifyReply, FastifyRequest } from "fastify";
import { toCytoscapePayload } from "../core/transform.js";
import { cytoSnap } from "../core/cyto-snap.js";
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
  if (!id || !domain) {
    reply.code(400).send({ error: "Provide 'id' and 'domain'." });
    return;
  }

  const url = composeUrl(domain, id);
  const auth = req.headers["authorization"] ? String(req.headers["authorization"]) : undefined;

  let upstream: any;
  try {
    const res = await fetch(url, { headers: auth ? { authorization: auth } : undefined });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    upstream = await res.json();
  } catch (e) {
    // if (!dummy) {
    //   reply.code(502).send({ error: "Upstream fetch failed", url, details: String(e) });
    //   return;
    // }
    upstream = sampleDummy; // testing fallback
  }

  const cyPayload = toCytoscapePayload(upstream);
  const svg = await cytoSnap(cyPayload);
  reply.header("Content-Type", "image/svg+xml; charset=utf-8").send(svg);
}
