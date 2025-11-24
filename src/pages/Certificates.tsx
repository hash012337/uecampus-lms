import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Calendar, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ueCampusLogo from "@/assets/ue-campus-logo.png";

export default function Certificates() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [certificateUsers, setCertificateUsers] = useState<Record<string, any>>({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      loadCertificates();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    
    if (data) {
      setIsAdmin(true);
      loadCoursesAndUsers();
    }
  };

  const loadCoursesAndUsers = async () => {
    const { data: coursesData } = await supabase
      .from("courses")
      .select("*")
      .order("title");
    
    if (coursesData) setCourses(coursesData);

    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name");
    
    if (usersData) setUsers(usersData);
  };

  const loadCertificates = async () => {
    if (!user) return;

    const query = supabase
      .from("certificates" as any)
      .select(`
        *,
        courses(title, code)
      `)
      .order("issued_date", { ascending: false });

    if (!isAdmin) {
      query.eq("user_id", user.id);
    }

    const { data } = await query;
    if (data) {
      setCertificates(data);
      
      // Load user profiles for all certificate holders
      const userIds = [...new Set(data.map((cert: any) => cert.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);
      
      if (profilesData) {
        const usersMap: Record<string, any> = {};
        profilesData.forEach((profile: any) => {
          usersMap[profile.id] = profile;
        });
        setCertificateUsers(usersMap);
      }
    }
  };

  const handleManualGenerate = async () => {
    if (!selectedCourse || !selectedUser) {
      toast.error("Please select both course and user");
      return;
    }

    try {
      const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { error } = await supabase
        .from("certificates" as any)
        .insert({
          user_id: selectedUser,
          course_id: selectedCourse,
          certificate_number: certificateNumber,
          completion_date: new Date().toISOString(),
          generated_by: user?.id
        });

      if (error) throw error;
      
      toast.success("Certificate generated successfully");
      setGenerateDialogOpen(false);
      setSelectedCourse("");
      setSelectedUser("");
      loadCertificates();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate certificate");
    }
  };

  const downloadCertificate = async (certificate: any) => {
    const element = document.getElementById(`certificate-${certificate.id}`);
    if (!element) return;

    try {
      // Get computed styles to preserve colors
      const computedStyle = window.getComputedStyle(element);
      const bgColor = computedStyle.backgroundColor;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: bgColor || '#ffffff',
        logging: false,
        imageTimeout: 0,
        removeContainer: true
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`certificate-${certificate.certificate_number}.pdf`);
      
      toast.success("Certificate downloaded");
    } catch (error) {
      toast.error("Failed to download certificate");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certificates</h1>
          <p className="text-muted-foreground mt-1">
            View and download your course completion certificates
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Award className="mr-2 h-4 w-4" />
                Generate Certificate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Certificate Manually</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select User</label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.full_name || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Select Course</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleManualGenerate} className="w-full">
                  Generate Certificate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground">
              Complete your courses to earn certificates
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div 
                id={`certificate-${cert.id}`}
                className="relative p-12 border-8 border-double"
                style={{ 
                  minHeight: "500px",
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 50%, hsl(var(--accent) / 0.05) 100%)',
                  borderColor: 'hsl(var(--primary) / 0.2)'
                }}
              >
                {/* Decorative corner elements */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4" style={{ borderColor: 'hsl(var(--primary) / 0.3)' }} />
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4" style={{ borderColor: 'hsl(var(--primary) / 0.3)' }} />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4" style={{ borderColor: 'hsl(var(--primary) / 0.3)' }} />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4" style={{ borderColor: 'hsl(var(--primary) / 0.3)' }} />
                
                {/* Certificate content */}
                <div className="text-center space-y-6 relative z-10">
                  <div className="inline-block">
                    <img 
                      src={ueCampusLogo} 
                      alt="UE Campus Logo" 
                      className="h-24 w-auto mx-auto mb-4"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold text-foreground tracking-wide">
                      Certificate of Completion
                    </h2>
                    <div className="h-1 w-32 mx-auto" style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary)), transparent)' }} />
                  </div>

                  <div className="space-y-4 py-8">
                    <p className="text-lg text-muted-foreground">This is to certify that</p>
                    <p className="text-3xl font-bold text-foreground">
                      {certificateUsers[cert.user_id]?.full_name || certificateUsers[cert.user_id]?.email || "Student"}
                    </p>
                    <p className="text-lg text-muted-foreground">has successfully completed</p>
                    <p className="text-2xl font-semibold text-primary">
                      {cert.courses?.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Course Code: {cert.courses?.code}
                    </p>
                  </div>

                  <div className="flex justify-center gap-12 pt-8 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Issued Date</p>
                        <p className="font-semibold text-foreground">
                          {new Date(cert.issued_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Certificate Number</p>
                        <p className="font-mono text-xs font-semibold text-foreground">
                          {cert.certificate_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <div className="inline-block pt-2 px-8" style={{ borderTop: '2px solid hsl(var(--foreground) / 0.2)' }}>
                      <p className="text-sm font-semibold text-foreground">UE Campus</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4 bg-muted/30">
                <Button 
                  onClick={() => downloadCertificate(cert)}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}