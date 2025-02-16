import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import "./App.css";
import { Badge } from "./components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import useCallstStore from "./stores/callStore";

interface Call {
  _id: string;
  checked: boolean;
  name: string;
  priority: "low" | "medium" | "high" | "vital";
  accident: string;
  dateTime: string;
}

function App() {
  const { calls, loading, error, addCall } = useCallstStore();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:3000`);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "initial") {
        addCall({ call: message.data });
      } else if (message.type === "update") {
        addCall(message.data);
      }
    };

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    return () => socket.close();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main className="bg-indigo-100 w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl">List of recent calls</h1>
      <div className="w-1/2 justify-center">
        <Table className="my-10">
          <TableCaption>A list of recent calls sorted by priority</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Checked</TableHead>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead className="text-right">Date time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <Dialog key={call._id || call.id}>
                <DialogTrigger asChild>
                  <TableRow
                    className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    // onClick={() => setSelectedCall(call)}
                  >
                    <TableCell>
                      {/* <Checkbox checked={call.checked} /> */}
                      yoooooooo
                    </TableCell>
                    <TableCell className="font-medium">{call.name}</TableCell>
                    <TableCell>
                      <Badge variant={call.priority}>{call.priority}</Badge>
                    </TableCell>
                    <TableCell>{call.accident}</TableCell>
                    <TableCell>{call.location}</TableCell>
                    <TableCell className="text-right">
                      {formatTime(call.dateTime)}
                    </TableCell>
                  </TableRow>
                </DialogTrigger>

                {/* dialogue pour afficher les détails de l'appel */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Call Details</DialogTitle>
                    <DialogDescription>
                      Details of the selected call.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold">Name:</span> {call.name}
                    </div>
                    <div>
                      <span className="font-semibold">Priority:</span>{" "}
                      <Badge variant={call.priority}>{call.priority}</Badge>
                    </div>
                    <div>
                      <span className="font-semibold">Description:</span>{" "}
                      {call.accident}
                    </div>
                    <div>
                      <span className="font-semibold">Date and Time:</span>{" "}
                      {call.dateTime}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default App;
