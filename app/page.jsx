import React from "react";
import {
  Video,
  Phone,
  Calendar,
  Shield,
  Clock,
  Award,
  Star,
  Heart,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const Care9jaLogo = () => (
  <Link href={"/"} className="flex items-center">
    <span className="text-3xl font-bold">
      <span className="text-sky-600">Care</span>
      <span className="text-sky-800">9ja</span>
    </span>
  </Link>
);

const LandingPage = () => {
  const testimonials = [
    {
      name: "Dr. Adebayo Johnson",
      role: "Cardiologist",
      quote:
        "Care9ja has revolutionized how I connect with my patients. The platform is intuitive and reliable.",
    },
    {
      name: "Mrs. Chioma Okafor",
      role: "Patient",
      quote:
        "Getting medical advice at 2 AM when my child had a fever was a lifesaver. Highly recommended!",
    },
    {
      name: "Dr. Fatima Ahmed",
      role: "Pediatrician",
      image: "/api/placeholder/64/64",
      quote:
        "The best telehealth platform in Nigeria. My patients love the convenience and ease of use.",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Patients Served" },
    { number: "1,000+", label: "Licensed Doctors" },
    { number: "4.9/5", label: "Patient Satisfaction" },
    { number: "24/7", label: "Availability" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Care9jaLogo />
            <div className="flex space-x-4">
              <Link href={"/about-us"}>
                <button className="text-gray-600 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </button>
              </Link>
              <button className="text-gray-600 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">
                Services
              </button>
              <button className="text-gray-600 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <div className="absolute inset-y-0 right-0 hidden lg:block lg:right-0">
          <svg
            className="h-full w-48 text-sky-50 transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="mb-8 lg:mb-0">
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Your Hospital's</span>
                  <span className="block text-sky-600">Digital Extension</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                  Extend your hospital's reach through our secure telehealth
                  platform. Connect patients with your hospital's specialists
                  through video calls, chat, or voice calls. Manage
                  prescriptions, lab referrals, and medical certificates
                  digitally.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row sm:gap-3">
                  <Link href={"/dashboard"}>
                    <button className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 md:py-4 md:text-lg md:px-10">
                      Start Consultation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </Link>
                  {/* <button className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 md:py-4 md:text-lg md:px-10">
                    Download App
                  </button> */}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 right-0 w-72 h-72 bg-sky-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-32 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative">
                <img
                  src="/api/placeholder/600/400"
                  alt="Doctor consultation"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-500" />
                    <span className="text-sm font-medium">
                      200+ Online Doctors
                    </span>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-sky-50 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-sky-600">{stat.number}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Comprehensive Healthcare Services
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need for your health, available 24/7
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Video className="h-6 w-6" />,
                title: "Video Consultations",
                description:
                  "Face-to-face video calls with experienced doctors",
                color: "bg-sky-500",
              },
              {
                icon: <Calendar className="h-6 w-6" />,
                title: "Easy Scheduling",
                description: "Book appointments at your convenience",
                color: "bg-green-500",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Secure Platform",
                description: "Your health data is protected and encrypted",
                color: "bg-sky-500",
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                title: "E-Prescriptions",
                description: "Get digital prescriptions sent to your pharmacy",
                color: "bg-green-500",
              },
              {
                icon: <Heart className="h-6 w-6" />,
                title: "Specialist Care",
                description: "Access to various medical specialists",
                color: "bg-sky-500",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "24/7 Support",
                description: "Round-the-clock medical assistance",
                color: "bg-green-500",
              },
            ].map((service, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-green-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <div
                    className={`inline-flex items-center justify-center p-2 ${service.color} rounded-md text-white`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-gray-500">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Simple process for better healthcare
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Register Account",
                  description: "Complete your registration and health profile",
                },
                {
                  step: "2",
                  title: "Hospital Assignment",
                  description:
                    "Our hospital admin team assigns you to appropriate specialists",
                },
                {
                  step: "3",
                  title: "Start Care",
                  description:
                    "Begin your healthcare journey with assigned specialists",
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-600 text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              What Our Users Say
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sky-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-sky-200">
                Join thousands of satisfied patients today.
              </span>
            </h2>
            <p className="mt-4 text-lg text-sky-100">
              Get your first consultation free when you sign up today!
            </p>
          </div>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-sky-600 bg-white hover:bg-sky-50">
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-800 hover:bg-sky-900">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
