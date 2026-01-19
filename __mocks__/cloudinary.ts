// Copyright 2025 Poiema Ministries. All Rights Reserved.

// Mock Cloudinary getAssetsFromCollection function
export const getAssetsFromCollection: jest.MockedFunction<
  (collectionId: string, maxResults?: number) => Promise<unknown[]>
> = jest.fn();
