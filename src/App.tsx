
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "@/pages/Index";
import ProjectDetails from "@/pages/ProjectDetails";
import MyProjects from "@/pages/MyProjects";
import Projects from "@/pages/Projects";
import BookmarkedProjects from "@/pages/BookmarkedProjects";
import Membership from "@/pages/Membership";
import NotFound from "@/pages/NotFound";
import ProjectProtection from "@/pages/ProjectProtection";
import ProjectCreation from "@/pages/ProjectCreation";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/bookmarks" element={<BookmarkedProjects />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/protection" element={<ProjectProtection />} />
          <Route path="/create-project" element={<ProjectCreation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
