import { useEffect, useState } from "react";
import { AlertCircle, Calendar, Clock, TrendingUp, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface Deadline {
  id: string;
  title: string;
  course: string;
  due_date: string;
  priority: string;
  hours_left: number;
  type?: 'assignment' | 'quiz';
}

export function RightSidebar() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [stats, setStats] = useState({
    studyTime: "0h 0m",
    completedTasks: 0,
    streak: 0,
  });

  useEffect(() => {
    if (user) {
      fetchDeadlines();
      fetchStats();
    }
  }, [user]);

  const fetchDeadlines = async () => {
    try {
      if (!user) return;

      // Get all assignments
      const { data: assignments } = await supabase
        .from("assignments")
        .select("*")
        .order("due_date", { ascending: true });

      if (!assignments) return;

      // Get user-specific deadlines
      const { data: customDeadlines } = await supabase
        .from("assignment_deadlines")
        .select("*")
        .eq("user_id", user.id);

      // Get user's submissions
      const { data: submissions } = await supabase
        .from("assignment_submissions")
        .select("assignment_id")
        .eq("user_id", user.id);

      // Get all quizzes with deadlines
      const { data: quizzes } = await supabase
        .from("section_quizzes")
        .select("*, courses(code)")
        .order("due_date", { ascending: true });

      // Get user-specific quiz deadlines
      const { data: customQuizDeadlines } = await supabase
        .from("quiz_deadlines")
        .select("*")
        .eq("user_id", user.id);

      const submittedIds = new Set(submissions?.map(s => s.assignment_id) || []);
      const customDeadlineMap = new Map(customDeadlines?.map(d => [d.assignment_id, d.deadline]) || []);
      const customQuizDeadlineMap = new Map(customQuizDeadlines?.map(d => [d.quiz_id, d.deadline]) || []);

      // Filter out submitted assignments and map to deadline format
      const assignmentDeadlines = assignments
        .filter(a => !submittedIds.has(a.id) && (a.due_date || customDeadlineMap.has(a.id)))
        .map((assignment) => {
          const deadline = customDeadlineMap.get(assignment.id) || assignment.due_date;
          
          // Skip if no deadline exists
          if (!deadline) return null;
          
          const dueDate = new Date(deadline);
          const now = new Date();
          const hoursLeft = Math.max(
            0,
            Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60))
          );

          return {
            id: `assignment-${assignment.id}`,
            title: assignment.title,
            course: assignment.course_code,
            due_date: deadline,
            priority: assignment.priority || "medium",
            hours_left: hoursLeft,
            type: 'assignment' as const
          };
        })
        .filter(Boolean); // Remove null entries

      // Map quizzes to deadline format
      const quizDeadlines = (quizzes || [])
        .filter(quiz => {
          // Include if there's a base deadline or custom deadline
          return quiz.due_date || customQuizDeadlineMap.has(quiz.id);
        })
        .map((quiz) => {
          const deadline = customQuizDeadlineMap.get(quiz.id) || quiz.due_date;
          
          if (!deadline) return null;
          
          const dueDate = new Date(deadline);
          const now = new Date();
          const hoursLeft = Math.max(
            0,
            Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60))
          );

          const courseData = quiz.courses as any;

          return {
            id: `quiz-${quiz.id}`,
            title: quiz.title,
            course: courseData?.code || '',
            due_date: deadline,
            priority: hoursLeft < 24 ? 'high' : hoursLeft < 72 ? 'medium' : 'low',
            hours_left: hoursLeft,
            type: 'quiz' as const
          };
        })
        .filter(Boolean); // Remove null entries

      // Combine and sort all deadlines by due date
      const allDeadlines = [...assignmentDeadlines, ...quizDeadlines]
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

      setDeadlines(allDeadlines);
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    }
  };

  const fetchStats = async () => {
    try {
      if (!user) return;

      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch today's completed items
      const { data: todayProgress } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .gte("completed_at", today.toISOString())
        .lt("completed_at", tomorrow.toISOString());

      // Fetch all completed progress for study time
      const { data: allProgress } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed");

      // Calculate streak (consecutive days with activity)
      const { data: recentProgress } = await supabase
        .from("progress_tracking")
        .select("completed_at")
        .eq("user_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      let streak = 0;
      if (recentProgress && recentProgress.length > 0) {
        // Group by date
        const dateSet = new Set<string>();
        recentProgress.forEach(item => {
          const date = new Date(item.completed_at!);
          const dateStr = date.toISOString().split('T')[0];
          dateSet.add(dateStr);
        });
        
        const sortedDates = Array.from(dateSet).sort().reverse();
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Check if there's activity today or yesterday to start counting
        let currentDate = new Date(todayStr);
        if (!sortedDates.includes(todayStr)) {
          // If no activity today, check yesterday
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // Count consecutive days
        for (const dateStr of sortedDates) {
          const checkDateStr = currentDate.toISOString().split('T')[0];
          if (dateStr === checkDateStr) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (new Date(dateStr) < currentDate) {
            break;
          }
        }
      }

      // Estimate study time based on completed items (assume 30 min per item)
      const totalMinutes = (allProgress?.length || 0) * 30;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setStats({
        studyTime: `${hours}h ${minutes}m`,
        completedTasks: todayProgress?.length || 0,
        streak,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Today's Stats */}
        <div className="bg-gradient-hero p-4 rounded-lg shadow-glow">
          <h2 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            Today's Activity
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-card/50 rounded backdrop-blur-sm">
              <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Study Time</p>
              <p className="text-sm font-bold">{stats.studyTime}</p>
            </div>
            <div className="text-center p-2 bg-card/50 rounded backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-success" />
              <p className="text-xs text-muted-foreground">Tasks</p>
              <p className="text-sm font-bold">{stats.completedTasks}</p>
            </div>
            <div className="text-center p-2 bg-card/50 rounded backdrop-blur-sm">
              <span className="text-xl">🔥</span>
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="text-sm font-bold">{stats.streak} days</p>
            </div>
          </div>
        </div>

        {/* Urgent Deadlines */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {deadlines.length === 0 ? (
              <Card className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No upcoming deadlines</p>
              </Card>
            ) : (
              deadlines.map((deadline) => (
                <Card
                  key={deadline.id}
                  className={cn(
                    "p-4 border-l-4 transition-all duration-300 hover:shadow-glow hover:scale-105 bg-gradient-card",
                    deadline.priority === "high" && "border-l-destructive shadow-glow-accent",
                    deadline.priority === "medium" && "border-l-warning",
                    deadline.priority === "low" && "border-l-success"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        {deadline.type === 'quiz' && (
                          <Badge variant="secondary" className="text-[10px] h-5 bg-purple-600 text-white mb-1">
                            Quiz
                          </Badge>
                        )}
                        {deadline.type === 'assignment' && (
                          <Badge variant="destructive" className="text-[10px] h-5 mb-1">
                            Assignment
                          </Badge>
                        )}
                        <h3 className="font-medium text-sm leading-tight">{deadline.title}</h3>
                      </div>
                      <Badge
                        variant={deadline.priority === "high" ? "destructive" : "secondary"}
                        className={deadline.priority === "high" ? "animate-pulse" : ""}
                      >
                        {deadline.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{deadline.course}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                       <span className="text-muted-foreground">
                        {deadline.due_date
                          ? (() => {
                              const utcDate = new Date(deadline.due_date);
                              // Convert UTC to UAE time (UTC+4)
                              const uaeDate = new Date(utcDate.getTime() + (4 * 60 * 60 * 1000));
                              return format(uaeDate, "MMM d, h:mm a");
                            })()
                          : "No date"}
                      </span>
                      <span
                        className={cn(
                          "ml-auto font-semibold",
                          deadline.hours_left < 24 && "text-destructive",
                          deadline.hours_left >= 24 && deadline.hours_left < 72 && "text-warning",
                          deadline.hours_left >= 72 && "text-success"
                        )}
                      >
                        {deadline.hours_left}h left
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
