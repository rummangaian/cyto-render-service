// Wrap original SVG into a fixed viewport and translate to center.
// Does not change how the SVG is generated.
export function centerSvg(svg: string, viewportW = 1000, viewportH = 700, padding = 24) {
  const open = svg.match(/<svg[^>]*>/i)?.[0] ?? "";
  const w = Number(/width="([\d.]+)"/i.exec(open)?.[1] ?? 0);
  const h = Number(/height="([\d.]+)"/i.exec(open)?.[1] ?? 0);
  if (!w || !h) return svg; // fallback: nothing to center

  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
  const tx = Math.max(0, (viewportW - w) / 2 + padding);
  const ty = Math.max(0, (viewportH - h) / 2 + padding);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${viewportW}" height="${viewportH}" viewBox="0 0 ${viewportW} ${viewportH}">`,
    `<g transform="translate(${tx},${ty})">`,
    inner,
    `</g></svg>`
  ].join("");
}
