import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Assignments from "./pages/Assignments";
import Quizzes from "./pages/Quizzes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/courses" element={<DashboardLayout><Courses /></DashboardLayout>} />
          <Route path="/courses/:courseId" element={<DashboardLayout><CourseDetail /></DashboardLayout>} />
          <Route path="/assignments" element={<DashboardLayout><Assignments /></DashboardLayout>} />
          <Route path="/quizzes" element={<DashboardLayout><Quizzes /></DashboardLayout>} />
          <Route path="/timetable" element={<DashboardLayout><div className="text-center py-12">Timetable - Coming Soon</div></DashboardLayout>} />
          <Route path="/library" element={<DashboardLayout><div className="text-center py-12">eLibrary - Coming Soon</div></DashboardLayout>} />
          <Route path="/guides" element={<DashboardLayout><div className="text-center py-12">Learning Guides - Coming Soon</div></DashboardLayout>} />
          <Route path="/certificates" element={<DashboardLayout><div className="text-center py-12">Certificates - Coming Soon</div></DashboardLayout>} />
          <Route path="/progress" element={<DashboardLayout><div className="text-center py-12">My Progress - Coming Soon</div></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><div className="text-center py-12">Profile - Coming Soon</div></DashboardLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
