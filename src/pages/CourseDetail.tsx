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
import { DraggableMaterialList, DraggableAssignmentList, DraggableQuizList } from "@/components/DraggableMaterialList";
import { CertificateGeneratedDialog } from "@/components/CertificateGeneratedDialog";
import quizIcon from "@/assets/quiz-icon.png";

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
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [textLessonDialogOpen, setTextLessonDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
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
    passing_marks: 50,
    assessment_brief: "",
    due_date: ""
  });
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set());
  const [courseProgress, setCourseProgress] = useState(0);
  const [sectionQuizzes, setSectionQuizzes] = useState<any[]>([]);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    quiz_url: "",
    description: "",
    duration: 30,
    due_date: ""
  });
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [activityType, setActivityType] = useState<"text" | "file" | "assignment" | "quiz" | "brief" | "google_drive" | null>(null);
  const [fileDisplayName, setFileDisplayName] = useState("");
  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [googleDriveTitle, setGoogleDriveTitle] = useState("");
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
  const [deadlineDialogOpen, setDeadlineDialogOpen] = useState(false);
  const [selectedAssignmentForDeadline, setSelectedAssignmentForDeadline] = useState<any>(null);
  const [selectedQuizForDeadline, setSelectedQuizForDeadline] = useState<any>(null);
  const [selectedUserForDeadline, setSelectedUserForDeadline] = useState("");
  const [customDeadline, setCustomDeadline] = useState("");
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);

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
      loadUserSubmissions();
    }
  }, [user, courseId, isAdmin]);

  const loadUserSubmissions = async () => {
    if (!user || !courseId) return;
    
    const { data } = await supabase
      .from('assignment_submissions')
      .select('assignment_id, status')
      .eq('user_id', user.id);
    
    if (data) {
      setUserSubmissions(data);
      
      // Update assignments with submission status
      const submittedAssignmentIds = new Set(data.map(s => s.assignment_id));
      setAssignments(prev => prev.map(a => ({
        ...a,
        hasSubmission: submittedAssignmentIds.has(a.id),
        status: submittedAssignmentIds.has(a.id) ? 'submitted' : a.status
      })));
    }
  };

  const loadUserProgress = async () => {
    if (!user || !courseId) return;
    
    const { data } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'completed');
    
    if (data) {
      // Create a set of completed material IDs, assignment IDs, and quiz IDs
      const completedItemIds = new Set<string>();
      data.forEach(item => {
        if (item.assignment_id) completedItemIds.add(item.assignment_id);
        // For materials, we need to track by a different mechanism
        // Since progress_tracking doesn't have material_id, we'll handle materials separately
      });
      
      setCompletedMaterials(completedItemIds);
      
      // Calculate progress percentage
      const totalItems = materials.length + assignments.length;
      if (totalItems > 0) {
        const completedCount = data.length;
        const progress = Math.round((completedCount / totalItems) * 100);
        setCourseProgress(progress);
        
        // Check if all materials are completed and generate certificate
        if (progress === 100) {
          checkAndGenerateCertificate();
        }
      }
    }
  };

  const checkAndGenerateCertificate = async () => {
    if (!user || !courseId) return;

    try {
      // Check if certificate already exists
      const { data: existingCert } = await supabase
        .from('certificates' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existingCert) return; // Certificate already exists

      // Generate certificate
      const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { error } = await supabase
        .from('certificates' as any)
        .insert({
          user_id: user.id,
          course_id: courseId,
          certificate_number: certificateNumber,
          completion_date: new Date().toISOString()
        });

      if (error) throw error;

      // Show congratulations dialog
      setCertificateDialogOpen(true);
    } catch (error: any) {
      console.error('Error generating certificate:', error);
    }
  };

  const handleMarkComplete = async (materialId: string) => {
    if (!user || !courseId) return;
    
    try {
      // Check if already completed
      if (completedMaterials.has(materialId)) {
        toast.info("Already marked as complete");
        return;
      }

      // Find the material to get its details
      const material = materials.find(m => m.id === materialId);
      if (!material) return;

      // Insert progress tracking record with material reference
      const { error } = await supabase.from('progress_tracking').insert({
        user_id: user.id,
        course_id: courseId,
        item_type: 'material',
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      if (error) throw error;

      // Update the material's completed status
      setMaterials(prev => prev.map(m => 
        m.id === materialId ? { ...m, completed: true } : m
      ));

      // Update local state
      setCompletedMaterials(prev => new Set([...prev, materialId]));
      toast.success("Marked as complete");
      
      // Reload progress to update the progress bar
      loadUserProgress();
    } catch (error: any) {
      console.error("Error marking complete:", error);
      toast.error(error.message || "Failed to mark as complete");
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
      // Filter hidden materials for non-admin users
      const filteredMaterials = isAdmin ? materialsData : materialsData.filter(m => !m.is_hidden);
      setMaterials(filteredMaterials);
      
      // Auto-select first material for students
      if (!isAdmin && filteredMaterials.length > 0) {
        setSelectedFile(filteredMaterials[0]);
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
      .eq("course_code", courseData?.code || "");
    
    if (assignmentsData) {
      // Get user-specific deadlines if user exists
      let customDeadlines: any[] = [];
      if (user) {
        const { data: deadlinesData } = await supabase
          .from("assignment_deadlines")
          .select("*")
          .eq("user_id", user.id);
        customDeadlines = deadlinesData || [];
      }
      
      const deadlineMap = new Map(customDeadlines.map(d => [d.assignment_id, d.deadline]));
      
      // Add custom deadlines to assignments
      const assignmentsWithDeadlines = assignmentsData.map(assignment => ({
        ...assignment,
        custom_deadline: deadlineMap.get(assignment.id) || null
      }));
      
      // Filter hidden assignments for non-admin users
      const filteredAssignments = isAdmin ? assignmentsWithDeadlines : assignmentsWithDeadlines.filter(a => !a.is_hidden);
      setAssignments(filteredAssignments);
    }

    const { data: quizzesData } = await supabase
      .from("section_quizzes")
      .select("*")
      .eq("course_id", courseId);
    
    if (quizzesData) {
      // Filter hidden quizzes for non-admin users
      const filteredQuizzes = isAdmin ? quizzesData : quizzesData.filter(q => !q.is_hidden);
      setSectionQuizzes(filteredQuizzes);
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
        description: newTextLesson.content,
        is_hidden: false
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
    if (uploadFiles.length === 0 || !fileDisplayName) {
      toast.error("Please provide a display name for the file");
      return;
    }
    
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
          title: fileDisplayName,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          is_hidden: false
        });

        if (dbError) throw dbError;
      }

      toast.success("Materials uploaded");
      setUploadFiles([]);
      setFileDisplayName("");
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

      // Convert datetime-local to UAE timezone (UTC+4) ISO string
      let dueDate = null;
      if (newAssignment.due_date) {
        // datetime-local gives us local time, treat it as UAE time
        const localDate = new Date(newAssignment.due_date);
        // Adjust to UAE timezone (UTC+4)
        const uaeOffset = 4 * 60; // 4 hours in minutes
        const localOffset = localDate.getTimezoneOffset(); // local offset in minutes (negative for UAE)
        const totalOffset = uaeOffset + localOffset;
        localDate.setMinutes(localDate.getMinutes() - totalOffset);
        dueDate = localDate.toISOString();
      }

      const { error } = await supabase.from("assignments").insert({
        course: courseId,
        course_code: course.code,
        title: newAssignment.title,
        unit_name: currentSectionId,
        description: newAssignment.description,
        assessment_brief: newAssignment.assessment_brief,
        feedback: assessmentBriefPath,
        points: newAssignment.points,
        passing_marks: newAssignment.passing_marks,
        due_date: dueDate
      });

      if (error) throw error;
      toast.success("Assignment added");
      setAssignmentDialogOpen(false);
      setNewAssignment({ 
        title: "", 
        unit_name: "", 
        description: "", 
        points: 100, 
        passing_marks: 50,
        assessment_brief: "",
        due_date: "" 
      });
      setAssignmentFile(null);
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submissionFile || !selectedAssignment || !user) return;
    
    try {
      const filePath = `${user.id}/${selectedAssignment.id}/${Date.now()}-${submissionFile.name}`;
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
      setSelectedAssignment(null);
      loadUserSubmissions();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuiz.title || !newQuiz.quiz_url || !currentSectionId || !courseId) return;
    
    try {
      // Convert datetime-local to UAE timezone (UTC+4) ISO string
      let dueDate = null;
      if (newQuiz.due_date) {
        // datetime-local gives us local time, treat it as UAE time
        const localDate = new Date(newQuiz.due_date);
        // Adjust to UAE timezone (UTC+4)
        const uaeOffset = 4 * 60; // 4 hours in minutes
        const localOffset = localDate.getTimezoneOffset(); // local offset in minutes (negative for UAE)
        const totalOffset = uaeOffset + localOffset;
        localDate.setMinutes(localDate.getMinutes() - totalOffset);
        dueDate = localDate.toISOString();
      }

      const { error } = await supabase.from("section_quizzes").insert({
        course_id: courseId,
        section_id: currentSectionId,
        title: newQuiz.title,
        quiz_url: newQuiz.quiz_url,
        description: newQuiz.description,
        duration: newQuiz.duration,
        due_date: dueDate
      });

      if (error) throw error;
      toast.success("Quiz added successfully");
      setNewQuiz({ title: "", quiz_url: "", description: "", duration: 30, due_date: "" });
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add quiz");
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Delete this quiz?")) return;
    
    try {
      const { error } = await supabase
        .from("section_quizzes")
        .delete()
        .eq("id", quizId);

      if (error) throw error;
      toast.success("Quiz deleted");
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("video")) return <Video className="h-4 w-4" />;
    if (fileType?.includes("pdf")) return <FileText className="h-4 w-4" />;
    if (fileType?.includes("text/html")) return <BookOpen className="h-4 w-4" />;
    if (fileType === "google_drive") return <File className="h-4 w-4" />;
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

  const handleUpdateMaterial = async (materialId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('course_materials')
        .update(updates)
        .eq('id', materialId);

      if (error) throw error;

      toast.success('Material updated');
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update material');
    }
  };

  const handleUpdateAssignment = async (assignmentId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update(updates)
        .eq('id', assignmentId);

      if (error) throw error;

      toast.success('Assignment updated');
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update assignment');
    }
  };

  const handleUpdateQuiz = async (quizId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('section_quizzes')
        .update(updates)
        .eq('id', quizId);

      if (error) throw error;

      toast.success('Quiz updated');
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quiz');
    }
  };

  const handleSetUserDeadline = async () => {
    if (!selectedUserForDeadline || !customDeadline) {
      if (selectedAssignmentForDeadline && !selectedUserForDeadline) {
        toast.error("Please select a user");
        return;
      }
      if (!customDeadline) {
        toast.error("Please set a deadline");
        return;
      }
    }
    
    try {
      if (selectedAssignmentForDeadline) {
        // Set deadline for assignment
        const { error } = await supabase.from("assignment_deadlines").upsert({
          assignment_id: selectedAssignmentForDeadline.id,
          user_id: selectedUserForDeadline,
          deadline: customDeadline
        });

        if (error) throw error;
        toast.success("Custom assignment deadline set successfully");
      } else if (selectedQuizForDeadline) {
        // Update quiz deadline
        const { error } = await supabase
          .from("section_quizzes")
          .update({ due_date: customDeadline })
          .eq("id", selectedQuizForDeadline.id);

        if (error) throw error;
        toast.success("Quiz deadline set successfully");
      }
      
      setDeadlineDialogOpen(false);
      setSelectedAssignmentForDeadline(null);
      setSelectedQuizForDeadline(null);
      setSelectedUserForDeadline("");
      setCustomDeadline("");
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || "Failed to set deadline");
    }
  };

  const handleToggleHideMaterial = async (materialId: string, currentlyHidden: boolean) => {
    try {
      const { error } = await supabase
        .from('course_materials')
        .update({ is_hidden: !currentlyHidden })
        .eq('id', materialId);

      if (error) throw error;
      
      toast.success(currentlyHidden ? 'Material visible to students' : 'Material hidden from students');
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update visibility');
    }
  };

  const handleToggleHideAssignment = async (assignmentId: string, currentlyHidden: boolean) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ is_hidden: !currentlyHidden })
        .eq('id', assignmentId);

      if (error) throw error;
      
      toast.success(currentlyHidden ? 'Assignment visible to students' : 'Assignment hidden from students');
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update visibility');
    }
  };

  const handleToggleHideQuiz = async (quizId: string, currentlyHidden: boolean) => {
    try {
      const { error } = await supabase
        .from('section_quizzes')
        .update({ is_hidden: !currentlyHidden })
        .eq('id', quizId);

      if (error) throw error;
      
      toast.success(currentlyHidden ? 'Quiz visible to students' : 'Quiz hidden from students');
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update visibility');
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Delete this assignment?")) return;
    
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast.success('Assignment deleted');
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete assignment');
    }
  };

  const handleAddGoogleDrive = async () => {
    if (!googleDriveUrl || !googleDriveTitle || !currentSectionId) {
      toast.error("Please provide both title and URL");
      return;
    }
    
    try {
      // Convert Google Drive link to embed format if needed
      let embedUrl = googleDriveUrl;
      
      // Handle different Google Drive URL formats
      if (googleDriveUrl.includes('/file/d/')) {
        const fileId = googleDriveUrl.match(/\/file\/d\/([^/]+)/)?.[1];
        if (fileId) {
          embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        }
      } else if (googleDriveUrl.includes('/open?id=')) {
        const fileId = googleDriveUrl.match(/[?&]id=([^&]+)/)?.[1];
        if (fileId) {
          embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }

      const { error } = await supabase.from("course_materials").insert({
        course_id: courseId,
        section_id: currentSectionId,
        title: googleDriveTitle,
        file_path: embedUrl,
        file_type: "google_drive",
        description: embedUrl,
        is_hidden: false
      });

      if (error) throw error;
      
      toast.success("Google Drive content added");
      setGoogleDriveUrl("");
      setGoogleDriveTitle("");
      setActivityDialogOpen(false);
      setActivityType(null);
      loadCourseData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add Google Drive content");
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm("Delete this submission?")) return;
    
    try {
      const submission = userSubmissions.find(s => s.id === submissionId);
      if (!submission) return;

      // Delete from storage
      if (submission.file_path) {
        await supabase.storage
          .from('assignment-submissions')
          .remove([submission.file_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('assignment_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('Submission deleted');
      loadUserSubmissions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete submission');
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
    const totalItems = materials.length + assignments.length + sectionQuizzes.length;
    
    // Count completed items from all sources
    const completedMaterialsCount = materials.filter(m => completedMaterials.has(m.id)).length;
    
    // Count completed assignments (from submissions)
    const completedAssignmentsCount = assignments.filter(a => {
      return userSubmissions.some(sub => sub.assignment_id === a.id);
    }).length;
    
    // Count completed quizzes (from progress tracking)
    const completedQuizzesCount = sectionQuizzes.filter(q => completedMaterials.has(q.id)).length;
    
    const completedItems = completedMaterialsCount + completedAssignmentsCount + completedQuizzesCount;
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="absolute top-4 left-4 z-50">
          <Link to="/courses">
            <Button variant="outline" className="gap-2 shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
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
                  const sectionQuizzesInSection = sectionQuizzes.filter(q => q.section_id === section.id);
                  const sectionTotal = sectionMaterials.length + sectionAssignments.length + sectionQuizzesInSection.length;
                  
                  // Count completed items in section
                  const completedMaterialsInSection = sectionMaterials.filter(m => completedMaterials.has(m.id)).length;
                  const completedAssignmentsInSection = sectionAssignments.filter(a => 
                    userSubmissions.some(sub => sub.assignment_id === a.id)
                  ).length;
                  const completedQuizzesInSection = sectionQuizzesInSection.filter(q => completedMaterials.has(q.id)).length;
                  
                  const sectionCompleted = completedMaterialsInSection + completedAssignmentsInSection + completedQuizzesInSection;
                  
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
                            <button
                              key={material.id}
                              onClick={() => setSelectedFile(material.file_type === "application/brief" ? {
                                ...material,
                                _isBrief: true,
                                assessment_brief: material.description,
                                file_path: material.file_path
                              } : material)}
                              className={`flex items-center gap-3 w-full p-3 rounded-md text-sm hover:bg-accent transition-colors ${
                                selectedFile?.id === material.id ? 'bg-accent' : ''
                              }`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkComplete(material.id);
                                }}
                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer hover:border-primary transition-colors ${
                                  material.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
                                }`}
                              >
                                {material.completed && (
                                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              {getFileIcon(material.file_type)}
                              <span className="truncate text-left flex-1">{material.title}</span>
                            </button>
                          ))}
                          
                          {sectionAssignments.map((assignment) => {
                            const hasSubmission = userSubmissions.some(s => s.assignment_id === assignment.id);
                            const deadline = assignment.custom_deadline || assignment.due_date;
                            return (
                              <button
                                key={assignment.id}
                                onClick={() => setSelectedFile({
                                  ...assignment,
                                  file_type: 'assignment',
                                  _isAssignment: true,
                                  course_id: courseId
                                })}
                                className={`flex items-center gap-3 w-full p-3 rounded-md text-sm hover:bg-accent transition-colors ${
                                  selectedFile?._isAssignment && selectedFile?.id === assignment.id ? 'bg-accent' : ''
                                }`}
                              >
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  hasSubmission ? 'bg-primary border-primary' : 'border-muted-foreground'
                                }`}>
                                  {hasSubmission && (
                                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <Upload className="h-4 w-4 flex-shrink-0 text-orange-500" />
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                  <span className="truncate text-left w-full">{assignment.title}</span>
                                  {deadline && (
                                    <span className="text-xs text-muted-foreground">
                                      Due: {new Date(deadline).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                          
                          {sectionQuizzes.filter(q => q.section_id === section.id).map((quiz) => (
                            <button
                              key={quiz.id}
                              onClick={() => setSelectedFile({
                                ...quiz,
                                file_type: 'quiz',
                                _isQuiz: true,
                              })}
                              className={`flex items-center gap-3 w-full p-3 rounded-md text-sm hover:bg-accent transition-colors border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20 ${
                                selectedFile?._isQuiz && selectedFile?.id === quiz.id ? 'bg-accent' : ''
                              }`}
                            >
                              <img src={quizIcon} alt="Quiz" className="h-5 w-5 flex-shrink-0 object-contain" />
                              <span className="truncate text-left flex-1">{quiz.title}</span>
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
                      onUpdate={handleUpdateMaterial}
                      getFileIcon={getFileIcon}
                    />
                    
                    <DraggableAssignmentList
                      assignments={assignments.filter(a => a.unit_name === section.id)}
                      onDelete={handleDeleteAssignment}
                      onUpdate={handleUpdateAssignment}
                      onToggleHide={handleToggleHideAssignment}
                      onSetDeadline={(assignment) => {
                        setSelectedAssignmentForDeadline(assignment);
                        setDeadlineDialogOpen(true);
                      }}
                    />

                    <DraggableQuizList
                      quizzes={sectionQuizzes.filter(q => q.section_id === section.id)}
                      onDelete={handleDeleteQuiz}
                      onUpdate={handleUpdateQuiz}
                      onToggleHide={handleToggleHideQuiz}
                      onSetDeadline={(quiz) => {
                        setSelectedQuizForDeadline(quiz);
                        setDeadlineDialogOpen(true);
                      }}
                    />

                    <div className="mt-4 pt-4 border-t">
                      <Dialog 
                        open={activityDialogOpen && currentSectionId === section.id} 
                        onOpenChange={(open) => {
                          setActivityDialogOpen(open);
                          if (!open) setActivityType(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => setCurrentSectionId(section.id)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Activity
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {!activityType ? "Select Activity Type" : 
                                activityType === "text" ? "Add Text Lesson" :
                                activityType === "file" ? "Upload Files" :
                                activityType === "assignment" ? "Add Assignment" :
                                activityType === "brief" ? "Add Assignment Brief" :
                                activityType === "google_drive" ? "Add Google Drive Content" :
                                "Add Quiz"}
                            </DialogTitle>
                          </DialogHeader>
                          
                          {!activityType ? (
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                variant="outline"
                                className="h-24 flex flex-col gap-2"
                                onClick={() => setActivityType("text")}
                              >
                                <BookOpen className="h-8 w-8" />
                                <span>Text Lesson</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="h-24 flex flex-col gap-2"
                                onClick={() => setActivityType("file")}
                              >
                                <Upload className="h-8 w-8" />
                                <span>Upload Files</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="h-24 flex flex-col gap-2"
                                onClick={() => setActivityType("assignment")}
                              >
                                <FileQuestion className="h-8 w-8" />
                                <span>Assignment</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="h-24 flex flex-col gap-2"
                                onClick={() => setActivityType("brief")}
                              >
                                <FileText className="h-8 w-8 text-blue-600" />
                                <span>Assignment Brief</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="h-24 flex flex-col gap-2"
                                onClick={() => setActivityType("quiz")}
                              >
                                <img src={quizIcon} alt="Quiz" className="h-12 w-12 object-contain" />
                                <span>Quiz</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="h-24 flex flex-col gap-2"
                                onClick={() => setActivityType("google_drive")}
                              >
                                <File className="h-8 w-8 text-green-600" />
                                <span>Google Drive</span>
                              </Button>
                            </div>
                          ) : activityType === "text" ? (
                            <div className="space-y-4">
                              <Button variant="ghost" size="sm" onClick={() => setActivityType(null)}>
                                ← Back
                              </Button>
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
                              <Button onClick={() => {
                                handleAddTextLesson();
                                setActivityDialogOpen(false);
                                setActivityType(null);
                              }} className="w-full">Add Lesson</Button>
                            </div>
                          ) : activityType === "file" ? (
                            <div className="space-y-4">
                              <Button variant="ghost" size="sm" onClick={() => setActivityType(null)}>
                                ← Back
                              </Button>
                              <div>
                                <Label>Display Name</Label>
                                <Input
                                  value={fileDisplayName}
                                  onChange={(e) => setFileDisplayName(e.target.value)}
                                  placeholder="Enter a name for this material"
                                />
                              </div>
                              <div>
                                <Label>Upload Files (PDF, Word, PPT, etc.)</Label>
                                <Input
                                  type="file"
                                  multiple
                                  onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                                />
                              </div>
                              <Button onClick={() => {
                                handleUploadMaterials(section.id);
                                setActivityDialogOpen(false);
                                setActivityType(null);
                              }} className="w-full">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Files
                              </Button>
                            </div>
                          ) : activityType === "assignment" ? (
                            <div className="space-y-4">
                              <Button variant="ghost" size="sm" onClick={() => setActivityType(null)}>
                                ← Back
                              </Button>
                              <div>
                                <Label>Assignment Title</Label>
                                <Input 
                                  value={newAssignment.title} 
                                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} 
                                  placeholder="Enter assignment title" 
                                />
                              </div>
                              <div>
                                <Label>Description (Optional)</Label>
                                <Textarea 
                                  value={newAssignment.description} 
                                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} 
                                  rows={2} 
                                  placeholder="Brief description" 
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Total Marks</Label>
                                  <Input 
                                    type="number" 
                                    value={newAssignment.points} 
                                    onChange={(e) => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) })} 
                                  />
                                </div>
                                <div>
                                  <Label>Passing Marks</Label>
                                  <Input 
                                    type="number" 
                                    value={newAssignment.passing_marks} 
                                    onChange={(e) => setNewAssignment({ ...newAssignment, passing_marks: parseInt(e.target.value) })} 
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Deadline</Label>
                                <Input 
                                  type="datetime-local" 
                                  value={newAssignment.due_date} 
                                  onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })} 
                                />
                              </div>
                              <Button onClick={() => {
                                handleAddAssignment();
                                setActivityDialogOpen(false);
                                setActivityType(null);
                              }} className="w-full">Add Assignment</Button>
                            </div>
                          ) : activityType === "brief" ? (
                            <div className="space-y-4">
                              <Button variant="ghost" size="sm" onClick={() => setActivityType(null)}>
                                ← Back
                              </Button>
                              <div>
                                <Label>Brief Title</Label>
                                <Input 
                                  value={newAssignment.title} 
                                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} 
                                  placeholder="e.g., Assignment Brief, Instructions" 
                                />
                              </div>
                              <div>
                                <Label>Brief Content</Label>
                                <Textarea 
                                  value={newAssignment.assessment_brief} 
                                  onChange={(e) => setNewAssignment({ ...newAssignment, assessment_brief: e.target.value })} 
                                  rows={6} 
                                  placeholder="Enter detailed assessment criteria, grading rubric, requirements..." 
                                />
                              </div>
                              <div>
                                <Label>Upload Brief File (Optional - PDF or Word)</Label>
                                <Input 
                                  type="file" 
                                  accept=".pdf,.doc,.docx" 
                                  onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)} 
                                />
                              </div>
                              <Button onClick={async () => {
                                if (!newAssignment.title || !currentSectionId) {
                                  toast.error("Please enter a title");
                                  return;
                                }
                                
                                let briefFilePath = null;
                                if (assignmentFile) {
                                  const filePath = `${courseId}/${currentSectionId}/briefs/${Date.now()}-${assignmentFile.name}`;
                                  const { error: uploadError } = await supabase.storage
                                    .from("course-materials")
                                    .upload(filePath, assignmentFile);

                                  if (uploadError) {
                                    toast.error(uploadError.message);
                                    return;
                                  }
                                  briefFilePath = filePath;
                                }

                                const { error } = await supabase.from("course_materials").insert({
                                  course_id: courseId,
                                  section_id: currentSectionId,
                                  title: newAssignment.title,
                                  file_path: briefFilePath || `briefs/${Date.now()}.txt`,
                                  file_type: "application/brief",
                                  description: newAssignment.assessment_brief
                                });

                                if (error) {
                                  toast.error(error.message);
                                  return;
                                }
                                
                                toast.success("Assignment brief added");
                                setActivityDialogOpen(false);
                                setActivityType(null);
                                setNewAssignment({ 
                                  title: "", 
                                  unit_name: "", 
                                  description: "", 
                                  points: 100, 
                                  passing_marks: 50,
                                  assessment_brief: "",
                                  due_date: "" 
                                });
                                setAssignmentFile(null);
                                loadCourseData();
                              }} className="w-full">Add Brief</Button>
                            </div>
                          ) : activityType === "quiz" ? (
                            <div className="space-y-4">
                              <Button variant="ghost" size="sm" onClick={() => setActivityType(null)}>
                                ← Back
                              </Button>
                              <div>
                                <Label>Quiz/Link Title</Label>
                                <Input 
                                  value={newQuiz.title} 
                                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                                  placeholder="Enter title (e.g., Unit 1 Quiz, Google Form)" 
                                />
                              </div>
                              <div>
                                <Label>Link URL</Label>
                                <Input 
                                  value={newQuiz.quiz_url} 
                                  onChange={(e) => setNewQuiz({ ...newQuiz, quiz_url: e.target.value })}
                                  placeholder="Paste any link (Google Forms, Quiz site, etc.)" 
                                />
                              </div>
                              <div>
                                <Label>Deadline (Optional)</Label>
                                <Input 
                                  type="datetime-local" 
                                  value={newQuiz.due_date} 
                                  onChange={(e) => setNewQuiz({ ...newQuiz, due_date: e.target.value })} 
                                />
                              </div>
                              <Button onClick={() => {
                                handleAddQuiz();
                                setActivityDialogOpen(false);
                                setActivityType(null);
                              }} className="w-full">Add Link</Button>
                            </div>
                          ) : activityType === "google_drive" ? (
                            <div className="space-y-4">
                              <Button variant="ghost" size="sm" onClick={() => setActivityType(null)}>
                                ← Back
                              </Button>
                              <div>
                                <Label>Display Title</Label>
                                <Input 
                                  value={googleDriveTitle} 
                                  onChange={(e) => setGoogleDriveTitle(e.target.value)}
                                  placeholder="Enter a title for this content" 
                                />
                              </div>
                              <div>
                                <Label>Google Drive Link</Label>
                                <Input 
                                  value={googleDriveUrl} 
                                  onChange={(e) => setGoogleDriveUrl(e.target.value)}
                                  placeholder="Paste Google Drive share link" 
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Make sure the file is set to "Anyone with the link can view"
                                </p>
                              </div>
                              <Button onClick={handleAddGoogleDrive} className="w-full">
                                Add Google Drive Content
                              </Button>
                            </div>
                          ) : null}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </TabsContent>


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


      {/* Submission Dialog */}
      <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Upload File</Label>
              <Input
                type="file"
                onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleSubmitAssignment} className="w-full">Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deadline Dialog */}
      <Dialog open={deadlineDialogOpen} onOpenChange={setDeadlineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAssignmentForDeadline ? 'Set Custom Assignment Deadline' : 'Set Quiz Deadline'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAssignmentForDeadline && (
              <div>
                <Label>Select User</Label>
                <Select value={selectedUserForDeadline} onValueChange={setSelectedUserForDeadline}>
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
              </div>
            )}
            <div>
              <Label>Deadline</Label>
              <Input
                type="datetime-local"
                value={customDeadline}
                onChange={(e) => setCustomDeadline(e.target.value)}
              />
            </div>
            <Button onClick={handleSetUserDeadline} className="w-full">Set Deadline</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certificate Generated Dialog */}
      <CertificateGeneratedDialog 
        open={certificateDialogOpen} 
        onOpenChange={setCertificateDialogOpen}
      />
      </div>
    </DashboardLayout>
  );
}
