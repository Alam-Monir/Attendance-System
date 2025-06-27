import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

type Leave = {
  id: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
};

type RequestedLeavesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RequestedLeavesDialog({
  open,
  onOpenChange,
}: RequestedLeavesDialogProps) {
  const [requestedLeaves, setRequestedLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRequestedLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/leave/myLeaves", { withCredentials: true });
      setRequestedLeaves(res.data.data);
    } catch (err) {
      console.error("Failed to fetch leave data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await axios.delete(`/leave/${id}`);
      setRequestedLeaves((prev) => prev.filter((leave) => leave.id !== id));
    } catch (err) {
      console.error("Failed to cancel leave request", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRequestedLeaves();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[100vw] overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Requested Leaves</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applied On</TableHead>
                <TableHead>Leave From</TableHead>
                <TableHead>Leave Till</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestedLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    {new Date(leave.createdAt).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell className="whitespace-pre-wrap break-words max-w-sm">
                    {leave.reason}
                  </TableCell>
                  <TableCell>{leave.status}</TableCell>
                  <TableCell className="text-right">
                    {leave.status.toLowerCase() === "pending" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <X />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Leave Request?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this leave
                                    request? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>No</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancel(leave.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Yes, Cancel
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TooltipTrigger>
                          <TooltipContent>Cancel Request</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {requestedLeaves.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
