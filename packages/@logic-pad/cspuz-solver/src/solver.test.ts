import { describe, expect, test } from '@jest/globals';
import { PuzzleData, solveLogicPad, Tile } from './solverBridge.js';

function makeTilesData(data: string[]): Tile[][] {
  const ret: Tile[][] = [];
  for (let y = 0; y < data.length; ++y) {
    const row: Tile[] = [];
    for (let x = 0; x < data[y].length; ++x) {
      const c = data[y].charAt(x);

      if (c == 'O') {
        row.push({ exists: true, fixed: true, color: 'light' });
      } else if (c == '#') {
        row.push({ exists: true, fixed: true, color: 'dark' });
      } else if (c == '.') {
        row.push({ exists: true, fixed: false, color: 'gray' });
      } else if (c == ' ') {
        row.push({ exists: false, fixed: false, color: 'gray' });
      }
    }
    ret.push(row);
  }
  return ret;
}

function makeExpectedData(data: string[]): ('dark' | 'light' | null)[][] {
  const ret: ('dark' | 'light' | null)[][] = [];
  for (let y = 0; y < data.length; ++y) {
    const row: ('dark' | 'light' | null)[] = [];
    for (let x = 0; x < data[y].length; ++x) {
      const c = data[y].charAt(x);

      if (c == 'O') {
        row.push('light');
      } else if (c == '#') {
        row.push('dark');
      } else {
        row.push(null);
      }
    }
    ret.push(row);
  }
  return ret;
}

test('connectAll', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 3,
    connections: [],
    tiles: makeTilesData([' ....', '..#..', 'O.#.O']),
    rules: [{ type: 'connectAll', color: 'light' }],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData([' OOO.', '.O#..', 'O.#.O']));
});

test('connectAllBoth', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['..O..', '.....', '#....', '..#O.']),
    rules: [
      { type: 'connectAll', color: 'light' },
      { type: 'connectAll', color: 'dark' },
    ],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['..OOO', '....O', '#...O', '###OO']));
});

test('forbiddenPattern', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['.....', '...O.', 'O....', '.....']),
    rules: [
      {
        type: 'forbiddenPattern',
        pattern: [[{ exists: true, fixed: true, color: 'light' }], [{ exists: true, fixed: true, color: 'light' }]],
      },
    ],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['...#.', '#.#O#', 'O#.#.', '#....']));
});

test('sameShape', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['##..O', '#OOO.', 'O....', '..###']),
    rules: [{ type: 'sameShape', color: 'dark' }],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['###.O', '#OOOO', 'O..O.', 'O.###']));
});

test('uniqueShape', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['.O#O.', '##.##', '.#...', '.O#..']),
    rules: [{ type: 'uniqueShape', color: 'light' }],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.O#O.', '##.##', 'O#...', 'OO#..']));
});

test('uniqueShape', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['#..#.', '.....', '.#..#', '.....']),
    rules: [{ type: 'regionArea', color: 'dark', size: 3 }],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['##O#.', '#O.#O', 'O#.O#', '.#O##']));
});

test('minesweeper', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['.....', '.O...', '.#...', '.....']),
    rules: [
      {
        type: 'minesweeper',
        tiles: [{ x: 1, y: 1, number: 1 }],
      },
    ],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['OOO..', 'OOO..', 'O#O..', '.....']));
});

test('number', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['.#...', '.....', '.....', '.....']),
    rules: [
      {
        type: 'number',
        tiles: [
          { x: 2, y: 0, number: 4 },
          { x: 4, y: 0, number: 7 },
          { x: 2, y: 2, number: 5 },
        ],
      },
    ],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['##OO.', '#O#..', '#O..O', 'OO...']));
});

test('letter', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['.#...', '.....', '.....', '.....']),
    rules: [
      {
        type: 'letter',
        tiles: [
          { x: 2, y: 0, letter: 'A' },
          { x: 2, y: 2, letter: 'B' },
          { x: 2, y: 6, letter: 'A' },
          { x: 8, y: 6, letter: 'B' },
        ],
      },
    ],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['##...', '#O...', '#....', '.#..O']));
});

