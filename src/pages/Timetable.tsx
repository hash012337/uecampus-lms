import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Upload, Trash2, Edit, Clock } from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, isToday } from "date-fns";

interface TimetableEntry {
  id: string;
  course_code: string;
  course_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  instructor?: string;
  room?: string;
  color: string;
  notes?: string;
  date?: string;
}

const COLORS = ["#8AB661", "#E87DB5", "#FF9D6B", "#5EB6E0", "#9D7BD8", "#FF6B6B", "#4ECDC4", "#FFD93D"];

export default function Timetable() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    start_time: "09:00",
    end_time: "10:00",
    instructor: "",
    room: "",
    color: COLORS[0],
    notes: "",
  });

  useEffect(() => {
    if (user) {
      loadTimetable();
      checkAdminStatus();
      fetchUsers();
    }
  }, [user, currentDate]);

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

  const handlePdfUpload = async () => {
    if (!pdfFile || !selectedUser) {
      toast.error("Please select a user and upload a PDF");
      return;
    }
    toast.info("PDF parsing will be implemented with document parsing API");
    setUploadDialogOpen(false);
    setPdfFile(null);
    setSelectedUser("");
  };

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("timetable")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error loading timetable:", error);
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      const dayOfWeek = format(selectedDate, "EEEE");
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      if (editingEntry) {
        const { error } = await supabase
          .from("timetable")
          .update({ 
            ...formData, 
            user_id: user?.id,
            day_of_week: dayOfWeek,
            date: dateStr
          })
          .eq("id", editingEntry.id);

        if (error) throw error;
        toast.success("Event updated successfully");
      } else {
        const { error } = await supabase
          .from("timetable")
          .insert({ 
            ...formData, 
            user_id: user?.id,
            day_of_week: dayOfWeek,
            date: dateStr
          });

        if (error) throw error;
        toast.success("Event added successfully");
      }

      setDialogOpen(false);
      setEditingEntry(null);
      setSelectedDate(new Date());
      resetForm();
      loadTimetable();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("timetable")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Event deleted successfully");
      loadTimetable();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      course_code: entry.course_code,
      course_name: entry.course_name,
      start_time: entry.start_time,
      end_time: entry.end_time,
      instructor: entry.instructor || "",
      room: entry.room || "",
      color: entry.color,
      notes: entry.notes || "",
    });
    if (entry.date) {
      setSelectedDate(new Date(entry.date));
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      course_code: "",
      course_name: "",
      start_time: "09:00",
      end_time: "10:00",
      instructor: "",
      room: "",
      color: COLORS[0],
      notes: "",
    });
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEntriesForDate = (date: Date) => {
    return entries.filter((entry) => {
      if (entry.date) {
        return isSameDay(new Date(entry.date), date);
      }
      return entry.day_of_week === format(date, "EEEE");
    });
  };

  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            My Timetable
          </h1>
          <p className="text-muted-foreground mt-1">Manage your weekly schedule</p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-3">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload PDF
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Timetable PDF</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Select User</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.full_name || u.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Upload PDF</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button onClick={handlePdfUpload} className="w-full">
                    Parse & Add Timetable
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={() => {
              setSelectedDate(new Date());
              setDialogOpen(true);
            }} className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Timetable */}
        <Card className="lg:col-span-3 p-6 shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
                className="h-10 w-10 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold">
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
                className="h-10 w-10 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>

          {/* Timetable Grid */}
          <div className="relative overflow-x-auto">
            <div className="inline-flex min-w-full">
              {/* Time Column */}
              <div className="flex flex-col w-20 flex-shrink-0">
                <div className="h-16 border-b border-border"></div>
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-24 flex items-center justify-center border-b border-border/50 text-sm text-muted-foreground font-medium">
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {weekDays.map((day) => {
                const dayEntries = getEntriesForDate(day);
                const isCurrentDay = isToday(day);
                
                return (
                  <div key={day.toISOString()} className="flex-1 min-w-[150px]">
                    {/* Day Header */}
                    <div className={`h-16 flex flex-col items-center justify-center border-b border-l border-border ${
                      isCurrentDay ? "bg-primary/10" : ""
                    }`}>
                      <div className="text-sm font-medium text-muted-foreground">
                        {format(day, "EEE")}
                      </div>
                      <div className={`text-lg font-bold ${
                        isCurrentDay ? "text-primary" : ""
                      }`}>
                        {format(day, "d")}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="relative">
                      {timeSlots.map((hour) => (
                        <div
                          key={hour}
                          className={`h-24 border-b border-l border-border/50 ${
                            isCurrentDay ? "bg-primary/5" : ""
                          } hover:bg-muted/30 transition-colors cursor-pointer`}
                          onClick={() => {
                            if (isAdmin) {
                              setSelectedDate(day);
                              setFormData(prev => ({
                                ...prev,
                                start_time: `${hour.toString().padStart(2, '0')}:00`,
                                end_time: `${(hour + 1).toString().padStart(2, '0')}:00`,
                              }));
                              setDialogOpen(true);
                            }
                          }}
                        />
                      ))}

                      {/* Events */}
                      {dayEntries.map((entry) => {
                        const [startHour] = entry.start_time.split(':').map(Number);
                        const [endHour, endMin] = entry.end_time.split(':').map(Number);
                        const duration = (endHour - startHour) + (endMin / 60);
                        const top = (startHour - 8) * 96; // 96px = 24px * 4 (quarter hours)
                        const height = duration * 96;

                        return (
                          <div
                            key={entry.id}
                            className="absolute left-1 right-1 rounded-lg p-2 shadow-md cursor-pointer group hover:shadow-lg transition-all overflow-hidden"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              backgroundColor: entry.color,
                              minHeight: '60px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAdmin) handleEdit(entry);
                            }}
                          >
                            <div className="text-white text-xs font-semibold truncate">
                              {entry.course_name}
                            </div>
                            <div className="text-white/90 text-xs flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {entry.start_time} - {entry.end_time}
                            </div>
                            {entry.room && (
                              <div className="text-white/80 text-xs mt-1 truncate">
                                📍 {entry.room}
                              </div>
                            )}
                            {isAdmin && (
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 bg-white/20 hover:bg-white/30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(entry);
                                  }}
                                >
                                  <Edit className="h-3 w-3 text-white" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 bg-white/20 hover:bg-red-500/50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(entry.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 text-white" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Mini Calendar */}
          <Card className="p-4 shadow-lg border-0">
            <h3 className="font-semibold mb-3 text-lg">Calendar</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
            />
          </Card>

          {/* Upcoming Events */}
          <Card className="p-4 shadow-lg border-0">
            <h3 className="font-semibold mb-3 text-lg">Upcoming Events</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {entries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-lg border border-border hover:shadow-md transition-all cursor-pointer"
                  style={{ borderLeftWidth: '4px', borderLeftColor: entry.color }}
                  onClick={() => isAdmin && handleEdit(entry)}
                >
                  <div className="font-medium text-sm">{entry.course_name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {entry.day_of_week}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {entry.start_time} - {entry.end_time}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingEntry(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Edit Event" : "Add New Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course_code">Course Code</Label>
                <Input
                  id="course_code"
                  value={formData.course_code}
                  onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course_name">Course Name</Label>
                <Input
                  id="course_name"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  placeholder="e.g., Introduction to CS"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                      formData.color === color ? "border-foreground scale-110 ring-2 ring-offset-2" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              {editingEntry ? "Update Event" : "Add Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
