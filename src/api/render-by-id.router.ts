import { FastifyInstance } from "fastify";
import { postRenderById } from "./render-by-id.controller.js";

export default async function renderByIdRouter(app: FastifyInstance) {
  app.post("/v1/render/svg/by-id", postRenderById);
}
