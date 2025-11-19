import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Award, BookOpen, CheckCircle2 } from "lucide-react";

interface ProgressItem {
  id: string;
  course_name: string;
  item_type: string;
  score: number;
  max_score: number;
  percentage: number;
  status: string;
  completed_at: string;
}

interface CourseProgress {
  course_id: string;
  course_name: string;
  overall_progress: number;
  assignments_completed: number;
  quizzes_completed: number;
  total_score: number;
}

export default function Progress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      setLoading(true);

      // Load detailed progress items
      const { data: items, error: itemsError } = await supabase
        .from("progress_tracking")
        .select(`
          *,
          courses!progress_tracking_course_id_fkey (title)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (itemsError) throw itemsError;

      const formattedItems = items?.map((item: any) => ({
        id: item.id,
        course_name: item.courses?.title || "Unknown Course",
        item_type: item.item_type,
        score: item.score || 0,
        max_score: item.max_score || 100,
        percentage: item.percentage || 0,
        status: item.status,
        completed_at: item.completed_at,
      })) || [];

      setProgressItems(formattedItems);

      // Load course enrollments and calculate progress
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select(`
          *,
          courses!enrollments_course_id_fkey (title)
        `)
        .eq("user_id", user?.id)
        .eq("status", "active");

      if (enrollmentsError) throw enrollmentsError;

      const courseProgressData = enrollments?.map((enrollment: any) => {
        const courseItems = formattedItems.filter(
          (item) => item.course_name === enrollment.courses?.title
        );

        const assignmentsCompleted = courseItems.filter(
          (item) => item.item_type === "assignment" && item.status === "completed"
        ).length;

        const quizzesCompleted = courseItems.filter(
          (item) => item.item_type === "quiz" && item.status === "completed"
        ).length;

        const totalScore = courseItems.reduce((sum, item) => sum + (item.score || 0), 0);

        return {
          course_id: enrollment.course_id,
          course_name: enrollment.courses?.title || "Unknown Course",
          overall_progress: enrollment.progress || 0,
          assignments_completed: assignmentsCompleted,
          quizzes_completed: quizzesCompleted,
          total_score: totalScore,
        };
      }) || [];

      setCourseProgress(courseProgressData);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          My Progress
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your learning progress and achievements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courseProgress.length}</p>
                <p className="text-xs text-muted-foreground">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {progressItems.filter((i) => i.status === "completed").length}
                </p>
                <p className="text-xs text-muted-foreground">Completed Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(
                    courseProgress.reduce((sum, c) => sum + c.overall_progress, 0) /
                      Math.max(courseProgress.length, 1)
                  )}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <Award className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {courseProgress.reduce((sum, c) => sum + c.total_score, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Course Progress</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {courseProgress.map((course) => (
            <Card key={course.course_id} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{course.course_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span className="font-semibold">{course.overall_progress}%</span>
                  </div>
                  <ProgressBar value={course.overall_progress} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Assignments</p>
                    <p className="font-semibold">{course.assignments_completed}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quizzes</p>
                    <p className="font-semibold">{course.quizzes_completed}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Score</p>
                    <p className="font-semibold">{course.total_score} pts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {progressItems
            .filter((item) => item.item_type === "assignment")
            .map((item) => (
              <Card key={item.id} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{item.course_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.completed_at
                        ? `Completed on ${new Date(item.completed_at).toLocaleDateString()}`
                        : "In Progress"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {item.score}/{item.max_score}
                    </p>
                    <Badge variant={item.status === "completed" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          {progressItems
            .filter((item) => item.item_type === "quiz")
            .map((item) => (
              <Card key={item.id} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{item.course_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.completed_at
                        ? `Completed on ${new Date(item.completed_at).toLocaleDateString()}`
                        : "In Progress"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{item.percentage}%</p>
                    <Badge variant={item.status === "completed" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
