import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, FileText, File as FileIcon, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileViewerProps {
  file: {
    title: string;
    file_path?: string;
    file_type: string;
    description?: string;
    _isAssignment?: boolean;
    id?: string;
    feedback?: string;
    points?: number;
    due_date?: string;
  } | null;
}

export function FileViewer({ file }: FileViewerProps) {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadFile = async () => {
    if (!file || !file.file_path) return;
    
    setLoading(true);
    try {
      const { data } = await supabase.storage
        .from("course-materials")
        .createSignedUrl(file.file_path, 3600);

      if (data?.signedUrl) {
        setFileUrl(data.signedUrl);
      }
    } catch (error: any) {
      toast.error("Failed to load file");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    if (!file || !file.file_path) return;
    
    try {
      const { data, error } = await supabase.storage
        .from("course-materials")
        .download(file.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.title;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Failed to download file");
    }
  };

  const handleSubmitAssignment = async () => {
    if (!file || !file._isAssignment || !submissionFile) {
      toast.error("Please select a file to submit");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to storage
      const fileExt = submissionFile.name.split('.').pop();
      const fileName = `${user.id}/${file.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assignment-submissions')
        .upload(fileName, submissionFile);

      if (uploadError) throw uploadError;

      // Create submission record
      const { error: submissionError } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: file.id,
          user_id: user.id,
          file_path: fileName,
          status: 'submitted'
        });

      if (submissionError) throw submissionError;

      toast.success("Assignment submitted successfully!");
      setSubmissionFile(null);
    } catch (error: any) {
      console.error("Error submitting assignment:", error);
      toast.error(error.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (file && !file._isAssignment) loadFile();
  }, [file]);

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center p-12">
          <FileIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No file selected</h3>
          <p className="text-muted-foreground">Select a file from the sidebar to view it here</p>
        </div>
      </div>
    );
  }

  // Assignment view
  if (file._isAssignment) {
    return (
      <div className="h-full overflow-y-auto p-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{file.title}</h1>
            {file.due_date && (
              <p className="text-muted-foreground">
                Due: {new Date(file.due_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            {file.points && (
              <p className="text-muted-foreground mt-1">Total Points: {file.points}</p>
            )}
          </div>

          {file.description && (
            <div className="p-4 bg-accent/50 rounded-lg">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-sm">{file.description}</p>
            </div>
          )}

          {file.feedback && (
            <div className="p-6 bg-card rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Assessment Brief</h2>
              {file.feedback.endsWith('.pdf') || file.feedback.endsWith('.doc') || file.feedback.endsWith('.docx') ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">View the assessment brief document:</p>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const { data } = await supabase.storage
                          .from("course-materials")
                          .createSignedUrl(file.feedback!, 3600);
                        if (data?.signedUrl) {
                          window.open(data.signedUrl, '_blank');
                        }
                      } catch (error) {
                        toast.error("Failed to load document");
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    View Assessment Brief
                  </Button>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {file.feedback}
                </div>
              )}
            </div>
          )}

          <div className="p-6 bg-card rounded-lg border space-y-4">
            <h2 className="text-xl font-semibold">Submit Assignment</h2>
            
            <div className="space-y-2">
              <Label htmlFor="submission-file">Upload Your Work (PDF or Word)</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('submission-file')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {submissionFile ? submissionFile.name : "Choose File"}
                </Button>
                <input
                  id="submission-file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
            </div>

            <Button 
              onClick={handleSubmitAssignment} 
              disabled={!submissionFile || submitting}
              className="w-full"
            >
              {submitting ? "Submitting..." : "Submit Assignment"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  const isPdf = file.file_type?.includes("pdf");
  const isVideo = file.file_type?.includes("video");
  const isImage = file.file_type?.includes("image");
  const isTextLesson = file.file_type?.includes("text/html");
  const isWord = file.file_type?.includes("word") || file.file_type?.includes("document");
  const isPowerpoint = file.file_type?.includes("presentation") || file.file_type?.includes("powerpoint");

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b flex items-center justify-between bg-background sticky top-0 z-10">
        <h3 className="font-semibold text-lg">{file.title}</h3>
        <Button variant="outline" size="sm" onClick={downloadFile}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {isPdf && fileUrl && (
          <iframe
            src={`${fileUrl}#view=FitH`}
            className="w-full h-full border-0"
            title={file.title}
          />
        )}
        {isVideo && fileUrl && (
          <div className="flex items-center justify-center h-full p-8">
            <video
              src={fileUrl}
              controls
              className="w-full max-w-5xl rounded-lg shadow-lg"
            />
          </div>
        )}
        {isImage && fileUrl && (
          <div className="flex items-center justify-center h-full p-8">
            <img
              src={fileUrl}
              alt={file.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
        )}
        {isTextLesson && file.description && (
          <div className="max-w-4xl mx-auto p-8">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_video]:w-full [&_video]:aspect-video [&_video]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: file.description }}
            />
          </div>
        )}
        {(isWord || isPowerpoint) && fileUrl && (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
            className="w-full h-full border-0"
            title={file.title}
          />
        )}
        {!isPdf && !isVideo && !isImage && !isTextLesson && !isWord && !isPowerpoint && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Preview not available for this file type
              </p>
              <Button onClick={downloadFile}>
                <Download className="h-4 w-4 mr-2" />
                Download to view
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
