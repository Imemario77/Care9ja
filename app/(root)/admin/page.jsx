"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  Users,
  UserPlus,
  FileText,
  Activity,
  ArrowRight,
  Settings,
} from "lucide-react";
import Link from "next/link";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalReports: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminStats = [
    {
      title: "Total Users",
      count: stats.totalUsers,
      icon: <Users className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "New Users Today",
      count: stats.newUsers,
      icon: <UserPlus className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "Total Reports",
      count: stats.totalReports,
      icon: <FileText className="h-6 w-6 text-gray-400" />,
    },
    {
      title: "Active Users",
      count: stats.activeUsers,
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
      href: "/medical-reports/view",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      title: "Appointments",
      description: "View appointments and Manage appointments.",
      href: "/admin/appointments",
      icon: <Settings className="h-5 w-5 mr-2" />,
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

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
                                {loading ? (
                                  <div className="animate-pulse bg-gray-200 h-8 w-20 rounded" />
                                ) : (
                                  stat.count
                                )}
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
