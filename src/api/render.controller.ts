import { FastifyReply, FastifyRequest } from "fastify";
import { cytoSnap } from "../core/cyto-snap.js";
import { centerSvg } from "../core/svg-center.js";

export async function postRenderSvg(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as any;
  const input =
    body?.elements?.nodes || body?.nodes
      ? (body.elements ? body : { elements: { nodes: body.nodes ?? [], edges: body.edges ?? [] } })
      : null;

  if (!input) return reply.code(400).send({ error: "Provide nodes and edges." });

  const rawSvg = await cytoSnap(input);
  const svg = centerSvg(rawSvg, 1000, 700, 24);
  reply.type("image/svg+xml; charset=utf-8").send(svg);
}
