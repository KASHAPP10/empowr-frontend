import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Car, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AlternativeIncome, CreditAssessmentData } from "@/types/empowrai";

interface AlternativeIncomeStepProps {
  data: Partial<CreditAssessmentData>;
  updateData: (section: keyof CreditAssessmentData, data: any) => void;
  onNext: () => void;
}

const GIG_PLATFORMS = [
  'Uber', 'Lyft', 'DoorDash', 'Grubhub', 'Instacart', 'TaskRabbit', 
  'Fiverr', 'Upwork', 'Amazon Flex', 'Shipt', 'Postmates', 'Other'
];

const BUSINESS_TYPES = [
  'E-commerce', 'Consulting', 'Freelance Services', 'Retail', 
  'Food Service', 'Technology', 'Healthcare', 'Education', 'Other'
];

export function AlternativeIncomeStep({ data, updateData, onNext }: AlternativeIncomeStepProps) {
  const [altIncome, setAltIncome] = useState<AlternativeIncome>(
    data.alternativeIncome || {
      gig_work: {
        platforms: [],
        monthlyIncome: 0,
        averageRating: 0,
        yearsActive: 0,
        consistency: 'medium',
      },
      business: {
        hasBusinessRevenue: false,
        monthlyRevenue: 0,
        businessType: '',
        yearsInBusiness: 0,
        seasonality: 'none',
      },
      otherIncome: {
        sources: [],
        monthlyAmount: 0,
      },
    }
  );

  const [newPlatform, setNewPlatform] = useState('');
  const [newIncomeSource, setNewIncomeSource] = useState('');

  useEffect(() => {
    updateData('alternativeIncome', altIncome);
  }, [altIncome, updateData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const addPlatform = (platform: string) => {
    if (platform && !altIncome.gig_work.platforms.includes(platform)) {
      setAltIncome(prev => ({
        ...prev,
        gig_work: {
          ...prev.gig_work,
          platforms: [...prev.gig_work.platforms, platform]
        }
      }));
    }
  };

  const removePlatform = (platform: string) => {
    setAltIncome(prev => ({
      ...prev,
      gig_work: {
        ...prev.gig_work,
        platforms: prev.gig_work.platforms.filter(p => p !== platform)
      }
    }));
  };

  const addIncomeSource = () => {
    if (newIncomeSource && !altIncome.otherIncome.sources.includes(newIncomeSource)) {
      setAltIncome(prev => ({
        ...prev,
        otherIncome: {
          ...prev.otherIncome,
          sources: [...prev.otherIncome.sources, newIncomeSource]
        }
      }));
      setNewIncomeSource('');
    }
  };

  const removeIncomeSource = (source: string) => {
    setAltIncome(prev => ({
      ...prev,
      otherIncome: {
        ...prev.otherIncome,
        sources: prev.otherIncome.sources.filter(s => s !== source)
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gig Work Income */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Car className="w-5 h-5 text-secondary" />
            <span>Gig Work & Platform Income</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Platforms You Work On</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {altIncome.gig_work.platforms.map(platform => (
                <Badge key={platform} variant="secondary" className="flex items-center space-x-1">
                  <span>{platform}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removePlatform(platform)}
                  />
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {GIG_PLATFORMS.map(platform => (
                <Button
                  key={platform}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPlatform(platform)}
                  disabled={altIncome.gig_work.platforms.includes(platform)}
                  className="justify-start"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {platform}
                </Button>
              ))}
            </div>
          </div>

          {altIncome.gig_work.platforms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gigIncome">Monthly Gig Income</Label>
                <Input
                  id="gigIncome"
                  type="number"
                  placeholder="1200"
                  value={altIncome.gig_work.monthlyIncome || ''}
                  onChange={(e) => setAltIncome(prev => ({
                    ...prev,
                    gig_work: { ...prev.gig_work, monthlyIncome: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="averageRating">Average Rating (1-5)</Label>
                <Input
                  id="averageRating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  placeholder="4.8"
                  value={altIncome.gig_work.averageRating || ''}
                  onChange={(e) => setAltIncome(prev => ({
                    ...prev,
                    gig_work: { ...prev.gig_work, averageRating: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="yearsActive">Years Active</Label>
                <Input
                  id="yearsActive"
                  type="number"
                  placeholder="2"
                  value={altIncome.gig_work.yearsActive || ''}
                  onChange={(e) => setAltIncome(prev => ({
                    ...prev,
                    gig_work: { ...prev.gig_work, yearsActive: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>

              <div>
                <Label>Income Consistency</Label>
                <Select
                  value={altIncome.gig_work.consistency}
                  onValueChange={(value: any) => setAltIncome(prev => ({
                    ...prev,
                    gig_work: { ...prev.gig_work, consistency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (Same every month)</SelectItem>
                    <SelectItem value="medium">Medium (Some variation)</SelectItem>
                    <SelectItem value="low">Low (Highly variable)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Income */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <span>Business Revenue</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="hasBusiness"
              checked={altIncome.business.hasBusinessRevenue}
              onCheckedChange={(checked) => setAltIncome(prev => ({
                ...prev,
                business: { ...prev.business, hasBusinessRevenue: checked }
              }))}
            />
            <Label htmlFor="hasBusiness">I have business revenue</Label>
          </div>

          {altIncome.business.hasBusinessRevenue && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessRevenue">Monthly Business Revenue</Label>
                <Input
                  id="businessRevenue"
                  type="number"
                  placeholder="3000"
                  value={altIncome.business.monthlyRevenue || ''}
                  onChange={(e) => setAltIncome(prev => ({
                    ...prev,
                    business: { ...prev.business, monthlyRevenue: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>

              <div>
                <Label>Business Type</Label>
                <Select
                  value={altIncome.business.businessType}
                  onValueChange={(value) => setAltIncome(prev => ({
                    ...prev,
                    business: { ...prev.business, businessType: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                <Input
                  id="yearsInBusiness"
                  type="number"
                  placeholder="3"
                  value={altIncome.business.yearsInBusiness || ''}
                  onChange={(e) => setAltIncome(prev => ({
                    ...prev,
                    business: { ...prev.business, yearsInBusiness: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>

              <div>
                <Label>Revenue Seasonality</Label>
                <Select
                  value={altIncome.business.seasonality}
                  onValueChange={(value: any) => setAltIncome(prev => ({
                    ...prev,
                    business: { ...prev.business, seasonality: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No seasonal variation</SelectItem>
                    <SelectItem value="low">Low seasonal impact</SelectItem>
                    <SelectItem value="high">High seasonal impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Income Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-accent" />
            <span>Other Income Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Additional Income Sources</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                placeholder="e.g., Rental income, Investments, Royalties"
                value={newIncomeSource}
                onChange={(e) => setNewIncomeSource(e.target.value)}
              />
              <Button type="button" onClick={addIncomeSource} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {altIncome.otherIncome.sources.map(source => (
                <Badge key={source} variant="outline" className="flex items-center space-x-1">
                  <span>{source}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeIncomeSource(source)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {altIncome.otherIncome.sources.length > 0 && (
            <div>
              <Label htmlFor="otherIncomeAmount">Monthly Amount from Other Sources</Label>
              <Input
                id="otherIncomeAmount"
                type="number"
                placeholder="500"
                value={altIncome.otherIncome.monthlyAmount || ''}
                onChange={(e) => setAltIncome(prev => ({
                  ...prev,
                  otherIncome: { ...prev.otherIncome, monthlyAmount: parseFloat(e.target.value) || 0 }
                }))}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Income Summary */}
      {(altIncome.gig_work.monthlyIncome > 0 || altIncome.business.monthlyRevenue > 0 || altIncome.otherIncome.monthlyAmount > 0) && (
        <Card className="bg-success/10 border-success/20">
          <CardHeader>
            <CardTitle className="text-lg text-success">Alternative Income Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-secondary">
                  ${altIncome.gig_work.monthlyIncome.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Gig Work</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-primary">
                  ${altIncome.business.monthlyRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Business</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-accent">
                  ${altIncome.otherIncome.monthlyAmount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Other Sources</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-background rounded-lg text-center">
              <div className="text-3xl font-bold text-success">
                ${(altIncome.gig_work.monthlyIncome + altIncome.business.monthlyRevenue + altIncome.otherIncome.monthlyAmount).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Alternative Income</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
        <p className="text-sm text-foreground">
          <strong>Why this matters:</strong> Alternative income sources demonstrate your 
          entrepreneurial spirit and income diversification. Our AI model values platform 
          ratings, consistency, and business growth as positive indicators of creditworthiness.
        </p>
      </div>
    </form>
  );
}
