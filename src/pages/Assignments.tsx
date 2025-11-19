import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, Upload, Download, Calendar, Plus, Trash2, Copy, Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useEditMode } from "@/contexts/EditModeContext";

interface PendingAssignment {
  id: number;
  title: string;
  course: string;
  courseCode: string;
  dueDate: string;
  priority: string;
  hoursLeft: number;
  points: number;
  description: string;
  attachments: string[];
}

interface CompletedAssignment {
  id: number;
  title: string;
  course: string;
  courseCode: string;
  submittedDate: string;
  grade: string;
  feedback: string;
  points: number;
}

export default function Assignments() {
  const { isEditMode } = useEditMode();
  
  const [pendingAssignments, setPendingAssignments] = useState<PendingAssignment[]>([
    { 
      id: 1, 
      title: "Binary Search Trees Implementation", 
      course: "Data Structures", 
      courseCode: "CS201", 
      dueDate: "2024-01-20", 
      priority: "high", 
      hoursLeft: 8, 
      points: 100, 
      description: "Implement BST operations", 
      attachments: [] 
    },
    { 
      id: 2, 
      title: "React Component Development", 
      course: "Web Development", 
      courseCode: "CS301", 
      dueDate: "2024-01-22", 
      priority: "medium", 
      hoursLeft: 48, 
      points: 80, 
      description: "Build component library", 
      attachments: [] 
    },
  ]);

  const [completedAssignments, setCompletedAssignments] = useState<CompletedAssignment[]>([
    { 
      id: 3, 
      title: "SQL Query Optimization", 
      course: "Database Management", 
      courseCode: "CS202", 
      submittedDate: "2024-01-15", 
      grade: "95/100", 
      feedback: "Excellent work!", 
      points: 100 
    },
  ]);

  const updatePendingAssignment = (id: number, field: keyof PendingAssignment, value: any) => {
    const updated = pendingAssignments.map(a => a.id === id ? { ...a, [field]: value } : a);
    setPendingAssignments(updated);
    console.log(`Pending assignment ${id} updated - Save to DB:`, { field, value });
  };

  const updateCompletedAssignment = (id: number, field: keyof CompletedAssignment, value: any) => {
    const updated = completedAssignments.map(a => a.id === id ? { ...a, [field]: value } : a);
    setCompletedAssignments(updated);
    console.log(`Completed assignment ${id} updated - Save to DB:`, { field, value });
  };

  const deletePendingAssignment = (id: number) => {
    setPendingAssignments(pendingAssignments.filter(a => a.id !== id));
    toast.success("Assignment deleted");
  };

  const deleteCompletedAssignment = (id: number) => {
    setCompletedAssignments(completedAssignments.filter(a => a.id !== id));
    toast.success("Assignment deleted");
  };

  const addPendingAssignment = () => {
    const newAssignment: PendingAssignment = {
      id: Date.now(),
      title: "New Assignment",
      course: "Course Name",
      courseCode: "CODE",
      dueDate: "2024-01-01",
      priority: "medium",
      hoursLeft: 24,
      points: 100,
      description: "Description",
      attachments: []
    };
    setPendingAssignments([...pendingAssignments, newAssignment]);
    toast.success("Assignment added");
  };

  const duplicatePendingAssignment = (assignment: PendingAssignment) => {
    const duplicated: PendingAssignment = {
      ...assignment,
      id: Date.now(),
      title: `${assignment.title} (Copy)`
    };
    setPendingAssignments([...pendingAssignments, duplicated]);
    toast.success("Assignment duplicated");
  };

  const addCompletedAssignment = () => {
    const newAssignment: CompletedAssignment = {
      id: Date.now(),
      title: "New Completed Assignment",
      course: "Course Name",
      courseCode: "CODE",
      submittedDate: "2024-01-01",
      grade: "0/100",
      feedback: "Feedback here",
      points: 100
    };
    setCompletedAssignments([...completedAssignments, newAssignment]);
    toast.success("Assignment added");
  };

  const duplicateCompletedAssignment = (assignment: CompletedAssignment) => {
    const duplicated: CompletedAssignment = {
      ...assignment,
      id: Date.now(),
      title: `${assignment.title} (Copy)`
    };
    setCompletedAssignments([...completedAssignments, duplicated]);
    toast.success("Assignment duplicated");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        {isEditMode && (
          <Badge variant="outline" className="animate-pulse">
            <Edit2 className="h-3 w-3 mr-1" />
            Edit Mode Active
          </Badge>
        )}
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {isEditMode && (
            <Button onClick={addPendingAssignment} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Pending Assignment
            </Button>
          )}
          {pendingAssignments.map((a) => (
            <Card key={a.id} className="p-6 border-l-4 border-l-accent hover:shadow-glow transition-all relative group">
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => duplicatePendingAssignment(a)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deletePendingAssignment(a.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3 flex-1">
                  {isEditMode ? (
                    <>
                      <Input
                        value={a.title}
                        onChange={(e) => updatePendingAssignment(a.id, "title", e.target.value)}
                        placeholder="Assignment Title"
                        className="text-xl font-semibold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={a.course}
                          onChange={(e) => updatePendingAssignment(a.id, "course", e.target.value)}
                          placeholder="Course Name"
                        />
                        <Input
                          value={a.courseCode}
                          onChange={(e) => updatePendingAssignment(a.id, "courseCode", e.target.value)}
                          placeholder="Course Code"
                        />
                      </div>
                      <Textarea
                        value={a.description}
                        onChange={(e) => updatePendingAssignment(a.id, "description", e.target.value)}
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Due Date</Label>
                          <Input
                            type="date"
                            value={a.dueDate}
                            onChange={(e) => updatePendingAssignment(a.id, "dueDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Hours Left</Label>
                          <Input
                            type="number"
                            value={a.hoursLeft}
                            onChange={(e) => updatePendingAssignment(a.id, "hoursLeft", parseInt(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Points</Label>
                          <Input
                            type="number"
                            value={a.points}
                            onChange={(e) => updatePendingAssignment(a.id, "points", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Priority</Label>
                        <Input
                          value={a.priority}
                          onChange={(e) => updatePendingAssignment(a.id, "priority", e.target.value)}
                          placeholder="high/medium/low"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">{a.title}</h3>
                      <p className="text-sm text-muted-foreground">{a.course} ({a.courseCode})</p>
                      <p className="text-sm">{a.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant={a.priority === "high" ? "destructive" : "secondary"}>{a.priority}</Badge>
                        <Badge variant="outline">{a.points} pts</Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" /> 
                          {a.hoursLeft}h left
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {a.dueDate}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
                {!isEditMode && (
                  <Button className="bg-gradient-primary">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {isEditMode && (
            <Button onClick={addCompletedAssignment} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Completed Assignment
            </Button>
          )}
          {completedAssignments.map((a) => (
            <Card key={a.id} className="p-6 border-l-4 border-l-success hover:shadow-glow transition-all relative group">
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => duplicateCompletedAssignment(a)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteCompletedAssignment(a.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="space-y-3">
                {isEditMode ? (
                  <>
                    <Input
                      value={a.title}
                      onChange={(e) => updateCompletedAssignment(a.id, "title", e.target.value)}
                      placeholder="Assignment Title"
                      className="text-xl font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={a.course}
                        onChange={(e) => updateCompletedAssignment(a.id, "course", e.target.value)}
                        placeholder="Course Name"
                      />
                      <Input
                        value={a.courseCode}
                        onChange={(e) => updateCompletedAssignment(a.id, "courseCode", e.target.value)}
                        placeholder="Course Code"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Submitted Date</Label>
                        <Input
                          type="date"
                          value={a.submittedDate}
                          onChange={(e) => updateCompletedAssignment(a.id, "submittedDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Grade</Label>
                        <Input
                          value={a.grade}
                          onChange={(e) => updateCompletedAssignment(a.id, "grade", e.target.value)}
                          placeholder="95/100"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Points</Label>
                        <Input
                          type="number"
                          value={a.points}
                          onChange={(e) => updateCompletedAssignment(a.id, "points", parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    <Textarea
                      value={a.feedback}
                      onChange={(e) => updateCompletedAssignment(a.id, "feedback", e.target.value)}
                      placeholder="Feedback"
                      rows={2}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{a.title}</h3>
                        <p className="text-sm text-muted-foreground">{a.course} ({a.courseCode})</p>
                      </div>
                      <Badge className="bg-success/20 text-success border-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {a.grade}
                      </Badge>
                    </div>
                    <div className="bg-muted/30 p-3 rounded">
                      <p className="text-sm font-medium mb-1">Instructor Feedback:</p>
                      <p className="text-sm text-muted-foreground">{a.feedback}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Submitted: {a.submittedDate}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        View Submission
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
