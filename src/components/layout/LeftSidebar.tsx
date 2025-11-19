import { 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  Library, 
  Video, 
  Trophy, 
  Award,
  Clock,
  User
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: BookOpen, label: "My Courses", href: "/courses" },
  { icon: ClipboardList, label: "Assignments", href: "/assignments" },
  { icon: Calendar, label: "Timetable", href: "/timetable" },
  { icon: Library, label: "eLibrary", href: "/library" },
  { icon: Video, label: "Learning Guides", href: "/guides" },
  { icon: Trophy, label: "Quizzes", href: "/quizzes" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: Clock, label: "My Progress", href: "/progress" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function LeftSidebar() {
  return (
    <nav className="flex flex-col h-full p-4 space-y-2" aria-label="Main navigation">
      {navigationItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
          )}
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
