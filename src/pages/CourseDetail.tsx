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
  const [activityType, setActivityType] = useState<"text" | "file" | "assignment" | "quiz" | "brief" | "google_drive" | "video_lecture" | "ppt" | null>(null);
  const [fileDisplayName, setFileDisplayName] = useState("");
  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [googleDriveTitle, setGoogleDriveTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [pptTitle, setPptTitle] = useState("");
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
    
    // Load from localStorage first
    const localKey = `completed_materials_${user.id}_${courseId}`;
    const localCompleted = localStorage.getItem(localKey);
    
    if (localCompleted) {
      try {
        const completedIds = JSON.parse(localCompleted);
        setCompletedMaterials(new Set(completedIds));
      } catch (e) {
        console.error('Error parsing local storage:', e);
      }
    }
    
    const { data } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'completed');
    
    if (data) {
      // Separate completed items by type
      const completedAssignments = data.filter(item => item.item_type === 'assignment');
      const completedQuizzes = data.filter(item => item.item_type === 'quiz');
      
      // Create set of completed IDs
      const completedItemIds = new Set<string>();
      
      // Add assignment IDs
      completedAssignments.forEach(item => {
        if (item.assignment_id) completedItemIds.add(item.assignment_id);
      });
      
      // Add quiz IDs
      completedQuizzes.forEach(item => {
        if (item.quiz_id) completedItemIds.add(item.quiz_id);
      });
      
      // Merge with localStorage completed materials
      if (localCompleted) {
        try {
          const localIds = JSON.parse(localCompleted);
          localIds.forEach((id: string) => completedItemIds.add(id));
        } catch (e) {
          console.error('Error parsing local storage:', e);
        }
      }
      
      setCompletedMaterials(completedItemIds);
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

      // Update local state
      const newCompleted = new Set([...completedMaterials, materialId]);
      setCompletedMaterials(newCompleted);
      
      // Save to localStorage
      const localKey = `completed_materials_${user.id}_${courseId}`;
      localStorage.setItem(localKey, JSON.stringify(Array.from(newCompleted)));
      
      toast.success("Marked as complete");
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
      
      // Auto-select first material for students (handle briefs correctly)
      if (!isAdmin && filteredMaterials.length > 0) {
        const first = filteredMaterials[0];
        const initialFile = first.file_type === "application/brief"
          ? {
              ...first,
              _isBrief: true,
              assessment_brief: first.description,
              file_path: first.file_path,
            }
          : first;
        setSelectedFile(initialFile);
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

  // Calculate progress based on completed materials
  const viewableMaterials = materials.filter(m => 
    m.file_type !== "application/brief" && 
    m.file_type !== "assignment" &&
    !m.file_type?.includes('quiz')
  );
  const totalItems = viewableMaterials.length;
  const completedItems = Array.from(completedMaterials).filter(id => 
    viewableMaterials.some(m => m.id === id)
  ).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Unified layout for both admin and student
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-card">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="font-bold text-lg">{course.title}</h1>
              <p className="text-xs text-muted-foreground">{course.code}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Course Page</Button>
            <Link to="/courses">
              <Button variant="ghost" size="sm">My Courses</Button>
            </Link>
            <Badge variant="secondary">{course.category}</Badge>
          </div>
      </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Content - File Viewer */}
        <div className="flex-1 overflow-hidden bg-background">
          <FileViewer file={selectedFile} />
        </div>
        
        {/* Right Sidebar - Course Navigation */}
        <div className="w-96 border-l bg-card overflow-auto">
          <div className="p-4">
            {/* Progress Section */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedItems} of {totalItems} items completed
              </p>
            </div>

            {/* Course Units/Sections */}
            <div className="space-y-3">
              {sections.map((section, index) => {
                const sectionMaterials = materials.filter(m => m.section_id === section.id && (!m.is_hidden || isAdmin));
                const sectionAssignments = assignments.filter(a => a.unit_name === section.id && (!a.is_hidden || isAdmin));
                const sectionQuizzesInSection = sectionQuizzes.filter(q => q.section_id === section.id && (!q.is_hidden || isAdmin));
                
                return (
                  <Collapsible
                    key={section.id}
                    open={openSections[section.id]}
                    onOpenChange={() => toggleSection(section.id)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-sm">{section.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {sectionMaterials.length + sectionAssignments.length + sectionQuizzesInSection.length} Topics
                          </p>
                        </div>
                      </div>
                      {openSections[section.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="border-t bg-muted/20">
                      <div className="p-2 space-y-1">{sectionMaterials.map((material) => (
                          <button
                            key={material.id}
                            onClick={() => setSelectedFile(material.file_type === "application/brief" ? {
                              ...material,
                              _isBrief: true,
                              assessment_brief: material.description,
                              file_path: material.file_path
                            } : material)}
                            className={`flex items-center gap-2 w-full p-2 rounded text-xs hover:bg-accent transition-colors ${
                              selectedFile?.id === material.id ? 'bg-accent' : ''
                            }`}
                          >
                            <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 text-left min-w-0">
                              <p className="truncate font-medium">{material.title}</p>
                              <p className="text-muted-foreground">
                                {material.file_type?.split('/')[1] || 'file'} | {material.file_size ? `${(material.file_size / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                              </p>
                            </div>
                            <label className="flex items-center gap-1 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={completedMaterials.has(material.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleMarkComplete(material.id);
                                }}
                                className="sr-only"
                              />
                              <div className={`w-9 h-5 rounded-full transition-colors ${completedMaterials.has(material.id) ? 'bg-primary' : 'bg-muted'} relative`}>
                                <div className={`absolute top-0.5 ${completedMaterials.has(material.id) ? 'right-0.5' : 'left-0.5'} w-4 h-4 bg-white rounded-full transition-all shadow`} />
                              </div>
                            </label>
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
                              className={`flex items-center gap-2 w-full p-2 rounded text-xs hover:bg-accent transition-colors ${
                                selectedFile?._isAssignment && selectedFile?.id === assignment.id ? 'bg-accent' : ''
                              }`}
                            >
                              <Upload className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              <div className="flex-1 text-left min-w-0">
                                <p className="truncate font-medium">{assignment.title}</p>
                                {deadline && (
                                  <p className="text-muted-foreground">
                                    Due: {new Date(deadline).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              {hasSubmission && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                        
                        {sectionQuizzesInSection.map((quiz) => (
                          <button
                            key={quiz.id}
                            onClick={() => setSelectedFile({
                              ...quiz,
                              file_type: 'quiz',
                              _isQuiz: true,
                            })}
                            className={`flex items-center gap-2 w-full p-2 rounded text-xs hover:bg-accent transition-colors ${
                              selectedFile?._isQuiz && selectedFile?.id === quiz.id ? 'bg-accent' : ''
                            }`}
                          >
                            <img src={quizIcon} alt="Quiz" className="h-4 w-4 flex-shrink-0" />
                            <div className="flex-1 text-left min-w-0">
                              <p className="truncate font-medium">{quiz.title}</p>
                              <p className="text-muted-foreground">Quiz</p>
                            </div>
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

      {/* Download Section - Only show for file materials, not assignments or quizzes */}
      {selectedFile && 
       selectedFile.file_path && 
       !selectedFile._isQuiz && 
       !selectedFile._isAssignment && 
       selectedFile.file_type !== "text/html" && (
        <div className="border-t bg-card p-4 flex items-center justify-between">
          <span className="text-sm font-medium">Download the file</span>
          <Button onClick={() => {
            if (selectedFile.file_path) {
              downloadMaterial(selectedFile.file_path, selectedFile.title);
            }
          }}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
}
