// Copyright 2025 Poiema Ministries. All Rights Reserved.

import 'server-only';
import { createClient, type SanityClient } from '@sanity/client';

import { apiVersion, dataset, projectId } from '../env';

let cached: SanityClient | null = null;

/**
 * Returns a server-side Sanity client with write access. Reads the
 * SANITY_WRITE_TOKEN environment variable lazily so build-time evaluation
 * does not crash when the secret is absent. The returned client must NEVER
 * be imported from a Client Component or from any code that ends up in the
 * browser bundle. The `import 'server-only'` directive at the top of this
 * file enforces that constraint at build time.
 */
export function getServerSanityClient(): SanityClient {
  if (cached) return cached;

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      'Missing SANITY_WRITE_TOKEN. Set it in .env.local (and your deploy env) to enable writes to Sanity.',
    );
  }

  cached = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: 'raw',
  });

  return cached;
}
