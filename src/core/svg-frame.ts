export function frameSvg(
  innerSvg: string,
  counters: { nodeCount: number; edgeCount: number; bCount: number },
  opts?: { width?: number; height?: number; padding?: number; bannerH?: number }
) {
  const width = opts?.width ?? 1000;
  const height = opts?.height ?? 700;
  const padding = opts?.padding ?? 24;
  const bannerH = opts?.bannerH ?? 72;

  const open = innerSvg.match(/<svg[^>]*>/i)?.[0] ?? "";
  const iw = Number(/width="([\d.]+)"/i.exec(open)?.[1] ?? 0);
  const ih = Number(/height="([\d.]+)"/i.exec(open)?.[1] ?? 0);
  if (!iw || !ih) return innerSvg;

  const inner = innerSvg.replace(/^[\s\S]*?<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
  const availW = width - padding * 2;
  const availH = height - bannerH - padding * 2;

  const tx = Math.max(padding, padding + (availW - iw) / 2);
  const ty = Math.max(padding, padding + (availH - ih) / 2);

  const fmt2 = (n: number) => String(n).padStart(2, "0");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>`,
    `<g transform="translate(${tx},${ty})">`,
    inner,
    `</g>`,
    `<g transform="translate(${padding},${height - bannerH + 28})" font-family="Inter, system-ui, sans-serif">`,
    `  <text font-size="36" fill="#1f2937">${fmt2(counters.nodeCount)}</text>`,
    `  <text font-size="24" fill="#6b7280" x="64" y="-2">Nodes</text>`,
    `  <text font-size="36" fill="#1f2937" x="220">${fmt2(counters.edgeCount)}</text>`,
    `  <text font-size="24" fill="#6b7280" x="284" y="-2">Edges</text>`,
    `  <text font-size="36" fill="#1f2937" x="440">${fmt2(counters.bCount)}</text>`,
    `  <text font-size="24" fill="#6b7280" x="504" y="-2">B</text>`,
    `</g>`,
    `</svg>`
  ].join("");
}
