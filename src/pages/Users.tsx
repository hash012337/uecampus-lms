import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Users as UsersIcon, UserPlus, Lock, Ban, LogIn, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";

const userSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().trim().min(1, "Name is required"),
  role: z.enum(["admin", "teacher", "non_editing_teacher", "student"]),
});

interface User {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
  is_blocked: boolean;
  user_id: string | null;
}

interface Cohort {
  id: string;
  name: string;
  description: string;
  member_count: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    user_id: "",
    email: "",
    password: "",
    full_name: "",
    role: "student",
    course_id: "",
  });
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    email: "",
    role: "student",
  });

  useEffect(() => {
    loadUsers();
    loadCohorts();
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await supabase.from("courses").select("id, title, code");
    if (data) setCourses(data);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles = profiles?.map((profile) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || "",
        roles: roles?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [],
        is_blocked: profile.is_blocked || false,
        user_id: profile.user_id,
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadCohorts = async () => {
    try {
      const { data, error } = await supabase
        .from("cohorts")
        .select(`
          *,
          cohort_members (count)
        `);

      if (error) throw error;

      const cohortsWithCount = data?.map((cohort: any) => ({
        id: cohort.id,
        name: cohort.name,
        description: cohort.description,
        member_count: cohort.cohort_members?.[0]?.count || 0,
      })) || [];

      setCohorts(cohortsWithCount);
    } catch (error) {
      console.error("Error loading cohorts:", error);
      toast.error("Failed to load cohorts");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_id) {
      toast.error("User ID is required");
      return;
    }
    
    try {
      const validated = userSchema.parse(formData);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            full_name: validated.full_name,
            user_id: formData.user_id,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: authData.user.id,
            role: validated.role,
          });

        if (roleError) throw roleError;

        if (formData.course_id) {
          const { error: enrollError } = await supabase
            .from("enrollments")
            .insert({
              user_id: authData.user.id,
              course_id: formData.course_id,
              role: "student",
              enrolled_by: authData.user.id
            });

          if (enrollError) throw enrollError;
        }
      }

      toast.success("User created successfully");
      setDialogOpen(false);
      setFormData({ user_id: "", email: "", password: "", full_name: "", role: "student", course_id: "" });
      loadUsers();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to create user");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast.success("User deleted successfully");
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleToggleBlock = async (user: User) => {
    const newBlockedState = !user.is_blocked;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_blocked: newBlockedState })
        .eq("id", user.id);

      if (error) throw error;

      toast.success(`User ${newBlockedState ? "blocked" : "unblocked"} successfully`);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${newBlockedState ? "block" : "unblock"} user`);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reset password");
      }

      toast.success("Password reset successfully");
      setPasswordDialogOpen(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  const handleImpersonate = async (user: User) => {
    if (!confirm(`Login as ${user.full_name}? This action will be logged.`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-impersonate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to impersonate user");
      }

      const data = await response.json();
      
      // Open impersonation link in new tab
      window.open(data.impersonationUrl, "_blank");
      toast.success("Impersonation link opened in new tab");
    } catch (error: any) {
      toast.error(error.message || "Failed to impersonate user");
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      full_name: user.full_name,
      email: user.email,
      role: user.roles[0] || "student",
    });
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          full_name: editFormData.full_name,
        })
        .eq("id", selectedUser.id);

      if (profileError) throw profileError;

      // Update role if changed
      if (editFormData.role !== selectedUser.roles[0]) {
        // Delete old role
        await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", selectedUser.id);

        // Insert new role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{
            user_id: selectedUser.id,
            role: editFormData.role as "admin" | "teacher" | "non_editing_teacher" | "student" | "user",
          }]);

        if (roleError) throw roleError;
      }

      toast.success("User updated successfully");
      setEditDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
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
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and cohorts
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_id">User ID *</Label>
                <Input
                  id="user_id"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  placeholder="e.g., 001, 002"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier (alphanumeric). Once assigned, cannot be changed or reused.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="non_editing_teacher">Non-editing Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Enroll in Course (Optional)</Label>
                <Select value={formData.course_id} onValueChange={(value) => setFormData({ ...formData, course_id: value })}>
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
              <Button type="submit" className="w-full">Create User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_full_name">Full Name</Label>
              <Input
                id="edit_full_name"
                value={editFormData.full_name}
                onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_email">Email (Read-only)</Label>
              <Input
                id="edit_email"
                value={editFormData.email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_role">Role</Label>
              <Select value={editFormData.role} onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="non_editing_teacher">Non-editing Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateUser} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Reset password for: <strong>{selectedUser?.full_name}</strong>
            </p>
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <Button onClick={handleResetPassword} className="w-full">
              Reset Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UsersIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.full_name}</h3>
                          {user.is_blocked && (
                            <Badge variant="destructive" className="text-xs">
                              Blocked
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.user_id && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {user.user_id}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user)}
                        title="Edit user"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setPasswordDialogOpen(true);
                        }}
                        title="Reset password"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleBlock(user)}
                        title={user.is_blocked ? "Unblock user" : "Block user"}
                        className={user.is_blocked ? "text-green-600" : "text-orange-600"}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleImpersonate(user)}
                        title="Login as this user"
                        className="text-blue-600"
                      >
                        <LogIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Cohort Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cohort management features coming soon. You'll be able to create cohorts and automatically enroll groups of users.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
