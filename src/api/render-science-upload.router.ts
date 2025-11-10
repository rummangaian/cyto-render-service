// src/api/render-science-upload.router.ts
import { FastifyInstance } from "fastify";
import { postRenderScienceUpload } from "./render-science-upload.controller.js";

const schema = {
  summary: "Render Science graph to SVG and upload to CDN",
  description:
    "Takes Science-shaped graph data, renders SVG via Cytoscape CLI, uploads to MOBIUS content service. Uses Authorization header.",
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: { type: "object" }, // keep loose to match your dynamic shape
      filePath: {
        type: "string",
        description: "Overrides MOBIUS_DEFAULT_FILE_PATH",
      },
      contentTags: {
        type: "string",
        description: "Overrides MOBIUS_DEFAULT_CONTENT_TAGS",
      },
      filename: {
        type: "string",
        description: "Filename for the uploaded SVG",
      },
    },
  },
  headers: {
    type: "object",
    properties: {
      authorization: { type: "string" },
    },
    required: ["authorization"],
  },
  response: {
    200: {
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
            bCount: { type: "number" },
          },
        },
        cdnUrl: { type: "string" },
        fileId: { type: "string" },
        fileInfo: { type: "object", additionalProperties: true },
        cdn: { type: "object", additionalProperties: true },
      },
    },
  },
  consumes: ["application/json"],
};

export default async function renderScienceUploadRouter(app: FastifyInstance) {
  app.post(
    "/v1/render/svg/science/upload",
    { schema },
    postRenderScienceUpload
  );
}
