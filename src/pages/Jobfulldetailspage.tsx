import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header"; // Assuming you have these components
import Footer from "@/components/Footer"; // Assuming you have these components
import { MapPin, Briefcase, Clock, ChevronRight, Building } from "lucide-react";

// --- DUMMY DATA IS NOW INSIDE THIS FILE ---

// 1. Define the structure of a Job object with TypeScript
interface Job {
  id: number;
  title: string;
  school: string; // Or Company Name
  location: string;
  salary: string;
  employmentType: string;
  experienceRequired: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

// 2. Create the dummy data array. This page will use this data.
const jobs: Job[] = [
  {
    id: 1,
    title: "TGT Geography",
    school: "City Children's Academy",
    location: "Chhibramau, Uttar Pradesh",
    salary: "₹30,000 - ₹35,000 a month",
    employmentType: "Full-Time",
    experienceRequired: "2 Years",
    description:
      "We are seeking a passionate and qualified TGT Geography teacher to join our dedicated team. The ideal candidate will have strong knowledge of geographical concepts and the ability to engage students effectively in a positive and dynamic classroom environment.",
    responsibilities: [
      "Develop and implement engaging lesson plans.",
      "Assess and evaluate student performance.",
      "Maintain a disciplined and supportive classroom.",
      "Collaborate with colleagues and parents.",
      "Participate in school events and activities.",
    ],
    qualifications: [
      "Bachelor's degree in Geography.",
      "B.Ed or equivalent teaching certification.",
      "Minimum 2 years of teaching experience.",
      "Excellent communication and interpersonal skills.",
    ],
  },
  {
    id: 2,
    title: "Software Engineer",
    school: "Innovatech Solutions",
    location: "Bengaluru, Karnataka",
    salary: "₹8,22,225 per year",
    employmentType: "Full-Time",
    experienceRequired: "1-2 Years",
    description:
      "We are seeking enthusiastic and skilled Software Engineers with 1-2 years of experience to join our dynamic team. The ideal candidates should have a strong foundation in React.js, Node.js, and be ready to contribute to both web and mobile application development.",
    responsibilities: [
      "Develop and maintain web applications using React.js and Node.js.",
      "Collaborate with UI/UX designers to implement responsive interfaces.",
      "Integrate RESTful APIs and manage backend services.",
      "Write clean, efficient, and maintainable code.",
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or a related field.",
      "1-2 years of hands-on experience with React.js and Node.js.",
      "Proficiency in JavaScript, HTML, CSS.",
      "Familiarity with version control systems like Git.",
    ],
  },
  {
    id: 3,
    title: "Primary School Teacher",
    school: "St. Mary's Convent School",
    location: "Mumbai, Maharashtra",
    salary: "From ₹35,000 a month",
    employmentType: "Full-Time",
    experienceRequired: "1-2 Years",
    description:
      "We are looking for a dedicated and creative Primary School Teacher who can create a nurturing and stimulating learning environment for young learners. You will be responsible for teaching all subjects to students in grades 1-3.",
    responsibilities: [
      "Create a fun and interactive learning atmosphere.",
      "Teach basic literacy, numeracy, and other subjects.",
      "Monitor the social and emotional development of children.",
    ],
    qualifications: [
      "Graduate with a Diploma in Elementary Education (D.El.Ed).",
      "Experience working with young children is preferred.",
      "Patient, energetic, and creative personality.",
    ],
  },
];

// --- HELPER COMPONENTS ---

/**
 * A reusable card component for the right-hand column,
 * styled like your provided image.
 */
const InfoCard = ({ job }: { job: Job }) => (
  <div className="sticky top-24">
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
        <p className="text-lg text-primary font-semibold mt-2">{job.salary}</p>
      </div>
      <Link
        to="#" // This would link to all openings for that company
        className="block border-t border-gray-200 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <div className="flex justify-between items-center">
          <span>Job openings</span>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </Link>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h4>
      <div className="space-y-4 text-sm">
        <div className="flex items-center text-gray-600">
          <Briefcase size={16} className="mr-3 text-gray-400 flex-shrink-0" />
          <span>{job.employmentType}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="mr-3 text-gray-400 flex-shrink-0" />
          <span>{job.experienceRequired} Experience</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin size={16} className="mr-3 text-gray-400 flex-shrink-0" />
          <span>{job.location}</span>
        </div>
      </div>
    </div>
  </div>
);

/**
 * The main component for the full job details page.
 */
const JobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const job = jobs.find((j) => j.id.toString() === jobId);

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center p-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Job Not Found</h1>
            <p className="text-gray-500 mt-2">
              The job you're looking for might have expired or been removed.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90"
            >
              Back to All Jobs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Main Job Content */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  {job.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500">
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span className="font-medium text-primary hover:underline cursor-pointer">
                      {job.school}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <button className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors font-semibold flex-shrink-0">
                Apply Now
              </button>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* This 'prose' class from @tailwindcss/typography handles the text styling */}
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="lead">{job.description}</p>

              <h3 className="font-bold mt-8">Key Responsibilities:</h3>
              <ul>
                {job.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="font-bold mt-8">
                Required Skills and Qualifications:
              </h3>
              <ul>
                {job.qualifications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Info Card */}
          <div className="lg:col-span-1">
            <InfoCard job={job} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetailPage;
