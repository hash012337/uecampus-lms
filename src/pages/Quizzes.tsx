import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, Target, PlayCircle, Plus, Trash2, Copy, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useEditMode } from "@/contexts/EditModeContext";
import { supabase } from "@/integrations/supabase/client";

interface Quiz {
  id: string;
  title: string;
  course: string;
  questions: number | null;
  duration: number | null;
  status: string | null;
  difficulty: string | null;
  best_score: number | null;
}

export default function Quizzes() {
  const { isEditMode } = useEditMode();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (id: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from("quizzes")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;
      setQuizzes(quizzes.map(q => q.id === id ? { ...q, [field]: value } : q));
    } catch (error: any) {
      toast.error("Failed to update quiz");
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      const { error } = await supabase.from("quizzes").delete().eq("id", id);
      if (error) throw error;

      setQuizzes(quizzes.filter(q => q.id !== id));
      toast.success("Quiz deleted");
    } catch (error: any) {
      toast.error("Failed to delete quiz");
    }
  };

  const addQuiz = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .insert({
          title: "New Quiz",
          course: "CODE",
          questions: 10,
          duration: 30,
          difficulty: "Medium",
          status: "available"
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setQuizzes([data, ...quizzes]);
      toast.success("Quiz added");
    } catch (error: any) {
      toast.error("Failed to add quiz");
    }
  };

  const duplicateQuiz = async (quiz: Quiz) => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .insert({
          title: `${quiz.title} (Copy)`,
          course: quiz.course,
          questions: quiz.questions,
          duration: quiz.duration,
          difficulty: quiz.difficulty,
          status: quiz.status,
          best_score: quiz.best_score
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setQuizzes([data, ...quizzes]);
      toast.success("Quiz duplicated");
    } catch (error: any) {
      toast.error("Failed to duplicate quiz");
    }
  };

  if (loading) return <div className="animate-fade-in">Loading...</div>;

  const completed = quizzes.filter(q => q.status === "completed").length;
  const avgScore = quizzes.filter(q => q.best_score).reduce((sum, q) => sum + (q.best_score || 0), 0) / (completed || 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        {isEditMode && (
          <div className="flex gap-2">
            <Badge variant="outline" className="animate-pulse">
              <Edit2 className="h-3 w-3 mr-1" />
              Edit Mode Active
            </Badge>
            <Button onClick={addQuiz} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Quiz
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 bg-gradient-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/20">
              <Target className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgScore.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((q) => (
          <Card key={q.id} className="p-6 hover:shadow-glow transition-all bg-gradient-card relative group">
            {isEditMode && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => duplicateQuiz(q)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => deleteQuiz(q.id)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="space-y-4">
              {isEditMode ? (
                <>
                  <Input
                    value={q.course}
                    onChange={(e) => updateQuiz(q.id, "course", e.target.value)}
                    placeholder="Course Code"
                  />
                  <Input
                    value={q.title}
                    onChange={(e) => updateQuiz(q.id, "title", e.target.value)}
                    placeholder="Quiz Title"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={q.questions || 0}
                      onChange={(e) => updateQuiz(q.id, "questions", parseInt(e.target.value))}
                      placeholder="Questions"
                    />
                    <Input
                      type="number"
                      value={q.duration || 0}
                      onChange={(e) => updateQuiz(q.id, "duration", parseInt(e.target.value))}
                      placeholder="Duration"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Badge variant="secondary">{q.course}</Badge>
                    <h3 className="text-xl font-semibold mt-2">{q.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Questions</p>
                      <p className="font-semibold">{q.questions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{q.duration} min</p>
                    </div>
                  </div>
                  {q.best_score && (
                    <div>
                      <Progress value={q.best_score} className="h-2" />
                      <p className="text-sm mt-1">Best: {q.best_score}%</p>
                    </div>
                  )}
                  <Button className="w-full bg-gradient-primary">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {q.status === "available" ? "Start Quiz" : "Retake"}
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
