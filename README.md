A solver for [Logic Pad](https://logic-pad.com) based on cspuz.

# Supported rules

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
  - Lotus
  - Galaxy
  - Minesweeper

Lotus and galaxy symbols may be placed on a tile, on an edge between two tiles, or on a corner of tiles. When such a symbol touches tiles of different colors, the mirrored regions may have opposite colors as long as their shapes are symmetrical. A diagonal lotus (e.g. `up-right`) on an edge between two tiles has no axis of symmetry and is rejected, unless every tile it touches is missing.

# Repository layout

This repo has two parts:

- `packages/logic-pad-solver-core` — the solver, published to npm as [`logic-pad-solver-core`](https://www.npmjs.com/package/logic-pad-solver-core).
- the web app at the repo root (a Vite + React front-end that consumes the package above via a `file:` dependency).

# Build

Prerequisites:

- Install [Rust](https://www.rust-lang.org/) with the `wasm32-unknown-emscripten` target:

  ```
  rustup target add wasm32-unknown-emscripten
  ```

- Install [emscripten](https://emscripten.org/) (emsdk). Activate it so that `emcc` is on your `PATH` before building.
- Clone [`cspuz_core`](https://github.com/semiexp/cspuz_core) **next to** this repository (as a sibling directory, not inside it). The Rust solver refers to it through the relative path `../../../../cspuz_core`, so the layout must be:

  ```
  <some-dir>/
  ├── cspuz_core/          # git clone --recursive https://github.com/semiexp/cspuz_core.git
  └── logic-pad-solver/    # this repository
  ```

  Use `--recursive` because `cspuz_core` has its own submodules.

> Note: `@logic-pad/core` used to be vendored as a git submodule under `src/logic-pad` (which required a manual patch to `streamCompressor.ts`). It is now a plain npm dependency, so there is nothing to clone or patch — `npm install` handles it.

> The `build-rust` script uses POSIX commands (`cd`, `cp`, `&&`); on Windows run it from a POSIX shell such as WSL or Git Bash.

## Build & publish the npm package (`logic-pad-solver-core`)

First compile cspuz_core to WebAssembly:

```
cd ../cspuz_core
./build_cspuz_solver_backend.sh release
```

Then build the solver package:

```
cd packages/logic-pad-solver-core
npm install
npm run build-rust   # compiles the Rust solver to WebAssembly -> src/core/solver.js
npm pack             # produces logic-pad-solver-core-<version>.tgz
```

To publish, either run `npm publish --provenance --access public` from that directory, or trigger the **Publish logic-pad-solver-core** workflow (`.github/workflows/publish.yml`) on GitHub, which sets up the toolchain and publishes for you.

## Build / run the web app

From the repo root:

```
npm install
# the app links logic-pad-solver-core via `file:`, so build the solver first:
(cd packages/logic-pad-solver-core && npm run build-rust)
npm run dev          # start the dev server
npm run build        # create a release build (dist/)
```

## Test

```
cd packages/logic-pad-solver-core
npm test
```
