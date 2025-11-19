import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, Target, TrendingUp } from "lucide-react";

const quizzes = [
  {
    id: 1,
    title: "Data Structures Fundamentals",
    course: "CS201",
    questions: 20,
    duration: 45,
    status: "available",
    bestScore: null,
  },
  {
    id: 2,
    title: "JavaScript ES6+ Features",
    course: "CS301",
    questions: 15,
    duration: 30,
    status: "available",
    bestScore: null,
  },
  {
    id: 3,
    title: "SQL Queries & Joins",
    course: "CS202",
    questions: 25,
    duration: 60,
    status: "completed",
    bestScore: 92,
  },
];

export default function Quizzes() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground mt-1">
          Test your knowledge and track your performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 bg-gradient-card border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-success/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Target className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-warning/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Timer className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">+5%</p>
              <p className="text-xs text-muted-foreground">Improvement</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quizzes List */}
      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz, index) => (
          <Card
            key={quiz.id}
            className="p-6 hover:shadow-lg transition-all duration-300 animate-scale-in bg-gradient-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="font-mono">
                    {quiz.course}
                  </Badge>
                  {quiz.status === "completed" && quiz.bestScore && (
                    <Badge className="bg-success text-success-foreground">
                      Best: {quiz.bestScore}%
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{quiz.title}</h3>
              </div>

              {/* Quiz Info */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-lg font-semibold">{quiz.questions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">{quiz.duration} min</p>
                </div>
              </div>

              {/* Progress for completed quizzes */}
              {quiz.status === "completed" && quiz.bestScore && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Best Score</span>
                    <span className="font-semibold">{quiz.bestScore}%</span>
                  </div>
                  <Progress value={quiz.bestScore} className="h-2" />
                </div>
              )}

              {/* Actions */}
              <Button
                className={
                  quiz.status === "available"
                    ? "w-full bg-gradient-primary hover:opacity-90"
                    : "w-full"
                }
                variant={quiz.status === "completed" ? "outline" : "default"}
              >
                {quiz.status === "available" ? "Start Quiz" : "Retake Quiz"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
