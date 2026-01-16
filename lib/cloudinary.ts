import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// Note: API secret should NOT be exposed to the client (no NEXT_PUBLIC_ prefix)
cloudinary.config({
  cloud_name:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Server-only, never expose to client
});

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  context?: {
    alt?: string;
    caption?: string;
    [key: string]: unknown;
  };
  metadata?: {
    description?: string;
    caption?: string;
    [key: string]: unknown;
  };
}

/**
 * Fetches images from a specific folder in Cloudinary with pagination
 * @param folderName - The folder name in Cloudinary (e.g., 'archives')
 * @param maxResults - Maximum number of results to return (default: 20)
 * @param nextCursor - Cursor for pagination (optional)
 * @returns Object containing images array and next cursor
 */
export async function getImagesFromFolder(
  folderName: string,
  maxResults: number = 20,
  nextCursor?: string,
): Promise<{ images: CloudinaryImage[]; nextCursor: string | null }> {
  try {
    // Validate environment variables
    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey =
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName) {
      throw new Error(
        'CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set',
      );
    }
    if (!apiKey) {
      throw new Error(
        'CLOUDINARY_API_KEY or NEXT_PUBLIC_CLOUDINARY_API_KEY is not set',
      );
    }
    if (!apiSecret) {
      throw new Error('CLOUDINARY_API_SECRET is not set');
    }

    let searchQuery = cloudinary.search
      .expression(`folder:${folderName}/*`)
      .sort_by('created_at', 'desc')
      .max_results(maxResults);

    if (nextCursor) {
      searchQuery = searchQuery.next_cursor(nextCursor);
    }

    const result = await searchQuery.execute();

    interface CloudinaryResource {
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      format: string;
      resource_type: string;
    }

    const images = (result.resources || []).map((resource: CloudinaryResource) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      resource_type: resource.resource_type,
    }));

    return {
      images,
      nextCursor: result.next_cursor || null,
    };
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    throw error;
  }
}

/**
 * Fetches assets from a Cloudinary collection/folder
 * @param collectionName - The collection/folder name (e.g., 'covers')
 * @param maxResults - Maximum number of results to return (default: 100)
 * @returns Array of assets with their metadata
 */
export async function getAssetsFromCollection(
  collectionName: string,
  maxResults: number = 100,
): Promise<CloudinaryImage[]> {
  try {
    // Validate environment variables
    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey =
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName) {
      throw new Error(
        'CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set',
      );
    }
    if (!apiKey) {
      throw new Error(
        'CLOUDINARY_API_KEY or NEXT_PUBLIC_CLOUDINARY_API_KEY is not set',
      );
    }
    if (!apiSecret) {
      throw new Error('CLOUDINARY_API_SECRET is not set');
    }

    // Search for assets in the collection folder
    const searchQuery = cloudinary.search
      .expression(`folder:${collectionName}/*`)
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .with_field('context')
      .with_field('metadata');

    const result = await searchQuery.execute();

    interface CloudinaryResourceWithMetadata {
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      format: string;
      resource_type: string;
      context?: {
        alt?: string;
        caption?: string;
        [key: string]: unknown;
      };
      metadata?: {
        description?: string;
        caption?: string;
        [key: string]: unknown;
      };
    }

    const assets: CloudinaryImage[] = (result.resources || []).map(
      (resource: CloudinaryResourceWithMetadata) => ({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        resource_type: resource.resource_type,
        context: resource.context,
        metadata: resource.metadata,
      }),
    );

    return assets;
  } catch (error) {
    console.error('Error fetching assets from Cloudinary collection:', error);
    throw error;
  }
}

export { cloudinary };
