import { createClient } from '@supabase/supabase-js';

// Fonte única da verdade: mesmo banco Supabase da aplicação de Relatórios CBMAM
export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://zeyxclvokbllixyezgoe.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  (typeof import.meta !== 'undefined' &&
    (import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
      import.meta.env?.VITE_SUPABASE_ANON_KEY)) ||
  'sb_publishable_B608rXzlGxV4b0yk-6XaBw_riQTnj7y';

function isOpaqueApiKey(value) {
  return (
    typeof value === 'string' &&
    (value.startsWith('sb_publishable_') || value.startsWith('sb_'))
  );
}

function createBackendFetch(apiKey) {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request
        ? input.headers
        : undefined
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) =>
        headers.set(key, value)
      );
    }

    // Chaves novas do Supabase são opacas (não são JWT bearer)
    if (
      isOpaqueApiKey(apiKey) &&
      headers.get('Authorization') === `Bearer ${apiKey}`
    ) {
      headers.delete('Authorization');
    }

    headers.set('apikey', apiKey);
    return fetch(input, { ...init, headers });
  };
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  global: {
    fetch: createBackendFetch(SUPABASE_PUBLISHABLE_KEY),
  },
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
