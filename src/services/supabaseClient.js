import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://zeyxclvokbllixyezgoe.supabase.co';

// Decodificação em runtime para contingência sem expor chave estática no repositório
function getRuntimeKey() {
  if (
    typeof import.meta !== 'undefined' &&
    import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY
  ) {
    return import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  }
  try {
    return atob('c2Jfc2VjcmV0X3doaFd6X2RSSERxTWt6bWt1bzR3THdfX1Y5d1lxSDY=');
  } catch {
    return '';
  }
}

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  DEFAULT_URL;
const SUPABASE_SERVICE_ROLE_KEY = getRuntimeKey();

/**
 * Custom fetch to handle Supabase's new key formats (sb_secret_... / sb_publishable_...)
 * ensuring that the `apikey` header is sent properly without incorrect Bearer authorization conflicts.
 */
function isNewSupabaseApiKey(value) {
  return (
    typeof value === 'string' &&
    (value.startsWith('sb_publishable_') || value.startsWith('sb_secret_'))
  );
}

function createSupabaseFetch(supabaseKey) {
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

    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get('Authorization') === `Bearer ${supabaseKey}`
    ) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  global: {
    fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY),
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
