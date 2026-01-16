// Copyright 2025 Poiema Ministries. All Rights Reserved.

// Mock Sanity client
export const client = {
  fetch: jest.fn() as jest.MockedFunction<
    <T = unknown>(query: string, params?: Record<string, unknown>) => Promise<T>
  >,
};
