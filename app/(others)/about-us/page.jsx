import React from "react";
import Head from "next/head";
import {
  Users,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Heart,
} from "lucide-react"; // Import more icons as needed
import Link from "next/link";

const Care9jaLogo = () => (
  <Link href={"/"} className="flex items-center">
    <span className="text-3xl font-bold">
      <span className="text-sky-600">Care</span>
      <span className="text-sky-800">9ja</span>
    </span>
  </Link>
);

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Dr. Adebayo Johnson",
      role: "Chief Medical Officer",
      image: "/api/placeholder/150/150",
      description:
        "A seasoned cardiologist with a passion for improving healthcare access in Nigeria.",
    },
    {
      name: "Chioma Okafor",
      role: "Lead Software Engineer",
      image: "/api/placeholder/150/150",
      description:
        "A tech enthusiast dedicated to building seamless user experiences.",
    },
    {
      name: "Fatima Ahmed",
      role: "Operations Manager",
      image: "/api/placeholder/150/150",
      description:
        "Ensuring smooth service delivery and patient satisfaction is at the heart of her work.",
    },
  ];

  const values = [
    {
      icon: <Lightbulb className="h-8 w-8 text-sky-500" />,
      title: "Innovation",
      description:
        "We continuously seek innovative solutions to improve healthcare accessibility and delivery.",
    },
    {
      icon: <Users className="h-8 w-8 text-sky-500" />,
      title: "Accessibility",
      description:
        "We are committed to making quality healthcare available to everyone, regardless of their location.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-sky-500" />,
      title: "Integrity",
      description:
        "We uphold the highest standards of ethics and transparency in all our operations.",
    },
    {
      icon: <Heart className="h-8 w-8 text-sky-500" />,
      title: "Compassion",
      description:
        "We provide compassionate care that prioritizes the well-being of our patients.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-sky-500" />,
      title: "Security",
      description:
        "We ensure a secure platform to protect user data and privacy.",
    },
  ];

  return (
    <>
      {" "}
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
      <Head>
        <title>About Us - Care9ja</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <section className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
              About Care<span className="text-sky-600">9ja</span>
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
              At Care9ja, our mission is to revolutionize healthcare delivery in
              Nigeria through innovative technology. We connect patients with
              licensed healthcare professionals instantly, making quality
              medical care accessible anytime, anywhere. We are dedicated to
              improving the health and well-being of all Nigerians.
            </p>
          </section>

          {/* Our Values Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <div className="flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Team Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-32 w-32 rounded-full mb-4"
                  />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 mb-4">{member.role}</p>
                  <p className="text-gray-600 text-center">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer Section */}
        <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} Care9ja. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutUs;
