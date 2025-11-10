import { FastifyInstance } from "fastify";

export default async function healthRouter(app: FastifyInstance) {
  app.get("/health", {
    schema: {
      tags: ["Health"],
      summary: "Liveness probe",
      response: { 200: { type: "object", properties: { ok: { type: "boolean" } } } }
    }
  }, async () => ({ ok: true }));
}
