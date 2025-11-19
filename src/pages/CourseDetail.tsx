import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar
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
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link to="/courses">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      {/* Header Section */}
      <Card className="p-8 bg-gradient-card border-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono">
                  {course.code}
                </Badge>
                <Badge>{course.level}</Badge>
                <Badge variant="outline">{course.category}</Badge>
                {course.partner && (
                  <Badge className="bg-accent/20 text-accent border-accent/50">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {course.partner}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              
              <p className="text-lg text-muted-foreground">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{course.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{course.enrolledStudents} students enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
              </div>
            </div>

            <div className="md:w-72">
              <Card className="p-6 bg-background/80 backdrop-blur space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tuition Fees</span>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{course.fees.tuition}</p>
                  {course.fees.installments && (
                    <p className="text-xs text-muted-foreground">
                      💳 Installment plans available
                    </p>
                  )}
                </div>
                
                <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                  Enroll Now
                </Button>
                
                <Button variant="outline" className="w-full">
                  Request Information
                </Button>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{course.accreditation}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="career">Career Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Program Overview
            </h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {course.overview}
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-card">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Program Level
              </h4>
              <p className="text-muted-foreground">{course.level}</p>
            </Card>

            <Card className="p-6 bg-gradient-card">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Subcategory
              </h4>
              <p className="text-muted-foreground">{course.subcategory}</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Course Modules
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {course.modules.map((module, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-sm pt-1">{module}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Learning Outcomes
            </h3>
            <div className="space-y-3">
              {course.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{outcome}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Entry Requirements
            </h3>
            <div className="space-y-3">
              {course.entryRequirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm pt-0.5">{requirement}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="space-y-4">
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Career Opportunities
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {course.careerOpportunities.map((career, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 hover:border-primary/50 border border-transparent transition-all"
                >
                  <Briefcase className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{career}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <Card className="p-8 bg-gradient-primary text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
        <p className="text-muted-foreground mb-6">
          Join {course.enrolledStudents} students already enrolled in this program
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
            Enroll Now
          </Button>
          <Button size="lg" variant="outline">
            Download Brochure
          </Button>
        </div>
      </Card>
    </div>
  );
}
