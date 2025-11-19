import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { importCoursesToDatabase } from "@/scripts/importCourses";

export function ImportCoursesButton() {
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setImporting(true);
    toast.info("Starting course import...");
    
    try {
      const result = await importCoursesToDatabase();
      
      if (result.success) {
        toast.success(`Successfully imported ${result.count} courses!`);
      } else {
        toast.error("Failed to import courses. Check console for details.");
      }
    } catch (error) {
      toast.error("An error occurred during import.");
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Button
      onClick={handleImport}
      disabled={importing}
      variant="outline"
      className="gap-2"
    >
      {importing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Importing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Import All Courses
        </>
      )}
    </Button>
  );
}
