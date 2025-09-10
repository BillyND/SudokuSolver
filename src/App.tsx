import { useState, useCallback, useEffect } from "react";
import { SudokuGrid } from "@/components/SudokuGrid";
import { ControlPanel } from "@/components/ControlPanel";
import { StatusMessages } from "@/components/StatusMessages";
import { InstructionsCard } from "@/components/InstructionsCard";
import "./App.css";

type SudokuGrid = (number | null)[][];

const createEmptyGrid = (): SudokuGrid => {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
};

const loadFromStorage = (): SudokuGrid => {
  const saved = localStorage.getItem("sudoku-puzzle");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return createEmptyGrid();
    }
  }
  return createEmptyGrid();
};

const saveToStorage = (grid: SudokuGrid) => {
  localStorage.setItem("sudoku-puzzle", JSON.stringify(grid));
};

const isValid = (
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number
): boolean => {
  // Check row
  for (let j = 0; j < 9; j++) {
    if (grid[row][j] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (grid[i][j] === num) return false;
    }
  }

  return true;
};

const solveSudoku = (grid: SudokuGrid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) {
              return true;
            }

            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const formatSudokuAsText = (grid: SudokuGrid): string => {
  let content = "";
  content += "SUDOKU PUZZLE\n";
  content += "=============\n\n";

  for (let i = 0; i < 9; i++) {
    let row = "";
    for (let j = 0; j < 9; j++) {
      row += (grid[i][j] || " ") + " ";
      if (j === 2 || j === 5) row += "| ";
    }
    content += row + "\n";
    if (i === 2 || i === 5) {
      content += "------+-------+------\n";
    }
  }

  content += "\nTạo bởi Sudoku Solver App";
  return content;
};

function App() {
  const [grid, setGrid] = useState<SudokuGrid>(loadFromStorage);
  const [isInputMode, setIsInputMode] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Save to localStorage whenever grid changes
  useEffect(() => {
    saveToStorage(grid);
  }, [grid]);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!isInputMode) return;

    const newGrid = grid.map((row) => [...row]);
    const numValue = value === "" ? null : parseInt(value);

    if (numValue === null || (numValue >= 1 && numValue <= 9)) {
      newGrid[row][col] = numValue;
      setGrid(newGrid);
    }
  };

  const solvePuzzle = useCallback(() => {
    const gridCopy = grid.map((row) => [...row]);
    if (solveSudoku(gridCopy)) {
      setGrid(gridCopy);
      setIsSolved(true);
      setIsInputMode(false);
    } else {
      alert(
        "Không thể giải được Sudoku này. Vui lòng kiểm tra lại dữ liệu đầu vào."
      );
    }
  }, [grid]);

  const resetGrid = () => {
    setGrid(createEmptyGrid());
    setIsInputMode(true);
    setIsSolved(false);
    localStorage.removeItem("sudoku-puzzle");
  };

  const copyToClipboard = async () => {
    try {
      const textContent = formatSudokuAsText(grid);
      await navigator.clipboard.writeText(textContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadSudoku = () => {
    const content = formatSudokuAsText(grid);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sudoku_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleInputMode = () => {
    setIsInputMode(!isInputMode);
    setIsSolved(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">🧩 Sudoku Solver</h1>
          <p className="text-muted-foreground">
            Nhập số từ 1-9 vào các ô trống, sau đó nhấn "Giải Sudoku"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Sudoku Grid */}
          <div className="lg:col-span-2">
            <SudokuGrid
              grid={grid}
              isInputMode={isInputMode}
              onCellChange={handleCellChange}
            />
          </div>

          {/* Controls and Status */}
          <div className="space-y-4">
            <ControlPanel
              grid={grid}
              isInputMode={isInputMode}
              isSolved={isSolved}
              copySuccess={copySuccess}
              onToggleInputMode={toggleInputMode}
              onSolvePuzzle={solvePuzzle}
              onCopyToClipboard={copyToClipboard}
              onDownloadSudoku={downloadSudoku}
              onResetGrid={resetGrid}
            />

            <StatusMessages isSolved={isSolved} copySuccess={copySuccess} />

            <InstructionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
