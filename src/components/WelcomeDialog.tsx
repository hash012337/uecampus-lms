import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Trophy, TrendingUp } from "lucide-react";

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show welcome dialog after a short delay on first visit
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("hasSeenWelcome", "true");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg border-primary/50 bg-gradient-hero shadow-glow">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center animate-bounce">
                <span className="text-lg">🎉</span>
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            Welcome Back, Jacob!
          </DialogTitle>
          
          <DialogDescription className="text-center text-base space-y-4">
            <p className="text-foreground">
              Ready to continue your learning journey? Here's what's waiting for you today:
            </p>
            
            <div className="grid gap-3 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="p-2 rounded-full bg-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">3 Active Courses</p>
                  <p className="text-xs text-muted-foreground">Keep up the momentum!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="p-2 rounded-full bg-warning/20">
                  <Trophy className="h-5 w-5 text-warning" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">2 Assignments Due</p>
                  <p className="text-xs text-muted-foreground">Don't forget to submit!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="p-2 rounded-full bg-success/20">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">24.9 Hours This Week</p>
                  <p className="text-xs text-muted-foreground">You're doing amazing! 🔥</p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 border-border/50 hover:bg-card/50"
          >
            Maybe Later
          </Button>
          <Button
            onClick={() => setOpen(false)}
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
          >
            Let's Go! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
