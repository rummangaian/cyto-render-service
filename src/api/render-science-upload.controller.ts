import { FastifyReply, FastifyRequest } from "fastify";
import {
  ScienceData,
  transformScienceToCytoscape,
} from "../core/transform-science.js";
import { cytoSnap } from "../core/cyto-snap.js";
import { frameSvg } from "../core/svg-frame.js";

type Body = {
  data: ScienceData; 
  filePath?: string; 
  contentTags?: string; 
  filename?: string; 
};

export async function postRenderScienceUpload(
  req: FastifyRequest<{ Body: Body }>,
  reply: FastifyReply
) {
  const auth = req.headers["authorization"];
  if (!auth)
    return reply.code(401).send({ error: "Missing Authorization header" });

  const { data } = (req.body ?? {}) as Body;
  if (!data?.nodes || !data?.edges) {
    return reply
      .code(400)
      .send({ error: "Body.data must contain nodes[] and edges[]" });
  }

  const { cyPayload, counters } = transformScienceToCytoscape(data);
  const rawSvg = await cytoSnap(cyPayload);
  const svg = frameSvg(rawSvg, counters, {
    width: 1000,
    height: 700,
    padding: 24,
    bannerH: 80,
  });

  // Build upload URL
  const base = process.env.MOBIUS_UPLOAD_URL!;
  const url = new URL(base);
  url.searchParams.set(
    "filePath",
    process.env.MOBIUS_DEFAULT_FILE_PATH || "kya"
  );
  url.searchParams.set(
    "contentTags",
    process.env.MOBIUS_DEFAULT_CONTENT_TAGS || "kya"
  );

  // FormData with SVG as file
  const fname = `graph-${Date.now()}.svg`;
  const form = new FormData();
  form.append("file", new Blob([svg], { type: "image/svg+xml" }), fname);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { Authorization: String(auth) },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    return reply.code(res.status).send({
      error: "CDN upload failed",
      status: res.status,
      endpoint: url.toString(),
      response: text,
    });
  }

  const response = await res.json();

  const cdnUrl =`https://cdn.gov-cloud.ai/${response.cdnUrl}`

  return reply.send({
    ok: true,
    uploadEndpoint: url.toString(),
    filename: fname,
    svgBytes: Buffer.byteLength(svg, "utf8"),
    counters,
    cdnUrl: cdnUrl,
    fileId: response.id,
    fileInfo: response.info,
    cdn: response,
  });
}
