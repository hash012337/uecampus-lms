import { useState } from "react";
import { Menu, X, Bell, Search, Settings, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-lg">
        <div className="flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="hover:bg-primary/20 hover:text-primary transition-all duration-300"
            aria-label="Toggle navigation menu"
          >
            {leftSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex-1 flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EduPro LMS
            </h1>
            
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, assignments..."
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-all duration-300"
                  aria-label="Search"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-primary/20 hover:text-primary transition-all duration-300 relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full animate-pulse" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-primary/20 hover:text-primary transition-all duration-300"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-primary/20 hover:text-primary transition-all duration-300"
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="hover:bg-accent/20 hover:text-accent transition-all duration-300"
              aria-label="Toggle alerts sidebar"
            >
              {rightSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <aside
          className={`transition-all duration-500 ease-smooth ${
            leftSidebarOpen ? "w-64" : "w-0"
          } overflow-hidden border-r border-border/50 bg-sidebar shadow-2xl relative z-10`}
          aria-label="Main navigation"
        >
          <LeftSidebar />
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {/* Background decorative elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside
          className={`transition-all duration-500 ease-smooth ${
            rightSidebarOpen ? "w-80" : "w-0"
          } overflow-hidden border-l border-border/50 bg-card shadow-2xl relative z-10`}
          aria-label="Alerts and deadlines"
        >
          <RightSidebar />
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-bl from-accent/5 to-transparent pointer-events-none" />
        </aside>

        {/* Overlay for mobile when sidebars are open */}
        {(leftSidebarOpen || rightSidebarOpen) && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0 lg:hidden"
            onClick={() => {
              setLeftSidebarOpen(false);
              setRightSidebarOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
