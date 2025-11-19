import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to dashboard page as the main entry
  return <Navigate to="/dashboard" replace />;
};

export default Index;
