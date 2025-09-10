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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Điều khiển</CardTitle>
        <CardDescription>Các tùy chọn cho Sudoku của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={onToggleInputMode}
          variant="outline"
          className="w-full"
          disabled={isEmpty && !isInputMode}
        >
          {isInputMode ? (
            <>
              <Lock className="h-4 w-4" />
              Khóa nhập liệu
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4" />
              Mở nhập liệu
            </>
          )}
        </Button>

        <Button
          onClick={onSolvePuzzle}
          disabled={!isInputMode || isSolved || isEmpty}
          className="w-full"
        >
          <Play className="h-4 w-4" />
          Giải Sudoku
        </Button>

        <Button
          onClick={onCopyToClipboard}
          variant="secondary"
          className="w-full"
          disabled={isEmpty}
        >
          <Copy className="h-4 w-4" />
          {copySuccess ? "Đã sao chép!" : "Sao chép"}
        </Button>

        <Button
          onClick={onDownloadSudoku}
          variant="outline"
          className="w-full"
          disabled={isEmpty}
        >
          <Download className="h-4 w-4" />
          Tải về TXT
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
