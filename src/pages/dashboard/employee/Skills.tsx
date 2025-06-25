
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Plus, Edit, Trash2, Award, BookOpen, Calendar, MapPin } from 'lucide-react';

const Skills = () => {
  const [skills] = useState([
    { id: 1, name: 'Mathematics', level: 'Expert', verified: true },
    { id: 2, name: 'Physics', level: 'Advanced', verified: true },
    { id: 3, name: 'Chemistry', level: 'Intermediate', verified: false },
    { id: 4, name: 'Classroom Management', level: 'Expert', verified: true },
    { id: 5, name: 'Digital Teaching Tools', level: 'Advanced', verified: false },
  ]);

  const [qualifications] = useState([
    {
      id: 1,
      degree: 'Master of Education (M.Ed)',
      institution: 'Delhi University',
      year: '2018',
      grade: '8.5 CGPA',
      specialization: 'Mathematics Education'
    },
    {
      id: 2,
      degree: 'Bachelor of Science (B.Sc)',
      institution: 'St. Stephen\'s College',
      year: '2016',
      grade: '85%',
      specialization: 'Mathematics'
    },
    {
      id: 3,
      degree: 'B.Ed (Bachelor of Education)',
      institution: 'Jamia Millia Islamia',
      year: '2017',
      grade: '82%',
      specialization: 'Secondary Education'
    }
  ]);

  const [experience] = useState([
    {
      id: 1,
      position: 'Senior Mathematics Teacher',
      school: 'Delhi Public School, Vasant Kunj',
      duration: 'Aug 2020 - Present',
      location: 'New Delhi',
      responsibilities: [
        'Teaching Mathematics to grades 9-12',
        'Preparing students for competitive exams',
        'Mentoring junior teachers',
        'Developing innovative teaching methodologies'
      ],
      achievements: [
        '95% pass rate in board examinations',
        'Teacher of the Year Award 2023',
        'Implemented digital learning tools'
      ]
    },
    {
      id: 2,
      position: 'Mathematics Teacher',
      school: 'Modern School, Barakhamba Road',
      duration: 'July 2018 - July 2020',
      location: 'New Delhi',
      responsibilities: [
        'Teaching Mathematics to grades 6-10',
        'Conducting remedial classes',
        'Parent-teacher coordination',
        'Organizing math competitions'
      ],
      achievements: [
        '90% student satisfaction rating',
        'Improved average class performance by 25%',
        'Best New Teacher Award 2019'
      ]
    }
  ]);

  const [certifications] = useState([
    {
      id: 1,
      name: 'Certified Mathematics Educator',
      issuedBy: 'National Board of Education',
      issueDate: 'March 2023',
      expiryDate: 'March 2026',
      credentialId: 'CME-2023-1234'
    },
    {
      id: 2,
      name: 'Digital Teaching Certification',
      issuedBy: 'Google for Education',
      issueDate: 'January 2022',
      expiryDate: 'January 2025',
      credentialId: 'GFE-2022-5678'
    },
    {
      id: 3,
      name: 'Child Psychology Certification',
      issuedBy: 'IGNOU',
      issueDate: 'September 2021',
      expiryDate: 'Lifetime',
      credentialId: 'CPC-2021-9012'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Skills & Experience</h1>
          <p className="text-muted-foreground">Manage your professional skills, qualifications, and experience</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Teaching Skills
          </CardTitle>
          <CardDescription>Your professional teaching competencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-medium">{skill.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={skill.level === 'Expert' ? 'default' : skill.level === 'Advanced' ? 'secondary' : 'outline'}>
                        {skill.level}
                      </Badge>
                      {skill.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add New Skill
          </Button>
        </CardContent>
      </Card>

      {/* Qualifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Educational Qualifications
          </CardTitle>
          <CardDescription>Your academic credentials and degrees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualifications.map((qual) => (
              <div key={qual.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">{qual.degree}</h4>
                    <p className="text-muted-foreground">{qual.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{qual.year}</p>
                    <p className="text-sm text-muted-foreground">{qual.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{qual.specialization}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Qualification
          </Button>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Teaching Experience
          </CardTitle>
          <CardDescription>Your professional teaching experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{exp.position}</h4>
                    <p className="text-muted-foreground">{exp.school}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Key Responsibilities:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {exp.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Key Achievements:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      {/* Certifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Certifications & Licenses
          </CardTitle>
          <CardDescription>Your professional certifications and teaching licenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">{cert.issuedBy}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Issued:</span> {cert.issueDate}</p>
                  <p><span className="font-medium">Expires:</span> {cert.expiryDate}</p>
                  <p><span className="font-medium">ID:</span> {cert.credentialId}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Skills;
