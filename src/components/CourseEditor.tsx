import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload, FileText, Video, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface Section {
  id: string;
  title: string;
  description: string;
  materials: Material[];
}

interface Material {
  id: string;
  title: string;
  file?: File;
  fileType: string;
}

interface CourseEditorProps {
  courseId: string;
  onSave: () => void;
}

export function CourseEditor({ courseId, onSave }: CourseEditorProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const addSection = () => {
    if (!newSectionTitle.trim()) {
      toast.error("Please enter a section title");
      return;
    }
    const newSection: Section = {
      id: Date.now().toString(),
      title: newSectionTitle,
      description: "",
      materials: []
    };
    setSections([...sections, newSection]);
    setNewSectionTitle("");
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const updateSection = (sectionId: string, field: keyof Section, value: string) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, [field]: value } : s));
  };

  const addMaterial = (sectionId: string, file: File) => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      title: file.name,
      file,
      fileType: file.type
    };
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, materials: [...s.materials, newMaterial] }
        : s
    ));
  };

  const deleteMaterial = (sectionId: string, materialId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, materials: s.materials.filter(m => m.id !== materialId) }
        : s
    ));
  };

  const saveCourse = async () => {
    setSaving(true);
    try {
      // Save sections and materials to database
      for (const section of sections) {
        const { data: sectionData, error: sectionError } = await supabase
          .from("course_sections")
          .insert({
            course_id: courseId,
            title: section.title,
            description: section.description,
            order_index: sections.indexOf(section)
          })
          .select()
          .single();

        if (sectionError) throw sectionError;

        // Upload materials
        for (const material of section.materials) {
          if (material.file) {
            const filePath = `${courseId}/${sectionData.id}/${material.file.name}`;
            const { error: uploadError } = await supabase.storage
              .from("course-materials")
              .upload(filePath, material.file);

            if (uploadError) throw uploadError;

            const { error: materialError } = await supabase
              .from("course_materials")
              .insert({
                course_id: courseId,
                section_id: sectionData.id,
                title: material.title,
                file_path: filePath,
                file_type: material.fileType,
                file_size: material.file.size,
                order_index: section.materials.indexOf(material)
              });

            if (materialError) throw materialError;
          }
        }
      }

      toast.success("Course content saved successfully");
      onSave();
    } catch (error: any) {
      toast.error(error.message || "Failed to save course content");
    } finally {
      setSaving(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("video")) return <Video className="h-4 w-4" />;
    if (fileType.includes("pdf")) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="New section title"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
        />
        <Button onClick={addSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {sections.map((section) => (
        <Card key={section.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(section.id, "title", e.target.value)}
                  placeholder="Section title"
                />
                <Textarea
                  value={section.description}
                  onChange={(e) => updateSection(section.id, "description", e.target.value)}
                  placeholder="Section description"
                  rows={2}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSection(section.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Materials</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addMaterial(section.id, file);
                  }}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.avi,.mov"
                />
              </div>
              <div className="space-y-2">
                {section.materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-2 bg-secondary rounded">
                    <div className="flex items-center gap-2">
                      {getFileIcon(material.fileType)}
                      <span className="text-sm">{material.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMaterial(section.id, material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={saveCourse} disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Course Content"}
      </Button>
    </div>
  );
}
