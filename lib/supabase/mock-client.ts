import { getInitialMockData, type MockDatabase } from "../mock-data";

const STORAGE_KEY = "convene_mock_db_v1";

let memoryDb: MockDatabase | null = null;

export function getMockDb(): MockDatabase {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  if (!memoryDb) {
    memoryDb = getInitialMockData();
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDb));
      } catch {
        // Ignore
      }
    }
  }
  return memoryDb;
}

export function saveMockDb(db: MockDatabase) {
  memoryDb = db;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Ignore
    }
  }
}

interface FilterOp {
  type: "eq" | "neq" | "in" | "match";
  field: string;
  value: unknown;
}

class MockQueryBuilder<T = Record<string, unknown>> implements PromiseLike<{ data: T[] | T | null; error: null }> {
  private tableName: keyof MockDatabase;
  private filters: FilterOp[] = [];
  private orderField?: string;
  private orderAscending = true;
  private orderNullsFirst = false;
  private limitCount?: number;
  private isSingle = false;
  private op: "select" | "insert" | "update" | "delete" = "select";
  private insertPayload?: unknown;
  private updatePayload?: unknown;

  constructor(tableName: keyof MockDatabase) {
    this.tableName = tableName;
  }

  select(_columns = "*") {
    if (this.op !== "insert") {
      this.op = "select";
    }
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push({ type: "eq", field, value });
    return this;
  }

  neq(field: string, value: unknown) {
    this.filters.push({ type: "neq", field, value });
    return this;
  }

  in(field: string, values: unknown[]) {
    this.filters.push({ type: "in", field, value: values });
    return this;
  }

  match(criteria: Record<string, unknown>) {
    this.filters.push({ type: "match", field: "", value: criteria });
    return this;
  }

