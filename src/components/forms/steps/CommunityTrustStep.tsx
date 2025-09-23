import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, X, Users, Award, Heart } from "lucide-react";
import type { CommunityTrust, CreditAssessmentData } from "@/types/empowrai";

interface CommunityTrustStepProps {
  data: Partial<CreditAssessmentData>;
  updateData: (section: keyof CreditAssessmentData, data: any) => void;
  onNext: () => void;
}

const RELATIONSHIP_TYPES = [
  'Professional Colleague', 'Business Partner', 'Employer', 'Client',
  'Friend', 'Family Member', 'Neighbor', 'Community Leader'
];

export function CommunityTrustStep({ data, updateData, onNext }: CommunityTrustStepProps) {
  const [communityTrust, setCommunityTrust] = useState<CommunityTrust>(
    data.communityTrust || {
      endorsements: {
        professional: 0,
        personal: 0,
        community: 0,
      },
      references: [],
      socialCapital: {
        volunteerWork: false,
        communityInvolvement: '',
        leadershipRoles: 0,
      },
    }
  );

  const [newReference, setNewReference] = useState({
    name: '',
    relationship: '',
    yearsKnown: 0,
    contact: ''
  });

  useEffect(() => {
    updateData('communityTrust', communityTrust);
  }, [communityTrust, updateData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const addReference = () => {
    if (newReference.name.trim() && newReference.relationship.trim()) {
      setCommunityTrust(prev => ({
        ...prev,
        references: [...prev.references, { ...newReference }]
      }));
      setNewReference({ name: '', relationship: '', yearsKnown: 0, contact: '' });
    }
  };

  const removeReference = (index: number) => {
    setCommunityTrust(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const getTrustScore = () => {
    const { endorsements, references, socialCapital } = communityTrust;
    const endorsementScore = Math.min((endorsements.professional + endorsements.personal + endorsements.community) / 3, 10);
    const referenceScore = Math.min(references.length * 2, 10);
    const volunteerScore = socialCapital.volunteerWork ? 2 : 0;
    const leadershipScore = Math.min(socialCapital.leadershipRoles * 2, 6);
    const involvementScore = socialCapital.communityInvolvement.trim() ? 2 : 0;
    
    return Math.round(endorsementScore + referenceScore + volunteerScore + leadershipScore + involvementScore);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Endorsements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Award className="w-5 h-5 text-primary" />
            <span>Community Endorsements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="professionalEndorsements">Professional Endorsements</Label>
            <Input
              id="professionalEndorsements"
              type="number"
              min="0"
              placeholder="5"
              value={communityTrust.endorsements.professional || ''}
              onChange={(e) => setCommunityTrust(prev => ({
                ...prev,
                endorsements: { ...prev.endorsements, professional: parseInt(e.target.value) || 0 }
              }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              LinkedIn recommendations, professional vouches
            </p>
          </div>

          <div>
            <Label htmlFor="personalEndorsements">Personal Endorsements</Label>
            <Input
              id="personalEndorsements"
              type="number"
              min="0"
              placeholder="8"
              value={communityTrust.endorsements.personal || ''}
              onChange={(e) => setCommunityTrust(prev => ({
                ...prev,
                endorsements: { ...prev.endorsements, personal: parseInt(e.target.value) || 0 }
              }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Personal references, character vouches
            </p>
          </div>

          <div>
            <Label htmlFor="communityEndorsements">Community Endorsements</Label>
            <Input
              id="communityEndorsements"
              type="number"
              min="0"
              placeholder="3"
              value={communityTrust.endorsements.community || ''}
              onChange={(e) => setCommunityTrust(prev => ({
                ...prev,
                endorsements: { ...prev.endorsements, community: parseInt(e.target.value) || 0 }
              }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Community leader endorsements
            </p>
          </div>
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Users className="w-5 h-5 text-secondary" />
            <span>Personal & Professional References</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Add Reference</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Input
                  placeholder="Full name"
                  value={newReference.name}
                  onChange={(e) => setNewReference(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  placeholder="Relationship"
                  value={newReference.relationship}
                  onChange={(e) => setNewReference(prev => ({ ...prev, relationship: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Years known"
                  value={newReference.yearsKnown || ''}
                  onChange={(e) => setNewReference(prev => ({ ...prev, yearsKnown: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Contact (email)"
                  value={newReference.contact}
                  onChange={(e) => setNewReference(prev => ({ ...prev, contact: e.target.value }))}
                />
                <Button type="button" onClick={addReference} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {communityTrust.references.length > 0 && (
            <div className="space-y-2">
              <Label>Your References ({communityTrust.references.length})</Label>
              {communityTrust.references.map((reference, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{reference.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {reference.relationship} • {reference.yearsKnown} years • {reference.contact}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReference(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {RELATIONSHIP_TYPES.map(type => (
              <Button
                key={type}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNewReference(prev => ({ ...prev, relationship: type }))}
                className="justify-start text-xs"
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Capital */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Heart className="w-5 h-5 text-accent" />
            <span>Social Capital & Community Involvement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="volunteerWork"
              checked={communityTrust.socialCapital.volunteerWork}
              onCheckedChange={(checked) => setCommunityTrust(prev => ({
                ...prev,
                socialCapital: { ...prev.socialCapital, volunteerWork: checked }
              }))}
            />
            <Label htmlFor="volunteerWork">I regularly volunteer or do community service</Label>
          </div>

          <div>
            <Label htmlFor="communityInvolvement">Community Involvement & Activities</Label>
            <Textarea
              id="communityInvolvement"
              placeholder="Describe your community involvement, local organizations, clubs, sports teams, religious groups, etc."
              value={communityTrust.socialCapital.communityInvolvement}
              onChange={(e) => setCommunityTrust(prev => ({
                ...prev,
                socialCapital: { ...prev.socialCapital, communityInvolvement: e.target.value }
              }))}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="leadershipRoles">Number of Leadership Roles</Label>
            <Input
              id="leadershipRoles"
              type="number"
              min="0"
              placeholder="2"
              value={communityTrust.socialCapital.leadershipRoles || ''}
              onChange={(e) => setCommunityTrust(prev => ({
                ...prev,
                socialCapital: { ...prev.socialCapital, leadershipRoles: parseInt(e.target.value) || 0 }
              }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Team lead, board member, organization officer, etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Community Trust Score */}
      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Community Trust Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {getTrustScore()}/40
            </div>
            <div className="text-muted-foreground">
              Based on endorsements, references, and community involvement
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {communityTrust.endorsements.professional + communityTrust.endorsements.personal + communityTrust.endorsements.community}
                </div>
                <div className="text-xs text-muted-foreground">Total Endorsements</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-secondary">
                  {communityTrust.references.length}
                </div>
                <div className="text-xs text-muted-foreground">References</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-accent">
                  {communityTrust.socialCapital.leadershipRoles}
                </div>
                <div className="text-xs text-muted-foreground">Leadership Roles</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-success">
                  {communityTrust.socialCapital.volunteerWork ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-muted-foreground">Volunteer Work</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
        <p className="text-sm text-foreground">
          <strong>Community Trust Impact:</strong> Your social capital and community connections 
          are valuable assets that traditional credit scoring misses. Strong community ties 
          indicate stability, reliability, and social support systems.
        </p>
      </div>
    </form>
  );
}