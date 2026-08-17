import type { FieldState, ListField } from "@/types/resume";

/**
 * Regra única de renderização condicional (seção 25): uma seção só
 * aparece no preview/PDF se tiver conteúdo real e não tiver sido marcada
 * como "not_available" pelo usuário. Templates NUNCA devem checar
 * `.value` ou `.items.length` diretamente — sempre via estas funções, para
 * manter a regra consistente em todos os 6 templates.
 */

export function hasValue<T>(field: FieldState<T>): boolean {
  return field.status === "provided" && field.value !== null && field.value !== "";
}

export function hasItems<T>(list: ListField<T>): boolean {
  return list.status === "provided" && list.items.length > 0;
}

export function isDeclaredAbsent(
  field: FieldState<unknown> | ListField<unknown>,
): boolean {
  return field.status === "not_available";
}

export function isUndecided(
  field: FieldState<unknown> | ListField<unknown>,
): boolean {
  return field.status === "not_provided";
}

/** Para campos de texto livre que não usam o padrão de 3 estados (ex.: professionalSummary, objective). */
export function hasText(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0);
}
