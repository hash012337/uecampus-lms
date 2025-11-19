import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to courses page as the main dashboard
  return <Navigate to="/courses" replace />;
};

export default Index;
