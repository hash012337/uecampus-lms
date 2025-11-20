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
import { CheckCircle2, XCircle, Eye, Award, Download } from "lucide-react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface Assignment {
  id: string;
  title: string;
  course: string;
  course_code: string;
  due_date: string | null;
  points: number | null;
  passing_marks: number | null;
}

interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_path: string | null;
  submitted_at: string | null;
  marks_obtained: number | null;
  graded_at: string | null;
  feedback: string | null;
  status: string | null;
  user_name?: string;
  user_email?: string;
}

export default function Submissions() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [courses, setCourses] = useState<Array<{id: string; name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"submitted" | "not-submitted">("submitted");
  const [gradingDialog, setGradingDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<{ assignment: Assignment; submission: Submission } | null>(null);
  const [gradeData, setGradeData] = useState({ marks: "", feedback: "" });

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, selectedCourse, isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "teacher"])
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch courses first to map IDs to names
      const { data: coursesData } = await supabase.from("courses").select("id, title, code");
      const coursesMap = new Map(coursesData?.map(c => [c.id, { title: c.title, code: c.code }]) || []);

      // Fetch assignments
      let assignmentsQuery = supabase.from("assignments").select("*");
      if (selectedCourse !== "all") {
        assignmentsQuery = assignmentsQuery.eq("course", selectedCourse);
      }
      const { data: assignmentsData } = await assignmentsQuery;

      if (assignmentsData) {
        // Deduplicate assignments by ID
        const uniqueAssignments = Array.from(
          new Map(assignmentsData.map(a => [a.id, a])).values()
        );
        setAssignments(uniqueAssignments);
        
        // Get unique course IDs and create course list
        const uniqueCourseIds = [...new Set(uniqueAssignments.map(a => a.course))];
        const courseList = uniqueCourseIds.map(id => {
          const course = coursesMap.get(id);
          return {
            id,
            name: course ? `${course.title}` : id
          };
        });
        setCourses(courseList);
      }

      // Fetch all users/profiles first
      const { data: usersData } = await supabase.from("profiles").select("*");
      const usersMap = new Map(usersData?.map(u => [u.id, u]) || []);
      
      if (usersData) {
        setAllUsers(usersData);
      }

      // Fetch all submissions
      const { data: submissionsData } = await supabase
        .from("assignment_submissions")
        .select("*");

      if (submissionsData) {
        // Deduplicate submissions by ID
        const uniqueSubmissions = Array.from(
          new Map(submissionsData.map(s => [s.id, s])).values()
        );
        
        // Manually join with user profiles
        const submissionsWithUserInfo = uniqueSubmissions.map((sub: any) => {
          const userProfile = usersMap.get(sub.user_id);
          return {
            ...sub,
            user_name: userProfile?.full_name || "Unknown User",
            user_email: userProfile?.email || "No email"
          };
        });
        setSubmissions(submissionsWithUserInfo);
      }

      setLoading(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  const handleGrade = (assignment: Assignment, submission: Submission) => {
    setSelectedSubmission({ assignment, submission });
    setGradeData({ 
      marks: submission.marks_obtained?.toString() || "", 
      feedback: submission.feedback || "" 
    });
    setGradingDialog(true);
  };

  const saveGrade = async () => {
    if (!selectedSubmission) return;

    try {
      const { error } = await supabase
        .from("assignment_submissions")
        .update({
          marks_obtained: parseInt(gradeData.marks),
          feedback: gradeData.feedback,
          graded_at: new Date().toISOString(),
          graded_by: user?.id
        })
        .eq("id", selectedSubmission.submission.id);

      if (error) throw error;

      toast.success("Grade saved successfully");
      setGradingDialog(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save grade");
    }
  };

  const downloadFile = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("assignment-submissions")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "file";
      a.click();
    } catch (error: any) {
      toast.error(error.message || "Failed to download file");
    }
  };

  const getSubmissionsForAssignment = (assignmentId: string) => {
    return submissions.filter(s => s.assignment_id === assignmentId);
  };

  const getUsersWithoutSubmission = (assignmentId: string) => {
    const submittedUserIds = submissions
      .filter(s => s.assignment_id === assignmentId)
      .map(s => s.user_id);
    
    return allUsers.filter(u => !submittedUserIds.includes(u.id));
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p>You do not have permission to view this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Assignment Submissions</h1>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "submitted" | "not-submitted")}>
          <TabsList>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="not-submitted">Not Submitted</TabsTrigger>
          </TabsList>

          <TabsContent value="submitted" className="space-y-4">
            {assignments.map((assignment) => {
              const assignmentSubmissions = getSubmissionsForAssignment(assignment.id);
              
              if (assignmentSubmissions.length === 0) return null;

              return (
                <Card key={assignment.id} className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.course_code}</p>
                  </div>

                  <div className="space-y-3">
                    {assignmentSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">{submission.user_name}</p>
                              <p className="text-sm text-muted-foreground">{submission.user_email}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span>
                              Submitted: {submission.submitted_at ? format(new Date(submission.submitted_at), "PPp") : "N/A"}
                            </span>
                            {submission.marks_obtained !== null && (
                              <Badge variant="default">
                                <Award className="h-3 w-3 mr-1" />
                                {submission.marks_obtained} / {assignment.points}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {submission.file_path && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadFile(submission.file_path!)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleGrade(assignment, submission)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {submission.marks_obtained !== null ? "Update Grade" : "Grade"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="not-submitted" className="space-y-4">
            {assignments.map((assignment) => {
              const usersWithoutSubmission = getUsersWithoutSubmission(assignment.id);
              
              if (usersWithoutSubmission.length === 0) return null;

              return (
                <Card key={assignment.id} className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.course_code}</p>
                  </div>

                  <div className="space-y-3">
                    {usersWithoutSubmission.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-4 border border-border rounded-lg"
                      >
                        <XCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">{user.full_name || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        <Dialog open={gradingDialog} onOpenChange={setGradingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grade Submission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Marks Obtained</Label>
                <Input
                  type="number"
                  value={gradeData.marks}
                  onChange={(e) => setGradeData({ ...gradeData, marks: e.target.value })}
                  placeholder={`Out of ${selectedSubmission?.assignment.points}`}
                />
              </div>
              <div>
                <Label>Feedback</Label>
                <Textarea
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  rows={4}
                  placeholder="Enter feedback..."
                />
              </div>
              <Button onClick={saveGrade} className="w-full">Save Grade</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
