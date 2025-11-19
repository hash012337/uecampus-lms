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
import { ChevronLeft, ChevronRight, Upload, Trash2 } from "lucide-react";
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

const COLORS = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#14B8A6"];

export default function Timetable() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
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
      .single();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {format(currentDate, "MMMM yyyy")}
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-primary/20">
                  <Upload className="h-4 w-4 mr-2" />
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
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-6">
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-sm py-2 text-muted-foreground">
              {day}
            </div>
          ))}
          
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] border border-border/30" />
          ))}
          
          {daysInMonth.map((date) => {
            const dateEntries = getEntriesForDate(date);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div
                key={date.toISOString()}
                className={`min-h-[120px] border border-border/30 p-2 hover:bg-muted/50 cursor-pointer transition-colors ${
                  !isSameMonth(date, currentDate) ? "opacity-50" : ""
                } ${isToday ? "bg-primary/5 border-primary" : ""}`}
                onClick={() => isAdmin && handleDateClick(date)}
              >
                <div className="font-semibold text-sm mb-1">
                  {format(date, "d")}
                </div>
                <div className="space-y-1">
                  {dateEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="text-xs p-1 rounded group relative"
                      style={{ backgroundColor: entry.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAdmin) handleEdit(entry);
                      }}
                    >
                      <div className="text-white font-medium truncate">
                        {entry.course_code}
                      </div>
                      <div className="text-white/90 text-[10px] truncate">
                        {entry.start_time}
                      </div>
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
              {editingEntry ? "Edit Class" : `Add Class - ${selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}`}
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
                  placeholder="e.g., Introduction to Programming"
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
                  placeholder="Instructor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Room number or location"
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
                      formData.color === color ? "border-foreground" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              {editingEntry ? "Update Class" : "Add Class"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
