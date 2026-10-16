# @logic-pad/cspuz-solver

> Forked from [semiexp/logic-pad-solver](https://github.com/semiexp/logic-pad-solver). Huge thanks to [semiexp](https://github.com/semiexp) for the powerful cspuz solver and the original Logic Pad solver implementation.

A solver for [Logic Pad](https://logic-pad.com) based on cspuz.

## Supported rules

- Global rules
  - Forbidden patterns (`Don't make this pattern`)
  - Connectivity (`Connect all light / dark cells`)
  - Shape constraints (`All light / dark areas have the same / different shape and size`)
  - Region size (`All light / dark regions have area N`)
  - Total count (`There are N light / dark cells in total`)
  - Off by X (`All numbers are off by X`)
  - Underclued (`Underclued grid: mark only what is definitely true`)
  - Symbols per region (`At most / at least / exactly N symbols per light / dark area`)
- Cell rules
  - Fixed tiles
  - Merged tiles
  - Area Number
  - Letter
  - Viewpoint
  - Dart
  - Lotus (with dual-color support)
  - Galaxy (with dual-color support)
  - Minesweeper

## Contributing

See GitHub for build and test instructions.