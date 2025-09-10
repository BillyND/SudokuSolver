import { useState, useCallback } from "react";
import "./App.css";

type SudokuGrid = (number | null)[][];

const createEmptyGrid = (): SudokuGrid => {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
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

function App() {
  const [grid, setGrid] = useState<SudokuGrid>(createEmptyGrid);
  const [isInputMode, setIsInputMode] = useState(true);
  const [isSolved, setIsSolved] = useState(false);

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
  };

  const downloadSudoku = () => {
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

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sudoku_${new Date().toISOString().split("T")[0]!}.txt`;
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
    <div className="app">
      <header className="app-header">
        <h1>🧩 Sudoku Solver</h1>
        <p>Nhập số từ 1-9 vào các ô trống, sau đó nhấn "Giải Sudoku"</p>
      </header>

      <main className="main-content">
        <div className="sudoku-container">
          <div className="sudoku-grid">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  maxLength={1}
                  className={`sudoku-cell ${
                    rowIndex === 2 || rowIndex === 5 ? "border-bottom" : ""
                  } ${colIndex === 2 || colIndex === 5 ? "border-right" : ""} ${
                    !isInputMode ? "readonly" : ""
                  }`}
                  value={cell || ""}
                  onChange={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.value)
                  }
                  readOnly={!isInputMode}
                />
              ))
            )}
          </div>
        </div>

        <div className="controls">
          <button className="btn btn-primary" onClick={toggleInputMode}>
            {isInputMode ? "🔒 Khóa nhập liệu" : "✏️ Mở nhập liệu"}
          </button>

          <button
            className="btn btn-success"
            onClick={solvePuzzle}
            disabled={!isInputMode || isSolved}
          >
            🎯 Giải Sudoku
          </button>

          <button className="btn btn-info" onClick={downloadSudoku}>
            📁 Tải về TXT
          </button>

          <button className="btn btn-warning" onClick={resetGrid}>
            🔄 Reset
          </button>
        </div>

        {isSolved && (
          <div className="success-message">
            <p>🎉 Đã giải xong Sudoku!</p>
          </div>
        )}

        <div className="instructions">
          <h3>Hướng dẫn:</h3>
          <ul>
            <li>
              <strong>Nhập Sudoku:</strong> Nhấp vào các ô và nhập số từ 1-9
            </li>
            <li>
              <strong>Giải Sudoku:</strong> Nhấn nút "Giải Sudoku" để tự động
              giải
            </li>
            <li>
              <strong>Tải về:</strong> Nhấn "Tải về TXT" để lưu kết quả thành
              file
            </li>
            <li>
              <strong>Reset:</strong> Nhấn "Reset" để xóa toàn bộ và bắt đầu lại
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
