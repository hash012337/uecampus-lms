import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { EditModeProvider } from "./contexts/EditModeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Assignments from "./pages/Assignments";
import Timetable from "./pages/Timetable";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import Progress from "./pages/Progress";
import Library from "./pages/Library";
import BookDetail from "./pages/BookDetail";
import Submissions from "./pages/Submissions";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <EditModeProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/courses" element={<DashboardLayout><Courses /></DashboardLayout>} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/assignments" element={<DashboardLayout><Assignments /></DashboardLayout>} />
            <Route path="/timetable" element={<DashboardLayout><Timetable /></DashboardLayout>} />
            <Route path="/library" element={<DashboardLayout><Library /></DashboardLayout>} />
            <Route path="/library/:bookId" element={<BookDetail />} />
            <Route path="/guides" element={<DashboardLayout><Guides /></DashboardLayout>} />
            <Route path="/guides/video/:id" element={<GuideDetail />} />
            <Route path="/guides/article/:id" element={<GuideDetail />} />
            <Route path="/certificates" element={<DashboardLayout><div className="text-center py-12">Certificates - Coming Soon</div></DashboardLayout>} />
            <Route path="/progress" element={<DashboardLayout><Progress /></DashboardLayout>} />
            <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
            <Route path="/users" element={<DashboardLayout><Users /></DashboardLayout>} />
            <Route path="/submissions" element={<DashboardLayout><Submissions /></DashboardLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </EditModeProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
