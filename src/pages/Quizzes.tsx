import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, Target, PlayCircle, CheckCircle } from "lucide-react";

const quizzes = [
  { id: 1, title: "Data Structures Fundamentals", course: "CS201", questions: 20, duration: 45, status: "available", difficulty: "Medium" },
  { id: 2, title: "JavaScript ES6+ Features", course: "CS301", questions: 15, duration: 30, status: "available", difficulty: "Easy" },
  { id: 3, title: "SQL Queries & Joins", course: "CS202", questions: 25, duration: 60, status: "completed", bestScore: 92, difficulty: "Hard" },
];

export default function Quizzes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Quizzes</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 bg-gradient-card border-primary/30"><div className="flex items-center gap-3"><div className="p-3 rounded-lg bg-primary/20"><Trophy className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold">3</p><p className="text-xs text-muted-foreground">Completed</p></div></div></Card>
        <Card className="p-4 bg-gradient-card border-success/30"><div className="flex items-center gap-3"><div className="p-3 rounded-lg bg-success/20"><Target className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold">92%</p><p className="text-xs text-muted-foreground">Avg Score</p></div></div></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((q) => (
          <Card key={q.id} className="p-6 hover:shadow-glow transition-all bg-gradient-card">
            <div className="space-y-4">
              <div><Badge variant="secondary">{q.course}</Badge><h3 className="text-xl font-semibold mt-2">{q.title}</h3></div>
              <div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-muted-foreground">Questions</p><p className="font-semibold">{q.questions}</p></div><div><p className="text-sm text-muted-foreground">Duration</p><p className="font-semibold">{q.duration} min</p></div></div>
              {q.bestScore && <div><Progress value={q.bestScore} className="h-2" /><p className="text-sm mt-1">Best: {q.bestScore}%</p></div>}
              <Button className="w-full bg-gradient-primary"><PlayCircle className="mr-2 h-4 w-4" />{q.status === "available" ? "Start" : "Retake"}</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
