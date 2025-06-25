import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, BrainCircuit, Briefcase, ChevronRight } from 'lucide-react';

// --- DUMMY CANDIDATE DATA ---
const candidates = [
  {
    id: 1,
    name: 'Priya Sharma',
    title: 'Senior Physics Teacher (PGT)',
    location: 'New Delhi, Delhi',
    experience: '8 Years',
    summary: 'Dedicated and experienced PGT Physics teacher with a passion for making complex concepts accessible. Proven ability to improve student scores and engagement.',
    skills: ['Physics', 'CBSE Curriculum', 'Lab Management', 'Online Teaching'],
  },
  {
    id: 2,
    name: 'Amit Kumar',
    title: 'Software Engineer & Coding Instructor',
    location: 'Bengaluru, Karnataka',
    experience: '5 Years',
    summary: 'Full-stack software engineer with a knack for teaching. Specializes in Python, JavaScript, and mentoring students for competitive programming.',
    skills: ['Python', 'JavaScript', 'React.js', 'Student Mentoring'],
  },
  {
    id: 3,
    name: 'Sunita Menon',
    title: 'Primary School Coordinator',
    location: 'Mumbai, Maharashtra',
    experience: '12 Years',
    summary: 'Highly organized Primary School Coordinator with extensive experience in curriculum development and teacher training. Focused on creating a nurturing learning environment.',
    skills: ['Curriculum Development', 'Teacher Training', 'Child Psychology', 'ICSE'],
  },
  {
    id: 4,
    name: 'Rohan Verma',
    title: 'Mathematics Teacher (TGT)',
    location: 'Pune, Maharashtra',
    experience: '6 Years',
    summary: 'Enthusiastic Mathematics TGT with a talent for using technology to create interactive and engaging lesson plans. Strong command of algebra and geometry.',
    skills: ['Mathematics', 'EdTech Tools', 'Algebra', 'Problem Solving'],
  },
  {
    id: 5,
    name: 'Anjali Desai',
    title: 'English Language and Literature Teacher',
    location: 'Hyderabad, Telangana',
    experience: '10 Years',
    summary: 'Creative and resourceful English teacher specializing in literature and creative writing. Aims to foster a lifelong love for reading in students.',
    skills: ['English Literature', 'Creative Writing', 'Public Speaking', 'Grammar'],
  },
];

const FindCVsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const filteredCandidates = candidates.filter(candidate => 
    (candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (candidate.location.toLowerCase().includes(location.toLowerCase()))
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header and Search Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Find Your Next Great Hire</h1>
          <p className="mt-4 text-xl text-gray-600">
            Search our database of qualified and passionate educators.
          </p>
          <form className="mt-8 max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label htmlFor="search-term" className="block text-left text-sm font-medium text-gray-700">Role or Skill</label>
              <Input
                id="search-term"
                type="text"
                placeholder="e.g., 'Physics Teacher' or 'Python'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 h-12"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-left text-sm font-medium text-gray-700">Location</label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., 'New Delhi'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 h-12"
              />
            </div>
            <Button type="submit" className="md:col-span-2 h-12 text-base font-bold">
              <Search className="mr-2 h-5 w-5" /> Search Candidates
            </Button>
          </form>
        </div>

        {/* Candidate List */}
        <div className="space-y-6">
          {filteredCandidates.map(candidate => (
            <Link to={`/candidate/${candidate.id}`} key={candidate.id} className="block group">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-primary hover:shadow-lg transition-all duration-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-primary group-hover:underline">{candidate.name}</h2>
                    <p className="text-md font-semibold text-gray-800">{candidate.title}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <ChevronRight className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-4 sm:gap-6 text-gray-600 text-sm">
                  <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-gray-400" /> {candidate.location}</div>
                  <div className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-gray-400" /> {candidate.experience} of experience</div>
                </div>
                <p className="mt-4 text-gray-500 text-sm">{candidate.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindCVsPage;