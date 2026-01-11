"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const JobsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ConnectionsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const tabs = [
    { name: "Dashboard", href: "/", icon: DashboardIcon },
    { name: "Jobs", href: "/jobs", icon: JobsIcon },
    { name: "Connections", href: "/connections", icon: ConnectionsIcon },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-700 via-purple-600 to-purple-700 flex flex-col shadow-2xl border-r border-purple-800">
      <div className="p-6 border-b border-purple-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl font-bold text-white">JF</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">JobFlow</h1>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "group flex items-center px-4 py-3 mb-1 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                    : "text-purple-100 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 mr-3 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="flex-1">{tab.name}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white ml-2"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-purple-500/30">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-purple-100 hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-50 group"
        >
          <LogoutIcon className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </nav>
  );
}

