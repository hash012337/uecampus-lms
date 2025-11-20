import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  UserPlus,
  Plus,
  Trash2,
  FileUp,
  FileText,
  HelpCircle,
  BookOpen
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
  title: string;
  activities: {
    id: string;
    type: 'assignment' | 'file' | 'quiz' | 'book';
    title: string;
  }[];
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
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState("");
  const [newActivity, setNewActivity] = useState({ type: 'assignment' as const, title: '' });

  useEffect(() => {
    checkAdminAndEnroll();
    checkAdminStatus();
    fetchUsers();
  }, [user]);

  const checkAdminAndEnroll = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    
    if (data && courseId) {
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
      .maybeSingle();
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

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      toast.error("Please enter a section title");
      return;
    }
    const newSection: CourseSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      activities: []
    };
    setSections([...sections, newSection]);
    setNewSectionTitle("");
    setAddSectionDialogOpen(false);
    toast.success("Section added");
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
    toast.success("Section deleted");
  };

  const handleAddActivity = () => {
    if (!newActivity.title.trim()) {
      toast.error("Please enter an activity title");
      return;
    }
    setSections(sections.map(section => {
      if (section.id === currentSectionId) {
        return {
          ...section,
          activities: [...section.activities, { ...newActivity, id: Date.now().toString() }]
        };
      }
      return section;
    }));
    setNewActivity({ type: 'assignment', title: '' });
    setActivityDialogOpen(false);
    toast.success("Activity added");
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'assignment': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'file': return <FileUp className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Course not found</p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/courses">
        <Button variant="ghost" className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      <div className="relative h-64 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-glow/90" />
        <div className="relative h-full flex items-center justify-between px-8">
          <div className="flex-1">
            <Badge className="mb-2">{course.category}</Badge>
            <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-white/80">{course.code}</p>
          </div>
          {isAdmin && (
            <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Enroll User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enroll User in Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select User</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
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
                  <Button onClick={handleEnrollUser} className="w-full">Enroll</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Sections</CardTitle>
          {isAdmin && (
            <Dialog open={addSectionDialogOpen} onOpenChange={setAddSectionDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Section</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Enter section title"
                    />
                  </div>
                  <Button onClick={handleAddSection} className="w-full">Add Section</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {isAdmin ? "No sections yet. Add your first section to get started." : "No sections available."}
            </p>
          ) : (
            sections.map((section) => (
              <Card key={section.id} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setCurrentSectionId(section.id);
                            setActivityDialogOpen(true);
                          }}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Activity
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {section.activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No activities yet</p>
                  ) : (
                    <div className="space-y-2">
                      {section.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                        >
                          {getActivityIcon(activity.type)}
                          <span className="flex-1">{activity.title}</span>
                          <Badge variant="outline" className="capitalize">
                            {activity.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Activity Type</Label>
              <Select
                value={newActivity.type}
                onValueChange={(value: any) => setNewActivity({ ...newActivity, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Activity Title</Label>
              <Input
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Enter activity title"
              />
            </div>
            <Button onClick={handleAddActivity} className="w-full">Add Activity</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
