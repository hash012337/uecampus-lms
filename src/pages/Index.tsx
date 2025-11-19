import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to auth page as the main entry
  return <Navigate to="/auth" replace />;
};

export default Index;
