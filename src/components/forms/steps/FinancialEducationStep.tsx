import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import type { FinancialEducation, CreditAssessmentData } from "@/types/empowrai";

interface FinancialEducationStepProps {
  data: Partial<CreditAssessmentData>;
  updateData: (section: keyof CreditAssessmentData, data: any) => void;
  onNext: () => void;
}

const COURSE_PROVIDERS = [
  'Coursera', 'Khan Academy', 'Udemy', 'edX', 'LinkedIn Learning',
  'Financial Planning Association', 'SCORE', 'SBA', 'Local Community College',
  'University Extension Program', 'Other'
];

const BUSINESS_PROGRAMS = [
  'SBA Training', 'SCORE Mentoring', 'Entrepreneur Bootcamp',
  'Business Plan Competition', 'Accelerator Program', 'Incubator',
  'Industry Certification', 'Professional Development', 'Other'
];

const CERTIFICATIONS = [
  'Certified Financial Planner (CFP)', 'Financial Risk Manager (FRM)',
  'Chartered Financial Analyst (CFA)', 'Personal Financial Specialist (PFS)',
  'QuickBooks Certification', 'Project Management (PMP)', 
  'Industry Specific Certification', 'Other'
];

export function FinancialEducationStep({ data, updateData, onNext }: FinancialEducationStepProps) {
  const [finEducation, setFinEducation] = useState<FinancialEducation>(
    data.financialEducation || {
      courses: [],
      businessTraining: {
        programs: [],
        hoursCompleted: 0,
      },
      financialLiteracy: {
        selfAssessed: 7,
        certifications: [],
      },
    }
  );

  const [newCourse, setNewCourse] = useState({
    name: '',
    provider: '',
    completionDate: '',
    certificateUrl: ''
  });

  const [newProgram, setNewProgram] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    updateData('financialEducation', finEducation);
  }, [finEducation, updateData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const addCourse = () => {
    if (newCourse.name.trim() && newCourse.provider.trim()) {
      setFinEducation(prev => ({
        ...prev,
        courses: [...prev.courses, { ...newCourse }]
      }));
      setNewCourse({ name: '', provider: '', completionDate: '', certificateUrl: '' });
    }
  };

  const removeCourse = (index: number) => {
    setFinEducation(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const addProgram = (program: string) => {
    if (program && !finEducation.businessTraining.programs.includes(program)) {
      setFinEducation(prev => ({
        ...prev,
        businessTraining: {
          ...prev.businessTraining,
          programs: [...prev.businessTraining.programs, program]
        }
      }));
    }
  };

  const removeProgram = (program: string) => {
    setFinEducation(prev => ({
      ...prev,
      businessTraining: {
        ...prev.businessTraining,
        programs: prev.businessTraining.programs.filter(p => p !== program)
      }
    }));
  };

  const addCertification = (cert: string) => {
    if (cert && !finEducation.financialLiteracy.certifications.includes(cert)) {
      setFinEducation(prev => ({
        ...prev,
        financialLiteracy: {
          ...prev.financialLiteracy,
          certifications: [...prev.financialLiteracy.certifications, cert]
        }
      }));
    }
  };

  const removeCertification = (cert: string) => {
    setFinEducation(prev => ({
      ...prev,
      financialLiteracy: {
        ...prev.financialLiteracy,
        certifications: prev.financialLiteracy.certifications.filter(c => c !== cert)
      }
    }));
  };

  const getEducationScore = () => {
    const courseScore = Math.min(finEducation.courses.length * 3, 15);
    const programScore = Math.min(finEducation.businessTraining.programs.length * 2, 10);
    const hoursScore = Math.min(finEducation.businessTraining.hoursCompleted / 10, 10);
    const certScore = Math.min(finEducation.financialLiteracy.certifications.length * 5, 20);
    const selfAssessScore = finEducation.financialLiteracy.selfAssessed;
    
    return Math.round(courseScore + programScore + hoursScore + certScore + selfAssessScore);
  };

  const getLiteracyLevel = (score: number) => {
    if (score >= 8) return { label: "Expert", color: "text-success" };
    if (score >= 6) return { label: "Advanced", color: "text-primary" };
    if (score >= 4) return { label: "Intermediate", color: "text-accent" };
    if (score >= 2) return { label: "Basic", color: "text-warning" };
    return { label: "Beginner", color: "text-muted-foreground" };
  };

  const literacyLevel = getLiteracyLevel(finEducation.financialLiteracy.selfAssessed);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Financial Literacy Self-Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Financial Literacy Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="selfAssessed">
              Rate Your Financial Knowledge (1-10 scale)
            </Label>
            <div className="flex items-center space-x-4 mt-2">
              <Input
                id="selfAssessed"
                type="range"
                min="1"
                max="10"
                value={finEducation.financialLiteracy.selfAssessed}
                onChange={(e) => setFinEducation(prev => ({
                  ...prev,
                  financialLiteracy: { 
                    ...prev.financialLiteracy, 
                    selfAssessed: parseInt(e.target.value) 
                  }
                }))}
                className="flex-1"
              />
              <div className="w-20 text-center">
                <div className={`text-2xl font-bold ${literacyLevel.color}`}>
                  {finEducation.financialLiteracy.selfAssessed}
                </div>
                <div className={`text-xs ${literacyLevel.color}`}>
                  {literacyLevel.label}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 text-xs text-muted-foreground mt-2">
              <div>1-2: Beginner</div>
              <div>3-4: Basic</div>
              <div>5-6: Intermediate</div>
              <div>7-8: Advanced</div>
              <div>9-10: Expert</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-secondary" />
            <span>Financial Courses & Training</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Add Financial Course or Training</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Input
                  placeholder="Course name"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  placeholder="Provider/Institution"
                  value={newCourse.provider}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, provider: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={newCourse.completionDate}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, completionDate: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Certificate URL (optional)"
                  value={newCourse.certificateUrl}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, certificateUrl: e.target.value }))}
                />
                <Button type="button" onClick={addCourse} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Course Provider Quick Add */}
          <div>
            <Label>Popular Course Providers</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {COURSE_PROVIDERS.map(provider => (
                <Button
                  key={provider}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewCourse(prev => ({ ...prev, provider }))}
                  className="justify-start text-xs"
                >
                  {provider}
                </Button>
              ))}
            </div>
          </div>

          {/* Course List */}
          {finEducation.courses.length > 0 && (
            <div className="space-y-2">
              <Label>Your Completed Courses ({finEducation.courses.length})</Label>
              {finEducation.courses.map((course, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{course.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {course.provider} • {course.completionDate}
                    </div>
                    {course.certificateUrl && (
                      <div className="text-xs text-primary mt-1">
                        Certificate available
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCourse(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Training */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <span>Business Development Training</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Business Training Programs</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {finEducation.businessTraining.programs.map(program => (
                <Badge key={program} variant="secondary" className="flex items-center space-x-1">
                  <span>{program}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeProgram(program)}
                  />
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {BUSINESS_PROGRAMS.map(program => (
                <Button
                  key={program}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addProgram(program)}
                  disabled={finEducation.businessTraining.programs.includes(program)}
                  className="justify-start text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {program}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="trainingHours">Total Training Hours Completed</Label>
            <Input
              id="trainingHours"
              type="number"
              min="0"
              placeholder="120"
              value={finEducation.businessTraining.hoursCompleted || ''}
              onChange={(e) => setFinEducation(prev => ({
                ...prev,
                businessTraining: { 
                  ...prev.businessTraining, 
                  hoursCompleted: parseInt(e.target.value) || 0 
                }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Financial & Business Certifications</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {finEducation.financialLiteracy.certifications.map(cert => (
                <Badge key={cert} variant="outline" className="flex items-center space-x-1">
                  <span>{cert}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeCertification(cert)}
                  />
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CERTIFICATIONS.map(cert => (
                <Button
                  key={cert}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCertification(cert)}
                  disabled={finEducation.financialLiteracy.certifications.includes(cert)}
                  className="justify-start text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {cert}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Score Summary */}
      <Card className="bg-success/10 border-success/20">
        <CardHeader>
          <CardTitle className="text-lg text-success">Financial Education Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-success mb-2">
              {getEducationScore()}/70
            </div>
            <div className="text-muted-foreground mb-4">
              Based on courses, training, certifications, and self-assessment
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {finEducation.courses.length}
                </div>
                <div className="text-xs text-muted-foreground">Courses</div>
              </div>
              
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {finEducation.businessTraining.programs.length}
                </div>
                <div className="text-xs text-muted-foreground">Programs</div>
              </div>
              
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {finEducation.businessTraining.hoursCompleted}
                </div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {finEducation.financialLiteracy.certifications.length}
                </div>
                <div className="text-xs text-muted-foreground">Certifications</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="bg-success/10 p-4 rounded-lg border border-success/20">
        <p className="text-sm text-foreground">
          <strong>Education Impact:</strong> Financial education and business training demonstrate 
          your commitment to improving financial management skills. This proactive approach to 
          learning is a strong positive indicator for creditworthiness.
        </p>
      </div>
    </form>
  );
}