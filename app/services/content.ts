// Copyright 2026 Poiema Ministries. All Rights Reserved.

import type { PortableTextBlock } from '@portabletext/types';
import { urlFor } from '@/sanity/lib/image';
import type {
  ServiceItem,
  ServicesContent,
  ServicesJoinUs,
} from '@/app/common/types/models';

export interface ServiceImage {
  alt?: string;
  asset?: {
    _ref?: string;
    _id?: string;
  };
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface ServiceDocument {
  _id: string;
  title?: string;
  description?: PortableTextBlock[];
  order?: number;
  image?: ServiceImage;
}

export interface ServicesPageDocument {
  description?: string;
  address?: string;
}

export interface ServicesQueryResult {
  services?: ServiceDocument[];
  joinUs?: ServicesPageDocument | null;
}

function serviceImageUrl(image: ServiceImage | undefined): string | null {
  if (!image?.asset) return null;

  try {
    return urlFor(image).width(800).quality(90).url();
  } catch (error) {
    console.error('Unable to build a service image URL', error);
    return null;
  }
}

function toServiceItem(service: ServiceDocument): ServiceItem | null {
  const title = service.title?.trim();
  if (!title) return null;

  return {
    _id: service._id,
    title,
    description: Array.isArray(service.description) ? service.description : [],
    imageUrl: serviceImageUrl(service.image),
    imageAlt: service.image?.alt?.trim() || title,
    order: typeof service.order === 'number' ? service.order : 0,
  };
}

function toJoinUs(
  joinUs: ServicesPageDocument | null | undefined,
): ServicesJoinUs | null {
  const description = joinUs?.description?.trim() ?? '';
  const address = joinUs?.address?.trim() ?? '';

  if (!description && !address) return null;

  return { description, address };
}

export function toServicesContent(
  result: ServicesQueryResult,
): ServicesContent {
  const services = (result.services ?? [])
    .map(toServiceItem)
    .filter((service): service is ServiceItem => service !== null);

  return {
    services,
    joinUs: toJoinUs(result.joinUs),
  };
}
