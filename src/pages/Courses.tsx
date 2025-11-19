import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Clock, 
  Users,
  TrendingUp,
  Award
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allCourses = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    code: "CS201",
    category: "Computer Science",
    progress: 75,
    instructor: "Dr. Sarah Johnson",
    duration: "12 weeks",
    lessonsCompleted: 18,
    totalLessons: 24,
    rating: 4.8,
    students: 1250,
    enrolled: true,
    difficulty: "Intermediate",
    nextLesson: "Binary Search Trees",
  },
  {
    id: 2,
    title: "Web Development",
    code: "CS301",
    category: "Development",
    progress: 60,
    instructor: "Prof. Michael Chen",
    duration: "10 weeks",
    lessonsCompleted: 12,
    totalLessons: 20,
    rating: 4.9,
    students: 2100,
    enrolled: true,
    difficulty: "Beginner",
    nextLesson: "React Hooks Deep Dive",
  },
  {
    id: 3,
    title: "Database Management",
    code: "CS202",
    category: "Computer Science",
    progress: 45,
    instructor: "Dr. Emily Rodriguez",
    duration: "8 weeks",
    lessonsCompleted: 9,
    totalLessons: 20,
    rating: 4.7,
    students: 980,
    enrolled: true,
    difficulty: "Intermediate",
    nextLesson: "Advanced SQL Queries",
  },
  {
    id: 4,
    title: "Machine Learning Fundamentals",
    code: "CS401",
    category: "AI & ML",
    progress: 0,
    instructor: "Dr. James Wilson",
    duration: "14 weeks",
    lessonsCompleted: 0,
    totalLessons: 28,
    rating: 4.9,
    students: 1800,
    enrolled: false,
    difficulty: "Advanced",
    nextLesson: null,
  },
  {
    id: 5,
    title: "Mobile App Development",
    code: "CS302",
    category: "Development",
    progress: 0,
    instructor: "Prof. David Kim",
    duration: "10 weeks",
    lessonsCompleted: 0,
    totalLessons: 20,
    rating: 4.8,
    students: 1400,
    enrolled: false,
    difficulty: "Intermediate",
    nextLesson: null,
  },
  {
    id: 6,
    title: "Cloud Computing",
    code: "CS403",
    category: "Infrastructure",
    progress: 0,
    instructor: "Dr. Lisa Chang",
    duration: "12 weeks",
    lessonsCompleted: 0,
    totalLessons: 24,
    rating: 4.7,
    students: 1100,
    enrolled: false,
    difficulty: "Advanced",
    nextLesson: null,
  },
];

export default function Courses() {
  const enrolledCourses = allCourses.filter(c => c.enrolled);
  const availableCourses = allCourses.filter(c => !c.enrolled);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage your learning journey
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-all duration-300"
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 bg-gradient-card border-primary/30 hover:shadow-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-success/30 hover:shadow-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/20">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">60%</p>
              <p className="text-xs text-muted-foreground">Avg Progress</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-warning/30 hover:shadow-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-warning/20">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">39</p>
              <p className="text-xs text-muted-foreground">Lessons Left</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-accent/30 hover:shadow-glow-accent transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/20">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs for Enrolled and Available */}
      <Tabs defaultValue="enrolled" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="enrolled">Enrolled ({enrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableCourses.length})</TabsTrigger>
        </TabsList>

        {/* Enrolled Courses */}
        <TabsContent value="enrolled" className="space-y-4">
          <div className="grid gap-4">
            {enrolledCourses.map((course) => (
              <Card
                key={course.id}
                className="p-6 hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/50 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {course.code}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        <Badge className="text-xs">
                          {course.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 35}`}
                          strokeDashoffset={`${2 * Math.PI * 35 * (1 - course.progress / 100)}`}
                          className="text-primary transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold">{course.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {course.lessonsCompleted} of {course.totalLessons} lessons completed
                      </span>
                      {course.nextLesson && (
                        <span className="text-primary font-medium">
                          Next: {course.nextLesson}
                        </span>
                      )}
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                      Continue Learning
                    </Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Available Courses */}
        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {availableCourses.map((course) => (
              <Card
                key={course.id}
                className="p-6 hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/50 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                
                <div className="relative z-10 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {course.code}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge className="text-xs">
                        {course.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      {course.totalLessons} lessons
                    </span>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