  order(field: string, opts?: { ascending?: boolean; nullsFirst?: boolean }) {
    this.orderField = field;
    this.orderAscending = opts?.ascending !== false;
    this.orderNullsFirst = opts?.nullsFirst === true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(payload: unknown) {
    this.op = "insert";
    this.insertPayload = payload;
    return this;
  }

  update(payload: unknown) {
    this.op = "update";
    this.updatePayload = payload;
    return this;
  }

  delete() {
    this.op = "delete";
    return this;
  }

  private execute(): { data: T[] | T | null; error: null } {
    const db = getMockDb();
    const tableData = (db[this.tableName] || []) as unknown as Record<string, unknown>[];

    // Handle INSERT
    if (this.op === "insert") {
      const itemsToInsert = Array.isArray(this.insertPayload)
        ? (this.insertPayload as Record<string, unknown>[])
        : [this.insertPayload as Record<string, unknown>];

      const inserted = itemsToInsert.map((item) => {
        const id = (item.id as string) || `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();
        return {
          ...item,
          id,
          created_at: item.created_at || now,
          updated_at: item.updated_at || now,
        };
      });

      (db[this.tableName] as unknown[]) = [...tableData, ...inserted];
      saveMockDb(db);

      const result = Array.isArray(this.insertPayload) ? inserted : inserted[0];
      return { data: result as unknown as T, error: null };
    }

    // Filter rows
    let rows = [...tableData];
    for (const f of this.filters) {
      if (f.type === "eq") {
        rows = rows.filter((r) => r[f.field] === f.value);
      } else if (f.type === "neq") {
        rows = rows.filter((r) => r[f.field] !== f.value);
      } else if (f.type === "in") {
        const list = Array.isArray(f.value) ? f.value : [];
        rows = rows.filter((r) => list.includes(r[f.field]));
      } else if (f.type === "match" && typeof f.value === "object" && f.value !== null) {
        const matchObj = f.value as Record<string, unknown>;
        rows = rows.filter((r) =>
          Object.entries(matchObj).every(([k, v]) => r[k] === v)
        );
      }
    }

    // Handle DELETE
    if (this.op === "delete") {
      const matchingIds = new Set(rows.map((r) => r.id));
      const remaining = tableData.filter((r) => !matchingIds.has(r.id));
      (db[this.tableName] as unknown[]) = remaining;
      saveMockDb(db);
      return { data: rows as unknown as T[], error: null };
    }

    // Handle UPDATE
    if (this.op === "update" && this.updatePayload) {
      const payload = this.updatePayload as Record<string, unknown>;
      const matchingIds = new Set(rows.map((r) => r.id));
      const updatedRows: Record<string, unknown>[] = [];

      (db[this.tableName] as unknown[]) = tableData.map((r) => {
        if (matchingIds.has(r.id)) {
          const updated = {
            ...r,
            ...payload,
            updated_at: new Date().toISOString(),
          };
          updatedRows.push(updated);
          return updated;
        }
        return r;
      });

      saveMockDb(db);
      const res = this.isSingle ? updatedRows[0] || null : updatedRows;
      return { data: res as unknown as T, error: null };
    }

    // Handle SELECT: Sorting
    if (this.orderField) {
      const field = this.orderField;
      const asc = this.orderAscending;
      const nullsFirst = this.orderNullsFirst;

      rows.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return nullsFirst ? -1 : 1;
        if (valB === null || valB === undefined) return nullsFirst ? 1 : -1;

        if (typeof valA === "string" && typeof valB === "string") {
          return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
    }

    // Limit
    if (this.limitCount !== undefined) {
      rows = rows.slice(0, this.limitCount);
    }

    if (this.isSingle) {
      return { data: (rows[0] || null) as unknown as T, error: null };
    }

    return { data: rows as unknown as T[], error: null };
  }

  then<TResult1 = { data: T[] | T | null; error: null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | T | null; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    try {
      const res = this.execute();
      return Promise.resolve(res).then(onfulfilled, onrejected);
    } catch (err) {
      if (onrejected) {
        return Promise.reject(err).then(null, onrejected);
      }
      return Promise.reject(err);
    }
  }
}

export function createMockSupabaseClient() {
  return {
    from(tableName: string) {
      return new MockQueryBuilder(tableName as keyof MockDatabase);
    },

    async rpc(fnName: string, params?: Record<string, unknown>) {
      const db = getMockDb();

      if (fnName === "match_document_chunks") {
        const docs = db.documents || [];
        const queryEmbedding = params?.query_embedding as string | undefined;
        // Search in doc contents
        const matched = docs.map((doc, idx) => ({
          id: `chunk-${doc.id}`,
          document_id: doc.id,
          content: doc.content || "",
          similarity: 0.85 - idx * 0.1,
          created_at: doc.created_at,
        }));
        return { data: matched, error: null };
      }

      return { data: [], error: null };
    },

    auth: {
      async signInWithOAuth() {
        return { data: { url: "/dashboard" }, error: null };
      },
      async getSession() {
        return {
          data: {
            session: {
              access_token: "mock-token",
              user: {
                id: "demo-user-id",
                email: "demo@convene.ai",
                user_metadata: { name: "Demo Club Lead" },
              },
            },
          },
          error: null,
        };
      },
      async getUser() {
        return {
          data: {
            user: {
              id: "demo-user-id",
              email: "demo@convene.ai",
              user_metadata: { name: "Demo Club Lead" },
            },
          },
          error: null,
        };
      },
      async signOut() {
        return { error: null };
      },
      async exchangeCodeForSession(_code: string) {
        return {
          data: {
            session: {
              access_token: "mock-token",
              user: { id: "demo-user-id", email: "demo@convene.ai" },
            },
          },
          error: null,
        };
      },
      onAuthStateChange(callback: (event: string, session: unknown) => void) {
        // Trigger initial state
        setTimeout(() => {
          callback("SIGNED_IN", {
            user: { id: "demo-user-id", email: "demo@convene.ai" },
          });
        }, 10);
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
    },
  };
}
