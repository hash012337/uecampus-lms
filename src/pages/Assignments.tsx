import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, AlertCircle, Upload, Download, Calendar, FileText } from "lucide-react";

const assignments = {
  pending: [
    { id: 1, title: "Binary Search Trees Implementation", course: "Data Structures", courseCode: "CS201", dueDate: "2024-01-20", priority: "high", hoursLeft: 8, points: 100, description: "Implement BST operations", attachments: ["requirements.pdf"] },
    { id: 2, title: "React Component Development", course: "Web Development", courseCode: "CS301", dueDate: "2024-01-22", priority: "medium", hoursLeft: 48, points: 80, description: "Build component library", attachments: ["specs.pdf"] },
  ],
  completed: [
    { id: 3, title: "SQL Query Optimization", course: "Database Management", courseCode: "CS202", submittedDate: "2024-01-15", grade: "95/100", feedback: "Excellent work!", points: 100 },
    { id: 4, title: "UI/UX Design Project", course: "Web Development", courseCode: "CS301", submittedDate: "2024-01-10", grade: "88/100", feedback: "Good design", points: 100 },
  ],
};

export default function Assignments() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Assignments</h1>
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">Pending ({assignments.pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({assignments.completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4 mt-6">
          {assignments.pending.map((a) => (
            <Card key={a.id} className="p-6 border-l-4 border-l-accent hover:shadow-glow transition-all">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.course}</p>
                  <div className="flex gap-2">
                    <Badge variant={a.priority === "high" ? "destructive" : "secondary"}>{a.priority}</Badge>
                    <Badge variant="outline">{a.points} pts</Badge>
                  </div>
                  <p className="text-sm flex items-center gap-2"><Clock className="h-4 w-4" /> {a.hoursLeft}h left</p>
                </div>
                <Button className="bg-gradient-primary"><Upload className="mr-2 h-4 w-4" />Submit</Button>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4 mt-6">
          {assignments.completed.map((a) => (
            <Card key={a.id} className="p-6 border-l-4 border-l-success hover:shadow-glow transition-all">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <Badge className="bg-success/20 text-success">Grade: {a.grade}</Badge>
                <p className="text-sm bg-muted/30 p-3 rounded">{a.feedback}</p>
                <Button variant="outline">View Feedback</Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