test('dart', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['.....', '#....', '.....', '.....']),
    rules: [
      {
        type: 'dart',
        tiles: [
          { x: 0, y: 1, orientation: 'right', number: 4 },
          { x: 2, y: 3, orientation: 'up-left', number: 0 },
        ],
      },
    ],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', '#OOOO', '.#...', '..#..']));
});

test('viewpoint', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['.....', '#....', '.....', '.....']),
    rules: [
      {
        type: 'viewpoint',
        tiles: [
          { x: 0, y: 1, number: 3 },
          { x: 2, y: 1, number: 7 },
        ],
      },
    ],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['..O..', '#OOOO', '#.O..', '..O..']));
});

describe('lotus', () => {
  test('cell', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.O...', '.....']),
      rules: [
        {
          type: 'lotus',
          tiles: [
            { x: 4, y: 2, orientation: 'up' }, // on the cell (x=2, y=1)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', '.###.', '.O.O.', '.....']));
  });

  test('edge', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.O...', '.....']),
      rules: [
        {
          type: 'lotus',
          tiles: [
            { x: 5, y: 2, orientation: 'up' }, // the edge between the cell (x=2, y=1) and (x=3, y=1)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', 'O##..', '.O...', '.....']));
  });

  test('edge-dual-color', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##.O', '.....', '.....']),
      rules: [
        {
          type: 'lotus',
          tiles: [
            { x: 5, y: 2, orientation: 'up' }, // the dark region (x=1..2, y=1) mirrors the light region (x=3..4, y=1)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', 'O##OO', '.....', '.....']));
  });

  test('edge-two-self-symmetric-regions', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.....', '.....']),
      rules: [
        {
          type: 'lotus',
          tiles: [
            { x: 4, y: 3, orientation: 'up' }, // the edge between the cell (x=2, y=1) and (x=2, y=2)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', '.###.', '.....', '.....']));
  });

  test('corner', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.....', '.....']),
      rules: [
        {
          type: 'lotus',
          tiles: [
            { x: 3, y: 3, orientation: 'up' }, // the corner to the bottom-right of the cell (x=1, y=1)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', '.##..', '.....', '.....']));
  });

  test('diagonal-corner', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.....', '.....']),
      rules: [
        {
          type: 'lotus',
          tiles: [
            { x: 3, y: 3, orientation: 'up-right' },
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', '.##..', '..#..', '.....']));
  });

  test('diagonal-edge-invalid', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.....', '.....']),
      rules: [
        {
          type: 'lotus',
          tiles: [
            { x: 4, y: 5, orientation: 'up-right' }, // a diagonal lotus on an edge has no axis of symmetry
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual({
      error: 'lotus on invalid position',
    });
  });

  test('diagonal-edge-on-holes', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['     ', '  #  ', '     ', '     ']),
      rules: [
        {
          type: 'lotus',
          tiles: [
            { x: 4, y: 5, orientation: 'up-right' }, // every tile it touches is missing, so it is vacuous
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', '..#..', '.....', '.....']));
  });
});

describe('galaxy', () => {
  test('cell', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.#...', '.....']),
      rules: [
        {
          type: 'galaxy',
          tiles: [
            { x: 4, y: 2 }, // on the cell (x=2, y=1)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['...#.', '.###.', '.#...', '.O...']));
  });

  test('edge', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.#...', '.....']),
      rules: [
        {
          type: 'galaxy',
          tiles: [
            { x: 5, y: 2 }, // on the edge between the cell (x=2, y=1) and (x=3, y=1)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', 'O##..', 'O#...', '.O...']));
  });

  test('edge-dual-color', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##.O', '.....', '.....']),
      rules: [
        {
          type: 'galaxy',
          tiles: [
            { x: 5, y: 2 }, // the dark region (x=1..2, y=1) mirrors the light region (x=3..4, y=1)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', 'O##OO', '.....', '.....']));
  });

  test('corner', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.##..', '.#...', '.....']),
      rules: [
        {
          type: 'galaxy',
          tiles: [
            { x: 3, y: 3 }, // on the corner to the bottom-right of the cell (x=1, y=1)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.....', '.##..', '.##..', '.....']));
  });

  test('asymmetric-region-is-unsat', () => {
    const puzzle: PuzzleData = {
      width: 3,
      height: 2,
      connections: [],
      tiles: makeTilesData(['.#.', '.##']),
      rules: [
        {
          type: 'galaxy',
          tiles: [
            { x: 1, y: 1 }, // the dark region sticks out past its own mirror image
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(null);
  });

  test('partially-missing-is-error', () => {
    const puzzle: PuzzleData = {
      width: 3,
      height: 2,
      connections: [],
      tiles: makeTilesData(['.#.', '# #']),
      rules: [
        {
          type: 'galaxy',
          tiles: [
            { x: 1, y: 1 }, // (x=1, y=1) is missing while its partner (x=0, y=0) exists
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual({
      error: "galaxy tile on non-existing tile; don't do this",
    });
  });
});

test('number-offbyx', () => {
  const puzzle: PuzzleData = {
    width: 5,
    height: 4,
    connections: [],
    tiles: makeTilesData(['.#...', '.....', '.....', '.....']),
    rules: [
      {
        type: 'number',
        tiles: [
          { x: 2, y: 0, number: 10 },
          { x: 4, y: 0, number: 5 },
          { x: 2, y: 2, number: 7 },
        ],
      },
      {
        type: 'offByX',
        number: 1,
      },
    ],
  };
  expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['##O..', '#OO..', '#....', '.....']));
});

describe('symbolCount', () => {
  test('exactly', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.#...', '.....', '.....', '.....']),
      rules: [
        {
          type: 'viewpoint',
          tiles: [
            { x: 1, y: 0, number: 2 },
            { x: 1, y: 1, number: 2 },
            { x: 3, y: 1, number: 6 },
          ],
        },
        {
          type: 'symbolCount',
          number: 1,
          kind: 'exactly',
          color: 'dark',
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['##O#.', '.O###', '...#.', '...#.']));
  });

  test('atLeast', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['..O..', '.#O#.', '..O..', '.....']),
      rules: [
        {
          type: 'viewpoint',
          tiles: [
            { x: 1, y: 1, number: 2 },
            { x: 3, y: 1, number: 2 },
          ],
        },
        {
          type: 'symbolCount',
          number: 2,
          kind: 'atLeast',
          color: 'dark',
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['.OOO.', '##O##', '#OOO#', '#####']));
  });

  test('atMost', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['..O..', '.#...', '.....', '.....']),
      rules: [
        {
          type: 'viewpoint',
          tiles: [
            { x: 1, y: 1, number: 2 },
            { x: 2, y: 1, number: 2 },
            { x: 2, y: 2, number: 2 },
          ],
        },
        {
          type: 'symbolCount',
          number: 1,
          kind: 'atMost',
          color: 'dark',
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['..O..', '.#O#.', '.O#..', '.....']));
  });
});

describe('symbolCountWithGalaxy', () => {
  test('exactly', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 4,
      connections: [],
      tiles: makeTilesData(['.....', '.....', '...#.', '...#.']),
      rules: [
        {
          type: 'galaxy',
          tiles: [{ x: 6, y: 4 }],
        },
        {
          type: 'symbolCount',
          number: 1,
          kind: 'exactly',
          color: 'dark',
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['OOOOO', 'OO.#.', 'OO.#.', 'OO.#.']));
  });
});

describe('symbolCountWithSymmetrySymbols', () => {
  test('galaxy on a corner counts in every region it touches', () => {
    const puzzle: PuzzleData = {
      width: 2,
      height: 2,
      connections: [],
      tiles: makeTilesData(['#O', 'O#']),
      rules: [
        {
          type: 'galaxy',
          tiles: [{ x: 1, y: 1 }], // the corner shared by all four cells
        },
        {
          type: 'symbolCount',
          number: 1,
          kind: 'exactly',
          color: 'dark',
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['#O', 'O#']));
  });

  test('lotus on an edge', () => {
    const puzzle: PuzzleData = {
      width: 2,
      height: 1,
      connections: [],
      tiles: makeTilesData(['#O']),
      rules: [
        {
          type: 'lotus',
          tiles: [{ x: 1, y: 0, orientation: 'up' }], // the edge between the cell (0, 0) and (0, 1)
        },
        {
          type: 'symbolCount',
          number: 1,
          kind: 'exactly',
          color: 'dark',
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['#O']));
  });
});

describe('letterBetweenTiles', () => {
  test('edge forces same color', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 2,
      connections: [],
      tiles: makeTilesData(['#..OO', 'O#O#O']),
      rules: [
        {
          type: 'letter',
          tiles: [
            { x: 0, y: 0, letter: 'A' }, // cell (0, 0), fixed dark
            { x: 3, y: 0, letter: 'A' }, // the edge between the cell (0, 1) and (0, 2)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['###OO', 'O#O#O']));
  });

  test('non-existing tile is error', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 2,
      connections: [],
      tiles: makeTilesData(['.....', '.. ..']),
      rules: [
        {
          type: 'letter',
          tiles: [
            { x: 4, y: 1, letter: 'A' }, // the edge between the cell (0, 2) and (1, 2); (1, 2) is missing
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual({
      error: "letter tile on non-existing tile; don't do this",
    });
  });
});

describe('areaNumberBetweenTiles', () => {
  test('edge forces same color and region size', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 2,
      connections: [],
      tiles: makeTilesData(['##..#', '#####']),
      rules: [
        {
          type: 'number',
          tiles: [
            { x: 5, y: 0, number: 2 }, // the edge between the cell (0, 2) and (0, 3)
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['##OO#', '#####']));
  });

  test('out-of-bounds is error', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 2,
      connections: [],
      tiles: makeTilesData(['.....', '.....']),
      rules: [
        {
          type: 'number',
          tiles: [
            { x: 0, y: 4, number: 3 }, // row 2 is out of bounds
          ],
        },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual({
      error: "area number tile on non-existing tile; don't do this",
    });
  });
});

describe('unsupported', () => {
  test('has no logic', () => {
    const puzzle: PuzzleData = {
      width: 5,
      height: 3,
      connections: [],
      tiles: makeTilesData([' ....', '..#..', 'O.#.O']),
      rules: [
        { type: 'connectAll', color: 'light' },
        { type: 'unsupported', tiles: [{ x: 0, y: 2 }] }, // the cell (1, 0)
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData([' OOO.', '.O#..', 'O.#.O']));
  });

  test('counts in symbolCount', () => {
    const puzzle: PuzzleData = {
      width: 3,
      height: 2,
      connections: [],
      tiles: makeTilesData(['# #', '# #']),
      rules: [
        { type: 'unsupported', tiles: [{ x: 0, y: 0 }, { x: 4, y: 0 }] }, // the cells (0, 0) and (0, 2)
        { type: 'symbolCount', number: 1, kind: 'exactly', color: 'dark' },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['# #', '# #']));
  });

  test('edge counts once per region', () => {
    const puzzle: PuzzleData = {
      width: 3,
      height: 1,
      connections: [],
      tiles: makeTilesData(['##O']),
      rules: [
        { type: 'unsupported', tiles: [{ x: 1, y: 0 }] }, // the edge between the cell (0, 0) and (0, 1)
        { type: 'symbolCount', number: 1, kind: 'exactly', color: 'dark' },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['##O']));
  });

  test('corner counts in every touched region', () => {
    const puzzle: PuzzleData = {
      width: 2,
      height: 2,
      connections: [],
      tiles: makeTilesData(['#O', 'O#']),
      rules: [
        { type: 'unsupported', tiles: [{ x: 1, y: 1 }] }, // the corner shared by all four cells
        { type: 'symbolCount', number: 1, kind: 'exactly', color: 'dark' },
      ],
    };
    expect(solveLogicPad(puzzle, true)).resolves.toEqual(makeExpectedData(['#O', 'O#']));
  });
});
