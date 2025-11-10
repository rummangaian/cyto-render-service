import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp(async (app) => {
  await app.register(swagger, {
    openapi: {
      info: { title: "Cyto Render Service", version: "0.1.0" },
      servers: [{ url: "/" }]
    }
  });
  await app.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: true }
  });
});
