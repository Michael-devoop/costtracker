import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Cache the client within a single request lifecycle (Next.js deduplicates cookies() calls)
let cachedPromise: ReturnType<typeof buildClient> | null = null;

async function buildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

export async function createClient() {
  // In server components/API routes, cookies() is deduped per-request by Next.js,
  // but createServerClient() setup is not — so we cache the promise within
  // the same event loop tick to avoid redundant client construction.
  if (!cachedPromise) {
    cachedPromise = buildClient();
    // Clear cache after current microtask to avoid cross-request leaking
    queueMicrotask(() => {
      cachedPromise = null;
    });
  }
  return cachedPromise;
}
