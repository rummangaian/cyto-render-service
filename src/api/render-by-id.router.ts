import { FastifyInstance } from "fastify";
import { postRenderById } from "./render-by-id.controller.js";

const schema = {
  tags: ["Render"],
  summary: "Fetch graph by id from domain, render to SVG",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["id", "domain"],
    properties: {
      id: { type: "string" },
      // removed: example
      domain: { type: "string" },
      dummy: { type: "object", description: "Optional fallback payload when upstream fails" }
    }
  },
  headers: {
    type: "object",
    properties: { authorization: { type: "string" } }
  },
  response: {
    200: { description: "SVG", content: { "image/svg+xml": { schema: { type: "string" } } } },
    502: { description: "Upstream fetch failed", type: "object" }
  }
};

export default async function renderByIdRouter(app: FastifyInstance) {
  app.post("/v1/render/svg/by-id", { schema }, postRenderById);
}
