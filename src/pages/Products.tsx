import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ChevronDown, PenSquare, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import EmployerHeader from "@/components/EmployerHeader"; // Reusable Header

// --- [NEW] Reusable component for the feature sections ---
const FeatureBlock = ({
  title,
  descriptionNode,
  visualNode,
  imagePosition = "right",
}: {
  title: string;
  descriptionNode: React.ReactNode;
  visualNode: React.ReactNode;
  imagePosition?: "left" | "right";
}) => {
  const imageClass = imagePosition === "left" ? "lg:order-1" : "lg:order-2";
  const textClass = imagePosition === "left" ? "lg:order-2" : "lg:order-1";

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className={textClass}>
        <h3 className="text-3xl font-bold text-slate-800">{title}</h3>
        <div className="mt-4 text-lg text-slate-600 leading-relaxed">
          {descriptionNode}
        </div>
      </div>
      <div className={imageClass}>{visualNode}</div>
    </div>
  );
};

// --- [NEW] Form Field Component for the contact form ---
const FormField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  required = true,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  children?: React.ReactNode;
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-slate-700 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children || (
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
);

// --- Main Products Page Component ---
const Products = () => {
  return (
    <div className="bg-white min-h-screen text-slate-800">
      <EmployerHeader />

      <main>
        {/* --- HERO SECTION --- */}
        <section className="pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Matching and hiring made easy
                </h1>
                <p className="mt-4 text-xl font-semibold text-slate-700">
                  Products for small businesses
                </p>
                <p className="mt-4 text-lg text-slate-600">
                  We have all the tools you need to find the right talent and to
                  start hiring today.
                </p>
                <div className="mt-8">
                  <Button
                    size="lg"
                    className="font-bold text-lg bg-[#2557a7] hover:bg-[#204a8d]"
                  >
                    Post a job
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img
                  src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="A professional looking happy for a job"
                  className="rounded-lg object-cover w-full h-full max-h-[450px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- "START WITH A FREE JOB POST" SECTION --- */}
        <section className="py-20 sm:py-24 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Start with a free job post
                <sup className="text-lg font-normal text-slate-500 ml-1">
                  [1]
                </sup>
              </h2>
              <div className="mt-4 w-24 h-1 bg-[#2557a7] mx-auto"></div>
            </div>
            <div className="mt-20 space-y-24">
              <FeatureBlock
                title="Search templates for any industry"
                descriptionNode={
                  <p>
                    Craft the perfect job post with one of our templates and an{" "}
                    <a
                      href="#"
                      className="text-[#2557a7] font-semibold hover:underline"
                    >
                      attention-grabbing job description.
                    </a>
                  </p>
                }
                visualNode={
                  <div className="relative h-72 flex items-center justify-center">
                    <div
                      className="absolute -right-1/4 -bottom-1/4 w-full h-full bg-cyan-50"
                      style={{ clipPath: "circle(50% at 80% 80%)" }}
                    ></div>
                    <div
                      className="relative w-full h-full bg-[#0d2d5e] rounded-3xl"
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% 100%, 25% 100%, 0 75%)",
                      }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 space-y-3">
                        <div className="bg-white p-3 rounded-lg shadow-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-slate-700">
                              Financial Analyst
                            </p>
                            <p className="text-xs text-slate-500">Mumbai</p>
                          </div>
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-slate-700">
                              Software Engineer
                            </p>
                            <p className="text-xs text-slate-500">Hyderabad</p>
                          </div>
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
              <FeatureBlock
                title="Add screenings"
                descriptionNode={
                  <p>
                    Screen potential applicants using your exact requirements.
                  </p>
                }
                imagePosition="left"
                visualNode={
                  <div className="relative h-72 flex items-center justify-center">
                    <div
                      className="absolute -left-1/4 -bottom-1/4 w-full h-full bg-cyan-50"
                      style={{ clipPath: "circle(50% at 20% 80%)" }}
                    ></div>
                    <div
                      className="relative w-full h-full bg-[#0d2d5e] rounded-3xl p-6"
                      style={{
                        clipPath:
                          "polygon(0 0, 75% 0, 100% 25%, 100% 100%, 0 100%)",
                      }}
                    >
                      <div className="bg-white p-4 rounded-lg shadow-2xl h-full">
                        <h4 className="text-sm font-bold text-slate-700 mb-4">
                          Screening questions{" "}
                          <span className="text-slate-400 font-normal">
                            (Pick up to 5)
                          </span>
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="form-radio text-blue-600"
                            />
                            <span>Years of experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="form-radio text-blue-600"
                            />
                            <span>Education</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="form-radio text-blue-600"
                            />
                            <span>Language</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              className="form-radio text-blue-600"
                            />
                            <span>Location</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
              <FeatureBlock
                title="Start to finish hiring, all in one place"
                descriptionNode={
                  <p>
                    Your first job post lands you on your dashboard, your single
                    source for managing all of your candidates and jobs. Track,
                    message, invite, and interview directly on Indeed with no
                    apps to download and flexible pricing options when you’re
                    ready to increase your reach.
                  </p>
                }
                visualNode={
                  <div className="relative h-72 flex items-center justify-center">
                    <div
                      className="absolute w-full h-full bg-cyan-50"
                      style={{ clipPath: "ellipse(70% 60% at 50% 50%)" }}
                    ></div>
                    <div className="relative w-[80%] h-full bg-[#0d2d5e] rounded-3xl p-4">
                      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-2xl h-full space-y-2 overflow-hidden">
                        <h4 className="text-sm font-bold text-slate-700">
                          Applicants
                        </h4>
                        <div className="p-2 rounded bg-white flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-green-500" />
                          <span>Matched candidates</span>
                        </div>
                        <div className="p-2 rounded bg-white flex items-center gap-2">
                          <PenSquare className="w-4 h-4 text-blue-500" />
                          <span>Awaiting review</span>
                        </div>
                        <div className="p-2 rounded bg-white flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-slate-500" />
                          <span>Reviewed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </section>

        {/* --- "UPGRADE" SECTION --- */}
        <section className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Upgrade to reach more quality candidates
              </h2>
              <div className="mt-4 w-24 h-1 bg-[#2557a7] mx-auto"></div>
            </div>
            <div className="mt-20 space-y-24">
              <FeatureBlock
                title="Get better visibility"
                descriptionNode={
                  <p>
                    When you{" "}
                    <a
                      href="#"
                      className="text-[#2557a7] font-semibold hover:underline"
                    >
                      sponsor your job
                    </a>
                    , you receive higher visibility for relevant search results.
                    Pause, resume, or cancel a Sponsored Job anytime, which
                    means more flexibility if you’re hiring in a competitive
                    market, or have a hard-to-fill position.
                  </p>
                }
                visualNode={
                  <div className="bg-slate-200 p-8 rounded-2xl">
                    <img
                      src="https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Team collaborating"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                }
              />
              <FeatureBlock
                title="Get access to matched candidates"
                descriptionNode={
                  <p>
                    With a{" "}
                    <a
                      href="#"
                      className="text-[#2557a7] font-semibold hover:underline"
                    >
                      subscription to Smart Sourcing
                    </a>
                    , see matching candidates who match your posted job
                    description and qualifications. If you like the
                    qualifications you see, then contact the candidates you like
                    or invite them to apply.
                  </p>
                }
                imagePosition="left"
                visualNode={
                  <div className="relative h-72 flex items-center justify-center">
                    <img
                      src="https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Person working on laptop"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute -top-4 -left-8 w-48 bg-white p-3 rounded-lg shadow-2xl space-y-1">
                      <h5 className="font-bold text-sm">Abhinav Saini</h5>
                      <p className="text-xs text-slate-500">Data Scientist</p>
                      <Button
                        size="sm"
                        className="w-full text-xs bg-[#2557a7] hover:bg-[#204a8d]"
                      >
                        Invite to apply
                      </Button>
                    </div>
                    <div className="absolute -bottom-4 -right-8 w-48 bg-white p-3 rounded-lg shadow-2xl space-y-1">
                      <h5 className="font-bold text-sm">Radhika Bhargava</h5>
                      <p className="text-xs text-slate-500">UX Designer</p>
                      <Button
                        size="sm"
                        className="w-full text-xs bg-[#2557a7] hover:bg-[#204a8d]"
                      >
                        Invite to apply
                      </Button>
                    </div>
                  </div>
                }
              />
              <FeatureBlock
                title="See Indeed Smart Sourcing in action"
                descriptionNode={
                  <p>
                    Try Indeed Smart Sourcing now with{" "}
                    <a
                      href="#"
                      className="text-[#2557a7] font-semibold hover:underline"
                    >
                      a plan that works for you
                    </a>
                    . When you post a job, your Indeed Smart Sourcing
                    subscription gives you access to matched candidates.
                  </p>
                }
                visualNode={
                  <div className="bg-slate-200 p-8 rounded-2xl">
                    <img
                      src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Team in a meeting"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                }
              />
            </div>
          </div>
        </section>

        {/* --- CONTACT FORM SECTION --- */}
        <section className="py-20 sm:py-24 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Try Indeed Smart Sourcing now
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              See real candidates searching for jobs on Indeed.
            </p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="First name" name="firstName" />
              <FormField label="Last name" name="lastName" />
              <FormField label="Phone number" name="phone" type="tel" />
              <FormField label="Business email" name="email" type="email" />
              <FormField label="Country/Region" name="country">
                <select
                  id="country"
                  name="country"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>India</option>
                </select>
              </FormField>
              <FormField label="Company name" name="companyName" />
              <FormField label="Company size" name="companySize">
                <select
                  id="companySize"
                  name="companySize"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Company size...</option>
                </select>
              </FormField>
              <FormField label="Job title" name="jobTitle">
                <select
                  id="jobTitle"
                  name="jobTitle"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Title...</option>
                </select>
              </FormField>
              <div className="md:col-span-2">
                <FormField
                  label="Number of roles to fill"
                  name="roles"
                  type="number"
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  label="How can we help you?"
                  name="help"
                  required={false}
                >
                  <textarea
                    id="help"
                    name="help"
                    rows={4}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </FormField>
              </div>
            </form>
            <p className="text-xs text-slate-500 mt-6">
              By submitting your information, you acknowledge that it will be
              handled in accordance with Indeed's Privacy Policy and Terms.
              Indeed India Operations (Poy) Ltd. will use the email you provide
              to us to send you marketing emails about our services.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              To object to receiving such marketing emails you can do so here:{" "}
              <a href="#" className="text-[#2557a7] underline">
                email preferences page
              </a>
              . You may also opt-out from receiving marketing emails by
              following the unsubscribe link provided in each of our messages.
            </p>
            <div className="flex items-start gap-2 mt-6">
              <input
                type="checkbox"
                id="marketingCalls"
                name="marketingCalls"
                className="mt-1"
              />
              <label
                htmlFor="marketingCalls"
                className="text-xs text-slate-500"
              >
                I agree to receive marketing calls from Indeed about its
                services. Please notify the caller if you do not wish to receive
                any further phone calls.
              </label>
            </div>
            <div className="mt-6">
              <Button
                size="lg"
                className="font-bold bg-[#2557a7] hover:bg-[#204a8d]"
              >
                Submit
              </Button>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="bg-[#0d2d5e] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-extrabold">Ready to try Indeed?</h2>
            <p className="mt-2 text-xl text-slate-300">
              Your next team member is looking for you, too!
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="font-bold bg-white text-[#0d2d5e] hover:bg-slate-100"
              >
                Post a job
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Products;