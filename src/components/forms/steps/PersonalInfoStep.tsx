import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PersonalInfo, CreditAssessmentData } from "@/types/empowrai";

interface PersonalInfoStepProps {
  data: Partial<CreditAssessmentData>;
  updateData: (section: keyof CreditAssessmentData, data: any) => void;
  onNext: () => void;
}

export function PersonalInfoStep({ data, updateData, onNext }: PersonalInfoStepProps) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(
    data.personalInfo || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      ssn: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    updateData('personalInfo', personalInfo);
  }, [personalInfo, updateData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!personalInfo.firstName.trim()) newErrors.firstName = "First name is required";
    if (!personalInfo.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!personalInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) newErrors.email = "Invalid email format";
    
    if (!personalInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!personalInfo.ssn.trim()) newErrors.ssn = "SSN is required";
    
    if (!personalInfo.address.street.trim()) newErrors.street = "Street address is required";
    if (!personalInfo.address.city.trim()) newErrors.city = "City is required";
    if (!personalInfo.address.state.trim()) newErrors.state = "State is required";
    if (!personalInfo.address.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const updateField = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPersonalInfo(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setPersonalInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={personalInfo.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className={errors.firstName ? "border-destructive" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={personalInfo.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className={errors.lastName ? "border-destructive" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={personalInfo.dateOfBirth}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              className={errors.dateOfBirth ? "border-destructive" : ""}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-destructive mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ssn">Social Security Number *</Label>
            <Input
              id="ssn"
              type="password"
              placeholder="XXX-XX-XXXX"
              value={personalInfo.ssn}
              onChange={(e) => updateField('ssn', e.target.value)}
              className={errors.ssn ? "border-destructive" : ""}
            />
            {errors.ssn && (
              <p className="text-sm text-destructive mt-1">{errors.ssn}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={personalInfo.address.street}
              onChange={(e) => updateField('address.street', e.target.value)}
              className={errors.street ? "border-destructive" : ""}
            />
            {errors.street && (
              <p className="text-sm text-destructive mt-1">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={personalInfo.address.city}
                onChange={(e) => updateField('address.city', e.target.value)}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={personalInfo.address.state}
                onChange={(e) => updateField('address.state', e.target.value)}
                className={errors.state ? "border-destructive" : ""}
              />
              {errors.state && (
                <p className="text-sm text-destructive mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input
                id="zipCode"
                value={personalInfo.address.zipCode}
                onChange={(e) => updateField('address.zipCode', e.target.value)}
                className={errors.zipCode ? "border-destructive" : ""}
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Privacy Notice:</strong> Your personal information is encrypted and secure. 
          We use this data solely for credit assessment purposes and never share it with 
          unauthorized parties.
        </p>
      </div>
    </form>
  );
}