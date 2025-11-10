import type cytoscape from "cytoscape";
import { z } from "zod";

export const ElementsSchema = z.object({
  nodes: z.array(z.any()).default([]),
  edges: z.array(z.any()).default([])
});

export const StyleSchema = z.array(z.any()).optional();

export const LayoutSchema = z
  .object({
    name: z.string().default("breadthfirst")
  })
  .passthrough()
  .optional();

export const RenderRequestSchema = z.object({
  elements: ElementsSchema,
  style: StyleSchema,
  layout: LayoutSchema
});

export type RenderRequest = z.infer<typeof RenderRequestSchema>;
export type ElementDefinition = cytoscape.ElementDefinition;
