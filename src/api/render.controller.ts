import { FastifyReply, FastifyRequest } from "fastify";
import { cytoSnap } from "../core/cyto-snap.js";

export async function postRenderSvg(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as any;

  const input =
    body?.elements?.length || body?.elements?.nodes || body?.nodes
      ? (body.elements ? body : { elements: body })
      : null;

  if (!input) return reply.code(400).send({ error: "Provide elements or nodes+edges." });

  const svg = await cytoSnap(input);
  reply.type("image/svg+xml; charset=utf-8").send(svg);
}
