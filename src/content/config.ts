import { defineCollection, z } from 'astro:content';

/**
 * Schemas de contenido de CIBA.
 * Validación en build: si un artículo tiene una subarea inexistente,
 * un campo faltante o un tipo incorrecto, `astro check`/`astro build`
 * fallan con mensaje claro. Regla 3 del super prompt.
 */

// --- Areas canónicas ---
export const AREAS = ['crianza', 'informatica', 'bienestar', 'acompanamiento'] as const;
export type AreaId = (typeof AREAS)[number];

// --- Colores de subárea (paleta CIBA) ---
export const COLORES_SUBAREA = ['coral', 'turquesa', 'salvia', 'lavanda'] as const;
export type ColorSubarea = (typeof COLORES_SUBAREA)[number];

// --- Niveles de prioridad editorial ---
export const NIVELES_PRIORIDAD = [1, 2, 3] as const;

// --- Subáreas (src/content/subareas.json) ---
const subareas = defineCollection({
  type: 'data',
  schema: z
    .object({
      id: z.string().regex(/^(cri|inf|bie|aco)-\d{2}$/, {
        message: 'El id de subárea debe tener forma cri-XX, inf-XX, bie-XX o aco-XX',
      }),
      area: z.enum(AREAS),
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          message: 'El slug debe ser kebab-case, sin acentos ni mayúsculas',
        }),
      nombre: z.string().min(3).max(80),
      descripcion: z.string().min(10).max(240),
      icono: z.string().regex(/\.svg$/, {
        message: 'El icono debe ser un archivo .svg',
      }),
      color: z.enum(COLORES_SUBAREA),
    })
    .array()
    .length(32, {
      message: 'subareas.json debe contener exactamente 32 subáreas (8 por área)',
    }),
});

// --- Sinónimos pediátricos (src/content/sinonimos.json) ---
const sinonimos = defineCollection({
  type: 'data',
  schema: z
    .object({
      id: z.string().min(2),
      terminos: z.array(z.string().min(2)).min(2, {
        message: 'Cada grupo de sinónimos necesita al menos 2 términos',
      }),
      tema_id: z.string().min(2),
      nota: z.string().optional(),
    })
    .array()
    .min(1),
});

// --- FAQ (src/content/faq.json) ---
const faq = defineCollection({
  type: 'data',
  schema: z
    .object({
      id: z.string().min(2),
      pregunta: z.string().min(8).max(200),
      respuesta_corta: z.string().min(20).max(400),
      tema_id: z.string().min(2),
      edad: z.string().min(2),
      area: z.enum(AREAS),
    })
    .array()
    .min(1),
});

// --- Recursos verificados (src/content/recursos.json) ---
const recursos = defineCollection({
  type: 'data',
  schema: z
    .object({
      id: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          message: 'El id del recurso debe ser kebab-case',
        }),
      nombre: z.string().min(5).max(160),
      institucion: z.string().min(2).max(80),
      pais: z.string().min(2).max(60),
      url: z.string().url({
        message: 'La URL del recurso debe ser válida (https://...)',
      }),
      descripcion: z.string().min(20).max(300),
      temas: z.array(z.string().min(2)).min(1),
      idioma: z.enum(['es', 'en', 'pt']),
      verificado: z.boolean(),
      fecha_verificacion: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: 'fecha_verificacion debe estar en formato YYYY-MM-DD',
        }),
      logo: z.string().regex(/\.svg$/, {
        message: 'El logo debe ser un archivo .svg',
      }),
    })
    .array()
    .min(1),
});

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

export const collections = {
  subareas,
  sinonimos,
  faq,
  recursos,
  articulos,
};
