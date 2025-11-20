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
  UserPlus,
  Zap
} from "lucide-react";
import { allCoursesData } from "@/data/coursesData";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Activity {
  id: string;
  section_id: string;
  course_id: string;
  title: string;
  description: string | null;
  activity_type: 'assignment' | 'file_upload' | 'quiz' | 'book' | 'video' | 'discussion' | 'external_link';
  due_date: string | null;
  points: number;
  metadata: Record<string, any>;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = allCoursesData.find(c => c.id === courseId);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [addActivityOpen, setAddActivityOpen] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndEnroll();
    checkAdminStatus();
    fetchUsers();
    fetchSections();
    fetchActivities();
  }, [user, courseId]);

  const checkAdminAndEnroll = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    
    if (data && courseId) {
      // Auto-enroll admin in this course
      await supabase
        .from("enrollments")
        .upsert({
          user_id: user.id,
          course_id: courseId,
          role: "admin",
          enrolled_by: user.id
        }, { onConflict: "user_id,course_id" });
    }
  };

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

  const fetchSections = async () => {
    if (!courseId) return;
    const { data, error } = await supabase
      .from("course_sections")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index");

    if (error) {
      console.error("Error fetching sections:", error);
      return;
    }
    if (data) setSections(data);
  };

  const fetchActivities = async () => {
    if (!courseId) return;
    const { data, error } = await supabase
      .from("section_activities")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index");

    if (error) {
      console.error("Error fetching activities:", error);
      return;
    }
    if (data) setActivities(data);
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
    toast.success("Course updated successfully!");
  };

  const handleAddSection = async () => {
    if (!courseId) return;

    try {
      const newSection: Partial<CourseSection> = {
        course_id: courseId,
        title: "New Section",
        description: "Section description",
        duration: "1 week",
        order_index: sections.length
      };

      const { error } = await supabase
        .from("course_sections")
        .insert(newSection);

      if (error) throw error;
      await fetchSections();
      toast.success("New section added");
    } catch (error: any) {
      toast.error(error.message || "Failed to add section");
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from("course_sections")
        .delete()
        .eq("id", sectionId);

      if (error) throw error;
      await fetchSections();
      await fetchActivities();
      toast.success("Section deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete section");
    }
  };

  const handleUpdateSection = async (sectionId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from("course_sections")
        .update({ [field]: value })
        .eq("id", sectionId);

      if (error) throw error;
      await fetchSections();
      toast.success("Section updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update section");
    }
  };

  const handleAddActivity = async (sectionId: string, activityType: string) => {
    if (!courseId) return;

    try {
      const newActivity: Partial<Activity> = {
        section_id: sectionId,
        course_id: courseId,
        title: "New Activity",
        description: "Activity description",
        activity_type: activityType as Activity["activity_type"],
        points: 0,
        order_index: activities.filter(a => a.section_id === sectionId).length
      };

      const { error } = await supabase
        .from("section_activities")
        .insert(newActivity);

      if (error) throw error;
      await fetchActivities();
      setAddActivityOpen(null);
      toast.success("Activity added");
    } catch (error: any) {
      toast.error(error.message || "Failed to add activity");
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const { error } = await supabase
        .from("section_activities")
        .delete()
        .eq("id", activityId);

      if (error) throw error;
      await fetchActivities();
      toast.success("Activity deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete activity");
    }
  };

  const handleUpdateActivity = async (activityId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from("section_activities")
        .update({ [field]: value })
        .eq("id", activityId);

      if (error) throw error;
      await fetchActivities();
    } catch (error: any) {
      toast.error(error.message || "Failed to update activity");
    }
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

      {/* Course Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Course Sections</h2>
          {isAdmin && (
            <Button onClick={handleAddSection} className="gap-2 bg-gradient-primary">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
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
                          value={section.description || ""}
                          onChange={(e) => handleUpdateSection(section.id, "description", e.target.value)}
                          placeholder="Section description"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Input
                            value={section.duration || ""}
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
                          {isAdmin && (
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
                          )}
                        </div>
                        <p className="text-muted-foreground">{section.description}</p>
                        {section.duration && <Badge variant="secondary">{section.duration}</Badge>}
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Activities */}
                <div className="space-y-3 pl-12">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-muted-foreground">Activities</h4>
                    {isAdmin && (
                      <Dialog open={addActivityOpen === section.id} onOpenChange={(open) => setAddActivityOpen(open ? section.id : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Zap className="h-3 w-3" />
                            Add Activity
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Activity</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAddActivity(section.id, "assignment")}>
                              <Plus className="h-4 w-4" />
                              Assignment
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAddActivity(section.id, "quiz")}>
                              <Plus className="h-4 w-4" />
                              Quiz
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAddActivity(section.id, "file_upload")}>
                              <Plus className="h-4 w-4" />
                              File Upload
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAddActivity(section.id, "book")}>
                              <Plus className="h-4 w-4" />
                              Book / Reading
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAddActivity(section.id, "video")}>
                              <Plus className="h-4 w-4" />
                              Video
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAddActivity(section.id, "discussion")}>
                              <Plus className="h-4 w-4" />
                              Discussion
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAddActivity(section.id, "external_link")}>
                              <Plus className="h-4 w-4" />
                              External Link
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  {activities
                    .filter(a => a.section_id === section.id)
                    .map((activity, activityIndex) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <Badge variant="secondary" className="font-mono text-xs">
                          {activityIndex + 1}
                        </Badge>
                        <div className="flex-1">
                          <Input
                            value={activity.title}
                            onChange={(e) => handleUpdateActivity(activity.id, "title", e.target.value)}
                            placeholder="Activity title"
                            className="font-medium text-sm mb-2"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Select
                              value={activity.activity_type}
                              onValueChange={(value) => handleUpdateActivity(activity.id, "activity_type", value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="assignment">Assignment</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="file_upload">File Upload</SelectItem>
                                <SelectItem value="book">Book</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="discussion">Discussion</SelectItem>
                                <SelectItem value="external_link">External Link</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={activity.points}
                              onChange={(e) => handleUpdateActivity(activity.id, "points", parseInt(e.target.value))}
                              placeholder="Points"
                              className="h-8 text-xs"
                            />
                            <Input
                              type="date"
                              value={activity.due_date ? activity.due_date.split('T')[0] : ""}
                              onChange={(e) => handleUpdateActivity(activity.id, "due_date", e.target.value)}
                              placeholder="Due date"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}

                  {activities.filter(a => a.section_id === section.id).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No activities yet.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {sections.length === 0 && (
            <Card className="p-12 text-center bg-gradient-card">
              <p className="text-muted-foreground mb-4">No sections yet.</p>
              {isAdmin && (
                <Button onClick={handleAddSection} className="gap-2 bg-gradient-primary">
                  <Plus className="h-4 w-4" />
                  Add First Section
                </Button>
              )}
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
