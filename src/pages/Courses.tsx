import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Star, 
  Clock, 
  Users,
  GraduationCap,
  Award,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allCoursesData, courseCategories } from "@/data/coursesData";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ImportCoursesButton } from "@/components/ImportCoursesButton";
import { useEditMode } from "@/contexts/EditModeContext";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { isAdmin } = useEditMode();
  
  const filteredCourses = allCoursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Course Catalog</h1>
            <p className="text-muted-foreground mt-1">
              Explore our comprehensive collection of {allCoursesData.length} programs
            </p>
          </div>
          {isAdmin && <ImportCoursesButton />}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-all duration-300"
          />
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card 
          onClick={() => setSelectedCategory("all")}
          className={`p-4 cursor-pointer transition-all duration-300 ${
            selectedCategory === "all" 
              ? "bg-gradient-primary border-primary shadow-glow" 
              : "bg-gradient-card border-border/50 hover:border-primary/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">📖</div>
            <div>
              <p className="text-2xl font-bold">{allCoursesData.length}</p>
              <p className="text-xs text-muted-foreground">All Courses</p>
            </div>
          </div>
        </Card>
        
        {courseCategories.map((category) => (
          <Card 
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`p-4 cursor-pointer transition-all duration-300 ${
              selectedCategory === category.name 
                ? "bg-gradient-primary border-primary shadow-glow" 
                : "bg-gradient-card border-border/50 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{category.icon}</div>
              <div>
                <p className="text-2xl font-bold">{category.count}</p>
                <p className="text-xs text-muted-foreground">{category.name}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Course Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {selectedCategory === "all" ? "All Courses" : selectedCategory}
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredCourses.length} courses
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className="p-6 h-full hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/50 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                
                <div className="relative z-10 space-y-4 h-full flex flex-col">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {course.code}
                      </Badge>
                      <Badge className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description}
                    </p>

                    {course.partner && (
                      <Badge variant="outline" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {course.partner}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.enrolledStudents}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        {course.rating}
                      </span>
                    </div>

                    <Button className="w-full bg-gradient-primary hover:opacity-90 group/btn">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="p-12 text-center bg-gradient-card">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
