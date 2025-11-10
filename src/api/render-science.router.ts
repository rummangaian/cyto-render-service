import { FastifyInstance } from "fastify";
import { postRenderScience } from "./render-science.controller.js";

const schema = {
  tags: ["Science"],
  summary: "Render Science JSON to styled, centered SVG",
  body: { $ref: "ScienceData#" },
  response: {
    200: { description: "SVG", content: { "image/svg+xml": { schema: { type: "string" } } } }
  }
};

export default async function renderScienceRouter(app: FastifyInstance) {
  app.post("/v1/render/svg/science", { schema }, postRenderScience);
}
