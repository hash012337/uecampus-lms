import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Clock, Video, Calendar, PlayCircle, CheckCircle2, AlertCircle, Plus, Trash2, Copy, Edit2 } from "lucide-react";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { useState } from "react";
import { toast } from "sonner";
import { useEditMode } from "@/contexts/EditModeContext";

interface WeeklyActivity {
  day: string;
  hours: number;
}

interface ProgressStats {
  totalActivity: number;
  inProgress: number;
  completed: number;
  upcoming: number;
}

interface Course {
  id: number;
  title: string;
  code: string;
  progress: number;
  instructor: string;
  nextClass: string;
  timeSlot: string;
  status: string;
  grade: string;
  participants: { name: string; avatar: string }[];
}

interface SupportOption {
  type: string;
  description: string;
  available: string;
  color: string;
}

export default function Dashboard() {
  const { isEditMode } = useEditMode();
  
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.2 },
    { day: "Wed", hours: 4.5 },
    { day: "Thu", hours: 5.8 },
    { day: "Fri", hours: 3.1 },
    { day: "Sat", hours: 2.0 },
    { day: "Sun", hours: 3.4 },
  ]);

  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalActivity: 64,
    inProgress: 8,
    completed: 12,
    upcoming: 14,
  });

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Data Structures & Algorithms",
      code: "CS201",
      progress: 75,
      instructor: "Dr. Sarah Johnson",
      nextClass: "Tomorrow, 10:00 AM",
      timeSlot: "10:00 - 12:00",
      status: "active",
      grade: "A",
      participants: [],
    },
    {
      id: 2,
      title: "Web Development",
      code: "CS301",
      progress: 60,
      instructor: "Prof. Michael Chen",
      nextClass: "Today, 2:00 PM",
      timeSlot: "14:00 - 16:00",
      status: "active",
      grade: "A-",
      participants: [],
    },
  ]);

  const [supportOptions, setSupportOptions] = useState<SupportOption[]>([
    { 
      type: "Zoom Meeting", 
      description: "Video conference", 
      available: "Schedule anytime",
      color: "primary"
    },
    { 
      type: "Google Meet", 
      description: "Quick video call", 
      available: "Available now",
      color: "success"
    },
  ]);

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  const updateWeeklyActivity = (index: number, hours: number) => {
    const updated = [...weeklyActivity];
    updated[index].hours = hours;
    setWeeklyActivity(updated);
    console.log("Weekly activity updated - Save to DB:", updated);
  };

  const updateProgressStats = (field: keyof ProgressStats, value: number) => {
    const updated = { ...progressStats, [field]: value };
    setProgressStats(updated);
    console.log("Progress stats updated - Save to DB:", updated);
  };

  const updateCourse = (courseId: number, field: keyof Course, value: any) => {
    const updated = courses.map(c => c.id === courseId ? { ...c, [field]: value } : c);
    setCourses(updated);
    console.log(`Course ${courseId} updated - Save to DB:`, { field, value });
  };

  const deleteCourse = (courseId: number) => {
    setCourses(courses.filter(c => c.id !== courseId));
    toast.success("Course removed");
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now(),
      title: "New Course",
      code: "NEW01",
      progress: 0,
      instructor: "Instructor Name",
      nextClass: "TBD",
      timeSlot: "00:00 - 00:00",
      status: "active",
      grade: "N/A",
      participants: []
    };
    setCourses([...courses, newCourse]);
    toast.success("Course added");
  };

  const duplicateCourse = (course: Course) => {
    const duplicated: Course = {
      ...course,
      id: Date.now(),
      title: `${course.title} (Copy)`,
      code: `${course.code}-COPY`
    };
    setCourses([...courses, duplicated]);
    toast.success("Course duplicated");
  };

  const updateSupportOption = (index: number, field: keyof SupportOption, value: string) => {
    const updated = [...supportOptions];
    updated[index] = { ...updated[index], [field]: value };
    setSupportOptions(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeDialog />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {isEditMode && (
          <Badge variant="outline" className="animate-pulse">
            <Edit2 className="h-3 w-3 mr-1" />
            Edit Mode Active
          </Badge>
        )}
      </div>

      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-muted-foreground">Activity</h3>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{weeklyActivity.reduce((sum, d) => sum + d.hours, 0).toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <div className="flex items-end gap-1 mt-4 h-12">
              {weeklyActivity.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  {isEditMode ? (
                    <Input
                      type="number"
                      step="0.1"
                      value={day.hours}
                      onChange={(e) => updateWeeklyActivity(i, parseFloat(e.target.value))}
                      className="w-full h-8 text-xs text-center p-1"
                    />
                  ) : (
                    <div
                      className="w-full bg-primary/20 rounded-t relative group/bar hover:bg-primary/40 transition-all duration-200"
                      style={{ height: `${(day.hours / maxHours) * 100}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-xs bg-card px-2 py-1 rounded whitespace-nowrap">
                        {day.hours}h
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              {weeklyActivity.map((day, i) => (
                <span key={i}>{day.day.charAt(0)}</span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-sm text-muted-foreground mb-4">Progress statistics</h3>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  {isEditMode ? (
                    <Input
                      type="number"
                      value={progressStats.totalActivity}
                      onChange={(e) => updateProgressStats("totalActivity", parseInt(e.target.value))}
                      className="w-24 h-12 text-4xl font-bold"
                    />
                  ) : (
                    <span className="text-5xl font-bold">{progressStats.totalActivity}%</span>
                  )}
                  <span className="text-sm text-muted-foreground">Total activity</span>
                </div>
                <Progress value={progressStats.totalActivity} className="h-2 w-full max-w-md" />
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2 border-2 border-primary">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  {isEditMode ? (
                    <Input
                      type="number"
                      value={progressStats.inProgress}
                      onChange={(e) => updateProgressStats("inProgress", parseInt(e.target.value))}
                      className="w-16 text-center mb-1"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{progressStats.inProgress}</p>
                  )}
                  <p className="text-xs text-muted-foreground">In progress</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-2 border-2 border-success">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  {isEditMode ? (
                    <Input
                      type="number"
                      value={progressStats.completed}
                      onChange={(e) => updateProgressStats("completed", parseInt(e.target.value))}
                      className="w-16 text-center mb-1"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{progressStats.completed}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-2 border-2 border-warning">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  {isEditMode ? (
                    <Input
                      type="number"
                      value={progressStats.upcoming}
                      onChange={(e) => updateProgressStats("upcoming", parseInt(e.target.value))}
                      className="w-16 text-center mb-1"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{progressStats.upcoming}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-accent/30 hover:shadow-glow-accent transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-muted-foreground">Total Courses</h3>
              <BookOpen className="h-4 w-4 text-accent" />
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">Currently enrolled</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Enrolled Courses</h2>
          {isEditMode && (
            <Button onClick={addCourse} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="p-6 hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 group relative">
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => duplicateCourse(course)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteCourse(course.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  {isEditMode ? (
                    <>
                      <Input
                        value={course.code}
                        onChange={(e) => updateCourse(course.id, "code", e.target.value)}
                        className="font-mono text-sm"
                        placeholder="Course Code"
                      />
                      <Input
                        value={course.title}
                        onChange={(e) => updateCourse(course.id, "title", e.target.value)}
                        className="text-lg font-semibold"
                        placeholder="Course Title"
                      />
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="font-mono">{course.code}</Badge>
                      <h3 className="text-lg font-semibold leading-tight">{course.title}</h3>
                    </>
                  )}
                </div>
                
                <div className="space-y-3">
                  {isEditMode ? (
                    <>
                      <div className="space-y-1">
                        <Label className="text-xs">Instructor</Label>
                        <Input
                          value={course.instructor}
                          onChange={(e) => updateCourse(course.id, "instructor", e.target.value)}
                          placeholder="Instructor Name"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Next Class</Label>
                        <Input
                          value={course.nextClass}
                          onChange={(e) => updateCourse(course.id, "nextClass", e.target.value)}
                          placeholder="Next Class Time"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Progress</Label>
                        <Input
                          type="number"
                          value={course.progress}
                          onChange={(e) => updateCourse(course.id, "progress", parseInt(e.target.value))}
                          placeholder="Progress %"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Grade</Label>
                        <Input
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                          placeholder="Grade"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{course.nextClass}</span>
                        </div>
                        <Badge variant="outline">{course.grade}</Badge>
                      </div>
                    </>
                  )}
                </div>

                {!isEditMode && (
                  <Button className="w-full bg-gradient-primary group-hover:shadow-glow transition-all">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Book a Support Meeting</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {supportOptions.map((option, index) => (
            <Card key={index} className="p-6 hover:shadow-glow transition-all duration-300 bg-gradient-card cursor-pointer group">
              {isEditMode ? (
                <div className="space-y-3">
                  <Input
                    value={option.type}
                    onChange={(e) => updateSupportOption(index, "type", e.target.value)}
                    placeholder="Meeting Type"
                  />
                  <Input
                    value={option.description}
                    onChange={(e) => updateSupportOption(index, "description", e.target.value)}
                    placeholder="Description"
                  />
                  <Input
                    value={option.available}
                    onChange={(e) => updateSupportOption(index, "available", e.target.value)}
                    placeholder="Availability"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{option.type}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-xs text-success">{option.available}</span>
                    <Button size="sm" variant="ghost" className="gap-1">
                      Schedule
                      <PlayCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

