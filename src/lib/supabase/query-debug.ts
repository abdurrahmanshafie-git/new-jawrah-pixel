type SupabaseQueryResult<TData = unknown, TError = unknown> = {
  data?: TData | null;
  error?: TError | null;
  count?: number | null;
  status?: number;
  statusText?: string;
};

export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message);
  }
  return error == null ? 'Unknown Supabase error.' : String(error);
}

export function withSupabaseQueryContext(table: string, error: unknown): Error {
  return Object.assign(new Error(`[${table}] ${getSupabaseErrorMessage(error)}`), { cause: error });
}

export function findFirstSupabaseQueryError(
  queries: Array<{ table: string; error?: unknown | null }>,
) {
  return queries.find((query) => query.error);
}

export async function logSupabaseQuery<T extends SupabaseQueryResult>(
  table: string,
  query: PromiseLike<T>,
): Promise<T> {
  const result = await query;

  console.log('QUERY RESULT:', {
    table,
    data: result.data,
    count: result.count,
    status: result.status,
  });
  console.error('QUERY ERROR:', {
    table,
    error: result.error,
  });

  return result;
}

export async function logSupabaseTask<T>(table: string, task: Promise<T>): Promise<T> {
  try {
    const data = await task;
    console.log('QUERY RESULT:', { table, data });
    console.error('QUERY ERROR:', { table, error: null });
    return data;
  } catch (error) {
    console.log('QUERY RESULT:', { table, data: null });
    console.error('QUERY ERROR:', { table, error });
    throw withSupabaseQueryContext(table, error);
  }
}
