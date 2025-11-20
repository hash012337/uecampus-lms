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
  FileQuestion,
  ChevronDown,
  ChevronRight
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
import { FileViewer } from "@/components/FileViewer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

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
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  
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
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
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
    
    if (sectionsData) {
      setSections(sectionsData);
      const openState: Record<string, boolean> = {};
      sectionsData.forEach(s => openState[s.id] = true);
      setOpenSections(openState);
    }

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

  const handleAddTextLesson = async () => {
    if (!newTextLesson.title || !newTextLesson.content || !currentSectionId) return;
    
    try {
      const { error } = await supabase.from("course_materials").insert({
        course_id: courseId,
        section_id: currentSectionId,
        title: newTextLesson.title,
        file_path: `text-lessons/${Date.now()}.html`,
        file_type: "text/html",
        description: newTextLesson.content
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

  const handleAddAssignment = async () => {
    if (!newAssignment.title || !courseId || !currentSectionId) return;
    
    try {
      let assessmentBriefPath = null;
      
      // Upload assessment brief file if provided
      if (assignmentFile) {
        const filePath = `${courseId}/${currentSectionId}/assignments/${Date.now()}-${assignmentFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("course-materials")
          .upload(filePath, assignmentFile);

        if (uploadError) throw uploadError;
        assessmentBriefPath = filePath;
      }

      const { error } = await supabase.from("assignments").insert({
        course: courseId,
        course_code: course.code,
        title: newAssignment.title,
        unit_name: currentSectionId,
        description: newAssignment.description,
        feedback: assessmentBriefPath,
        points: newAssignment.points,
        due_date: newAssignment.due_date || null
      });

      if (error) throw error;
      toast.success("Assignment added");
      setAssignmentDialogOpen(false);
      setNewAssignment({ title: "", unit_name: "", description: "", points: 100, due_date: "" });
      setAssignmentFile(null);
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
    if (fileType?.includes("video")) return <Video className="h-4 w-4" />;
    if (fileType?.includes("pdf")) return <FileText className="h-4 w-4" />;
    if (fileType?.includes("text/html")) return <BookOpen className="h-4 w-4" />;
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

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (!course) return <div className="flex justify-center items-center min-h-96">Loading...</div>;

  // Student View - No layout, just back arrow and content
  if (!isAdmin) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="absolute top-4 left-4 z-50">
          <Link to="/courses">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <FileViewer file={selectedFile} />
          </div>
          
          <div className="w-80 border-l bg-card overflow-auto">
            <div className="p-4">
              <div className="mb-4">
                <Badge className="mb-2">{course.category}</Badge>
                <h2 className="text-xl font-bold">{course.title}</h2>
                <p className="text-sm text-muted-foreground">{course.code}</p>
              </div>
              
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide">Course Content</h3>
              
              <div className="space-y-2">
                {sections.map((section) => (
                  <Collapsible
                    key={section.id}
                    open={openSections[section.id]}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded text-left">
                      {openSections[section.id] ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm">{section.title}</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 mt-2 space-y-1">
                      {materials
                        .filter(m => m.section_id === section.id)
                        .map((material) => (
                          <button
                            key={material.id}
                            onClick={() => setSelectedFile(material)}
                            className={`flex items-center gap-2 w-full p-2 rounded text-sm hover:bg-accent transition-colors ${
                              selectedFile?.id === material.id ? 'bg-accent font-medium' : ''
                            }`}
                          >
                            {getFileIcon(material.file_type)}
                            <span className="truncate text-left">{material.title}</span>
                          </button>
                        ))}
                      
                       {assignments
                        .filter(a => a.unit_name === section.id)
                        .map((assignment) => (
                          <button
                            key={assignment.id}
                            onClick={() => setSelectedFile({
                              ...assignment,
                              file_type: 'assignment',
                              _isAssignment: true
                            })}
                            className={`flex items-center gap-2 w-full p-2 rounded text-sm hover:bg-accent transition-colors ${
                              selectedFile?._isAssignment && selectedFile?.id === assignment.id ? 'bg-accent font-medium' : ''
                            }`}
                          >
                            <FileQuestion className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate text-left">{assignment.title}</span>
                          </button>
                        ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View - wrapped in DashboardLayout
  return (
    <DashboardLayout>
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
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          {course.quiz_url && <TabsTrigger value="quiz">Quiz</TabsTrigger>}
          <TabsTrigger value="students">Enrolled Students</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
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
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newSection.description}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddSection} className="w-full">Add Section</Button>
              </div>
            </DialogContent>
          </Dialog>

          {sections.map((section) => (
            <Collapsible
              key={section.id}
              open={openSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
            >
              <Card>
                <CardHeader>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-80">
                    {openSections[section.id] ? (
                      <ChevronDown className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 flex-shrink-0" />
                    )}
                    <CardTitle className="text-left">{section.title}</CardTitle>
                  </CollapsibleTrigger>
                  {section.description && <p className="text-sm text-muted-foreground ml-7">{section.description}</p>}
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-2">
                    {materials.filter(m => m.section_id === section.id).map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 bg-secondary rounded">
                        <div className="flex items-center gap-2">
                          {getFileIcon(material.file_type)}
                          <span>{material.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadMaterial(material.file_path, material.title)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {assignments.filter(a => a.unit_name === section.id).map((assignment) => (
                      <div key={assignment.id} className="p-3 bg-accent rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <FileQuestion className="h-4 w-4" />
                          <span className="font-medium">{assignment.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                        <div className="text-xs">
                          <span className="font-semibold">Marks:</span> {assignment.points}
                          {assignment.due_date && (
                            <> | <span className="font-semibold">Due:</span> {new Date(assignment.due_date).toLocaleDateString()}</>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 mt-4 pt-4 border-t flex-wrap">
                      <Dialog open={textLessonDialogOpen && currentSectionId === section.id} onOpenChange={setTextLessonDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setCurrentSectionId(section.id)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Add Text
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add Text Lesson</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Lesson Title</Label>
                              <Input
                                value={newTextLesson.title}
                                onChange={(e) => setNewTextLesson({ ...newTextLesson, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Content (You can add text and YouTube videos)</Label>
                              <RichTextEditor
                                content={newTextLesson.content}
                                onChange={(content) => setNewTextLesson({ ...newTextLesson, content })}
                              />
                            </div>
                            <Button onClick={handleAddTextLesson} className="w-full">Add Lesson</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <div className="flex gap-2 flex-1">
                        <Input
                          type="file"
                          multiple
                          onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                          className="flex-1"
                        />
                        <Button onClick={() => handleUploadMaterials(section.id)} size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload File
                        </Button>
                      </div>

                      <Dialog open={assignmentDialogOpen && currentSectionId === section.id} onOpenChange={setAssignmentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setCurrentSectionId(section.id)}>
                            <FileQuestion className="h-4 w-4 mr-2" />
                            Add Assignment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add Assignment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Assignment Title</Label>
                              <Input value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} placeholder="Enter assignment title" />
                            </div>
                            <div>
                              <Label>Description (Optional)</Label>
                              <Textarea value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} rows={2} placeholder="Brief description" />
                            </div>
                            <div>
                              <Label>Assessment Brief (Upload PDF or Word)</Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById("assignment-file-input")?.click()}
                                  className="w-full"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  {assignmentFile ? assignmentFile.name : "Choose File"}
                                </Button>
                                <input
                                  id="assignment-file-input"
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)}
                                  className="hidden"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Marks</Label>
                              <Input type="number" value={newAssignment.points} onChange={(e) => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) })} />
                            </div>
                            <Button onClick={handleAddAssignment} className="w-full">Add Assignment</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </TabsContent>

        {course.quiz_url && (
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Course Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input value={quizUrl} onChange={(e) => setQuizUrl(e.target.value)} placeholder="Paste quiz link" />
                  <Button onClick={handleSaveQuiz}>Save Quiz Link</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

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
      </Tabs>

      {!course.quiz_url && (
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
    </DashboardLayout>
  );
}
