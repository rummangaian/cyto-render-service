import fp from "fastify-plugin";

export default fp(async (app) => {
  app.addSchema({
    $id: "CytoscapeNode",
    type: "object",
    properties: { data: { type: "object", additionalProperties: true } },
    required: ["data"],
    additionalProperties: false
  });

  app.addSchema({
    $id: "CytoscapeEdge",
    type: "object",
    properties: { data: { type: "object", additionalProperties: true } },
    required: ["data"],
    additionalProperties: false
  });

  app.addSchema({
    $id: "RenderElements",
    type: "object",
    properties: {
      elements: {
        type: "object",
        properties: {
          nodes: { type: "array", items: { $ref: "CytoscapeNode#" } },
          edges: { type: "array", items: { $ref: "CytoscapeEdge#" } }
        },
        required: ["nodes", "edges"],
        additionalProperties: true
      },
      layout: { type: "object", additionalProperties: true },
      width: { type: "number" },
      height: { type: "number" }
    },
    required: ["elements"],
    additionalProperties: true
  });

  app.addSchema({
    $id: "RenderNodesEdges",
    type: "object",
    properties: {
      nodes: { type: "array", items: { $ref: "CytoscapeNode#" } },
      edges: { type: "array", items: { $ref: "CytoscapeEdge#" } },
      layout: { type: "object", additionalProperties: true },
      width: { type: "number" },
      height: { type: "number" }
    },
    required: ["nodes", "edges"],
    additionalProperties: true
  });

  app.addSchema({
    $id: "ScienceNode",
    type: "object",
    properties: {
      internalId: { type: ["number", "string"] },
      id: { type: "string" },
      labels: { type: "array", items: { type: "string" } },
      properties: { type: "object", additionalProperties: true }
    },
    required: ["internalId", "id", "labels"],
    additionalProperties: true
  });

  app.addSchema({
    $id: "ScienceEdge",
    type: "object",
    properties: {
      start: { type: ["number", "string"] },
      end: { type: ["number", "string"] },
      internalId: { type: ["number", "string"] },
      id: { type: ["number", "string"] },
      type: { type: "string" },
      properties: { type: "object", additionalProperties: true }
    },
    required: ["start", "end"],
    additionalProperties: true
  });

  app.addSchema({
    $id: "ScienceData",
    type: "object",
    properties: {
      meta: { type: "object", additionalProperties: true },
      nodes: { type: "array", items: { $ref: "ScienceNode#" } },
      edges: { type: "array", items: { $ref: "ScienceEdge#" } }
    },
    required: ["nodes", "edges"],
    additionalProperties: true
  });
});
