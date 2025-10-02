import { Header } from "@/components/layout/Header";
import { AssessmentForm } from "@/components/forms/AssessmentForm";

const Assessment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AssessmentForm />
    </div>
  );
};

export default Assessment;