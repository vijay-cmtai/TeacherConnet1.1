import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header"; // Assuming you have a Header component
import Footer from "@/components/Footer"; // Assuming you have a Footer component
import { Search, Mail, Phone, ChevronDown } from "lucide-react";

// --- DUMMY DATA FOR FAQs ---
const faqData = [
  {
    category: "Account Management",
    questions: [
      {
        q: "How do I reset my password?",
        a: 'To reset your password, go to the Sign In page and click the "Forgot Password" link. Enter your email address, and we will send you a link to create a new password.',
      },
      {
        q: "How can I change my email address?",
        a: 'You can change your email address in the "Settings" section of your profile. Navigate to My Profile > Settings > Account and you will find the option to update your email.',
      },
      {
        q: "How do I delete my account?",
        a: 'To delete your account, please go to the "Privacy Centre" from your profile menu. You will find an option for account deletion. Please note that this action is permanent and cannot be undone.',
      },
    ],
  },
  {
    category: "Applying for Jobs",
    questions: [
      {
        q: "How do I track my job applications?",
        a: 'You can view the status of all your submitted applications in the "My Jobs" section of your profile. It will show you if your application has been viewed or if there are any updates.',
      },
      {
        q: "What happens after I apply for a job?",
        a: "After you apply, the school or institution will review your profile and resume. If they are interested, they will contact you directly through the contact information provided in your profile.",
      },
      {
        q: "Can I withdraw an application?",
        a: "Currently, you cannot withdraw an application once it has been submitted. We recommend only applying for positions you are genuinely interested in.",
      },
    ],
  },
  {
    category: "Profile and CV",
    questions: [
      {
        q: "How do I upload or update my CV/resume?",
        a: 'You can manage your CV in the "My Profile" section. Look for the "Upload CV" or "Update Resume" button to upload a new document.',
      },
      {
        q: "What information should I include in my profile?",
        a: "For the best results, make sure your profile is complete. This includes your contact details, educational background, teaching experience, certifications, and a professional profile picture.",
      },
    ],
  },
];

// A simple, self-contained Accordion component
const FaqAccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-2"
      >
        <span className="font-medium text-gray-800">{question}</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600 leading-relaxed">{answer}</div>
      )}
    </div>
  );
};

// The main Help Page component
const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the FAQs based on the search term (case-insensitive)
  const filteredFaqData = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto py-16 px-4 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Help Center
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Find answers to your questions and get the support you need.
            </p>
            {/* Search Bar */}
            <div className="mt-8 max-w-lg mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a question..."
                  className="block w-full h-12 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="space-y-10">
            {filteredFaqData.length > 0 ? (
              filteredFaqData.map((category) => (
                <div key={category.category}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {category.category}
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-lg">
                    {category.questions.map((q, index) => (
                      <FaqAccordionItem
                        key={index}
                        question={q.q}
                        answer={q.a}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800">
                  No results found
                </h3>
                <p className="mt-2 text-gray-500">
                  Try a different search term or check out our contact options
                  below.
                </p>
              </div>
            )}
          </div>

          {/* Contact Us Section */}
          <div className="mt-20 text-center border-t border-gray-200 pt-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Still need help?
            </h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              If you can't find the answer you're looking for, please feel free
              to reach out to our support team.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Mail size={32} className="mx-auto text-primary" />
                <h3 className="mt-4 text-xl font-semibold">Email Support</h3>
                <p className="mt-2 text-gray-500">
                  Send us an email and we'll get back to you soon.
                </p>
                <a
                  href="mailto:support@teacherconnect.com"
                  className="mt-4 inline-block text-primary font-medium hover:underline"
                >
                  support@teacherconnect.com
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Phone size={32} className="mx-auto text-primary" />
                <h3 className="mt-4 text-xl font-semibold">Phone Support</h3>
                <p className="mt-2 text-gray-500">
                  Talk to our team for immediate assistance.
                </p>
                <a
                  href="tel:+911234567890"
                  className="mt-4 inline-block text-primary font-medium hover:underline"
                >
                  +91 123-456-7890
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;
