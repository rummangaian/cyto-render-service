import { FastifyInstance } from "fastify";
import { postRenderSvg } from "./render.controller.js";
export default async function renderRouter(app: FastifyInstance) {
  app.post("/v1/render/svg", postRenderSvg);
}
