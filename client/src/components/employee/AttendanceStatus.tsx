/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/axios";

export function AttendanceStatus() {
  const [lunchOutDone, setLunchOutDone] = useState(false);

  const handleCheckIn = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude},${longitude}`;

        try {
          const { data } = await api.post("/attendance/check-in", {
            location,
          });
          toast.success(data.message || "Checked in successfully");
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Check-in failed");
        }
      },
      (error) => {
        console.error("Geolocation Error:", error); // 👈 Add this line
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Permission denied for location.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("An unknown error occurred while fetching location.");
            break;
        }
      }
    );
  };

  const handleLunch = async () => {
    const endpoint = lunchOutDone
      ? "/attendance/lunch-in"
      : "/attendance/lunch-out";
    try {
      const { data } = await api.post(endpoint);
      toast.success(
        data.message ||
          (lunchOutDone ? "Lunch In recorded" : "Lunch Out recorded")
      );
      setLunchOutDone(!lunchOutDone);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lunch update failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      const { data } = await api.post("/attendance/check-out");
      toast.success(data.message || "Checked out successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Check-out failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button variant="default" onClick={handleCheckIn}>
          Check In
        </Button>
        <Button variant="outline" onClick={handleLunch}>
          {lunchOutDone ? "Lunch In" : "Lunch Out"}
        </Button>
        <Button variant="destructive" onClick={handleCheckOut}>
          Check Out
        </Button>
      </CardContent>
    </Card>
  );
}
