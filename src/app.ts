import Fastify from "fastify";
import sensible from "@fastify/sensible";
import renderRouter from "./api/render.router.js";
import renderByIdRouter from "./api/render-by-id.router.js";
import healthRouter from "./api/health.router.js";

export function buildApp() {
  const app = Fastify({
    logger:
      process.env.NODE_ENV === "production"
        ? { level: process.env.LOG_LEVEL || "info" }
        : { level: process.env.LOG_LEVEL || "debug" },
  });

  app.register(sensible);
  app.register(healthRouter);
  app.register(renderRouter);
  app.register(renderByIdRouter);
  return app;
}
