import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, Target, PlayCircle, Edit2, Save, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Quiz {
  id: number;
  title: string;
  course: string;
  questions: number;
  duration: number;
  status: string;
  difficulty: string;
  bestScore?: number;
}

export default function Quizzes() {
  const [isEditMode, setIsEditMode] = useState(false);

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    { 
      id: 1, 
      title: "Data Structures Fundamentals", 
      course: "CS201", 
      questions: 20, 
      duration: 45, 
      status: "available", 
      difficulty: "Medium" 
    },
    { 
      id: 2, 
      title: "JavaScript ES6+ Features", 
      course: "CS301", 
      questions: 15, 
      duration: 30, 
      status: "available", 
      difficulty: "Easy" 
    },
    { 
      id: 3, 
      title: "SQL Queries & Joins", 
      course: "CS202", 
      questions: 25, 
      duration: 60, 
      status: "completed", 
      bestScore: 92, 
      difficulty: "Hard" 
    },
  ]);

  const [stats, setStats] = useState({
    completed: 3,
    avgScore: 92
  });

  const handleSaveAll = () => {
    console.log("=== QUIZZES DATA FOR DATABASE ===");
    console.log("Quizzes:", quizzes);
    console.log("Stats:", stats);
    console.log("================================");
    // TODO: await saveQuizzesData({ quizzes, stats });
    toast.success("Quizzes data saved successfully!");
    setIsEditMode(false);
  };

  const updateQuiz = (id: number, field: keyof Quiz, value: any) => {
    const updated = quizzes.map(q => q.id === id ? { ...q, [field]: value } : q);
    setQuizzes(updated);
    console.log(`Quiz ${id} updated - Save to DB:`, { field, value });
    // TODO: await updateQuizInDatabase(id, { [field]: value });
  };

  const deleteQuiz = (id: number) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
    console.log("Quiz deleted - Remove from DB:", id);
    // TODO: await deleteQuizFromDatabase(id);
    toast.success("Quiz deleted");
  };

  const addQuiz = () => {
    const newQuiz: Quiz = {
      id: Date.now(),
      title: "New Quiz",
      course: "CODE",
      questions: 10,
      duration: 30,
      status: "available",
      difficulty: "Medium"
    };
    setQuizzes([...quizzes, newQuiz]);
    console.log("Quiz added - Save to DB:", newQuiz);
    // TODO: await addQuizToDatabase(newQuiz);
    toast.success("Quiz added");
  };

  const updateStats = (field: "completed" | "avgScore", value: number) => {
    const updated = { ...stats, [field]: value };
    setStats(updated);
    console.log("Stats updated - Save to DB:", updated);
    // TODO: await updateStatsInDatabase(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <div className="flex gap-2">
          {isEditMode && (
            <Button onClick={handleSaveAll} className="gap-2 bg-gradient-primary">
              <Save className="h-4 w-4" />
              Save All Changes
            </Button>
          )}
          <Button 
            onClick={() => setIsEditMode(!isEditMode)} 
            variant={isEditMode ? "destructive" : "outline"}
            className="gap-2"
          >
            {isEditMode ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            {isEditMode ? "Cancel Edit" : "Edit Mode"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 bg-gradient-card border-primary/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              {isEditMode ? (
                <Input
                  type="number"
                  value={stats.completed}
                  onChange={(e) => updateStats("completed", parseInt(e.target.value))}
                  className="w-20 h-8 text-xl font-bold"
                />
              ) : (
                <p className="text-2xl font-bold">{stats.completed}</p>
              )}
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card border-success/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/20">
              <Target className="h-5 w-5 text-success" />
            </div>
            <div>
              {isEditMode ? (
                <Input
                  type="number"
                  value={stats.avgScore}
                  onChange={(e) => updateStats("avgScore", parseInt(e.target.value))}
                  className="w-20 h-8 text-xl font-bold"
                />
              ) : (
                <p className="text-2xl font-bold">{stats.avgScore}%</p>
              )}
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {isEditMode && (
          <Button onClick={addQuiz} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Quiz
          </Button>
        )}
        
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((q) => (
            <Card key={q.id} className="p-6 hover:shadow-glow transition-all bg-gradient-card relative group">
              {isEditMode && (
                <Button
                  onClick={() => deleteQuiz(q.id)}
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Input
                        value={q.course}
                        onChange={(e) => updateQuiz(q.id, "course", e.target.value)}
                        placeholder="Course Code"
                        className="font-mono"
                      />
                      <Input
                        value={q.title}
                        onChange={(e) => updateQuiz(q.id, "title", e.target.value)}
                        placeholder="Quiz Title"
                        className="text-xl font-semibold"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Questions</Label>
                        <Input
                          type="number"
                          value={q.questions}
                          onChange={(e) => updateQuiz(q.id, "questions", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Duration (min)</Label>
                        <Input
                          type="number"
                          value={q.duration}
                          onChange={(e) => updateQuiz(q.id, "duration", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Difficulty</Label>
                        <Input
                          value={q.difficulty}
                          onChange={(e) => updateQuiz(q.id, "difficulty", e.target.value)}
                          placeholder="Easy/Medium/Hard"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Status</Label>
                        <Input
                          value={q.status}
                          onChange={(e) => updateQuiz(q.id, "status", e.target.value)}
                          placeholder="available/completed"
                        />
                      </div>
                    </div>

                    {q.status === "completed" && (
                      <div className="space-y-1">
                        <Label className="text-xs">Best Score</Label>
                        <Input
                          type="number"
                          value={q.bestScore || 0}
                          onChange={(e) => updateQuiz(q.id, "bestScore", parseInt(e.target.value))}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <Badge variant="secondary">{q.course}</Badge>
                      <h3 className="text-xl font-semibold mt-2">{q.title}</h3>
                      <Badge variant="outline" className="mt-2">{q.difficulty}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Questions</p>
                        <p className="font-semibold">{q.questions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {q.duration} min
                        </p>
                      </div>
                    </div>

                    {q.bestScore && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Best Score</span>
                          <span className="font-semibold">{q.bestScore}%</span>
                        </div>
                        <Progress value={q.bestScore} className="h-2" />
                      </div>
                    )}

                    <Button className="w-full bg-gradient-primary">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {q.status === "available" ? "Start Quiz" : "Retake Quiz"}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
