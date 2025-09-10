import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InstructionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <strong>Input Sudoku:</strong> Click on cells and enter numbers 1-9
        </div>
        <div>
          <strong>Solve Sudoku:</strong> Click "Solve Sudoku" button to
          automatically solve
        </div>
        <div>
          <strong>Copy:</strong> Click "Copy" to copy in text format
        </div>
        <div>
          <strong>Download:</strong> Click "Download TXT" to save result as file
        </div>
        <div>
          <strong>Reset:</strong> Click "Reset" to clear all and start over
        </div>
        <div className="text-xs text-muted-foreground mt-3">
          💡 Data will be automatically saved and restored when page reloads
        </div>
      </CardContent>
    </Card>
  );
}
