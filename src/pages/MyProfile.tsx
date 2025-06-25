
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Edit, Save, Plus, X } from 'lucide-react';

const MyProfile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'Chicago, IL',
    title: 'Mathematics Teacher',
    bio: 'Passionate educator with 8 years of experience teaching mathematics to middle and high school students. Dedicated to creating engaging learning environments and helping students achieve their academic goals.',
    experience: '8 years',
    education: 'Master of Education in Mathematics',
    certifications: ['Illinois Teaching License', 'Mathematics Certification'],
    skills: ['Classroom Management', 'Curriculum Development', 'Student Assessment', 'Educational Technology'],
    languages: ['English', 'Spanish']
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data
    console.log('Profile saved:', profile);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skill)
    });
  };

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground">Manage your professional information</p>
              </div>
            </div>
            <Button 
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Your career and educational background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.title}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                  />
                ) : (
                  <div className="p-2 bg-muted/50 rounded">
                    <p className="text-foreground">{profile.bio}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  {isEditing ? (
                    <Select value={profile.experience} onValueChange={(value) => setProfile({...profile, experience: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5-8 years">5-8 years</SelectItem>
                        <SelectItem value="8+ years">8+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 bg-muted/50 rounded">
                      <span>{profile.experience}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  {isEditing ? (
                    <Input
                      id="education"
                      value={profile.education}
                      onChange={(e) => setProfile({...profile, education: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.education}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills and Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Certifications</CardTitle>
              <CardDescription>Highlight your expertise and qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeSkill(skill)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Label>Certifications</Label>
                <div className="space-y-2">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Badge variant="outline">{cert}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language, index) => (
                    <Badge key={index} variant="outline">{language}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
