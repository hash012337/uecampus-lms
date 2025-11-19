import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  GraduationCap, 
  CheckCircle2,
  BookOpen,
  Award,
  Target,
  Briefcase,
  DollarSign,
  Calendar,
  PlayCircle,
  Download,
  FileText,
  Globe,
  BarChart3,
  TrendingUp,
  Shield,
  Laptop,
  MessageSquare,
  Share2,
  Bookmark,
  ChevronDown
} from "lucide-react";
import { allCoursesData } from "@/data/coursesData";

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = allCoursesData.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="p-12 text-center bg-gradient-card">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The course you're looking for doesn't exist.
          </p>
          <Link to="/courses">
            <Button className="bg-gradient-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back Button */}
      <Link to="/courses">
        <Button variant="ghost" className="gap-2 hover:bg-accent/50 transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      {/* Hero Section with Video Preview */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <Card className="p-8 bg-gradient-card border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {course.code}
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/50">
                  {course.level}
                </Badge>
                <Badge variant="outline">{course.category}</Badge>
                {course.partner && (
                  <Badge className="bg-accent/20 text-accent border-accent/50">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {course.partner}
                  </Badge>
                )}
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {course.title}
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({course.enrolledStudents} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{course.enrolledStudents.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{course.mode}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button className="gap-2" variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button className="gap-2" variant="outline" size="sm">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </Card>

          {/* Course Preview Video Card */}
          <Card className="overflow-hidden bg-gradient-card border-border/50">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group cursor-pointer hover:from-primary/30 hover:to-accent/30 transition-all duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
              <div className="relative z-10 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-background/90 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <PlayCircle className="h-10 w-10 text-primary fill-primary/20" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Course Preview</p>
                  <p className="text-sm text-muted-foreground">Watch introduction video</p>
                </div>
              </div>
            </div>
          </Card>

          {/* What You'll Learn Section */}
          <Card className="p-8 bg-gradient-card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              What You'll Learn
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {course.learningOutcomes.map((outcome, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-md group"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Course Content / Syllabus */}
          <Card className="p-8 bg-gradient-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Course Curriculum
              </h2>
              <Badge variant="outline" className="text-xs">
                {course.modules.length} Modules
              </Badge>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {course.modules.map((module, index) => (
                <AccordionItem 
                  key={index} 
                  value={`module-${index}`}
                  className="border rounded-lg bg-background/50 hover:bg-background transition-colors px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{module}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Module {index + 1} • Estimated time: {Math.floor(Math.random() * 4) + 2} hours
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3 pt-2">
                      {[1, 2, 3].map((lesson) => (
                        <div 
                          key={lesson}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background/80 hover:bg-accent/10 transition-colors cursor-pointer group"
                        >
                          <PlayCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Lesson {lesson}: Introduction to {module}</p>
                            <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 30) + 10} min</p>
                          </div>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          {/* Requirements Section */}
          <Card className="p-8 bg-gradient-card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Entry Requirements
            </h2>
            <div className="space-y-3">
              {course.entryRequirements.map((req, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-background/50"
                >
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Career Opportunities */}
          <Card className="p-8 bg-gradient-card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Career Opportunities
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {course.careerOpportunities.map((career, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-background/50 hover:bg-background border border-border/50 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium text-sm">{career}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Instructor Section */}
          <Card className="p-8 bg-gradient-card">
            <h2 className="text-2xl font-bold mb-6">Your Instructors</h2>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {i === 1 ? 'JD' : 'SK'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {i === 1 ? 'Dr. John Doe' : 'Dr. Sarah Khan'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {i === 1 ? 'Professor of ' + course.subcategory : 'Senior Lecturer'}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Over {i === 1 ? '15' : '12'} years of experience in {course.subcategory.toLowerCase()} 
                      with multiple publications and industry certifications.
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        {(4.5 + Math.random() * 0.5).toFixed(1)} rating
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {Math.floor(Math.random() * 50000) + 10000} students
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Student Reviews */}
          <Card className="p-8 bg-gradient-card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Student Reviews
            </h2>
            
            {/* Rating Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 rounded-lg bg-background/50">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-5xl font-bold">{course.rating}</span>
                  <Star className="h-8 w-8 fill-warning text-warning" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {course.enrolledStudents} reviews
                </p>
              </div>
              
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-8">{stars}★</span>
                    <Progress 
                      value={stars === 5 ? 80 : stars === 4 ? 15 : stars === 3 ? 3 : stars === 2 ? 1 : 1} 
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {stars === 5 ? '80%' : stars === 4 ? '15%' : stars === 3 ? '3%' : stars === 2 ? '1%' : '1%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {i === 1 ? 'AM' : i === 2 ? 'RP' : 'LC'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">
                            {i === 1 ? 'Alex Morgan' : i === 2 ? 'Rachel Peters' : 'Lucas Chen'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className="h-3 w-3 fill-warning text-warning" />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {i === 1 ? '2 weeks ago' : i === 2 ? '1 month ago' : '2 months ago'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {i === 1 
                          ? 'Excellent course! The instructors are knowledgeable and the content is very well structured. Highly recommend to anyone looking to advance in this field.'
                          : i === 2
                          ? 'This program exceeded my expectations. The practical approach and real-world examples made complex topics easy to understand.'
                          : 'Great learning experience. The course materials are comprehensive and the support from instructors is outstanding.'
                        }
                      </p>
                    </div>
                  </div>
                  {i < 3 && <Separator />}
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6">
              View All Reviews
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Enrollment Card */}
            <Card className="p-6 bg-gradient-card border-primary/30 shadow-glow">
              <div className="space-y-6">
                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{course.fees.tuition.split(' ')[0]}</span>
                    <span className="text-muted-foreground">{course.fees.tuition.split(' ').slice(1).join(' ')}</span>
                  </div>
                  {course.fees.installments && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Flexible payment plans available
                    </p>
                  )}
                </div>

                <Separator />

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-lg h-12 text-base font-semibold" size="lg">
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full h-11">
                    Request Information
                  </Button>
                </div>

                <Separator />

                {/* Course Includes */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm">This course includes:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <PlayCircle className="h-4 w-4 text-primary" />
                      <span>Video lectures & tutorials</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Laptop className="h-4 w-4 text-primary" />
                      <span>Access on mobile & desktop</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span>Instructor support</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Accreditation */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold mb-1">Accredited Program</p>
                    <p className="text-xs text-muted-foreground">{course.accreditation}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Stats */}
            <Card className="p-6 bg-gradient-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Course Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Skill Level</span>
                  <Badge variant="secondary">{course.level}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students Enrolled</span>
                  <span className="font-semibold">{course.enrolledStudents.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Languages</span>
                  <span className="font-semibold">English</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </Card>

            {/* Share Course */}
            <Card className="p-6 bg-gradient-card">
              <h3 className="font-semibold mb-4">Share this course</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
