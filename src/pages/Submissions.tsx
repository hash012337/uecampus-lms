import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Eye, Award } from "lucide-react";
import { format } from "date-fns";

interface Assignment {
  id: string;
  title: string;
  course: string;
  course_code: string;
  due_date: string | null;
  points: number | null;
}

interface Submission {
  assignment_id: string;
  user_id: string;
  submitted_date: string | null;
  grade: string | null;
  feedback: string | null;
  user_name: string;
  user_email: string;
}

export default function Submissions() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"submitted" | "not-submitted">("submitted");
  const [gradingDialog, setGradingDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<{ assignment: Assignment; submission: Submission } | null>(null);
  const [gradeData, setGradeData] = useState({ grade: "", feedback: "" });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, selectedCourse]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch assignments
      let assignmentsQuery = supabase.from("assignments").select("*");
      if (selectedCourse !== "all") {
        assignmentsQuery = assignmentsQuery.eq("course", selectedCourse);
      }
      const { data: assignmentsData } = await assignmentsQuery;

      if (assignmentsData) {
        setAssignments(assignmentsData);
        
        // Get unique courses
        const uniqueCourses = [...new Set(assignmentsData.map(a => a.course))];
        setCourses(uniqueCourses);

        // Fetch all users
        const { data: usersData } = await supabase.from("profiles").select("*");

        // Build submissions map
        const submissionsMap: Record<string, Submission[]> = {};
        
        for (const assignment of assignmentsData) {
          const assignmentSubmissions: Submission[] = [];
          
          if (usersData) {
            for (const profile of usersData) {
              // Check if user has submitted (simplified - in real app, fetch from submissions table)
              const hasSubmitted = assignment.status === "completed" && Math.random() > 0.5; // Mock data
              
              if (hasSubmitted) {
                assignmentSubmissions.push({
                  assignment_id: assignment.id,
                  user_id: profile.id,
                  submitted_date: assignment.submitted_date,
                  grade: assignment.grade,
                  feedback: assignment.feedback,
                  user_name: profile.full_name || "Unknown",
                  user_email: profile.email,
                });
              } else {
                assignmentSubmissions.push({
                  assignment_id: assignment.id,
                  user_id: profile.id,
                  submitted_date: null,
                  grade: null,
                  feedback: null,
                  user_name: profile.full_name || "Unknown",
                  user_email: profile.email,
                });
              }
            }
          }
          
          submissionsMap[assignment.id] = assignmentSubmissions;
        }

        setSubmissions(submissionsMap);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = (assignment: Assignment, submission: Submission) => {
    setSelectedSubmission({ assignment, submission });
    setGradeData({ grade: submission.grade || "", feedback: submission.feedback || "" });
    setGradingDialog(true);
  };

  const saveGrade = async () => {
    if (!selectedSubmission) return;

    try {
      const { error } = await supabase
        .from("assignments")
        .update({
          grade: gradeData.grade,
          feedback: gradeData.feedback,
          status: "completed",
        })
        .eq("id", selectedSubmission.assignment.id);

      if (error) throw error;

      toast.success("Grade saved successfully");
      setGradingDialog(false);
      setSelectedSubmission(null);
      fetchData();
    } catch (error) {
      console.error("Error saving grade:", error);
      toast.error("Failed to save grade");
    }
  };

  const filteredSubmissions = (assignmentId: string) => {
    const allSubmissions = submissions[assignmentId] || [];
    if (viewMode === "submitted") {
      return allSubmissions.filter(s => s.submitted_date !== null);
    } else {
      return allSubmissions.filter(s => s.submitted_date === null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Assignment Submissions
          </h1>
          <p className="text-muted-foreground mt-1">
            View and grade student submissions
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList>
          <TabsTrigger value="submitted">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Submitted
          </TabsTrigger>
          <TabsTrigger value="not-submitted">
            <XCircle className="h-4 w-4 mr-2" />
            Not Submitted
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submitted" className="space-y-4 mt-6">
          {assignments.map((assignment) => {
            const submittedList = filteredSubmissions(assignment.id);
            if (submittedList.length === 0) return null;

            return (
              <Card key={assignment.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {assignment.course} ({assignment.course_code})
                    </p>
                    {assignment.due_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {format(new Date(assignment.due_date), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">
                    {submittedList.length} submission{submittedList.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {submittedList.map((submission) => (
                    <div
                      key={submission.user_id}
                      className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{submission.user_name}</p>
                          <p className="text-xs text-muted-foreground">{submission.user_email}</p>
                          {submission.submitted_date && (
                            <p className="text-xs text-muted-foreground">
                              Submitted: {format(new Date(submission.submitted_date), "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.grade ? (
                          <Badge variant="secondary">
                            <Award className="h-3 w-3 mr-1" />
                            {submission.grade}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Graded</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGrade(assignment, submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Grade
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="not-submitted" className="space-y-4 mt-6">
          {assignments.map((assignment) => {
            const notSubmittedList = filteredSubmissions(assignment.id);
            if (notSubmittedList.length === 0) return null;

            return (
              <Card key={assignment.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {assignment.course} ({assignment.course_code})
                    </p>
                    {assignment.due_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {format(new Date(assignment.due_date), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  <Badge variant="destructive">
                    {notSubmittedList.length} not submitted
                  </Badge>
                </div>

                <div className="space-y-2">
                  {notSubmittedList.map((submission) => (
                    <div
                      key={submission.user_id}
                      className="flex items-center gap-3 p-3 border border-border/50 rounded-lg"
                    >
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">{submission.user_name}</p>
                        <p className="text-xs text-muted-foreground">{submission.user_email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Grading Dialog */}
      <Dialog open={gradingDialog} onOpenChange={setGradingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4 py-4">
              <div>
                <p className="font-semibold">{selectedSubmission.assignment.title}</p>
                <p className="text-sm text-muted-foreground">
                  Student: {selectedSubmission.submission.user_name}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={gradeData.grade}
                  onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                  placeholder="e.g., A+, 95/100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  placeholder="Provide feedback for the student"
                  rows={4}
                />
              </div>

              <Button onClick={saveGrade} className="w-full">
                Save Grade
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
