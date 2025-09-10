import { useState } from "react";
import { Upload, Download, Plus, RotateCcw } from "lucide-react";

const SudokuSolver = () => {
  // Sudoku mẫu ban đầu
  const sampleBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const emptyBoard = Array(9)
    .fill()
    .map(() => Array(9).fill(0));

  const [board, setBoard] = useState(sampleBoard.map((row) => [...row]));
  const [originalBoard, setOriginalBoard] = useState(
    sampleBoard.map((row) => [...row])
  );
  const [inputMode, setInputMode] = useState(false);
  const [inputBoard, setInputBoard] = useState(
    emptyBoard.map((row) => [...row])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [savedPuzzles, setSavedPuzzles] = useState([
    { name: "Mẫu ban đầu", board: sampleBoard },
  ]);

  // Kiểm tra số có hợp lệ tại vị trí (row, col) không
  const isValid = (board, row, col, num) => {
    // Kiểm tra hàng
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === num) return false;
    }

    // Kiểm tra cột
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Kiểm tra ô 3x3
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }

    return true;
  };

  // Kiểm tra bảng Sudoku có hợp lệ không
  const isValidBoard = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) {
          const num = board[row][col];
          board[row][col] = 0; // Tạm thời xóa để kiểm tra
          if (!isValid(board, row, col, num)) {
            board[row][col] = num; // Khôi phục
            return false;
          }
          board[row][col] = num; // Khôi phục
        }
      }
    }
    return true;
  };

  // Thuật toán backtracking để giải Sudoku
  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Xử lý giải Sudoku
  const handleSolve = async () => {
    setIsLoading(true);
    setMessage("Đang giải...");

    const boardCopy = board.map((row) => [...row]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (solveSudoku(boardCopy)) {
      setBoard(boardCopy);
      setMessage("Đã giải xong!");
    } else {
      setMessage("Không thể giải được Sudoku này!");
    }

    setIsLoading(false);
  };

  // Reset về trạng thái ban đầu
  const handleReset = () => {
    setBoard(originalBoard.map((row) => [...row]));
    setMessage("");
  };

  // Xử lý thay đổi giá trị ô trong chế độ chơi
  const handleCellChange = (row, col, value) => {
    const num = parseInt(value) || 0;
    if (num < 0 || num > 9) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = num;
    setBoard(newBoard);
    setMessage("");
  };

  // Xử lý thay đổi giá trị ô trong chế độ nhập
  const handleInputCellChange = (row, col, value) => {
    const num = parseInt(value) || 0;
    if (num < 0 || num > 9) return;

    const newInputBoard = inputBoard.map((row) => [...row]);
    newInputBoard[row][col] = num;
    setInputBoard(newInputBoard);
  };

  // Kiểm tra xem ô có phải là ô ban đầu không
  const isOriginalCell = (row, col) => {
    return originalBoard[row][col] !== 0;
  };

  // Chuyển sang chế độ nhập
  const enterInputMode = () => {
    setInputMode(true);
    setInputBoard(emptyBoard.map((row) => [...row]));
    setMessage("Nhập bảng Sudoku mới. Để trống ô nào không biết.");
  };

  // Áp dụng bảng đã nhập
  const applyInputBoard = () => {
    const boardCopy = inputBoard.map((row) => [...row]);

    // Kiểm tra tính hợp lệ
    if (!isValidBoard(boardCopy)) {
      setMessage("Bảng Sudoku không hợp lệ! Vui lòng kiểm tra lại.");
      return;
    }

    setBoard(boardCopy);
    setOriginalBoard(boardCopy);
    setInputMode(false);
    setMessage("Đã áp dụng bảng mới!");
  };

  // Hủy chế độ nhập
  const cancelInput = () => {
    setInputMode(false);
    setMessage("");
  };

  // Tạo bảng trống
  const createEmptyBoard = () => {
    setInputBoard(emptyBoard.map((row) => [...row]));
    setMessage("Đã tạo bảng trống. Hãy nhập số vào các ô.");
  };

  // Lưu puzzle hiện tại
  const savePuzzle = () => {
    const name = prompt("Nhập tên cho puzzle này:");
    if (name && name.trim()) {
      const newPuzzle = {
        name: name.trim(),
        board: originalBoard.map((row) => [...row]),
      };
      setSavedPuzzles([...savedPuzzles, newPuzzle]);
      setMessage(`Đã lưu puzzle "${name}"!`);
    }
  };

  // Load puzzle đã lưu
  const loadPuzzle = (puzzle) => {
    setBoard(puzzle.board.map((row) => [...row]));
    setOriginalBoard(puzzle.board.map((row) => [...row]));
    setInputMode(false);
    setMessage(`Đã load puzzle "${puzzle.name}"!`);
  };

  // Import từ text
  const importFromText = () => {
    const text = prompt(
      "Nhập chuỗi 81 số (0 = ô trống):\nVí dụ: 300200005057000040000000007000004100000375000000024090200030000900000680000480000"
    );
    if (text && text.length === 81) {
      const newBoard = [];
      for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
          const num = parseInt(text[i * 9 + j]) || 0;
          row.push(num);
        }
        newBoard.push(row);
      }

      if (isValidBoard(newBoard)) {
        setInputBoard(newBoard);
        setMessage("Đã import thành công!");
      } else {
        setMessage("Dữ liệu không hợp lệ!");
      }
    }
  };

  // Export thành text
  const exportToText = () => {
    const text = originalBoard.flat().join("");
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Đã copy chuỗi số vào clipboard!");
    });
  };

  const currentBoard = inputMode ? inputBoard : board;

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-800 mb-6">Giải Sudoku</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {!inputMode ? (
          <>
            <button
              onClick={enterInputMode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Nhập Sudoku mới
            </button>
            <button
              onClick={savePuzzle}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download size={16} />
              Lưu puzzle
            </button>
            <button
              onClick={exportToText}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Upload size={16} />
              Export
            </button>
          </>
        ) : (
          <>
            <button
              onClick={applyInputBoard}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Áp dụng bảng này
            </button>
            <button
              onClick={createEmptyBoard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bảng trống
            </button>
            <button
              onClick={importFromText}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Import text
            </button>
            <button
              onClick={cancelInput}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Hủy
            </button>
          </>
        )}
      </div>

      {/* Saved Puzzles */}
      {!inputMode && savedPuzzles.length > 1 && (
        <div className="mb-6 w-full max-w-4xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Puzzle đã lưu:
          </h3>
          <div className="flex flex-wrap gap-2">
            {savedPuzzles.map((puzzle, index) => (
              <button
                key={index}
                onClick={() => loadPuzzle(puzzle)}
                className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                {puzzle.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode indicator */}
      <div className="mb-4">
        <span
          className={`px-4 py-2 rounded-lg font-medium ${
            inputMode
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {inputMode ? "📝 Chế độ nhập Sudoku" : "🎮 Chế độ giải Sudoku"}
        </span>
      </div>

      {/* Sudoku Board */}
      <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
        <div className="grid grid-cols-9 gap-1 bg-gray-800 p-2 rounded-lg">
          {currentBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="number"
                min="1"
                max="9"
                value={cell === 0 ? "" : cell}
                onChange={(e) =>
                  inputMode
                    ? handleInputCellChange(rowIndex, colIndex, e.target.value)
                    : handleCellChange(rowIndex, colIndex, e.target.value)
                }
                className={`
                  w-12 h-12 text-center text-lg font-bold border-2 rounded
                  ${
                    inputMode
                      ? "bg-blue-50 text-gray-800 border-blue-300"
                      : isOriginalCell(rowIndex, colIndex)
                      ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                      : "bg-white text-gray-800 border-gray-300"
                  }
                  ${(rowIndex + 1) % 3 === 0 && rowIndex < 8 ? "mb-2" : ""}
                  ${(colIndex + 1) % 3 === 0 && colIndex < 8 ? "mr-2" : ""}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  hover:bg-gray-50 transition-colors duration-150
                `}
                readOnly={!inputMode && isOriginalCell(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>

      {/* Control Buttons */}
      {!inputMode && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleSolve}
            disabled={isLoading}
            className={`
              px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-xl active:transform active:scale-95"
              }
            `}
          >
            {isLoading ? "Đang giải..." : "Giải Sudoku"}
          </button>

          <button
            onClick={handleReset}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 hover:shadow-xl active:transform active:scale-95"
              }
            `}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`
          px-6 py-3 rounded-lg font-medium text-center mb-4
          ${
            message.includes("xong") ||
            message.includes("thành công") ||
            message.includes("lưu") ||
            message.includes("load") ||
            message.includes("copy")
              ? "bg-green-100 text-green-800"
              : message.includes("không") || message.includes("lỗi")
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }
        `}
        >
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 max-w-4xl text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cách sử dụng:
        </h2>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                🎮 Chế độ giải:
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                • Ô xanh: số ban đầu (không đổi được)
              </p>
              <p className="text-gray-600 text-sm mb-1">
                • Ô trắng: có thể chỉnh sửa
              </p>
              <p className="text-gray-600 text-sm mb-1">
                • Nhấn "Giải Sudoku" để tự động giải
              </p>
              <p className="text-gray-600 text-sm">
                • Sau khi giải: copy kết quả dạng số hoặc ma trận
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                📝 Chế độ nhập:
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                • Nhập số 1-9 vào các ô
              </p>
              <p className="text-gray-600 text-sm mb-1">
                • Để trống ô không biết
              </p>
              <p className="text-gray-600 text-sm">
                • "Import text": dán chuỗi 81 số
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SudokuSolver;
