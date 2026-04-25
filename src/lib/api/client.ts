import { ZodSchema } from 'zod';

import { env } from '@/config/env';
import { getAccessToken } from '@/lib/auth/tokenStorage';

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload: unknown
  ) {
    super(message);
  }
}

export async function apiRequest<TResponse>(
  path: string,
  schema: ZodSchema<TResponse>,
  options: ApiRequestOptions = {}
) {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth) {
    const token = await getAccessToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    headers,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError('API request failed', response.status, payload);
  }

  return schema.parse(payload);
}
