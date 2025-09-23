import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, Home, Zap, CreditCard } from "lucide-react";
import type { PaymentReliability, CreditAssessmentData } from "@/types/empowrai";

interface PaymentReliabilityStepProps {
  data: Partial<CreditAssessmentData>;
  updateData: (section: keyof CreditAssessmentData, data: any) => void;
  onNext: () => void;
}

export function PaymentReliabilityStep({ data, updateData, onNext }: PaymentReliabilityStepProps) {
  const [paymentInfo, setPaymentInfo] = useState<PaymentReliability>(
    data.paymentReliability || {
      rent: {
        monthlyAmount: 0,
        onTimePercentage: 100,
        yearsAtAddress: 0,
      },
      utilities: {
        onTimePercentage: 100,
        averageMonthlyAmount: 0,
      },
      otherRecurring: [],
    }
  );

  const [newPayment, setNewPayment] = useState({
    type: '',
    onTimePercentage: 100,
    monthlyAmount: 0
  });

  useEffect(() => {
    updateData('paymentReliability', paymentInfo);
  }, [paymentInfo, updateData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const addRecurringPayment = () => {
    if (newPayment.type.trim()) {
      setPaymentInfo(prev => ({
        ...prev,
        otherRecurring: [...prev.otherRecurring, { ...newPayment }]
      }));
      setNewPayment({ type: '', onTimePercentage: 100, monthlyAmount: 0 });
    }
  };

  const removeRecurringPayment = (index: number) => {
    setPaymentInfo(prev => ({
      ...prev,
      otherRecurring: prev.otherRecurring.filter((_, i) => i !== index)
    }));
  };

  const getReliabilityColor = (percentage: number) => {
    if (percentage >= 95) return "text-success";
    if (percentage >= 85) return "text-accent";
    if (percentage >= 75) return "text-warning";
    return "text-destructive";
  };

  const getReliabilityLabel = (percentage: number) => {
    if (percentage >= 95) return "Excellent";
    if (percentage >= 85) return "Good";
    if (percentage >= 75) return "Fair";
    return "Poor";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rent Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Home className="w-5 h-5 text-primary" />
            <span>Rent Payment History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="rentAmount">Monthly Rent</Label>
            <Input
              id="rentAmount"
              type="number"
              placeholder="1500"
              value={paymentInfo.rent.monthlyAmount || ''}
              onChange={(e) => setPaymentInfo(prev => ({
                ...prev,
                rent: { ...prev.rent, monthlyAmount: parseFloat(e.target.value) || 0 }
              }))}
            />
          </div>

          <div>
            <Label htmlFor="rentOnTime">On-Time Payment Rate (%)</Label>
            <Input
              id="rentOnTime"
              type="number"
              min="0"
              max="100"
              placeholder="95"
              value={paymentInfo.rent.onTimePercentage || ''}
              onChange={(e) => setPaymentInfo(prev => ({
                ...prev,
                rent: { ...prev.rent, onTimePercentage: parseFloat(e.target.value) || 0 }
              }))}
            />
            {paymentInfo.rent.onTimePercentage > 0 && (
              <p className={`text-sm mt-1 font-medium ${getReliabilityColor(paymentInfo.rent.onTimePercentage)}`}>
                {getReliabilityLabel(paymentInfo.rent.onTimePercentage)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="yearsAtAddress">Years at Current Address</Label>
            <Input
              id="yearsAtAddress"
              type="number"
              placeholder="2"
              value={paymentInfo.rent.yearsAtAddress || ''}
              onChange={(e) => setPaymentInfo(prev => ({
                ...prev,
                rent: { ...prev.rent, yearsAtAddress: parseFloat(e.target.value) || 0 }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Utility Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="w-5 h-5 text-secondary" />
            <span>Utility Payment History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="utilityOnTime">On-Time Payment Rate (%)</Label>
            <Input
              id="utilityOnTime"
              type="number"
              min="0"
              max="100"
              placeholder="98"
              value={paymentInfo.utilities.onTimePercentage || ''}
              onChange={(e) => setPaymentInfo(prev => ({
                ...prev,
                utilities: { ...prev.utilities, onTimePercentage: parseFloat(e.target.value) || 0 }
              }))}
            />
            {paymentInfo.utilities.onTimePercentage > 0 && (
              <p className={`text-sm mt-1 font-medium ${getReliabilityColor(paymentInfo.utilities.onTimePercentage)}`}>
                {getReliabilityLabel(paymentInfo.utilities.onTimePercentage)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="utilityAmount">Average Monthly Utilities</Label>
            <Input
              id="utilityAmount"
              type="number"
              placeholder="150"
              value={paymentInfo.utilities.averageMonthlyAmount || ''}
              onChange={(e) => setPaymentInfo(prev => ({
                ...prev,
                utilities: { ...prev.utilities, averageMonthlyAmount: parseFloat(e.target.value) || 0 }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Recurring Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-accent" />
            <span>Other Recurring Payments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Add Other Regular Payments (insurance, subscriptions, etc.)</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
              <Input
                placeholder="Payment type"
                value={newPayment.type}
                onChange={(e) => setNewPayment(prev => ({ ...prev, type: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Monthly amount"
                value={newPayment.monthlyAmount || ''}
                onChange={(e) => setNewPayment(prev => ({ ...prev, monthlyAmount: parseFloat(e.target.value) || 0 }))}
              />
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="On-time %"
                value={newPayment.onTimePercentage || ''}
                onChange={(e) => setNewPayment(prev => ({ ...prev, onTimePercentage: parseFloat(e.target.value) || 0 }))}
              />
              <Button type="button" onClick={addRecurringPayment} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {paymentInfo.otherRecurring.length > 0 && (
            <div className="space-y-2">
              <Label>Your Recurring Payments</Label>
              {paymentInfo.otherRecurring.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{payment.type}</div>
                    <div className="text-sm text-muted-foreground">
                      ${payment.monthlyAmount}/month • {payment.onTimePercentage}% on-time
                    </div>
                  </div>
                  <Badge className={getReliabilityColor(payment.onTimePercentage)}>
                    {getReliabilityLabel(payment.onTimePercentage)}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRecurringPayment(index)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Reliability Summary */}
      {paymentInfo.rent.monthlyAmount > 0 && (
        <Card className="bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Payment Reliability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg">
                <div className={`text-3xl font-bold ${getReliabilityColor(paymentInfo.rent.onTimePercentage)}`}>
                  {paymentInfo.rent.onTimePercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Rent Payments</div>
              </div>

              <div className="text-center p-4 bg-background rounded-lg">
                <div className={`text-3xl font-bold ${getReliabilityColor(paymentInfo.utilities.onTimePercentage)}`}>
                  {paymentInfo.utilities.onTimePercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Utility Payments</div>
              </div>

              <div className="text-center p-4 bg-background rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {paymentInfo.rent.yearsAtAddress}
                </div>
                <div className="text-sm text-muted-foreground">Years Stability</div>
              </div>
            </div>

            {paymentInfo.otherRecurring.length > 0 && (
              <div className="mt-4">
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {paymentInfo.otherRecurring.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Additional Payment History Sources</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
        <p className="text-sm text-foreground">
          <strong>Alternative Credit Data:</strong> Rent and utility payment history are
          powerful indicators of financial responsibility. Unlike traditional credit reports,
          these payments show real-world financial behavior and stability.
        </p>
      </div>
    </form>
  );
}
