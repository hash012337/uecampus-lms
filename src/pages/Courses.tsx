import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Video, Calendar, PlayCircle, CheckCircle2, AlertCircle, Users, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WelcomeDialog } from "@/components/WelcomeDialog";

const weeklyActivity = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 4.5 },
  { day: "Thu", hours: 5.8 },
  { day: "Fri", hours: 3.1 },
  { day: "Sat", hours: 2.0 },
  { day: "Sun", hours: 3.4 },
];

const progressStats = {
  totalActivity: 64,
  inProgress: 8,
  completed: 12,
  upcoming: 14,
};

const courses = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    code: "CS201",
    progress: 75,
    instructor: "Dr. Sarah Johnson",
    nextClass: "Tomorrow, 10:00 AM",
    timeSlot: "10:00 - 12:00",
    status: "active",
    grade: "A",
    participants: [
      { name: "John", avatar: "JD" },
      { name: "Sarah", avatar: "SM" },
      { name: "Mike", avatar: "MK" },
      { name: "Emma", avatar: "EW" },
    ],
  },
  {
    id: 2,
    title: "Web Development",
    code: "CS301",
    progress: 60,
    instructor: "Prof. Michael Chen",
    nextClass: "Today, 2:00 PM",
    timeSlot: "14:00 - 16:00",
    status: "active",
    grade: "A-",
    participants: [
      { name: "Alex", avatar: "AL" },
      { name: "Lisa", avatar: "LS" },
      { name: "Tom", avatar: "TM" },
    ],
  },
  {
    id: 3,
    title: "Database Management",
    code: "CS202",
    progress: 45,
    instructor: "Dr. Emily Rodriguez",
    nextClass: "Wed, 9:00 AM",
    timeSlot: "09:00 - 11:00",
    status: "active",
    grade: "B+",
    participants: [
      { name: "Chris", avatar: "CH" },
      { name: "Nina", avatar: "NA" },
    ],
  },
];

const supportOptions = [
  { 
    type: "Zoom Meeting", 
    description: "Video conference", 
    icon: Video,
    available: "Schedule anytime",
    color: "primary"
  },
  { 
    type: "Google Meet", 
    description: "Quick video call", 
    icon: Video,
    available: "Available now",
    color: "success"
  },
  { 
    type: "Email Support", 
    description: "Detailed help", 
    icon: Mail,
    available: "24h response time",
    color: "accent"
  },
];

export default function Courses() {
  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Dialog */}
      <WelcomeDialog />
      
      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Activity Card */}
        <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-muted-foreground">Activity</h3>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{weeklyActivity.reduce((sum, d) => sum + d.hours, 0).toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            {/* Mini bar chart */}
            <div className="flex items-end gap-1 mt-4 h-12">
              {weeklyActivity.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t relative group/bar hover:bg-primary/40 transition-all duration-200"
                  style={{ height: `${(day.hours / maxHours) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-xs bg-card px-2 py-1 rounded whitespace-nowrap">
                    {day.hours}h
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              {weeklyActivity.map((day, i) => (
                <span key={i}>{day.day.charAt(0)}</span>
              ))}
            </div>
          </div>
        </Card>

        {/* Progress Statistics Card */}
        <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-sm text-muted-foreground mb-4">Progress statistics</h3>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold">{progressStats.totalActivity}%</span>
                  <span className="text-sm text-muted-foreground">Total activity</span>
                </div>
                <Progress value={progressStats.totalActivity} className="h-2 w-full max-w-md" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1 max-w-md">
                  <span>24%</span>
                  <span>35%</span>
                  <span>41%</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2 border-2 border-primary">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{progressStats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-2 border-2 border-success">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-2xl font-bold">{progressStats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-2 border-2 border-warning">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <p className="text-2xl font-bold">{progressStats.upcoming}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Total Courses */}
        <Card className="p-6 bg-gradient-card border-accent/30 hover:shadow-glow-accent transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-muted-foreground">Total Courses</h3>
              <BookOpen className="h-4 w-4 text-accent" />
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-bold">{courses.length}</span>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">Avg Grade</p>
              <p className="text-xl font-bold text-accent">A-</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Support Meeting Booking */}
        <Card className="p-6 bg-gradient-card border-border/50 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Book a Support Meeting</h3>
            <p className="text-sm text-muted-foreground">Get help from our team whenever you need it</p>
          </div>
          <div className="space-y-3">
            {supportOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start p-4 h-auto hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className="flex items-center gap-3 w-full relative z-10">
                  <div className={`p-2 rounded bg-${option.color}/20 group-hover:bg-${option.color}/30 transition-colors`}>
                    <option.icon className={`h-5 w-5 text-${option.color}`} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">{option.type}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {option.available}
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity mt-4">
            View All Support Options
          </Button>
        </Card>

        {/* Middle & Right Columns - Course Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrolled Courses Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Enrolled Courses</h2>
            <p className="text-sm text-muted-foreground">
              Continue your learning journey with your active courses
            </p>
          </div>

          {/* Course Cards */}
          <div className="space-y-4">
            {courses.map((course, index) => (
            <Card
              key={course.id}
              className="p-6 hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/50 group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              
              <div className="relative z-10 space-y-4">
                {/* Course Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {course.code}
                      </Badge>
                      <Badge className="bg-success/20 text-success border-success/30 text-xs">
                        Grade: {course.grade}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {course.nextClass}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors truncate">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                  
                  {/* Circular Progress */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - course.progress / 100)}`}
                        className="text-primary transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">{course.progress}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                {/* Participants & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-xs text-muted-foreground">Participants</span>
                    </div>
                    <div className="flex -space-x-2">
                      {course.participants.map((participant, i) => (
                        <Avatar key={i} className="w-7 h-7 border-2 border-card">
                          <AvatarFallback className="text-xs bg-primary/20 text-primary">
                            {participant.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="bg-gradient-primary hover:opacity-90 transition-opacity w-full sm:w-auto">
                    Continue Learning
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
