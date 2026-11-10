export type SqlCell = string | number | null;
export type SqlResult = {
  columns: string[];
  rows: SqlCell[][];
  truncated: boolean;
};
export type SqlTable = { name: string; columns: string[] };
export type SqlReply = {
  id: number;
  error?: string;
  results?: SqlResult[];
  tables?: SqlTable[];
  snapshot?: Uint8Array;
  changed?: number;
};
export type SqlRequest = {
  id: number;
  setup?: string;
  snapshot?: Uint8Array;
  query?: string;
};
export const maxSqlBytes = 2 * 1024 * 1024;
export function quoteIdentifier(name: string) {
  return '"' + name.replaceAll('"', '""') + '"';
}
