import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  UserPlus,
  Trash2,
  Plus,
  FileText,
  Video,
  File,
  Upload,
  Download,
  BookOpen,
  FileQuestion
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [quizUrl, setQuizUrl] = useState("");
  
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [textLessonDialogOpen, setTextLessonDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [currentSectionId, setCurrentSectionId] = useState("");
  const [newSection, setNewSection] = useState({ title: "", description: "" });
  const [newTextLesson, setNewTextLesson] = useState({ title: "", content: "" });
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    unit_name: "",
    description: "",
    points: 100,
    due_date: ""
  });
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCourseData();
    }
  }, [user, courseId, isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const loadCourseData = async () => {
    if (!courseId) return;
    
    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();
    
    if (courseData) {
      setCourse(courseData);
      setQuizUrl(courseData.quiz_url || "");
    }

    const { data: sectionsData } = await supabase
      .from("course_sections")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index");
    
    if (sectionsData) setSections(sectionsData);

    const { data: materialsData } = await supabase
      .from("course_materials")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index");
    
    if (materialsData) setMaterials(materialsData);

    const { data: assignmentsData } = await supabase
      .from("assignments")
      .select("*")
      .eq("course", courseId);
    
    if (assignmentsData) setAssignments(assignmentsData);

    if (isAdmin) {
      const { data: usersData } = await supabase.from("profiles").select("*");
      if (usersData) setUsers(usersData);

      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select("*, profiles(*)")
        .eq("course_id", courseId)
        .eq("status", "active");
      
      if (enrollmentsData) setEnrolledStudents(enrollmentsData);
    }
  };

  const handleEnrollUser = async () => {
    if (!selectedUserId || !courseId) return;
    
    try {
      const { error } = await supabase.from("enrollments").insert({
        user_id: selectedUserId,
        course_id: courseId,
        role: "student",
        enrolled_by: user?.id
      });

      if (error) throw error;
      toast.success("User enrolled successfully");
      setEnrollDialogOpen(false);
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll user");
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseId || !confirm("Are you sure you want to delete this course?")) return;
    
    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);
      if (error) throw error;
      toast.success("Course deleted");
      window.location.href = "/courses";
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddSection = async () => {
    if (!newSection.title || !courseId) return;
    
    try {
      const { error } = await supabase.from("course_sections").insert({
        course_id: courseId,
        title: newSection.title,
        description: newSection.description,
        order_index: sections.length
      });

      if (error) throw error;
      toast.success("Section added");
      setSectionDialogOpen(false);
      setNewSection({ title: "", description: "" });
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUploadMaterials = async (sectionId: string) => {
    if (uploadFiles.length === 0) return;
    
    try {
      for (const file of uploadFiles) {
        const filePath = `${courseId}/${sectionId}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("course-materials")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from("course_materials").insert({
          course_id: courseId,
          section_id: sectionId,
          title: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size
        });

        if (dbError) throw dbError;
      }

      toast.success("Materials uploaded");
      setUploadFiles([]);
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddTextLesson = async () => {
    if (!newTextLesson.title || !currentSectionId || !courseId) return;
    
    try {
      const { error } = await supabase.from("course_materials").insert({
        course_id: courseId,
        section_id: currentSectionId,
        title: newTextLesson.title,
        file_path: "text-lesson",
        file_type: "text/html",
        description: newTextLesson.content,
        order_index: materials.filter(m => m.section_id === currentSectionId).length
      });

      if (error) throw error;
      toast.success("Text lesson added");
      setTextLessonDialogOpen(false);
      setNewTextLesson({ title: "", content: "" });
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.title || !courseId) return;
    
    try {
      const { error } = await supabase.from("assignments").insert({
        course: courseId,
        course_code: course.code,
        title: newAssignment.title,
        unit_name: newAssignment.unit_name,
        description: newAssignment.description,
        points: newAssignment.points,
        due_date: newAssignment.due_date || null
      });

      if (error) throw error;
      toast.success("Assignment added");
      setAssignmentDialogOpen(false);
      setNewAssignment({ title: "", unit_name: "", description: "", points: 100, due_date: "" });
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submissionFile || !selectedAssignment || !user) return;
    
    try {
      const filePath = `${user.id}/${selectedAssignment.id}/${submissionFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("assignment-submissions")
        .upload(filePath, submissionFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("assignment_submissions").insert({
        assignment_id: selectedAssignment.id,
        user_id: user.id,
        file_path: filePath,
        status: "submitted"
      });

      if (dbError) throw dbError;

      toast.success("Assignment submitted");
      setSubmissionDialogOpen(false);
      setSubmissionFile(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSaveQuiz = async () => {
    if (!courseId) return;
    
    try {
      const { error } = await supabase
        .from("courses")
        .update({ quiz_url: quizUrl })
        .eq("id", courseId);

      if (error) throw error;
      toast.success("Quiz link saved");
      setQuizDialogOpen(false);
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "text/html") return <BookOpen className="h-4 w-4" />;
    if (fileType?.includes("video")) return <Video className="h-4 w-4" />;
    if (fileType?.includes("pdf")) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const downloadMaterial = async (filePath: string, title: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("course-materials")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = title;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Failed to download file");
    }
  };

  if (!course) return <div className="flex justify-center items-center min-h-96">Loading...</div>;

  return (
    <div className="space-y-6">
      <Link to="/courses">
        <Button variant="ghost" className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-r from-primary/90 to-primary-glow/90">
        <div className="relative h-full flex items-center justify-between px-8">
          <div className="flex-1">
            <Badge className="mb-2 bg-white/20 text-white border-white/30">{course.category}</Badge>
            <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-white/80">{course.code}</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Enroll User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enroll User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(u => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.full_name || u.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleEnrollUser} className="w-full">Enroll</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={handleDeleteCourse}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          {course.quiz_url && <TabsTrigger value="quiz">Quiz</TabsTrigger>}
          {isAdmin && <TabsTrigger value="students">Enrolled Students</TabsTrigger>}
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {isAdmin && (
            <Button onClick={() => setSectionDialogOpen(true)} className="mb-4">
              <Plus className="h-4 w-4 mr-2" />
              New Section
            </Button>
          )}

          {sections.map((section) => {
            const sectionMaterials = materials.filter(m => m.section_id === section.id);
            const sectionAssignments = assignments.filter(a => a.unit_name === section.id);
            
            return (
              <Card key={section.id} className="overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sectionMaterials.length + sectionAssignments.length} items
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-0">
                  {sectionMaterials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border-b hover:bg-accent/50">
                      <div className="flex items-center gap-3">
                        {getFileIcon(material.file_type)}
                        <div>
                          <div className="text-sm font-medium">{material.title}</div>
                          {material.file_type === "text/html" && material.description && (
                            <div 
                              className="text-xs text-muted-foreground mt-1 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: material.description.substring(0, 100) + "..." }}
                            />
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">Free</Badge>
                      </div>
                      <div className="flex gap-2">
                        {material.file_type !== "text/html" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadMaterial(material.file_path, material.title)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {sectionAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border-b hover:bg-accent/50">
                      <div className="flex items-center gap-3">
                        <FileQuestion className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="text-sm font-medium">{assignment.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No deadline"}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">Assignment • {assignment.points} pts</Badge>
                      </div>
                      {!isAdmin && (
                        <Button size="sm" onClick={() => {
                          setSelectedAssignment(assignment);
                          setSubmissionDialogOpen(true);
                        }}>
                          Submit
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {isAdmin && (
                    <div className="p-4 border-t bg-muted/30">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          onClick={() => {
                            setCurrentSectionId(section.id);
                            setTextLessonDialogOpen(true);
                          }} 
                          size="sm"
                          variant="outline"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Add Text Lesson
                        </Button>
                        <div className="flex gap-2 flex-1">
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                            className="text-sm flex-1"
                          />
                          <Button onClick={() => handleUploadMaterials(section.id)} size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </Button>
                        </div>
                        <Button 
                          onClick={() => {
                            setNewAssignment({ ...newAssignment, unit_name: section.id });
                            setAssignmentDialogOpen(true);
                          }} 
                          size="sm" 
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Assignment
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={newSection.title}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    placeholder="e.g., Unit 1: Introduction"
                  />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={newSection.description}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                    placeholder="Brief description of this section"
                  />
                </div>
                <Button onClick={handleAddSection} className="w-full">Add Section</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={textLessonDialogOpen} onOpenChange={setTextLessonDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add Text Lesson</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Lesson Title</Label>
                  <Input
                    value={newTextLesson.title}
                    onChange={(e) => setNewTextLesson({ ...newTextLesson, title: e.target.value })}
                    placeholder="e.g., Introduction to Programming"
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <RichTextEditor
                    content={newTextLesson.content}
                    onChange={(content) => setNewTextLesson({ ...newTextLesson, content })}
                  />
                </div>
                <Button onClick={handleAddTextLesson} className="w-full">Add Lesson</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>


        {course.quiz_url && (
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Course Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  <div className="space-y-4">
                    <Input value={quizUrl} onChange={(e) => setQuizUrl(e.target.value)} placeholder="Paste quiz link" />
                    <Button onClick={handleSaveQuiz}>Save Quiz Link</Button>
                  </div>
                ) : (
                  <a href={course.quiz_url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">Take Quiz</Button>
                  </a>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Upload File</Label>
                <Input type="file" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={handleSubmitAssignment} className="w-full">Submit Assignment</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
              </div>
              <div>
                <Label>Marks</Label>
                <Input type="number" value={newAssignment.points} onChange={(e) => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={newAssignment.due_date} onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })} />
              </div>
              <Button onClick={handleAddAssignment} className="w-full">Add Assignment</Button>
            </div>
          </DialogContent>
        </Dialog>

        {isAdmin && (
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrolled Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>{enrollment.profiles?.full_name}</TableCell>
                        <TableCell>{enrollment.profiles?.email}</TableCell>
                        <TableCell>{new Date(enrollment.enrolled_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {isAdmin && !course.quiz_url && (
        <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Quiz Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Quiz Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={quizUrl}
                onChange={(e) => setQuizUrl(e.target.value)}
                placeholder="https://forms.google.com/..."
              />
              <Button onClick={handleSaveQuiz} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
