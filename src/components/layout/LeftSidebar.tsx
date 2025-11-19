import { useState, useEffect } from "react";
import { 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  Library, 
  Video, 
  Trophy, 
  Award,
  Clock,
  User,
  Users,
  Sparkles,
  LayoutDashboard,
  CheckCircle2
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useEditMode } from "@/contexts/EditModeContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/courses" },
  { icon: ClipboardList, label: "Assignments", href: "/assignments" },
  { icon: Calendar, label: "Timetable", href: "/timetable" },
  { icon: Library, label: "eLibrary", href: "/library" },
  { icon: Video, label: "Learning Guides", href: "/guides" },
  { icon: Trophy, label: "Quizzes", href: "/quizzes" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: Clock, label: "My Progress", href: "/progress" },
  { icon: Users, label: "Users", href: "/users", adminOnly: true },
  { icon: CheckCircle2, label: "Submissions", href: "/submissions", adminOnly: true },
  { icon: User, label: "Profile", href: "/profile" },
];

export function LeftSidebar() {
  const { isAdmin } = useEditMode();
  const { user } = useAuth();
  const [userName, setUserName] = useState("Student");
  const [userRole, setUserRole] = useState("Student");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profileData?.full_name) {
          setUserName(profileData.full_name);
        }

        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleData?.role) {
          setUserRole(roleData.role.charAt(0).toUpperCase() + roleData.role.slice(1));
        }
      }
    };

    fetchUserData();
  }, [user]);
  
  return (
    <nav className="flex flex-col h-full p-4 space-y-2 relative" aria-label="Main navigation">
      {/* Header with avatar */}
      <div className="mb-4 pb-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <User className="h-5 w-5 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent animate-pulse" />
          </div>
          <div>
            <p className="font-semibold text-sidebar-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
        </div>
      </div>

      {navigationItems
        .filter((item) => !item.adminOnly || isAdmin)
        .map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
            "text-sidebar-foreground hover:text-sidebar-primary-foreground",
            "focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
          )}
          activeClassName="bg-gradient-primary text-white font-medium shadow-glow"
        >
          {/* Hover background effect */}
          <div className="absolute inset-0 bg-sidebar-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <item.icon className="h-5 w-5 flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm relative z-10">{item.label}</span>
          
          {/* Active indicator */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r-full group-hover:h-8 transition-all duration-300" />
        </NavLink>
      ))}
    </nav>
  );
}
