import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Clock, Upload, FileText } from "lucide-react";

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
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 8; // Start from 8 AM
  return `${hour.toString().padStart(2, "0")}:00`;
});

export default function Timetable() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "10:00",
    instructor: "",
    room: "",
    color: "#8B5CF6",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      loadTimetable();
      checkAdminStatus();
      fetchUsers();
    }
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

  const handlePdfUpload = async () => {
    if (!pdfFile || !selectedUser) {
      toast.error("Please select a user and upload a PDF");
      return;
    }

    toast.info("PDF parsing will be implemented with document parsing API");
    // TODO: Implement PDF parsing to extract timetable data
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
        .order("day_of_week")
        .order("start_time");

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
    try {
      if (editingEntry) {
        const { error } = await supabase
          .from("timetable")
          .update({ ...formData, user_id: user?.id })
          .eq("id", editingEntry.id);

        if (error) throw error;
        toast.success("Entry updated successfully");
      } else {
        const { error } = await supabase
          .from("timetable")
          .insert({ ...formData, user_id: user?.id });

        if (error) throw error;
        toast.success("Entry added successfully");
      }

      setDialogOpen(false);
      setEditingEntry(null);
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
      day_of_week: entry.day_of_week,
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
      day_of_week: "Monday",
      start_time: "09:00",
      end_time: "10:00",
      instructor: "",
      room: "",
      color: "#8B5CF6",
      notes: "",
    });
  };

  const getEntriesForDay = (day: string) => {
    return entries.filter((entry) => entry.day_of_week === day);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Weekly Timetable
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your weekly class schedule
          </p>
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
                  <Button onClick={handlePdfUpload} className="w-full bg-gradient-primary">
                    <FileText className="h-4 w-4 mr-2" />
                    Parse & Add Timetable
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingEntry(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? "Edit Class" : "Add New Class"}
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day_of_week">Day</Label>
                  <Select value={formData.day_of_week} onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingEntry ? "Update Class" : "Add Class"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Weekly Calendar View */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <Card key={day} className="p-4 border-border/50">
            <h3 className="font-semibold text-center mb-4 text-sm uppercase tracking-wide text-primary">
              {day}
            </h3>
            <div className="space-y-2">
              {getEntriesForDay(day).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-lg text-white text-sm relative group hover:shadow-lg transition-all"
                  style={{ backgroundColor: entry.color }}
                >
                  <div className="font-semibold">{entry.course_code}</div>
                  <div className="text-xs opacity-90 truncate">{entry.course_name}</div>
                  <div className="flex items-center gap-1 text-xs opacity-90 mt-1">
                    <Clock className="h-3 w-3" />
                    {entry.start_time} - {entry.end_time}
                  </div>
                  {entry.room && (
                    <div className="text-xs opacity-90">📍 {entry.room}</div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 bg-white/20 hover:bg-white/30"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 bg-white/20 hover:bg-white/30"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {getEntriesForDay(day).length === 0 && (
                <div className="text-center text-muted-foreground text-xs py-8">
                  No classes
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
