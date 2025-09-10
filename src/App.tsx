import { useState, useCallback, useEffect } from "react";
import { Copy, Download, RotateCcw, Lock, Unlock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          {/* Main Sudoku Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sudoku Grid</CardTitle>
                <CardDescription>
                  {isInputMode
                    ? "Nhấp vào ô để nhập số"
                    : "Chế độ chỉ xem - mở khóa để chỉnh sửa"}
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
                        className="w-8 h-8 sm:w-10 sm:h-10 text-center font-bold text-sm sm:text-base p-0"
                        value={cell || ""}
                        onChange={(e) =>
                          handleCellChange(rowIndex, colIndex, e.target.value)
                        }
                        readOnly={!isInputMode}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Card */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Điều khiển</CardTitle>
                <CardDescription>
                  Các tùy chọn cho Sudoku của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={toggleInputMode}
                  variant="outline"
                  className="w-full"
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
                  onClick={solvePuzzle}
                  disabled={!isInputMode || isSolved}
                  className="w-full"
                >
                  <Play className="h-4 w-4" />
                  Giải Sudoku
                </Button>

                <Button
                  onClick={copyToClipboard}
                  variant="secondary"
                  className="w-full"
                >
                  <Copy className="h-4 w-4" />
                  {copySuccess ? "Đã sao chép!" : "Sao chép"}
                </Button>

                <Button
                  onClick={downloadSudoku}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4" />
                  Tải về TXT
                </Button>

                <Button
                  onClick={resetGrid}
                  variant="destructive"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </CardContent>
            </Card>

            {/* Success Message */}
            {isSolved && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center font-semibold">
                    🎉 Đã giải xong Sudoku!
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Copy Success Message */}
            {copySuccess && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center font-semibold">
                    ✅ Đã sao chép vào clipboard!
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Hướng dẫn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Nhập Sudoku:</strong> Nhấp vào các ô và nhập số từ 1-9
                </div>
                <div>
                  <strong>Giải Sudoku:</strong> Nhấn nút "Giải Sudoku" để tự
                  động giải
                </div>
                <div>
                  <strong>Sao chép:</strong> Nhấn "Sao chép" để copy định dạng
                  text
                </div>
                <div>
                  <strong>Tải về:</strong> Nhấn "Tải về TXT" để lưu kết quả
                  thành file
                </div>
                <div>
                  <strong>Reset:</strong> Nhấn "Reset" để xóa toàn bộ và bắt đầu
                  lại
                </div>
                <div className="text-xs text-muted-foreground mt-3">
                  💡 Dữ liệu sẽ được tự động lưu và khôi phục khi reload trang
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
