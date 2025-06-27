import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeaveSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Leave</p>
          <p className="text-xl font-bold">6</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Casual Leave</p>
          <p className="text-xl font-bold">4</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sick Leave</p>
          <p className="text-xl font-bold">2</p>
        </div>
      </CardContent>
    </Card>
  );
}
