import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, Upload, Calendar, Plus, Trash2, Copy, Edit2, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useEditMode } from "@/contexts/EditModeContext";
import { supabase } from "@/integrations/supabase/client";

interface Assignment {
  id: string;
  title: string;
  course: string;
  course_code: string;
  due_date: string | null;
  priority: string | null;
  hours_left: number | null;
  points: number | null;
  description: string | null;
  status: string | null;
  submitted_date: string | null;
  grade: string | null;
  feedback: string | null;
}

export default function Assignments() {
  const { isEditMode } = useEditMode();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchAssignments();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) setUsers(data);
  };

  const handlePdfUpload = async () => {
    if (!pdfFile || !selectedUser) {
      toast.error("Please select a user and upload a PDF");
      return;
    }

    toast.info("PDF parsing will be implemented with document parsing API");
    // TODO: Implement PDF parsing to extract assignment data
    setUploadDialogOpen(false);
    setPdfFile(null);
    setSelectedUser("");
  };

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from("assignments")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;
      setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
    } catch (error: any) {
      toast.error("Failed to update assignment");
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase.from("assignments").delete().eq("id", id);
      if (error) throw error;

      setAssignments(assignments.filter(a => a.id !== id));
      toast.success("Assignment deleted");
    } catch (error: any) {
      toast.error("Failed to delete assignment");
    }
  };

  const addAssignment = async (status: string) => {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .insert({
          title: "New Assignment",
          course: "Course Name",
          course_code: "CODE",
          status: status,
          points: 100,
          priority: "medium"
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setAssignments([data, ...assignments]);
      toast.success("Assignment added");
    } catch (error: any) {
      toast.error("Failed to add assignment");
    }
  };

  const duplicateAssignment = async (assignment: Assignment) => {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .insert({
          title: `${assignment.title} (Copy)`,
          course: assignment.course,
          course_code: assignment.course_code,
          due_date: assignment.due_date,
          priority: assignment.priority,
          hours_left: assignment.hours_left,
          points: assignment.points,
          description: assignment.description,
          status: assignment.status
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setAssignments([data, ...assignments]);
      toast.success("Assignment duplicated");
    } catch (error: any) {
      toast.error("Failed to duplicate assignment");
    }
  };

  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const completedAssignments = assignments.filter(a => a.status === "completed");

  if (loading) return <div className="animate-fade-in">Loading...</div>;

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
            <Button onClick={() => addAssignment("pending")} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Assignment
            </Button>
          )}
          {pendingAssignments.map((a) => (
            <Card key={a.id} className="p-6 border-l-4 border-l-accent hover:shadow-glow transition-all relative group">
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => duplicateAssignment(a)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteAssignment(a.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="space-y-3 flex-1">
                {isEditMode ? (
                  <>
                    <Input
                      value={a.title}
                      onChange={(e) => updateAssignment(a.id, "title", e.target.value)}
                      placeholder="Assignment Title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={a.course}
                        onChange={(e) => updateAssignment(a.id, "course", e.target.value)}
                        placeholder="Course"
                      />
                      <Input
                        value={a.course_code}
                        onChange={(e) => updateAssignment(a.id, "course_code", e.target.value)}
                        placeholder="Code"
                      />
                    </div>
                    <Textarea
                      value={a.description || ""}
                      onChange={(e) => updateAssignment(a.id, "description", e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="date"
                        value={a.due_date || ""}
                        onChange={(e) => updateAssignment(a.id, "due_date", e.target.value)}
                      />
                      <Input
                        type="number"
                        value={a.hours_left || 0}
                        onChange={(e) => updateAssignment(a.id, "hours_left", parseInt(e.target.value))}
                        placeholder="Hours"
                      />
                      <Input
                        type="number"
                        value={a.points || 0}
                        onChange={(e) => updateAssignment(a.id, "points", parseInt(e.target.value))}
                        placeholder="Points"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.course} ({a.course_code})</p>
                    <p className="text-sm">{a.description}</p>
                    <div className="flex gap-2">
                      <Badge variant={a.priority === "high" ? "destructive" : "secondary"}>
                        {a.priority}
                      </Badge>
                      <Badge variant="outline">{a.points} pts</Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {a.hours_left}h left
                      </Badge>
                    </div>
                    <Button className="w-full bg-gradient-primary mt-2">
                      <Upload className="mr-2 h-4 w-4" />
                      Submit
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {isEditMode && (
            <Button onClick={() => addAssignment("completed")} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Completed
            </Button>
          )}
          {completedAssignments.map((a) => (
            <Card key={a.id} className="p-6 border-l-4 border-l-success hover:shadow-glow transition-all relative group">
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => duplicateAssignment(a)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteAssignment(a.id)}
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
                      onChange={(e) => updateAssignment(a.id, "title", e.target.value)}
                      placeholder="Title"
                    />
                    <Input
                      value={a.grade || ""}
                      onChange={(e) => updateAssignment(a.id, "grade", e.target.value)}
                      placeholder="Grade"
                    />
                    <Textarea
                      value={a.feedback || ""}
                      onChange={(e) => updateAssignment(a.id, "feedback", e.target.value)}
                      placeholder="Feedback"
                      rows={2}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold">{a.title}</h3>
                      <Badge className="bg-success/20 text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {a.grade}
                      </Badge>
                    </div>
                    <div className="bg-muted/30 p-3 rounded">
                      <p className="text-sm">{a.feedback}</p>
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
