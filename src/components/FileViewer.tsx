import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Video, File as FileIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileViewerProps {
  file: {
    title: string;
    file_path: string;
    file_type: string;
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
      <Card className="h-full flex items-center justify-center">
        <div className="text-center p-12">
          <FileIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No file selected</h3>
          <p className="text-muted-foreground">Select a file from the sidebar to view it here</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p>Loading...</p>
      </Card>
    );
  }

  const isPdf = file.file_type?.includes("pdf");
  const isVideo = file.file_type?.includes("video");
  const isImage = file.file_type?.includes("image");

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">{file.title}</h3>
        <Button variant="outline" size="sm" onClick={downloadFile}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {isPdf && fileUrl && (
          <iframe
            src={fileUrl}
            className="w-full h-full min-h-[600px] border-0"
            title={file.title}
          />
        )}
        {isVideo && fileUrl && (
          <video
            src={fileUrl}
            controls
            className="w-full h-auto max-h-[600px]"
          />
        )}
        {isImage && fileUrl && (
          <img
            src={fileUrl}
            alt={file.title}
            className="w-full h-auto"
          />
        )}
        {!isPdf && !isVideo && !isImage && (
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
        )}
      </div>
    </Card>
  );
}
