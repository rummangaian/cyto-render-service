import { FastifyInstance } from "fastify";
import { postRenderScienceUpload } from "./render-science-upload.controller.js";

const schema = {
  tags: ["Science", "Upload"],
  summary: "Render Science graph to SVG and upload to CDN",
  description: "Renders SVG via CLI, uses Authorization header to upload to MOBIUS.",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: { $ref: "ScienceData#" },
      filePath: { type: "string" },
      contentTags: { type: "string" },
      filename: { type: "string" }
    }
  },
  headers: {
    type: "object",
    properties: { authorization: { type: "string" } },
    required: ["authorization"]
  },
  response: {
    200: {
      description: "Upload result",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
              uploadEndpoint: { type: "string" },
              filename: { type: "string" },
              svgBytes: { type: "number" },
              counters: {
                type: "object",
                properties: {
                  nodeCount: { type: "number" },
                  edgeCount: { type: "number" },
                  bCount: { type: "number" }
                }
              },
              cdn: { type: "object", additionalProperties: true }
            }
          }
        }
      }
    }
  }
};

export default async function renderScienceUploadRouter(app: FastifyInstance) {
  app.post("/v1/render/svg/science/upload", { schema }, postRenderScienceUpload);
}
