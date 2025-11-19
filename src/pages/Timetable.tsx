import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Upload, Trash2, Plus, Bell, Filter } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

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

const COLORS = ["#8AB661", "#E87DB5", "#FF9D6B", "#5EB6E0", "#9D7BD8", "#FF6B6B", "#4ECDC4"];

export default function Timetable() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
        toast.success("Entry updated successfully");
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
        toast.success("Entry added successfully");
      }

      setDialogOpen(false);
      setEditingEntry(null);
      setSelectedDate(null);
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
      toast.success("Entry deleted successfully");
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

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getEntriesForDate = (date: Date) => {
    return entries.filter((entry) => {
      if (entry.date) {
        return isSameDay(new Date(entry.date), date);
      }
      return entry.day_of_week === format(date, "EEEE");
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth();
  const firstDayOfMonth = startOfMonth(currentDate);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  return (
    <div className="flex gap-4 h-full">
      {/* Main Calendar Area */}
      <div className="flex-1 space-y-4">
        {/* Header with controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {format(currentDate, "MMMM yyyy")}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                className={`px-4 py-2 text-sm ${viewMode === "day" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("day")}
              >
                Day
              </button>
              <button
                className={`px-4 py-2 text-sm border-x border-border ${viewMode === "week" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("week")}
              >
                Week
              </button>
              <button
                className={`px-4 py-2 text-sm ${viewMode === "month" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("month")}
              >
                Month
              </button>
            </div>

            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>

            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="p-6 bg-white dark:bg-card">
          <div className="grid grid-cols-7 gap-0 border-l border-t border-border">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm py-3 border-r border-b border-border bg-muted/30">
                {day}
              </div>
            ))}
            
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] border-r border-b border-border bg-muted/10" />
            ))}
            
            {daysInMonth.map((date) => {
              const dateEntries = getEntriesForDate(date);
              const isToday = isSameDay(date, new Date());
              
              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[120px] border-r border-b border-border p-2 cursor-pointer transition-colors bg-white dark:bg-background ${
                    !isSameMonth(date, currentDate) ? "opacity-50 bg-muted/10" : ""
                  } ${isToday ? "bg-green-50 dark:bg-green-950/20" : "hover:bg-muted/20"}`}
                  onClick={() => isAdmin && handleDateClick(date)}
                >
                  <div className={`font-semibold text-sm mb-1 ${isToday ? "w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center" : "text-foreground"}`}>
                    {format(date, "d")}
                  </div>
                  <div className="space-y-1">
                    {dateEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="text-xs px-2 py-1 rounded group relative text-white font-medium"
                        style={{ backgroundColor: entry.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAdmin) handleEdit(entry);
                        }}
                      >
                        <div className="truncate">{entry.course_name}</div>
                        {isAdmin && (
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5 bg-white/20 hover:bg-white/30"
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
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-4">
        {/* Mini Calendar */}
        <Card className="p-4 bg-white dark:bg-card">
          <h3 className="font-semibold mb-3 text-center">{format(currentDate, "MMMM")}</h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-muted-foreground">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`mini-empty-${i}`} className="w-8 h-8" />
            ))}
            {daysInMonth.map((date) => {
              const isToday = isSameDay(date, new Date());
              return (
                <button
                  key={date.toISOString()}
                  className={`w-8 h-8 rounded-full text-sm ${
                    isToday ? "bg-green-600 text-white font-semibold" : "hover:bg-muted"
                  } ${!isSameMonth(date, currentDate) ? "text-muted-foreground" : ""}`}
                  onClick={() => setCurrentDate(date)}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Add Event Button */}
        {isAdmin && (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              setSelectedDate(new Date());
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add new event
          </Button>
        )}

        {/* Upload PDF Button */}
        {isAdmin && (
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-primary/20">
                <Upload className="h-4 w-4 mr-2" />
                Upload Timetable PDF
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
        )}

        {/* Assignments Section */}
        <Card className="p-4 bg-white dark:bg-card">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Assignments</h3>
            <Button size="sm" variant="ghost">+ Add</Button>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                <div className="w-10 h-10 rounded flex items-center justify-center bg-green-100 dark:bg-green-900/20 text-sm font-semibold">
                  CS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Assignment Name</p>
                  <p className="text-xs text-muted-foreground">9:00 AM</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingEntry(null);
          setSelectedDate(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Edit Event" : `Add Event - ${selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}`}
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
                  placeholder="e.g., Math class"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course_name">Event Name</Label>
                <Input
                  id="course_name"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  placeholder="e.g., Chemistry club"
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

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 ${
                      formData.color === color ? "border-foreground scale-110" : "border-transparent"
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
