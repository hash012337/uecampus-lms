import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, File as FileIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileViewerProps {
  file: {
    title: string;
    file_path: string;
    file_type: string;
    description?: string;
  } | null;
}

export function FileViewer({ file }: FileViewerProps) {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const loadFile = async () => {
    if (!file) return;
    
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
    if (!file) return;
    
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

  useEffect(() => {
    if (file) loadFile();
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
              className="prose prose-lg dark:prose-invert max-w-none"
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
