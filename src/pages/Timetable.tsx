import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Upload, Clock, MapPin, User as UserIcon, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface TimetableEntry {
  id: string;
  course_name: string;
  course_code: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room?: string;
  instructor?: string;
  color: string;
  user_id?: string;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function Timetable() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState({
    course_name: "",
    course_code: "",
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "10:00",
    room: "",
    instructor: "",
    color: "#8B5CF6"
  });

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      loadTimetable();
      loadUsers();
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

  const loadTimetable = async () => {
    if (!user) return;

    const query = supabase
      .from("timetable")
      .select("*")
      .order("start_time");

    if (!isAdmin) {
      query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading timetable:", error);
      return;
    }

    if (data) setEntries(data);
  };

  const handleAddEntry = async () => {
    if (!user || !newEntry.course_name || !newEntry.course_code) {
      toast.error("Please fill in all required fields");
      return;
    }

    const targetUserId = isAdmin && selectedUser ? selectedUser : user.id;

    try {
      const { error } = await supabase.from("timetable").insert({
        ...newEntry,
        user_id: targetUserId
      });

      if (error) throw error;

      toast.success("Entry added successfully");
      setDialogOpen(false);
      setNewEntry({
        course_name: "",
        course_code: "",
        day_of_week: "Monday",
        start_time: "09:00",
        end_time: "10:00",
        room: "",
        instructor: "",
        color: "#8B5CF6"
      });
      setSelectedUser("");
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

  const getEntriesForDayAndTime = (day: string, time: string) => {
    return entries.filter(
      (entry) =>
        entry.day_of_week === day &&
        entry.start_time <= time &&
        entry.end_time > time
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            My Timetable
          </h1>
          <p className="text-muted-foreground mt-1">Your weekly class schedule</p>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Timetable Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select User</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.full_name || u.email} {u.user_id ? `(${u.user_id})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Course Name *</Label>
                    <Input
                      value={newEntry.course_name}
                      onChange={(e) => setNewEntry({ ...newEntry, course_name: e.target.value })}
                      placeholder="e.g., Mathematics"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Course Code *</Label>
                    <Input
                      value={newEntry.course_code}
                      onChange={(e) => setNewEntry({ ...newEntry, course_code: e.target.value })}
                      placeholder="e.g., MATH101"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Select value={newEntry.day_of_week} onValueChange={(val) => setNewEntry({ ...newEntry, day_of_week: val })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Input
                        type="color"
                        value={newEntry.color}
                        onChange={(e) => setNewEntry({ ...newEntry, color: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={newEntry.start_time}
                        onChange={(e) => setNewEntry({ ...newEntry, start_time: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={newEntry.end_time}
                        onChange={(e) => setNewEntry({ ...newEntry, end_time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Room</Label>
                    <Input
                      value={newEntry.room}
                      onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
                      placeholder="e.g., Room 101"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instructor</Label>
                    <Input
                      value={newEntry.instructor}
                      onChange={(e) => setNewEntry({ ...newEntry, instructor: e.target.value })}
                      placeholder="e.g., Dr. Smith"
                    />
                  </div>

                  <Button onClick={handleAddEntry} className="w-full">
                    Add Entry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select User</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.full_name || u.email} {u.user_id ? `(${u.user_id})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Upload PDF</Label>
                    <Input type="file" accept=".pdf" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PDF parsing functionality will be implemented soon
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Card className="border-primary/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 bg-muted/30 font-semibold border-r">Time</div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 font-semibold text-center border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b last:border-b-0">
                  <div className="p-4 bg-muted/20 font-medium border-r flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {time}
                  </div>
                  {daysOfWeek.map((day) => {
                    const dayEntries = getEntriesForDayAndTime(day, time);
                    return (
                      <div key={`${day}-${time}`} className="p-2 border-r last:border-r-0 min-h-[80px] hover:bg-muted/30 transition-colors">
                        {dayEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="rounded-lg p-2 mb-1 shadow-md hover:shadow-lg transition-all group relative"
                            style={{ 
                              backgroundColor: `${entry.color}20`,
                              borderLeft: `4px solid ${entry.color}`
                            }}
                          >
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{entry.course_name}</p>
                              <p className="text-xs text-muted-foreground">{entry.course_code}</p>
                              {entry.room && (
                                <div className="flex items-center gap-1 text-xs">
                                  <MapPin className="h-3 w-3" />
                                  {entry.room}
                                </div>
                              )}
                              {entry.instructor && (
                                <div className="flex items-center gap-1 text-xs">
                                  <UserIcon className="h-3 w-3" />
                                  {entry.instructor}
                                </div>
                              )}
                              <p className="text-xs font-medium" style={{ color: entry.color }}>
                                {entry.start_time} - {entry.end_time}
                              </p>
                            </div>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteEntry(entry.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
