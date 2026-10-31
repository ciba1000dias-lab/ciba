/**
 * Datos estáticos de CIBA.
 */
import { z } from 'astro:content';
import subareasJson from '../content/subareas/subareas.json';
import sinonimosJson from '../content/sinonimos/sinonimos.json';
import faqJson from '../content/faq/faq.json';
import recursosJson from '../content/recursos/recursos.json';
import { AREAS, COLORES_SUBAREA } from '../content/config';

const SubareaSchema = z.object({
  id: z.string().regex(/^(cri|inf|bie|aco)-\d{2}$/),
  area: z.enum(AREAS),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  nombre: z.string().min(3).max(80),
  descripcion: z.string().min(10).max(240),
  icono: z.string().regex(/\.svg$/),
  color: z.enum(COLORES_SUBAREA),
});

export const subareas = z.array(SubareaSchema).length(32).parse(subareasJson);

const SinonimoSchema = z.object({
  id: z.string().min(2),
  terminos: z.array(z.string().min(2)).min(2),
  tema_id: z.string().min(2),
  nota: z.string().optional(),
});

export const sinonimos = z.array(SinonimoSchema).min(1).parse(sinonimosJson);

const FaqSchema = z.object({
  id: z.string().min(2),
  pregunta: z.string().min(8).max(200),
  respuesta_corta: z.string().min(20).max(400),
  tema_id: z.string().min(2),
  edad: z.string().min(2),
  area: z.enum(AREAS),
});

export const faq = z.array(FaqSchema).min(1).parse(faqJson);

const RecursoSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  nombre: z.string().min(5).max(160),
  institucion: z.string().min(2).max(80),
  pais: z.string().min(2).max(60),
  url: z.string().url(),
  descripcion: z.string().min(20).max(300),
  temas: z.array(z.string().min(2)).min(1),
  idioma: z.enum(['es', 'en', 'pt']),
  verificado: z.boolean(),
  fecha_verificacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  logo: z.string().regex(/\.svg$/),
});

export const recursos = z.array(RecursoSchema).min(1).parse(recursosJson);
