import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    code: "CS201",
    progress: 75,
    instructor: "Dr. Sarah Johnson",
    nextClass: "Tomorrow, 10:00 AM",
    status: "active",
    grade: "A",
  },
  {
    id: 2,
    title: "Web Development",
    code: "CS301",
    progress: 60,
    instructor: "Prof. Michael Chen",
    nextClass: "Today, 2:00 PM",
    status: "active",
    grade: "A-",
  },
  {
    id: 3,
    title: "Database Management",
    code: "CS202",
    progress: 45,
    instructor: "Dr. Emily Rodriguez",
    nextClass: "Wed, 9:00 AM",
    status: "active",
    grade: "B+",
  },
  {
    id: 4,
    title: "Mobile App Development",
    code: "CS302",
    progress: 30,
    instructor: "Prof. David Kim",
    nextClass: "Thu, 11:00 AM",
    status: "active",
    grade: "A",
  },
];

export default function Courses() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            Track your learning progress across all enrolled courses
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <BookOpen className="mr-2 h-4 w-4" />
          Browse Courses
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 bg-gradient-card border-primary/30 hover:shadow-glow transition-all duration-300 hover:scale-105 hover:border-primary group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 rounded-lg bg-primary/20 shadow-glow">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground">Active Courses</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-success/30 hover:shadow-glow transition-all duration-300 hover:scale-105 hover:border-success group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 rounded-lg bg-success/20">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">52%</p>
              <p className="text-xs text-muted-foreground">Avg Progress</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-warning/30 hover:shadow-glow transition-all duration-300 hover:scale-105 hover:border-warning group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 rounded-lg bg-warning/20">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">24h</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-accent/30 hover:shadow-glow-accent transition-all duration-300 hover:scale-105 hover:border-accent group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 rounded-lg bg-accent/20 shadow-glow-accent">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">A-</p>
              <p className="text-xs text-muted-foreground">Avg Grade</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course, index) => (
          <Card
            key={course.id}
            className="p-6 hover:shadow-glow transition-all duration-300 animate-scale-in bg-gradient-card border-border/50 hover:border-primary/50 hover:scale-105 group relative overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <div className="space-y-4 relative z-10">
              {/* Course Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="font-mono">
                      {course.code}
                    </Badge>
                    <Badge className="bg-success text-success-foreground">
                      {course.grade}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.instructor}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              {/* Next Class */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Next class: {course.nextClass}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" variant="default">
                  Continue Learning
                </Button>
                <Button variant="outline">View Details</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
