// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { parseBiblePassage } from '@/app/common/utils/parse-bible-passage';

describe('parseBiblePassage', () => {
  it('returns null for empty text', () => {
    expect(parseBiblePassage('')).toBeNull();
    expect(parseBiblePassage('   \n  ')).toBeNull();
  });

  it('returns null when there are no verse numbers', () => {
    expect(
      parseBiblePassage('Comfort, comfort my people, says your God.'),
    ).toBeNull();
  });

  it('parses one verse per line', () => {
    const result = parseBiblePassage(
      '1 Comfort, comfort my people, says your God.\n2 Speak tenderly to Jerusalem.',
    );

    expect(result).toEqual([
      { number: '1', lines: ['Comfort, comfort my people, says your God.'] },
      { number: '2', lines: ['Speak tenderly to Jerusalem.'] },
    ]);
  });

  it('treats unnumbered lines as poetry continuation', () => {
    const result = parseBiblePassage(
      '1 Comfort, comfort my people, says your God.\n2 Speak tenderly to Jerusalem,\nand cry to her\nthat her warfare is ended.',
    );

    expect(result).toEqual([
      { number: '1', lines: ['Comfort, comfort my people, says your God.'] },
      {
        number: '2',
        lines: [
          'Speak tenderly to Jerusalem,',
          'and cry to her',
          'that her warfare is ended.',
        ],
      },
    ]);
  });

  it('skips a heading before the first numbered verse', () => {
    const result = parseBiblePassage(
      'Comfort for God\'s People\n1 Comfort, comfort my people, says your God.\n2 Speak tenderly to Jerusalem.',
    );

    expect(result?.[0]).toEqual({
      number: '1',
      lines: ['Comfort, comfort my people, says your God.'],
    });
    expect(result).toHaveLength(2);
  });

  it('parses inline verse numbers in a single paragraph', () => {
    const result = parseBiblePassage(
      '1 Comfort, comfort my people, says your God. 2 Speak tenderly to Jerusalem.',
    );

    expect(result).toEqual([
      { number: '1', lines: ['Comfort, comfort my people, says your God.'] },
      { number: '2', lines: ['Speak tenderly to Jerusalem.'] },
    ]);
  });

  it('parses a single numbered verse', () => {
    expect(parseBiblePassage('1 Comfort, comfort my people, says your God.')).toEqual([
      { number: '1', lines: ['Comfort, comfort my people, says your God.'] },
    ]);
  });

  it('accepts verse numbers with a trailing period', () => {
    const result = parseBiblePassage(
      '1. Comfort, comfort my people, says your God.\n2. Speak tenderly to Jerusalem.',
    );

    expect(result?.[0].number).toBe('1');
    expect(result?.[1].number).toBe('2');
  });
});
