import { supabase } from "@/integrations/supabase/client";
import { allCoursesData } from "@/data/coursesData";

export async function importCoursesToDatabase() {
  try {
    console.log(`Starting import of ${allCoursesData.length} courses...`);

    // Transform the courses data to match the database schema
    const coursesToInsert = allCoursesData.map((course) => ({
      id: course.id,
      code: course.code,
      title: course.title,
      category: course.category,
      subcategory: course.subcategory,
      level: course.level,
      duration: course.duration,
      mode: course.mode,
      partner: course.partner,
      description: course.description,
      overview: course.overview,
      tuition: course.fees.tuition,
      installments: course.fees.installments,
      accreditation: course.accreditation,
      learning_outcomes: course.learningOutcomes,
      modules: course.modules,
      entry_requirements: course.entryRequirements,
      career_opportunities: course.careerOpportunities,
      rating: course.rating,
      enrolled_students: course.enrolledStudents,
      status: "active",
      progress: 0,
    }));

    // Insert courses in batches to avoid timeout
    const batchSize = 10;
    for (let i = 0; i < coursesToInsert.length; i += batchSize) {
      const batch = coursesToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from("courses")
        .upsert(batch, { onConflict: "id" });

      if (error) {
        console.error(`Error importing batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      console.log(`Imported batch ${i / batchSize + 1} of ${Math.ceil(coursesToInsert.length / batchSize)}`);
    }

    console.log(`Successfully imported ${allCoursesData.length} courses!`);
    return { success: true, count: allCoursesData.length };
  } catch (error) {
    console.error("Error importing courses:", error);
    return { success: false, error };
  }
}
