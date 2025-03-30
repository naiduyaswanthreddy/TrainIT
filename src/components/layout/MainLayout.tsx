
import React from "react";
import { Navigation } from "./Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">
      <Navigation />
      <main className="flex-grow w-full">
        <div className="w-full">
          {children}
        </div>
      </main>
      <footer className="border-t border-gray-800 py-6 w-full">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CrowdHive. Decentralized crowdfunding on the blockchain.</p>
        </div>
      </footer>
    </div>
  );
}
