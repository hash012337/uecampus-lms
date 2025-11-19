import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save,
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  X,
  UserPlus
} from "lucide-react";
import { allCoursesData } from "@/data/coursesData";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurriculumSection {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: string;
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = allCoursesData.find(c => c.id === courseId);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();
    setIsAdmin(!!data);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) setUsers(data);
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
      setSelectedUserId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll user");
    }
  };

  const [courseData, setCourseData] = useState({
    id: course?.id || "",
    code: course?.code || "",
    title: course?.title || "",
    category: course?.category || "",
    subcategory: course?.subcategory || "",
    level: course?.level || "",
    duration: course?.duration || "",
    mode: course?.mode || "",
    partner: course?.partner || "",
    description: course?.description || "",
    overview: course?.overview || "",
    tuition: course?.fees.tuition || "",
    installments: course?.fees.installments || false,
    accreditation: course?.accreditation || "",
    rating: course?.rating || 0,
    enrolledStudents: course?.enrolledStudents || 0,
    learningOutcomes: course?.learningOutcomes || [],
    modules: course?.modules || [],
    entryRequirements: course?.entryRequirements || [],
    careerOpportunities: course?.careerOpportunities || []
  });

  const [curriculumSections, setCurriculumSections] = useState<CurriculumSection[]>([
    {
      id: "1",
      title: "Introduction to the Course",
      description: "Get started with the fundamentals",
      duration: "2 weeks",
      lessons: [
        { id: "1-1", title: "Welcome and Course Overview", duration: "15 min", type: "video" },
        { id: "1-2", title: "Setting Up Your Environment", duration: "30 min", type: "video" },
        { id: "1-3", title: "First Assignment", duration: "45 min", type: "assignment" }
      ]
    }
  ]);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  // Handler for updating basic course fields
  const handleCourseFieldUpdate = (field: keyof typeof courseData, value: any) => {
    const updatedData = { ...courseData, [field]: value };
    setCourseData(updatedData);
    console.log(`Course ${field} updated - Save to DB:`, { field, value });
    // TODO: await updateCourseFieldInDatabase(courseData.id, { [field]: value });
  };

  if (!course) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="p-12 text-center bg-gradient-card">
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <Link to="/courses">
            <Button className="bg-gradient-primary mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleSaveCourse = () => {
    // Complete course data package ready for database
    const completeCourseData = {
      ...courseData,
      curriculumSections: curriculumSections
    };
    
    console.log("=== COURSE DATA FOR DATABASE ===");
    console.log("Basic Info:", courseData);
    console.log("Curriculum Sections:", curriculumSections);
    console.log("Complete Package:", completeCourseData);
    console.log("================================");
    
    // TODO: Add your database save logic here
    // Example: await saveCourseToDatabase(completeCourseData);
    
    toast.success("Course updated successfully!");
  };

  const handleAddSection = () => {
    const newSection: CurriculumSection = {
      id: Date.now().toString(),
      title: "New Section",
      description: "Section description",
      duration: "1 week",
      lessons: []
    };
    const updatedSections = [...curriculumSections, newSection];
    setCurriculumSections(updatedSections);
    console.log("Section added - Save to DB:", newSection);
    // TODO: await addSectionToDatabase(courseData.id, newSection);
    toast.success("New section added");
  };

  const handleDeleteSection = (sectionId: string) => {
    setCurriculumSections(curriculumSections.filter(s => s.id !== sectionId));
    console.log("Section deleted - Remove from DB:", sectionId);
    // TODO: await deleteSectionFromDatabase(courseData.id, sectionId);
    toast.success("Section deleted");
  };

  const handleUpdateSection = (sectionId: string, field: keyof CurriculumSection, value: any) => {
    const updatedSections = curriculumSections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    setCurriculumSections(updatedSections);
    console.log(`Section ${sectionId} updated - Save to DB:`, { field, value });
    // TODO: await updateSectionInDatabase(courseData.id, sectionId, { [field]: value });
  };

  const handleAddLesson = (sectionId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "New Lesson",
      duration: "15 min",
      type: "video"
    };
    setCurriculumSections(curriculumSections.map(section => 
      section.id === sectionId 
        ? { ...section, lessons: [...section.lessons, newLesson] }
        : section
    ));
    console.log("Lesson added - Save to DB:", { sectionId, lesson: newLesson });
    // TODO: await addLessonToDatabase(courseData.id, sectionId, newLesson);
    toast.success("Lesson added");
  };

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    setCurriculumSections(curriculumSections.map(section => 
      section.id === sectionId 
        ? { ...section, lessons: section.lessons.filter(l => l.id !== lessonId) }
        : section
    ));
    console.log("Lesson deleted - Remove from DB:", { sectionId, lessonId });
    // TODO: await deleteLessonFromDatabase(courseData.id, sectionId, lessonId);
    toast.success("Lesson deleted");
  };

  const handleUpdateLesson = (sectionId: string, lessonId: string, field: keyof Lesson, value: string) => {
    setCurriculumSections(curriculumSections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            lessons: section.lessons.map(lesson => 
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            )
          }
        : section
    ));
    console.log(`Lesson ${lessonId} updated - Save to DB:`, { sectionId, field, value });
    // TODO: await updateLessonInDatabase(courseData.id, sectionId, lessonId, { [field]: value });
  };

  const handleArrayFieldAdd = (field: keyof typeof courseData) => {
    const currentArray = courseData[field] as string[];
    const updatedData = {
      ...courseData,
      [field]: [...currentArray, ""]
    };
    setCourseData(updatedData);
    console.log(`${field} item added - Save to DB:`, updatedData[field]);
    // TODO: await updateCourseFieldInDatabase(courseData.id, field, updatedData[field]);
  };

  const handleArrayFieldUpdate = (field: keyof typeof courseData, index: number, value: string) => {
    const currentArray = courseData[field] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    const updatedData = {
      ...courseData,
      [field]: newArray
    };
    setCourseData(updatedData);
    console.log(`${field}[${index}] updated - Save to DB:`, updatedData[field]);
    // TODO: await updateCourseFieldInDatabase(courseData.id, field, updatedData[field]);
  };

  const handleArrayFieldDelete = (field: keyof typeof courseData, index: number) => {
    const currentArray = courseData[field] as string[];
    const updatedData = {
      ...courseData,
      [field]: currentArray.filter((_, i) => i !== index)
    };
    setCourseData(updatedData);
    console.log(`${field}[${index}] deleted - Save to DB:`, updatedData[field]);
    // TODO: await updateCourseFieldInDatabase(courseData.id, field, updatedData[field]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/courses">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <Button onClick={handleSaveCourse} className="gap-2 bg-gradient-primary">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Course Basic Information */}
      <Card className="p-8 bg-gradient-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Course Information</h2>
          <Badge variant="outline">Admin Edit Mode</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="course-id">Course ID</Label>
            <Input
              id="course-id"
              value={courseData.id}
              onChange={(e) => handleCourseFieldUpdate("id", e.target.value)}
              placeholder="course-id"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-code">Course Code</Label>
            <Input
              id="course-code"
              value={courseData.code}
              onChange={(e) => handleCourseFieldUpdate("code", e.target.value)}
              placeholder="CS-101"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="course-title">Course Title</Label>
            <Input
              id="course-title"
              value={courseData.title}
              onChange={(e) => handleCourseFieldUpdate("title", e.target.value)}
              placeholder="Enter course title"
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={courseData.category}
              onChange={(e) => handleCourseFieldUpdate("category", e.target.value)}
              placeholder="Bachelor's Programs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              value={courseData.subcategory}
              onChange={(e) => handleCourseFieldUpdate("subcategory", e.target.value)}
              placeholder="Information Technology"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Input
              id="level"
              value={courseData.level}
              onChange={(e) => handleCourseFieldUpdate("level", e.target.value)}
              placeholder="Undergraduate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={courseData.duration}
              onChange={(e) => handleCourseFieldUpdate("duration", e.target.value)}
              placeholder="3-4 years"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">Mode</Label>
            <Input
              id="mode"
              value={courseData.mode}
              onChange={(e) => handleCourseFieldUpdate("mode", e.target.value)}
              placeholder="Online"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner">Partner Institution</Label>
            <Input
              id="partner"
              value={courseData.partner}
              onChange={(e) => handleCourseFieldUpdate("partner", e.target.value)}
              placeholder="Walsh College"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={courseData.description}
              onChange={(e) => handleCourseFieldUpdate("description", e.target.value)}
              placeholder="Brief course description"
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="overview">Overview</Label>
            <Textarea
              id="overview"
              value={courseData.overview}
              onChange={(e) => handleCourseFieldUpdate("overview", e.target.value)}
              placeholder="Detailed course overview"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tuition">Tuition Fees</Label>
            <Input
              id="tuition"
              value={courseData.tuition}
              onChange={(e) => handleCourseFieldUpdate("tuition", e.target.value)}
              placeholder="$12,000 - $15,000 per year"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accreditation">Accreditation</Label>
            <Input
              id="accreditation"
              value={courseData.accreditation}
              onChange={(e) => handleCourseFieldUpdate("accreditation", e.target.value)}
              placeholder="Accreditation body"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={courseData.rating}
              onChange={(e) => handleCourseFieldUpdate("rating", parseFloat(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrolled">Enrolled Students</Label>
            <Input
              id="enrolled"
              type="number"
              value={courseData.enrolledStudents}
              onChange={(e) => handleCourseFieldUpdate("enrolledStudents", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2 flex items-center gap-3">
            <Switch
              id="installments"
              checked={courseData.installments}
              onCheckedChange={(checked) => handleCourseFieldUpdate("installments", checked)}
            />
            <Label htmlFor="installments" className="cursor-pointer">
              Installment plans available
            </Label>
          </div>
        </div>
      </Card>

      {/* Learning Outcomes */}
      <Card className="p-8 bg-gradient-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Learning Outcomes</h2>
          <Button onClick={() => handleArrayFieldAdd("learningOutcomes")} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Outcome
          </Button>
        </div>
        <div className="space-y-3">
          {courseData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={outcome}
                onChange={(e) => handleArrayFieldUpdate("learningOutcomes", index, e.target.value)}
                placeholder="Enter learning outcome"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleArrayFieldDelete("learningOutcomes", index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Modules/Topics */}
      <Card className="p-8 bg-gradient-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Course Modules</h2>
          <Button onClick={() => handleArrayFieldAdd("modules")} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Module
          </Button>
        </div>
        <div className="space-y-3">
          {courseData.modules.map((module, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex items-center gap-2 flex-1">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <Input
                  value={module}
                  onChange={(e) => handleArrayFieldUpdate("modules", index, e.target.value)}
                  placeholder="Enter module name"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleArrayFieldDelete("modules", index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Entry Requirements */}
      <Card className="p-8 bg-gradient-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Entry Requirements</h2>
          <Button onClick={() => handleArrayFieldAdd("entryRequirements")} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Requirement
          </Button>
        </div>
        <div className="space-y-3">
          {courseData.entryRequirements.map((req, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={req}
                onChange={(e) => handleArrayFieldUpdate("entryRequirements", index, e.target.value)}
                placeholder="Enter requirement"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleArrayFieldDelete("entryRequirements", index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Career Opportunities */}
      <Card className="p-8 bg-gradient-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Career Opportunities</h2>
          <Button onClick={() => handleArrayFieldAdd("careerOpportunities")} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Career
          </Button>
        </div>
        <div className="space-y-3">
          {courseData.careerOpportunities.map((career, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={career}
                onChange={(e) => handleArrayFieldUpdate("careerOpportunities", index, e.target.value)}
                placeholder="Enter career opportunity"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleArrayFieldDelete("careerOpportunities", index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Separator className="my-8" />

      {/* Curriculum Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Course Curriculum</h2>
          <Button onClick={handleAddSection} className="gap-2 bg-gradient-primary">
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>

        <div className="space-y-6">
          {curriculumSections.map((section, sectionIndex) => (
            <Card key={section.id} className="p-6 bg-gradient-card border-primary/20">
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 mt-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <Badge variant="outline" className="font-mono">
                      Section {sectionIndex + 1}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    {editingSection === section.id ? (
                      <>
                        <Input
                          value={section.title}
                          onChange={(e) => handleUpdateSection(section.id, "title", e.target.value)}
                          placeholder="Section title"
                          className="text-lg font-semibold"
                        />
                        <Textarea
                          value={section.description}
                          onChange={(e) => handleUpdateSection(section.id, "description", e.target.value)}
                          placeholder="Section description"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Input
                            value={section.duration}
                            onChange={(e) => handleUpdateSection(section.id, "duration", e.target.value)}
                            placeholder="Duration"
                            className="w-40"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            Done
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold">{section.title}</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingSection(section.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSection(section.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{section.description}</p>
                        <Badge variant="secondary">{section.duration}</Badge>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Lessons */}
                <div className="space-y-3 pl-12">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-muted-foreground">Lessons</h4>
                    <Button
                      onClick={() => handleAddLesson(section.id)}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-3 w-3" />
                      Add Lesson
                    </Button>
                  </div>

                  {section.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <Badge variant="secondary" className="font-mono text-xs">
                        {lessonIndex + 1}
                      </Badge>
                      
                      {editingLesson === lesson.id ? (
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={lesson.title}
                            onChange={(e) => handleUpdateLesson(section.id, lesson.id, "title", e.target.value)}
                            placeholder="Lesson title"
                            className="flex-1"
                          />
                          <Input
                            value={lesson.duration}
                            onChange={(e) => handleUpdateLesson(section.id, lesson.id, "duration", e.target.value)}
                            placeholder="Duration"
                            className="w-24"
                          />
                          <Input
                            value={lesson.type}
                            onChange={(e) => handleUpdateLesson(section.id, lesson.id, "type", e.target.value)}
                            placeholder="Type"
                            className="w-32"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingLesson(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {lesson.duration} • {lesson.type}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingLesson(lesson.id)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLesson(section.id, lesson.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {section.lessons.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No lessons yet. Click &quot;Add Lesson&quot; to get started.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {curriculumSections.length === 0 && (
            <Card className="p-12 text-center bg-gradient-card">
              <p className="text-muted-foreground mb-4">No curriculum sections yet.</p>
              <Button onClick={handleAddSection} className="gap-2 bg-gradient-primary">
                <Plus className="h-4 w-4" />
                Add First Section
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="flex justify-end pt-6">
        <Button onClick={handleSaveCourse} size="lg" className="gap-2 bg-gradient-primary">
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
