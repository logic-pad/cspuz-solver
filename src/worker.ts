import { solveLogicPad, PuzzleData, SolverResult } from '@logic-pad/cspuz-solver';

export function solve(data: PuzzleData, underclued: boolean): Promise<SolverResult> {
  return solveLogicPad(data, underclued);
}
