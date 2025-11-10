import { FastifyReply, FastifyRequest } from "fastify";
import { ScienceData, transformScienceToCytoscape } from "../core/transform-science.js";
import { cytoSnap } from "../core/cyto-snap.js";
import { frameSvg } from "../core/svg-frame.js";

export async function postRenderScience(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as ScienceData;
  if (!Array.isArray(body?.nodes) || !Array.isArray(body?.edges)) {
    return reply.code(400).send({ error: "Provide nodes[] and edges[]" });
  }
  const { cyPayload, counters } = transformScienceToCytoscape(body);
  const raw = await cytoSnap(cyPayload);
  const svg = frameSvg(raw, counters, { width: 1000, height: 700, padding: 24, bannerH: 80 });
  reply.type("image/svg+xml; charset=utf-8").send(svg);
}
