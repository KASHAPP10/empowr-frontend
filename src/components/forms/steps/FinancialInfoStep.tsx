import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import type { FinancialInfo, CreditAssessmentData } from "@/types/empowrai";

interface FinancialInfoStepProps {
  data: Partial<CreditAssessmentData>;
  updateData: (section: keyof CreditAssessmentData, data: any) => void;
  onNext: () => void;
}

export function FinancialInfoStep({ data, updateData, onNext }: FinancialInfoStepProps) {
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>(
    data.financialInfo || {
      monthlyIncome: 0,
      currentCreditScore: 0,
      employmentStatus: 'employed',
      employmentLength: 0,
      bankAccountBalance: 0,
      monthlyExpenses: 0,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    updateData('financialInfo', financialInfo);
  }, [financialInfo, updateData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (financialInfo.monthlyIncome <= 0) {
      newErrors.monthlyIncome = "Monthly income must be greater than $0";
    }

    if (financialInfo.currentCreditScore < 300 || financialInfo.currentCreditScore > 850) {
      newErrors.currentCreditScore = "Credit score must be between 300-850";
    }

    if (financialInfo.employmentLength < 0) {
      newErrors.employmentLength = "Employment length cannot be negative";
    }

    if (financialInfo.bankAccountBalance < 0) {
      newErrors.bankAccountBalance = "Bank balance cannot be negative";
    }

    if (financialInfo.monthlyExpenses < 0) {
      newErrors.monthlyExpenses = "Monthly expenses cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const updateField = (field: keyof FinancialInfo, value: any) => {
    setFinancialInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-success";
    if (score >= 700) return "text-accent";
    if (score >= 650) return "text-warning";
    return "text-destructive";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Income Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-success" />
            <span>Income & Employment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="monthlyIncome">Monthly Income (Before Taxes) *</Label>
            <Input
              id="monthlyIncome"
              type="number"
              placeholder="5000"
              value={financialInfo.monthlyIncome || ''}
              onChange={(e) => updateField('monthlyIncome', parseFloat(e.target.value) || 0)}
              className={errors.monthlyIncome ? "border-destructive" : ""}
            />
            {errors.monthlyIncome && (
              <p className="text-sm text-destructive mt-1">{errors.monthlyIncome}</p>
            )}
            {financialInfo.monthlyIncome > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Annual: {formatCurrency(financialInfo.monthlyIncome * 12)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="employmentStatus">Employment Status *</Label>
            <Select 
              value={financialInfo.employmentStatus} 
              onValueChange={(value) => updateField('employmentStatus', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self-employed">Self-Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="employmentLength">Employment Length (Months) *</Label>
            <Input
              id="employmentLength"
              type="number"
              placeholder="24"
              value={financialInfo.employmentLength || ''}
              onChange={(e) => updateField('employmentLength', parseInt(e.target.value) || 0)}
              className={errors.employmentLength ? "border-destructive" : ""}
            />
            {errors.employmentLength && (
              <p className="text-sm text-destructive mt-1">{errors.employmentLength}</p>
            )}
            {financialInfo.employmentLength > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {Math.floor(financialInfo.employmentLength / 12)} years, {financialInfo.employmentLength % 12} months
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="monthlyExpenses">Monthly Expenses *</Label>
            <Input
              id="monthlyExpenses"
              type="number"
              placeholder="3500"
              value={financialInfo.monthlyExpenses || ''}
              onChange={(e) => updateField('monthlyExpenses', parseFloat(e.target.value) || 0)}
              className={errors.monthlyExpenses ? "border-destructive" : ""}
            />
            {errors.monthlyExpenses && (
              <p className="text-sm text-destructive mt-1">{errors.monthlyExpenses}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credit & Banking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Credit & Banking</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentCreditScore">Current Credit Score (FICO) *</Label>
            <Input
              id="currentCreditScore"
              type="number"
              placeholder="720"
              min="300"
              max="850"
              value={financialInfo.currentCreditScore || ''}
              onChange={(e) => updateField('currentCreditScore', parseInt(e.target.value) || 0)}
              className={errors.currentCreditScore ? "border-destructive" : ""}
            />
            {errors.currentCreditScore && (
              <p className="text-sm text-destructive mt-1">{errors.currentCreditScore}</p>
            )}
            {financialInfo.currentCreditScore > 0 && (
              <p className={`text-sm mt-1 font-medium ${getCreditScoreColor(financialInfo.currentCreditScore)}`}>
                {financialInfo.currentCreditScore >= 750 ? 'Excellent' :
                 financialInfo.currentCreditScore >= 700 ? 'Good' :
                 financialInfo.currentCreditScore >= 650 ? 'Fair' : 'Poor'}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bankAccountBalance">Current Bank Balance *</Label>
            <Input
              id="bankAccountBalance"
              type="number"
              placeholder="15000"
              value={financialInfo.bankAccountBalance || ''}
              onChange={(e) => updateField('bankAccountBalance', parseFloat(e.target.value) || 0)}
              className={errors.bankAccountBalance ? "border-destructive" : ""}
            />
            {errors.bankAccountBalance && (
              <p className="text-sm text-destructive mt-1">{errors.bankAccountBalance}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Overview */}
      {financialInfo.monthlyIncome > 0 && financialInfo.monthlyExpenses > 0 && (
        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span>Financial Health Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-background rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {formatCurrency(financialInfo.monthlyIncome - financialInfo.monthlyExpenses)}
                </div>
                <div className="text-sm text-muted-foreground">Monthly Surplus</div>
              </div>
              
              <div className="p-4 bg-background rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {((financialInfo.monthlyExpenses / financialInfo.monthlyIncome) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Expense Ratio</div>
              </div>
              
              <div className="p-4 bg-background rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {(financialInfo.bankAccountBalance / financialInfo.monthlyExpenses).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Months of Reserves</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
        <p className="text-sm text-foreground">
          <strong>Why we need this:</strong> Traditional financial metrics help us establish 
          your baseline creditworthiness. Our AI model will combine this with alternative 
          data to create a more complete picture of your financial health.
        </p>
      </div>
    </form>
  );
}