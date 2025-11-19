import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, AlertCircle, Upload } from "lucide-react";

const assignments = {
  pending: [
    {
      id: 1,
      title: "Binary Search Trees Implementation",
      course: "Data Structures",
      dueDate: "2024-01-20",
      priority: "high",
      points: 100,
    },
    {
      id: 2,
      title: "React Component Development",
      course: "Web Development",
      dueDate: "2024-01-22",
      priority: "medium",
      points: 80,
    },
  ],
  completed: [
    {
      id: 3,
      title: "SQL Query Optimization",
      course: "Database Management",
      submittedDate: "2024-01-15",
      grade: "95/100",
      status: "graded",
    },
    {
      id: 4,
      title: "UI/UX Design Project",
      course: "Mobile Development",
      submittedDate: "2024-01-10",
      grade: "88/100",
      status: "graded",
    },
  ],
};

export default function Assignments() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground mt-1">
          Manage your assignments and track submissions
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({assignments.pending.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({assignments.completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Assignments */}
        <TabsContent value="pending" className="space-y-4">
          {assignments.pending.map((assignment) => (
            <Card
              key={assignment.id}
              className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {assignment.course}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={
                            assignment.priority === "high"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {assignment.priority} priority
                        </Badge>
                        <Badge variant="outline">{assignment.points} points</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                </div>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Upload className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Completed Assignments */}
        <TabsContent value="completed" className="space-y-4">
          {assignments.completed.map((assignment) => (
            <Card
              key={assignment.id}
              className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-success"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {assignment.course}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-success text-success-foreground">
                          Grade: {assignment.grade}
                        </Badge>
                        <Badge variant="outline">{assignment.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Submitted: {assignment.submittedDate}</span>
                  </div>
                </div>
                <Button variant="outline">View Feedback</Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
