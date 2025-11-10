import { FastifyReply, FastifyRequest } from "fastify";
import { cytoSnap } from "../core/cyto-snap.js";

export async function postRenderSvg(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as any;

  // Accept either {nodes, edges} OR {elements:{nodes,edges}}.
  const input =
    body?.elements?.nodes || body?.nodes
      ? (body.elements
          ? body
          : { elements: { nodes: body.nodes ?? [], edges: body.edges ?? [] } })
      : null;

  if (!input) {
    reply.code(400).send({ error: "Bad Request", message: "Provide nodes and edges." });
    return;
  }

  const svg = await cytoSnap(input);
  reply.header("Content-Type", "image/svg+xml; charset=utf-8").send(svg);
}
