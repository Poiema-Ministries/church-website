// Copyright 2026 Poiema Ministries. All Rights Reserved.

export interface ParsedVerse {
  number: string;
  lines: string[];
}

const LINE_VERSE_PATTERN = /^(\d+)\s*[.)]?\s+(.*)$/;
const INLINE_VERSE_PATTERN = /(\d+)\s+(?=[A-Za-z\u201C\u201D\u2018\u2019"'])/g;

function parseNumberedLines(text: string): ParsedVerse[] | null {
  const verses: ParsedVerse[] = [];

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const match = line.match(LINE_VERSE_PATTERN);
    if (match) {
      verses.push({
        number: match[1],
        lines: match[2] ? [match[2]] : [],
      });
    } else if (verses.length > 0) {
      verses[verses.length - 1].lines.push(line);
    }
  }

  return verses.length > 0 ? verses : null;
}

function parseInlineVerses(text: string): ParsedVerse[] | null {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  const matches = [...collapsed.matchAll(INLINE_VERSE_PATTERN)];

  if (matches.length === 0) {
    return null;
  }

  if (matches.length === 1 && matches[0].index !== 0) {
    return null;
  }

  const verses: ParsedVerse[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const contentStart = match.index! + match[0].length;
    const contentEnd =
      i + 1 < matches.length ? matches[i + 1].index! : collapsed.length;
    const content = collapsed.slice(contentStart, contentEnd).trim();

    if (content) {
      verses.push({ number: match[1], lines: [content] });
    }
  }

  return verses.length > 0 ? verses : null;
}

/**
 * Parses pasted scripture into numbered verses for Bible-app style display.
 * Supports one verse per line (`1 Comfort...`) and inline numbers
 * (`1 Comfort... 2 Speak...`). Continuation lines without numbers are treated
 * as poetry belonging to the previous verse.
 */
export function parseBiblePassage(raw: string): ParsedVerse[] | null {
  const text = raw.replace(/\r\n/g, '\n').trim();
  if (!text) {
    return null;
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const numberedLineCount = lines.filter((line) =>
    LINE_VERSE_PATTERN.test(line),
  ).length;

  if (numberedLineCount >= 2) {
    return parseNumberedLines(text);
  }

  const inline = parseInlineVerses(text);
  if (inline && inline.length >= 2) {
    return inline;
  }

  if (numberedLineCount === 1) {
    return parseNumberedLines(text);
  }

  if (inline && inline.length === 1) {
    return inline;
  }

  return null;
}
