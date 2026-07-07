/**
 * Minimal ambient types for Node's built-in `node:sqlite` module — the running
 * Node (24.x) ships it, but @types/node@20 doesn't declare it yet. Covers only
 * the subset used by src/lib/db.ts.
 */
declare module "node:sqlite" {
  interface StatementSync {
    run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  }
  export class DatabaseSync {
    constructor(location: string, options?: { readOnly?: boolean });
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
