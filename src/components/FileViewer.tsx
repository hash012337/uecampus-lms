import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, File as FileIcon, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FileViewerProps {
  file: {
    title: string;
    file_path?: string;
    file_type: string;
    description?: string;
    _isAssignment?: boolean;
    _isQuiz?: boolean;
    _isBrief?: boolean;
    quiz_url?: string;
    assessment_brief?: string;
    id?: string;
    feedback?: string;
    points?: number;
    passing_marks?: number;
    due_date?: string;
  } | null;
}

export function FileViewer({ file }: FileViewerProps) {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);

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
      console.error("File load error:", error);
      toast.error("Failed to load file");
    } finally {
      setLoading(false);
    }
  };

  const loadUserSubmissions = async () => {
    if (!file || !file._isAssignment) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', file.id)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setUserSubmissions(data || []);
    } catch (error: any) {
      console.error("Error loading submissions:", error);
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
      loadUserSubmissions(); // Reload submissions
    } catch (error: any) {
      console.error("Error submitting assignment:", error);
      toast.error(error.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string, filePath: string) => {
    if (!confirm("Delete this submission?")) return;
    
    try {
      // Delete from storage
      await supabase.storage
        .from('assignment-submissions')
        .remove([filePath]);

      // Delete from database
      const { error } = await supabase
        .from('assignment_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('Submission deleted');
      loadUserSubmissions();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || 'Failed to delete submission');
    }
  };

  useEffect(() => {
    if (file && !file._isAssignment && !file._isQuiz && !file._isBrief) {
      loadFile();
    }
    if (file && file._isAssignment) {
      loadUserSubmissions();
    }
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

  // Quiz view
  if (file._isQuiz && file.quiz_url) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-4 border-b bg-card">
          <h2 className="text-2xl font-bold">{file.title}</h2>
          {file.description && (
            <p className="text-muted-foreground mt-1">{file.description}</p>
          )}
        </div>
        <div className="flex-1">
          <iframe 
            src={file.quiz_url} 
            className="w-full h-full border-0"
            title={file.title}
            allow="fullscreen"
          />
        </div>
      </div>
    );
  }

  // Assignment Brief view
  if (file._isBrief) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{file.title}</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Brief</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{file.assessment_brief || file.description}</p>
              </div>
              {file.file_path && (
                <div className="mt-4 pt-4 border-t">
                  <Button onClick={downloadFile} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Brief Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Assignment view
  if (file._isAssignment) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{file.title}</h2>
            {file.description && (
              <p className="text-muted-foreground">{file.description}</p>
            )}
            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <span className="font-semibold">Total Marks:</span> {file.points}
              </div>
              <div>
                <span className="font-semibold">Passing Marks:</span> {file.passing_marks}
              </div>
              {file.due_date && (
                <div>
                  <span className="font-semibold">Due:</span> {new Date(file.due_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Submissions Section */}
          {userSubmissions.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Submissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userSubmissions.map((submission) => (
                  <div key={submission.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Status:</span>
                          <Badge variant={submission.status === 'submitted' ? 'default' : 'secondary'}>
                            {submission.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-semibold">Submitted:</span> {new Date(submission.submitted_at).toLocaleString()}
                        </div>
                        {submission.marks_obtained !== null && (
                          <div className="text-sm">
                            <span className="font-semibold">Grade:</span> {submission.marks_obtained}/{file.points}
                          </div>
                        )}
                        {submission.feedback && (
                          <div className="text-sm">
                            <span className="font-semibold">Feedback:</span> {submission.feedback}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubmission(submission.id, submission.file_path)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Submit Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Choose File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button 
                onClick={handleSubmitAssignment} 
                disabled={!submissionFile || submitting}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {submitting ? "Submitting..." : "Submit Assignment"}
              </Button>
            </CardContent>
          </Card>
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
