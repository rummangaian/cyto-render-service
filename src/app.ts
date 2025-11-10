import Fastify from "fastify";
import sensible from "@fastify/sensible";
import renderRouter from "./api/render.router.js";
import healthRouter from "./api/health.router.js";
import { logger } from "./utils/logger.js";

export function buildApp() {
  const app = Fastify({ logger });
  app.register(sensible);
  app.register(healthRouter);
  app.register(renderRouter);
  return app;
}
