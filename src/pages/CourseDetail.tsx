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
import { DraggableMaterialList } from "@/components/DraggableMaterialList";

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
  const [showWelcome, setShowWelcome] = useState(false);
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set());
  const [courseProgress, setCourseProgress] = useState(0);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCourseData();
      if (!isAdmin) {
        setShowWelcome(true);
      }
    }
  }, [user, courseId, isAdmin]);

  useEffect(() => {
    if (user && !isAdmin) {
      loadUserProgress();
    }
  }, [user, courseId, isAdmin]);

  const loadUserProgress = async () => {
    if (!user || !courseId) return;
    
    const { data } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'completed');
    
    if (data) {
      const completed = new Set(data.map(item => item.id));
      setCompletedMaterials(completed);
      
      // Calculate progress percentage
      const totalItems = materials.length + assignments.length;
      if (totalItems > 0) {
        const completedCount = data.length;
        setCourseProgress(Math.round((completedCount / totalItems) * 100));
      }
    }
  };

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
      // Initialize all sections as open
      const openState: Record<string, boolean> = {};
      sectionsData.forEach(section => {
        openState[section.id] = true;
      });
      setOpenSections(openState);
    }

    const { data: materialsData } = await supabase
      .from("course_materials")
      .select("*")
      .eq("course_id", courseId)
      .order("section_id")
      .order("order_index");
    
    if (materialsData) {
      setMaterials(materialsData);
      
      // Auto-select first material for students
      if (!isAdmin && materialsData.length > 0) {
        setSelectedFile(materialsData[0]);
      }
    }

    if (isAdmin) {
      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq("course_id", courseId);
      
      if (enrollmentsData) {
        setEnrolledStudents(enrollmentsData.map((e: any) => e.profiles));
      }

      const { data: usersData } = await supabase
        .from("profiles")
        .select("*");
      
      if (usersData) {
        setUsers(usersData);
      }
    }

    const { data: assignmentsData } = await supabase
      .from("assignments")
      .select("*")
      .eq("course", courseId);
    
    if (assignmentsData) {
      setAssignments(assignmentsData);
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

  const handleReorderMaterials = async (sectionId: string, reorderedMaterials: any[]) => {
    try {
      // Update order_index for each material
      const updates = reorderedMaterials.map((material, index) => 
        supabase
          .from('course_materials')
          .update({ order_index: index })
          .eq('id', material.id)
      );

      await Promise.all(updates);
      
      // Reload materials
      loadCourseData();
      toast.success('Materials reordered');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reorder materials');
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      const material = materials.find(m => m.id === materialId);
      if (!material) return;

      // Delete from storage if it has a file
      if (material.file_path) {
        await supabase.storage
          .from('course-materials')
          .remove([material.file_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('course_materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;

      toast.success('Material deleted');
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete material');
    }
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
    const totalItems = materials.length + assignments.length;
    const completedItems = materials.filter(m => m.completed).length + assignments.filter(a => a.status === 'completed').length;
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

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
          
          <div className="w-96 border-l bg-card overflow-auto">
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="mb-2">{course.category}</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-1">{course.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{course.code}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Overall Progress</span>
                    <span className="font-bold text-lg text-primary">{progressPercentage}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-primary via-primary-glow to-primary transition-all duration-700 ease-out rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center font-medium">
                    {completedItems} of {totalItems} items completed
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {sections.map((section, index) => {
                  const sectionMaterials = materials.filter(m => m.section_id === section.id);
                  const sectionAssignments = assignments.filter(a => a.unit_name === section.id);
                  const sectionTotal = sectionMaterials.length + sectionAssignments.length;
                  const sectionCompleted = sectionMaterials.filter(m => m.completed).length + 
                                          sectionAssignments.filter(a => a.status === 'completed').length;
                  
                  return (
                    <Collapsible
                      key={section.id}
                      open={openSections[section.id]}
                      onOpenChange={() => toggleSection(section.id)}
                      className="border rounded-lg overflow-hidden bg-card"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent/50 transition-colors">
                         <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-base shadow-md">
                            {index + 1}
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="font-bold text-base">{section.title}</h3>
                            {section.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{section.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="h-1.5 bg-muted rounded-full flex-1 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                                  style={{ width: `${sectionTotal > 0 ? (sectionCompleted / sectionTotal) * 100 : 0}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                {sectionCompleted}/{sectionTotal}
                              </span>
                            </div>
                          </div>
                        </div>
                        {openSections[section.id] ? (
                          <ChevronDown className="h-5 w-5 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 flex-shrink-0" />
                        )}
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="border-t">
                        <div className="p-2 space-y-1">
                          {sectionMaterials.map((material) => (
                            <div key={material.id} className="group">
                              <button
                                onClick={() => setSelectedFile(material)}
                                className={`flex items-center gap-3 w-full p-3 rounded-md text-sm hover:bg-accent transition-colors ${
                                  selectedFile?.id === material.id ? 'bg-accent' : ''
                                }`}
                              >
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  material.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
                                }`}>
                                  {material.completed && (
                                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                {getFileIcon(material.file_type)}
                                <span className="truncate text-left flex-1">{material.title}</span>
                              </button>
                              {selectedFile?.id === material.id && !material.completed && (
                                <div className="px-3 py-2">
                                  <Button
                                    size="sm"
                                    variant={completedMaterials.has(material.id) ? "default" : "outline"}
                                    className="w-full text-xs"
                                    onClick={async () => {
                                      try {
                                        const { error } = await supabase
                                          .from('progress_tracking')
                                          .insert({
                                            user_id: user?.id,
                                            course_id: courseId,
                                            item_type: 'material',
                                            status: 'completed',
                                            completed_at: new Date().toISOString()
                                          });
                                        
                                        if (error) throw error;
                                        loadUserProgress();
                                        toast.success('Material completed!');
                                      } catch (error: any) {
                                        toast.error('Failed to mark as complete');
                                      }
                                    }}
                                  >
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    {completedMaterials.has(material.id) ? 'Completed ✓' : 'Mark Complete'}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {sectionAssignments.map((assignment) => (
                            <button
                              key={assignment.id}
                              onClick={() => setSelectedFile({
                                ...assignment,
                                file_type: 'assignment',
                                _isAssignment: true
                              })}
                              className={`flex items-center gap-3 w-full p-3 rounded-md text-sm hover:bg-accent transition-colors ${
                                selectedFile?._isAssignment && selectedFile?.id === assignment.id ? 'bg-accent' : ''
                              }`}
                            >
                              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                assignment.status === 'completed' ? 'bg-primary border-primary' : 'border-muted-foreground'
                              }`}>
                                {assignment.status === 'completed' && (
                                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <FileQuestion className="h-4 w-4 flex-shrink-0 text-orange-500" />
                              <span className="truncate text-left flex-1">{assignment.title}</span>
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Welcome Dialog */}
        <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Welcome to UE Campus LMS!
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center space-y-4">
              <p className="text-lg font-semibold">Your Study Portal Awaits</p>
              <p className="text-muted-foreground">
                Explore your course materials, complete lessons, and track your progress as you advance through your learning journey.
              </p>
              <Button 
                onClick={() => setShowWelcome(false)} 
                className="mt-4 w-full"
                size="lg"
              >
                Let's Start Learning! 🚀
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  <CardContent className="space-y-4">
                    <DraggableMaterialList
                      materials={materials.filter(m => m.section_id === section.id)}
                      onReorder={(reordered) => handleReorderMaterials(section.id, reordered)}
                      onDelete={handleDeleteMaterial}
                      getFileIcon={getFileIcon}
                    />
                    
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
