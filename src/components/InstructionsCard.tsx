import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InstructionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hướng dẫn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <strong>Nhập Sudoku:</strong> Nhấp vào các ô và nhập số từ 1-9
        </div>
        <div>
          <strong>Giải Sudoku:</strong> Nhấn nút "Giải Sudoku" để tự động giải
        </div>
        <div>
          <strong>Sao chép:</strong> Nhấn "Sao chép" để copy định dạng text
        </div>
        <div>
          <strong>Tải về:</strong> Nhấn "Tải về TXT" để lưu kết quả thành file
        </div>
        <div>
          <strong>Reset:</strong> Nhấn "Reset" để xóa toàn bộ và bắt đầu lại
        </div>
        <div className="text-xs text-muted-foreground mt-3">
          💡 Dữ liệu sẽ được tự động lưu và khôi phục khi reload trang
        </div>
      </CardContent>
    </Card>
  );
}
