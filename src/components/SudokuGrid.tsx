import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SudokuGrid = (number | null)[][];

interface SudokuGridProps {
  grid: SudokuGrid;
  isInputMode: boolean;
  onCellChange: (row: number, col: number, value: string) => void;
}

export function SudokuGrid({
  grid,
  isInputMode,
  onCellChange,
}: SudokuGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sudoku Grid</CardTitle>
        <CardDescription>
          {isInputMode
            ? "Click on cells to enter numbers"
            : "View mode - unlock to edit"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-9 gap-0.5 sm:gap-1 w-fit mx-auto">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                inputMode="numeric"
                pattern="[1-9]"
                maxLength={1}
                className="w-8 h-8 sm:w-10 sm:h-10 text-center font-bold text-base p-0"
                value={cell || ""}
                onChange={(e) =>
                  onCellChange(rowIndex, colIndex, e.target.value)
                }
                onFocus={(e) => {
                  // Move cursor to the end of the input
                  const input = e.target as HTMLInputElement;
                  const length = input.value.length;
                  input.setSelectionRange(length, length);
                }}
                readOnly={!isInputMode}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
