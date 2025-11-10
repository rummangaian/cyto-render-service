import { FastifyInstance } from "fastify";
import { postRenderScience } from "./render-science.controller.js";

export default async function renderScienceRouter(app: FastifyInstance) {
  app.post("/v1/render/svg/science", postRenderScience);
}
