// Copyright 2026 Poiema Ministries. All Rights Reserved.

export const DEFAULT_OFFERING_LABEL =
  'Your generosity helps us serve our community.';

export const DEFAULT_GIVE_NOW_URL =
  'https://tithe.ly/give_new/www/#/tithely/give-one-time/1285769';

export const DEFAULT_WHY_WE_GIVE =
  'Tithing is an act of worship and an expression of our gratitude to God. By returning a portion of what He has provided, we acknowledge that He is the source of every blessing in our lives. Your generosity allows us to continue our mission of sharing the Gospel and serving our local community. As 2 Corinthians 9:7 reminds us, “God loves a cheerful giver.”';

export interface OfferingPageDocument {
  label?: string;
  giveNowUrl?: string;
  whyWeGive?: string;
}

export interface OfferingContent {
  label: string;
  giveNowUrl: string;
  whyWeGive: string;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function toOfferingContent(
  document: OfferingPageDocument | null | undefined,
): OfferingContent {
  const label = document?.label?.trim() || DEFAULT_OFFERING_LABEL;
  const giveNowUrl = document?.giveNowUrl?.trim() ?? '';
  const whyWeGive = document?.whyWeGive?.trim() || DEFAULT_WHY_WE_GIVE;

  return {
    label,
    giveNowUrl: isHttpUrl(giveNowUrl) ? giveNowUrl : DEFAULT_GIVE_NOW_URL,
    whyWeGive,
  };
}
