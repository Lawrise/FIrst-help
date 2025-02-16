import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useWebSocket } from './lib/websocket';

interface Call {
  id: number;
  checked: boolean;
  name: string;
  priority: "low" | "medium" | "high" | "vital";
  description: string;
  dateTime: string;
}

function App() {
  const { connect, disconnect, calls, updateCall } = useWebSocket();
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const handleCheckboxChange = (call: Call) => {
    updateCall({
      ...call,
      checked: !call.checked
    });
  };

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
              <TableHead className="text-right">Date time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <Dialog key={call.id}>
                <DialogTrigger asChild>
                  <TableRow
                    className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={() => setSelectedCall(call)}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={call.checked} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(call);
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{call.name}</TableCell>
                    <TableCell>
                      <Badge variant={call.priority}>{call.priority}</Badge>
                    </TableCell>
                    <TableCell>{call.description}</TableCell>
                    <TableCell className="text-right">
                      {call.dateTime}
                    </TableCell>
                  </TableRow>
                </DialogTrigger>

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
                      {call.description}
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
