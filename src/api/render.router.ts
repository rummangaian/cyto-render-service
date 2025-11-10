import { FastifyInstance } from "fastify";
import { postRenderSvg } from "./render.controller.js";

const schema = {
  tags: ["Render"],
  summary: "Render Cytoscape payload to SVG",
  description: "Accepts either {elements:{nodes,edges}} or {nodes,edges}. Returns image/svg+xml.",
  body: { oneOf: [{ $ref: "RenderElements#" }, { $ref: "RenderNodesEdges#" }] },
  response: {
    200: {
      description: "SVG",
      content: { "image/svg+xml": { schema: { type: "string" } } }
    }
  }
};

export default async function renderRouter(app: FastifyInstance) {
  app.post("/v1/render/svg", { schema }, postRenderSvg);
}
