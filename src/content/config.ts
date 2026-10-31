import { defineCollection, z } from 'astro:content';

/**
 * Schemas de contenido de CIBA.
 *
 * NOTA ARQUITECTÓNICA (Paso E.3):
 * Los JSON `subareas.json`, `sinonimos.json`, `faq.json` y `recursos.json`
 * son arrays únicos, no colecciones de Astro. Se tratan como datos estáticos
 * importados desde `src/lib/datos.ts` y validados allí con Zod.
 *
 * Aquí solo se declara la colección `articulos` (archivos .md individuales).
 */

// --- Areas canónicas ---
export const AREAS = ['crianza', 'informatica', 'bienestar', 'acompanamiento'] as const;
export type AreaId = (typeof AREAS)[number];

// --- Colores de subárea (paleta CIBA) ---
export const COLORES_SUBAREA = ['coral', 'turquesa', 'salvia', 'lavanda'] as const;
export type ColorSubarea = (typeof COLORES_SUBAREA)[number];

// --- Niveles de prioridad editorial ---
export const NIVELES_PRIORIDAD = [1, 2, 3] as const;

// --- Artículos (src/content/articulos/*.md) ---
const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^(cri|inf|bie|aco)-\d{2}$/),
    numero: z.number().int().positive(),
    area: z.enum(AREAS),
    subarea: z.string().regex(/^(cri|inf|bie|aco)-\d{2}$/, {
      message: 'La subarea del artículo debe tener forma cri-XX, inf-XX, bie-XX o aco-XX',
    }),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'El slug debe ser kebab-case, sin acentos ni mayúsculas',
      }),
    titulo: z.string().min(10).max(120),
    resumen: z.string().min(40).max(300),
    edad: z
      .array(z.string().min(3))
      .min(1, { message: 'El artículo debe declarar al menos un rango de edad' }),
    estado: z.enum(['borrador', 'revision', 'publicado']),
    tipo: z.literal('articulo'),
    nivel_prioridad: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    autor: z.string().min(3),
    fecha_publicacion: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'fecha_publicacion debe estar en formato YYYY-MM-DD',
      }),
    fecha_revision: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'fecha_revision debe estar en formato YYYY-MM-DD',
      }),
    referencias: z
      .array(z.string().min(10))
      .min(1, { message: 'Cada artículo debe incluir al menos una referencia' }),
  }),
});

export const collections = { articulos };