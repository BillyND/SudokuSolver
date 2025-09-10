import { Copy, Download, RotateCcw, Lock, Unlock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SudokuGrid = (number | null)[][];

interface ControlPanelProps {
  grid: SudokuGrid;
  isInputMode: boolean;
  isSolved: boolean;
  copySuccess: boolean;
  onToggleInputMode: () => void;
  onSolvePuzzle: () => void;
  onCopyToClipboard: () => void;
  onDownloadSudoku: () => void;
  onResetGrid: () => void;
}

export function ControlPanel({
  grid,
  isInputMode,
  isSolved,
  copySuccess,
  onToggleInputMode,
  onSolvePuzzle,
  onCopyToClipboard,
  onDownloadSudoku,
  onResetGrid,
}: ControlPanelProps) {
  // Check if grid has any values
  const hasValues = grid.some((row) => row.some((cell) => cell !== null));

  // Check if grid is empty
  const isEmpty = !hasValues;

  // Check if grid is completely filled
  const isComplete = grid.every((row) => row.every((cell) => cell !== null));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
        <CardDescription>Options for your Sudoku puzzle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={onToggleInputMode}
          variant="outline"
          className="w-full"
        >
          {isInputMode ? (
            <>
              <Lock className="h-4 w-4" />
              Lock Input
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4" />
              Unlock Input
            </>
          )}
        </Button>

        <Button
          onClick={onSolvePuzzle}
          disabled={!isInputMode || isSolved || isEmpty || isComplete}
          className="w-full"
        >
          <Play className="h-4 w-4" />
          Solve Sudoku
        </Button>

        <Button
          onClick={onCopyToClipboard}
          variant="secondary"
          className="w-full"
          disabled={isEmpty}
        >
          <Copy className="h-4 w-4" />
          {copySuccess ? "Copied!" : "Copy"}
        </Button>

        <Button
          onClick={onDownloadSudoku}
          variant="outline"
          className="w-full"
          disabled={isEmpty}
        >
          <Download className="h-4 w-4" />
          Download TXT
        </Button>

        <Button
          onClick={onResetGrid}
          variant="destructive"
          className="w-full"
          disabled={isEmpty}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
