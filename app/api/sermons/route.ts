// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/client';
import { groq } from 'next-sanity';

const SERMONS_PER_PAGE = 7;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || null;
    const fetchLimit = SERMONS_PER_PAGE + 1; // Fetch one extra to check if there are more

    let query: string;
    const params: Record<string, unknown> = {};

    if (cursor) {
      // Use date as cursor (since we're ordering by date desc)
      // GROQ array slicing doesn't support parameters, so we use template literal for limit
      query = groq`*[_type == "sermon" && date < $cursor] | order(date desc) [0...${fetchLimit}] {
        _id,
        title,
        bibleVerse,
        preacher,
        date,
        url
      }`;
      params.cursor = cursor;
    } else {
      // First page - no cursor
      query = groq`*[_type == "sermon"] | order(date desc) [0...${fetchLimit}] {
        _id,
        title,
        bibleVerse,
        preacher,
        date,
        url
      }`;
    }

    const sermons = await client.fetch(query, params);

    // Check if there are more results
    const hasMore = sermons.length > SERMONS_PER_PAGE;
    const results = hasMore ? sermons.slice(0, SERMONS_PER_PAGE) : sermons;

    // Get the last sermon's date as the next cursor
    const nextCursor =
      hasMore && results.length > 0 && results[results.length - 1].date
        ? new Date(results[results.length - 1].date).toISOString()
        : null;

    return NextResponse.json({
      sermons: results,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching sermons:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch sermons';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
