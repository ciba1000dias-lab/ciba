/**
 * Tipos de dominio de CIBA.
 *
 * Tras el Paso E.3, solo `articulos` es una colección de Astro.
 * `subareas`, `sinonimos`, `faq` y `recursos` viven en `src/lib/datos.ts`
 * como datos estáticos validados con Zod. Sus tipos se derivan de allí.
 */
import type { CollectionEntry } from 'astro:content';
import type {
  subareas as subareasData,
  sinonimos as sinonimosData,
  faq as faqData,
  recursos as recursosData,
} from './datos';
import type { AreaId, ColorSubarea } from '../content/config';

// --- Alias de entrada de la única colección real ---
export type ArticuloEntry = CollectionEntry<'articulos'>;
export type ArticuloData = ArticuloEntry['data'];

// --- Tipos derivados de los datos estáticos (vía Zod) ---
export type Subarea = (typeof subareasData)[number];
export type Sinonimo = (typeof sinonimosData)[number];
export type FAQ = (typeof faqData)[number];
export type Recurso = (typeof recursosData)[number];
export type GrupoSinonimos = Sinonimo;

// --- Reexport de constantes útiles ---
export type { AreaId, ColorSubarea };

// --- Tipos de dominio de UI ---

export interface AreaInfo {
  id: AreaId;
  nombre: string;
  descripcion: string;
  color: ColorSubarea;
  colorHex: string;
  colorSuaveHex: string;
  colorFuerteHex: string;
  icono: string;
  slug: string;
}

export interface SubareaInfo {
  id: string;
  area: AreaId;
  slug: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: ColorSubarea;
}

export interface ArticuloConSubarea {
  articulo: ArticuloEntry;
  subarea: Subarea;
}

export interface GrupoEdad {
  id: string;
  nombre: string;
  rango: string;
  descripcion: string;
  icono: string;
}

export interface ResultadoBusqueda {
  tipo: 'articulo' | 'subarea' | 'faq' | 'recurso';
  id: string;
  titulo: string;
  extracto: string;
  url: string;
  area?: AreaId;
  subarea?: string;
  edad?: string[];
  prioridad?: number;
}

export interface OpcionRespuestaNayara {
  tipo: 'alarma' | 'derivacion' | 'respuesta' | 'sugerencia';
  titulo: string;
  cuerpo: string;
  enlaces?: Array<{ texto: string; url: string; externo?: boolean }>;
  accionWhatsApp?: boolean;
}
