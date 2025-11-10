import { FastifyInstance } from "fastify";

export default async function healthRouter(app: FastifyInstance) {
  app.get("/health", async () => ({ ok: true }));
}
