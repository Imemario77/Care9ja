import React from "react";
import Head from "next/head";
import {
  Users,
  UserPlus,
  FileText,
  Activity,
  ArrowRight,
  Settings,
  ShieldCheck,
  CreditCard,
} from "lucide-react"; // Import more icons as needed
import Link from "next/link";

const AdminDashboard = () => {
  const adminStats = [
    {
      title: "Total Users",
      count: 5321,
      icon: <Users className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "New Users Today",
      count: 432,
      icon: <UserPlus className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "Total Reports",
      count: 325,
      icon: <FileText className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "Active Users",
      count: 4000,
      icon: <Activity className="h-6 w-6 text-gray-400" />,
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "Add, edit, or delete user profiles.",
      href: "/admin/users",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      title: "Review Reports",
      description: "Approve or reject medical reports.",
      href: "/admin/reports",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      title: "Settings",
      description: "Configure general application settings.",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5 mr-2" />,
    },
    {
      title: "Payment Requests",
      description: "Review and process payment requests.",
      href: "/admin/payments",
      icon: <CreditCard className="h-5 w-5 mr-2" />,
    },
    {
      title: "Security Logs",
      description: "Monitor system security and audit logs.",
      href: "/admin/security",
      icon: <ShieldCheck className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard - Care9ja</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Admin Dashboard
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                {/* Stats Section */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {adminStats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">{stat.icon}</div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                {stat.title}
                              </dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {stat.count}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions Section */}
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                      <Link
                        href={action.href}
                        key={index}
                        className="bg-white rounded-lg shadow-md p-5 flex items-center hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          {action.icon}
                          <div className="ml-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {action.title}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
