import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

interface TimetableEntry {
  id: string;
  course_name: string;
  course_code: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  color: string;
  user_id?: string;
  type?: 'class' | 'assignment' | 'quiz';
  due_date?: string;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Timetable() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEntry, setNewEntry] = useState({
    course_id: "",
    end_time: "10:00",
    color: "#8B5CF6"
  });

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      loadTimetable();
      loadUsers();
      loadCourses();
    }
  }, [user]);

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

  const loadUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) setUsers(data);
  };

  const loadCourses = async () => {
    const { data } = await supabase.from("courses").select("id, title, code");
    if (data) setCourses(data);
  };

  const loadTimetable = async () => {
    if (!user) return;

    // Load regular timetable entries
    const query = supabase
      .from("timetable")
      .select("*")
      .order("start_time");

    if (!isAdmin) {
      query.eq("user_id", user.id);
    }

    const { data: timetableData, error } = await query;

    if (error) {
      console.error("Error loading timetable:", error);
      return;
    }

    const timetableEntries: TimetableEntry[] = (timetableData || []).map(entry => ({
      ...entry,
      type: 'class' as const
    }));

    // Load assignments with deadlines
    let assignmentEntries: TimetableEntry[] = [];
    if (isAdmin) {
      // Admin sees all assignments
      const { data: assignments } = await supabase
        .from("assignments")
        .select("id, course, course_code, due_date")
        .not("due_date", "is", null);
      
      if (assignments) {
        assignmentEntries = assignments.map(a => ({
          id: `assignment-${a.id}`,
          course_name: a.course,
          course_code: a.course_code,
          day_of_week: format(new Date(a.due_date!), 'EEEE'),
          start_time: 'Due',
          end_time: '',
          color: '#ef4444',
          type: 'assignment' as const,
          due_date: a.due_date!
        }));
      }
    } else {
      // Students see their assignments with custom deadlines
      const { data: assignments } = await supabase
        .from("assignments")
        .select("id, course, course_code, due_date")
        .not("due_date", "is", null);
      
      const { data: customDeadlines } = await supabase
        .from("assignment_deadlines")
        .select("*")
        .eq("user_id", user.id);
      
      if (assignments) {
        assignmentEntries = assignments.map(a => {
          const customDeadline = customDeadlines?.find(cd => cd.assignment_id === a.id);
          const deadline = customDeadline ? customDeadline.deadline : a.due_date;
          
          return {
            id: `assignment-${a.id}`,
            course_name: a.course,
            course_code: a.course_code,
            day_of_week: format(new Date(deadline!), 'EEEE'),
            start_time: 'Due',
            end_time: '',
            color: '#ef4444',
            type: 'assignment' as const,
            due_date: deadline!
          };
        });
      }
    }

    // Load quizzes with deadlines
    const { data: quizzes } = await supabase
      .from("section_quizzes")
      .select(`
        id,
        title,
        due_date,
        course_id,
        courses (title, code)
      `)
      .not("due_date", "is", null);
    
    const quizEntries: TimetableEntry[] = (quizzes || []).map(q => {
      const courseData = q.courses as any;
      return {
        id: `quiz-${q.id}`,
        course_name: courseData?.title || q.title,
        course_code: courseData?.code || '',
        day_of_week: format(new Date(q.due_date!), 'EEEE'),
        start_time: 'Due',
        end_time: '',
        color: '#8b5cf6',
        type: 'quiz' as const,
        due_date: q.due_date!
      };
    });

    setEntries([...timetableEntries, ...assignmentEntries, ...quizEntries]);
  };

  const handleAddEntry = async () => {
    if (!user || !newEntry.course_id || !selectedDate) {
      toast.error("Please fill in all required fields and select a date");
      return;
    }

    if (!isAdmin || !selectedUser) {
      toast.error("Please select a student");
      return;
    }

    const selectedCourse = courses.find(c => c.id === newEntry.course_id);
    if (!selectedCourse) return;

    const dayOfWeek = format(selectedDate, 'EEEE');
    const startTime = format(selectedDate, 'HH:mm');

    try {
      const { error } = await supabase.from("timetable").insert({
        course_name: selectedCourse.title,
        course_code: selectedCourse.code,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: newEntry.end_time,
        color: newEntry.color,
        user_id: selectedUser
      });

      if (error) throw error;

      toast.success("Entry added successfully");
      setDialogOpen(false);
      setNewEntry({
        course_id: "",
        end_time: "10:00",
        color: "#8B5CF6"
      });
      setSelectedUser("");
      setSelectedDate(new Date());
      loadTimetable();
    } catch (error: any) {
      toast.error(error.message || "Failed to add entry");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase.from("timetable").delete().eq("id", id);
      if (error) throw error;
      toast.success("Entry deleted");
      loadTimetable();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete entry");
    }
  };

  const getEntriesForDay = (day: string) => {
    return entries.filter(e => e.day_of_week === day);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Timetable
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your weekly schedule
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Timetable Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
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

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={newEntry.course_id} onValueChange={(value) => setNewEntry({ ...newEntry, course_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Date & Time</Label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  {selectedDate && (
                    <p className="text-sm text-muted-foreground text-center">
                      Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy HH:mm')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newEntry.end_time}
                    onChange={(e) => setNewEntry({ ...newEntry, end_time: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={newEntry.color}
                    onChange={(e) => setNewEntry({ ...newEntry, color: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddEntry} className="w-full">
                  Add Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {daysOfWeek.map(day => (
              <div key={day} className="space-y-2">
                <div className="font-semibold text-center p-2 bg-primary/10 rounded-lg">
                  {day}
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {getEntriesForDay(day).map(entry => (
                    <Card
                      key={entry.id}
                      className="p-3 border-l-4 hover:shadow-lg transition-shadow"
                      style={{ borderLeftColor: entry.color }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          {entry.type === 'assignment' && (
                            <Badge variant="destructive" className="text-xs mb-1">
                              Assignment Due
                            </Badge>
                          )}
                          {entry.type === 'quiz' && (
                            <Badge variant="secondary" className="text-xs mb-1 bg-purple-600 text-white">
                              Quiz Due
                            </Badge>
                          )}
                          <p className="font-semibold text-sm truncate">
                            {entry.course_code}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {entry.course_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {entry.type === 'class' 
                              ? `${entry.start_time} - ${entry.end_time}`
                              : entry.due_date ? new Date(entry.due_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Due'
                            }
                          </p>
                        </div>
                        {isAdmin && entry.type === 'class' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                  {getEntriesForDay(day).length === 0 && (
                    <div className="text-center text-muted-foreground text-sm p-4">
                      No classes
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
