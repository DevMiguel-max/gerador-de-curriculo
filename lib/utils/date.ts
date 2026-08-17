const MONTHS_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

/** Recebe "YYYY-MM" e devolve "mmm/AAAA", ex.: "2021-06" -> "jun/2021". */
export function formatMonthYear(value: string | undefined): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return value;
  return `${MONTHS_PT[monthIndex]}/${year}`;
}

export function formatDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  current: boolean,
): string {
  const start = formatMonthYear(startDate);
  const end = current ? "atual" : formatMonthYear(endDate);
  if (!start && !end) return "";
  if (!end) return start;
  return `${start} — ${end}`;
}
