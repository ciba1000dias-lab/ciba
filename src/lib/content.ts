/**
 * Capa de acceso tipado al contenido de CIBA.
 * Centraliza getCollection() y normaliza orden, filtros y validaciones cruzadas.
 */

import { getCollection } from 'astro:content';
import type { AreaId } from '../content/config';
import type {
  ArticuloEntry,
  ArticuloConSubarea,
  FAQ,
  GrupoSinonimos,
  Recurso,
  Subarea,
} from './types';

// --- Mapa de información por área (para header, home, breadcrumbs) ---
import type { AreaInfo } from './types';

export const AREAS_INFO: Record<AreaId, AreaInfo> = {
  crianza: {
    id: 'crianza',
    nombre: 'Crianza',
    descripcion:
      'Vínculo, lactancia, sueño y desarrollo socioemocional en los primeros años.',
    color: 'coral',
    colorHex: '#FF8A7A',
    colorSuaveHex: '#FFE1DC',
    colorFuerteHex: '#E5644F',
    icono: 'crianza.svg',
    slug: 'crianza',
  },
  informatica: {
    id: 'informatica',
    nombre: 'Informática',
    descripcion:
      'Alfabetización digital, pantallas, privacidad y seguridad infantil en línea.',
    color: 'turquesa',
    colorHex: '#3EC5B5',
    colorSuaveHex: '#D6F4F0',
    colorFuerteHex: '#1F9A8C',
    icono: 'informatica.svg',
    slug: 'informatica',
  },
  bienestar: {
    id: 'bienestar',
    nombre: 'Bienestar',
    descripcion:
      'Salud emocional, descanso, corresponsabilidad y autocuidado de la familia.',
    color: 'salvia',
    colorHex: '#8FCB9B',
    colorSuaveHex: '#E3F3E6',
    colorFuerteHex: '#5AA86B',
    icono: 'bienestar.svg',
    slug: 'bienestar',
  },
  acompanamiento: {
    id: 'acompanamiento',
    nombre: 'Acompañamiento',
    descripcion:
      'Orientación práctica, redes de apoyo y acompañamiento sin juzgar.',
    color: 'lavanda',
    colorHex: '#A99BE0',
    colorSuaveHex: '#ECE7F8',
    colorFuerteHex: '#7B69C9',
    icono: 'acompanamiento.svg',
    slug: 'acompanamiento',
  },
};

// --- Subáreas ---

export async function getSubareas(): Promise<Subarea[]> {
  const entries = await getCollection('subareas');
  return entries.map((e) => e.data);
}

export async function getSubareasPorArea(area: AreaId): Promise<Subarea[]> {
  const todas = await getSubareas();
  return todas.filter((s) => s.area === area).sort((a, b) => a.id.localeCompare(b.id));
}

export async function getSubareaPorId(id: string): Promise<Subarea | undefined> {
  const todas = await getSubareas();
  return todas.find((s) => s.id === id);
}

// --- Artículos ---

export async function getArticulos(opciones?: {
  soloPublicados?: boolean;
}): Promise<ArticuloEntry[]> {
  const entries = await getCollection(
    'articulos',
    (entry) => !opciones?.soloPublicados || entry.data.estado === 'publicado'
  );
  return entries.sort((a, b) => {
    if (a.data.area !== b.data.area) return a.data.area.localeCompare(b.data.area);
    if (a.data.numero !== b.data.numero) return a.data.numero - b.data.numero;
    return a.data.titulo.localeCompare(b.data.titulo);
  });
}

export async function getArticulosPorArea(area: AreaId): Promise<ArticuloEntry[]> {
  const articulos = await getArticulos({ soloPublicados: true });
  return articulos.filter((a) => a.data.area === area);
}

export async function getArticulosPorSubarea(subareaId: string): Promise<ArticuloConSubarea[]> {
  const [articulos, subarea] = await Promise.all([
    getArticulos({ soloPublicados: true }),
    getSubareaPorId(subareaId),
  ]);
  if (!subarea) {
    throw new Error(
      `[CIBA] No existe subárea con id "${subareaId}". Revisa subareas.json y el frontmatter del artículo.`
    );
  }
  return articulos
    .filter((a) => a.data.subarea === subareaId)
    .map((articulo) => ({ articulo, subarea }));
}

export async function getArticuloPorSlug(slug: string): Promise<ArticuloEntry | undefined> {
  const articulos = await getArticulos();
  return articulos.find((a) => a.data.slug === slug);
}

// --- FAQ ---

export async function getFAQs(filtro?: { area?: AreaId; tema_id?: string }): Promise<FAQ[]> {
  const entries = await getCollection('faq');
  let faqs = entries.map((e) => e.data);
  if (filtro?.area) faqs = faqs.filter((f) => f.area === filtro.area);
  if (filtro?.tema_id) faqs = faqs.filter((f) => f.tema_id === filtro.tema_id);
  return faqs;
}

// --- Recursos ---

export async function getRecursos(soloVerificados = true): Promise<Recurso[]> {
  const entries = await getCollection('recursos');
  const recursos = entries.map((e) => e.data);
  return (soloVerificados ? recursos.filter((r) => r.verificado) : recursos).sort(
    (a, b) => a.nombre.localeCompare(b.nombre)
  );
}

// --- Sinónimos ---

export async function getSinonimos(): Promise<GrupoSinonimos[]> {
  const entries = await getCollection('sinonimos');
  return entries.flatMap((e) => e.data);
}

// --- Validación cruzada (llamada desde scripts/validar-contenido.mjs) ---

export async function validarIntegridadContenido(): Promise<string[]> {
  const errores: string[] = [];
  const [subareas, articulos] = await Promise.all([getSubareas(), getArticulos()]);
  const subareaIds = new Set(subareas.map((s) => s.id));
  const articulosPorSubarea = new Map<string, number>();

  for (const art of articulos) {
    if (!subareaIds.has(art.data.subarea)) {
      errores.push(
        `Artículo "${art.data.slug}" apunta a subarea "${art.data.subarea}" que no existe en subareas.json.`
      );
    } else {
      articulosPorSubarea.set(
        art.data.subarea,
        (articulosPorSubarea.get(art.data.subarea) ?? 0) + 1
      );
    }
  }

  for (const sa of subareas) {
    const n = articulosPorSubarea.get(sa.id) ?? 0;
    if (n === 0) {
      errores.push(`Subárea "${sa.id}" (${sa.nombre}) no tiene ningún artículo publicado.`);
    }
  }

  return errores;
}
