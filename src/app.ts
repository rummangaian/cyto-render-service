// src/app.ts
import Fastify from "fastify";
import sensible from "@fastify/sensible";
import renderRouter from "./api/render.router.js";
import healthRouter from "./api/health.router.js";

export function buildApp() {
  const app = Fastify({
    logger:
      process.env.NODE_ENV === "production"
        ? { level: process.env.LOG_LEVEL || "info" }
        : {
            level: process.env.LOG_LEVEL || "debug",
            // optional pretty logs in dev if you install pino-pretty (dev dep)
            // transport: { target: "pino-pretty", options: { singleLine: true } }
          },
  });

  app.register(sensible);
  app.register(healthRouter);
  app.register(renderRouter);
  return app;
}
