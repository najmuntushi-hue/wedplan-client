"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authFetch } from "@/lib/api";

export default function BookingForm({ serviceId }: { serviceId: string }) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const eventDate = String(f.get("eventDate"));
    const eventLocation = String(f.get("eventLocation")).trim();
    const message = String(f.get("message")).trim();

    if (!eventDate || !eventLocation) return toast.error("Event date and location are required");

    setLoading(true);
    try {
      await authFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({ serviceId, eventDate, eventLocation, message }),
      });
      toast.success("Booking request sent successfully");
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Could not send booking request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventDate">Event Date</Label>
        <Input id="eventDate" name="eventDate" type="date" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eventLocation">Event Location</Label>
        <Input id="eventLocation" name="eventLocation" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Additional Message</Label>
        <Textarea id="message" name="message" rows={3} />
      </div>
      <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={loading}>
        {loading ? "Sending..." : "Send Booking Request"}
      </Button>
    </form>
  );
}