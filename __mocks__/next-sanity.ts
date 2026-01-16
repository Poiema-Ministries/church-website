// Copyright 2025 Poiema Ministries. All Rights Reserved.

// Mock Sanity client
export const createClient = jest.fn(() => ({
  fetch: jest.fn(),
  withConfig: jest.fn(),
}));

// Mock Sanity image URL builder
export const urlFor = jest.fn(() => ({
  url: () => 'https://cdn.sanity.io/images/test/test.jpg',
  width: jest.fn().mockReturnThis(),
  height: jest.fn().mockReturnThis(),
  quality: jest.fn().mockReturnThis(),
  format: jest.fn().mockReturnThis(),
}));
