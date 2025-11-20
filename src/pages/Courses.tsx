import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Star, Clock, Users, ChevronRight } from "lucide-react";
import { allCoursesData } from "@/data/coursesData";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ImportCoursesButton } from "@/components/ImportCoursesButton";
import { useEditMode } from "@/contexts/EditModeContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin } = useEditMode();
  const { user } = useAuth();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) loadEnrolledCourses();
  }, [user]);

  const loadEnrolledCourses = async () => {
    if (!user) return;
    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (roleData) {
      setEnrolledCourseIds(allCoursesData.map(c => c.id));
      return;
    }
    const { data: enrollments } = await supabase.from("enrollments").select("course_id").eq("user_id", user.id).eq("status", "active");
    if (enrollments) setEnrolledCourseIds(enrollments.map(e => e.course_id));
  };
  
  const filteredCourses = allCoursesData.filter(course => enrolledCourseIds.includes(course.id)).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Course Catalog</h1>
          <p className="text-muted-foreground mt-1">Explore your enrolled courses</p>
        </div>
        {isAdmin && <ImportCoursesButton />}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map(course => (
          <Link key={course.id} to={`/courses/${course.id}`}>
            <Card className="h-full p-6 hover:shadow-xl transition-all">
              <Badge className="mb-2">{course.category}</Badge>
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
              <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.enrolledStudents}</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3" />{course.rating}</span>
              </div>
              <Button className="w-full">View Details <ChevronRight className="h-4 w-4 ml-2" /></Button>
            </Card>
          </Link>
        ))}
        {filteredCourses.length === 0 && (
          <Card className="p-12 text-center col-span-full">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">{isAdmin ? "Try adjusting your search" : "You haven't been enrolled yet"}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
