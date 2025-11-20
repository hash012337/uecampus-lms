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
import { CheckCircle2, XCircle, Eye, Award, Download, Sparkles, FileText } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface Assignment {
  id: string;
  title: string;
  course: string;
  course_code: string;
  due_date: string | null;
  points: number | null;
  passing_marks: number | null;
  assessment_brief: string | null;
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
  const [viewMode, setViewMode] = useState<"marked" | "unmarked">("unmarked");
  const [gradingDialog, setGradingDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<{ assignment: Assignment; submission: Submission } | null>(null);
  const [gradeData, setGradeData] = useState({ marks: "", feedback: "", comments: "" });
  const [filePreview, setFilePreview] = useState<string>("");
  const [isAutoGrading, setIsAutoGrading] = useState(false);

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

  const handleGrade = async (assignment: Assignment, submission: Submission) => {
    setSelectedSubmission({ assignment, submission });
    setGradeData({ 
      marks: submission.marks_obtained?.toString() || "", 
      feedback: submission.feedback || "",
      comments: ""
    });
    
    // Load file preview - get public URL for Google Docs Viewer
    if (submission.file_path) {
      try {
        // Get a public URL for the file
        const { data: urlData } = await supabase.storage
          .from('assignment-submissions')
          .createSignedUrl(submission.file_path, 3600); // 1 hour expiry
        
        if (urlData?.signedUrl) {
          setFilePreview(urlData.signedUrl);
        } else {
          setFilePreview('');
        }
      } catch (err) {
        console.error('Error loading file preview:', err);
        setFilePreview('');
      }
    }
    
    setGradingDialog(true);
  };

  const handleAutoGrade = async () => {
    if (!selectedSubmission) return;
    
    setIsAutoGrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('grade-assignment', {
        body: {
          submissionId: selectedSubmission.submission.id,
          assignmentTitle: selectedSubmission.assignment.title,
          assignmentBrief: selectedSubmission.assignment.assessment_brief,
          maxPoints: selectedSubmission.assignment.points || 100
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
      } else {
        setGradeData({
          marks: data.marks.toString(),
          feedback: data.feedback,
          comments: data.comments || ""
        });
        toast.success('AI grading completed!');
      }
    } catch (error: any) {
      console.error('Auto-grading error:', error);
      toast.error(error.message || 'Failed to auto-grade assignment');
    } finally {
      setIsAutoGrading(false);
    }
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
      
      // Refresh the data to update the tabs
      await fetchData();
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
      <div className="p-8">
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">Loading...</div>
    );
  }

  return (
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

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "marked" | "unmarked")}>
        <TabsList>
          <TabsTrigger value="unmarked">Unmarked</TabsTrigger>
          <TabsTrigger value="marked">Marked</TabsTrigger>
        </TabsList>

        <TabsContent value="unmarked" className="space-y-4">
          {assignments.map((assignment) => {
            const markedSubmissions = getSubmissionsForAssignment(assignment.id)
              .filter(s => s.marks_obtained !== null);
            
            if (markedSubmissions.length === 0) return null;

            return (
              <Card key={assignment.id} className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground">{assignment.course_code}</p>
                </div>

                <div className="space-y-3">
                  {markedSubmissions.map((submission) => (
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
                            Graded: {submission.graded_at ? format(new Date(submission.graded_at), "PPp") : "N/A"}
                          </span>
                          <Badge variant="default">
                            <Award className="h-3 w-3 mr-1" />
                            {submission.marks_obtained} / {assignment.points}
                          </Badge>
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
                          View Grade
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="unmarked" className="space-y-4">
          {assignments.map((assignment) => {
            const unmarkedSubmissions = getSubmissionsForAssignment(assignment.id)
              .filter(s => s.marks_obtained === null);
            
            if (unmarkedSubmissions.length === 0) return null;

            return (
              <Card key={assignment.id} className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground">{assignment.course_code}</p>
                </div>

                <div className="space-y-3">
                  {unmarkedSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-amber-50 dark:bg-amber-950/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30">
                            Pending
                          </Badge>
                          <div>
                            <p className="font-medium">{submission.user_name}</p>
                            <p className="text-sm text-muted-foreground">{submission.user_email}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span>
                            Submitted: {submission.submitted_at ? format(new Date(submission.submitted_at), "PPp") : "N/A"}
                          </span>
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
                          Grade Now
                        </Button>
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Grade Submission: {selectedSubmission?.assignment.title}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoGrade}
                disabled={isAutoGrading}
                className="ml-4"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isAutoGrading ? 'AI Grading...' : 'Auto Grade with AI'}
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 mt-4">
            {/* Left: Assignment Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Assignment Preview
              </div>
              <Card className="p-0 overflow-hidden">
                {filePreview ? (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(filePreview)}&embedded=true`}
                    className="w-full h-[500px] border-0"
                    title="Assignment Preview"
                  />
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading preview...
                  </div>
                )}
              </Card>
            </div>

            {/* Right: Grading Form */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">
                Grading Details
              </div>
              
              <div>
                <Label>Student</Label>
                <div className="text-sm mt-1">
                  <p className="font-medium">{selectedSubmission?.submission.user_name}</p>
                  <p className="text-muted-foreground">{selectedSubmission?.submission.user_email}</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="marks">Marks Obtained</Label>
                <Input
                  id="marks"
                  type="number"
                  value={gradeData.marks}
                  onChange={(e) => setGradeData({ ...gradeData, marks: e.target.value })}
                  placeholder={`Out of ${selectedSubmission?.assignment.points}`}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  rows={5}
                  placeholder="Enter detailed feedback..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={gradeData.comments}
                  onChange={(e) => setGradeData({ ...gradeData, comments: e.target.value })}
                  rows={3}
                  placeholder="Additional comments..."
                  className="mt-1"
                />
              </div>

              <Button onClick={saveGrade} className="w-full" size="lg">
                Save Grade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
