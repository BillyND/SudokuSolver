import { Card, CardContent } from "@/components/ui/card";

interface StatusMessagesProps {
  isSolved: boolean;
  copySuccess: boolean;
}

export function StatusMessages({ isSolved, copySuccess }: StatusMessagesProps) {
  if (!isSolved && !copySuccess) {
    return null;
  }

  return (
    <>
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
    </>
  );
}
