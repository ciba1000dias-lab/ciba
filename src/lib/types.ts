/**
 * Tipos compartidos de CIBA.
 * Derivados de los schemas Zod de src/content/config.ts para no duplicar
 * definiciones, más tipos auxiliares para componentes y navegación.
 */

import type { CollectionEntry } from 'astro:content';

// --- Alias de entrada de colecciones ---
export type SubareaEntry = CollectionEntry<'subareas'>;
export type ArticuloEntry = CollectionEntry<'articulos'>;
export type FAQEntry = CollectionEntry<'faq'>;
export type RecursoEntry = CollectionEntry<'recursos'>;
export type SinonimoEntry = CollectionEntry<'sinonimos'>;

// --- Tipos derivados (payload de datos) ---
export type Subarea = SubareaEntry extends { data: infer D } ? D : never;
export type ArticuloData = ArticuloEntry['data'];
export type FAQ = FAQEntry extends { data: infer D } ? D : never;
export type Recurso = RecursoEntry extends { data: infer D } ? D : never;
export type GrupoSinonimos = SinonimoEntry extends { data: infer D } ? D[number] : never;

// --- Reexport de constantes útiles ---
export type { AreaId, ColorSubarea } from '../content/config';

// --- Tipos de dominio de UI ---

export interface AreaInfo {
  id: 'crianza' | 'informatica' | 'bienestar' | 'acompanamiento';
  nombre: string;
  descripcion: string;
  color: 'coral' | 'turquesa' | 'salvia' | 'lavanda';
  colorHex: string;
  colorSuaveHex: string;
  colorFuerteHex: string;
  icono: string;
  slug: string;
}

export interface ArticuloConSubarea {
  articulo: ArticuloEntry;
  subarea: Subarea;
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

export interface GrupoEdad {
  id: string;
  nombre: string;
  rango: string;
  descripcion: string;
  icono: string;
}

export interface OpcionRespuestaNayara {
  tipo: 'alarma' | 'derivacion' | 'respuesta' | 'sugerencia';
  titulo: string;
  cuerpo: string;
  enlaces?: Array<{ texto: string; url: string; externo?: boolean }>;
  accionWhatsApp?: boolean;
}
