// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useState, useEffect } from 'react';
import { Sermon } from '../common/types/models';
import SermonItem from './sermon-item';

interface SermonsResponse {
  sermons: (Sermon & { _id?: string })[];
  nextCursor: string | null;
  hasMore: boolean;
}

export default function SermonsClient() {
  const [sermons, setSermons] = useState<(Sermon & { _id?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null); // Cursor used to load current page
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]); // Stack of cursors for previous pages
  const [hasNavigated, setHasNavigated] = useState(false); // Track if user has ever navigated

  const loadSermons = async (cursor: string | null = null) => {
    setLoading(true);
    try {
      const cursorParam = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
      const response = await fetch(`/api/sermons${cursorParam}`);

      if (!response.ok) {
        throw new Error('Failed to fetch sermons');
      }

      const data: SermonsResponse = await response.json();

      // Replace sermons (page-based navigation, not append)
      setSermons(data.sermons);

      // Update current cursor to the cursor used to load this page
      setCurrentCursor(cursor);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error loading sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSermons();
  }, []);

  const handleNextPage = () => {
    if (nextCursor && hasMore && !loading) {
      // Store current cursor before navigating to next page
      setCursorHistory((prev) => [...prev, currentCursor]);
      setHasNavigated(true);
      loadSermons(nextCursor);
    }
  };

  const handlePreviousPage = () => {
    if (cursorHistory.length > 0 && !loading) {
      const newHistory = [...cursorHistory];
      const previousCursor = newHistory.pop() || null; // Get and remove the last cursor
      setCursorHistory(newHistory);
      loadSermons(previousCursor);
    }
  };

  const canGoPrevious = cursorHistory.length > 0;

  if (loading && sermons.length === 0) {
    return (
      <div className='flex justify-center items-center w-full px-4 sm:px-6 md:px-8 py-12'>
        <p className='text-lg text-primary-black/70'>Loading sermons...</p>
      </div>
    );
  }

  if (!loading && sermons.length === 0) {
    return (
      <div className='flex justify-center items-center w-full px-4 sm:px-6 md:px-8 py-12'>
        <p className='text-lg text-primary-black/70'>No sermons found.</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center w-full px-4 sm:px-6 md:px-8 py-12'>
          <p className='text-lg text-primary-black/70'>Loading sermons...</p>
        </div>
      ) : (
        <div className='flex flex-col items-start w-full px-4 sm:px-6 md:px-8'>
          {sermons.map((sermon, index) => {
            const isLast = index === sermons.length - 1 && !hasMore;
            return (
              <SermonItem sermon={sermon} key={sermon._id} isLast={isLast} />
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {(hasMore || hasNavigated) && (
        <div className='flex justify-center items-center gap-4 w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8'>
          <button
            onClick={handlePreviousPage}
            disabled={loading || !canGoPrevious}
            className='px-6 py-2.5 border-2 border-primary-black text-primary-black font-semibold rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={loading || !hasMore}
            className='px-6 py-2.5 border-2 border-primary-black text-primary-black font-semibold rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
