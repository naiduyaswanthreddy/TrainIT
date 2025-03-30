
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProjectModal } from "@/hooks/use-project-modal";
import { CreateProjectForm } from "@/components/project/CreateProjectForm";
import { SimpleProjectForm } from "@/components/project/SimpleProjectForm";
import { AuthRequiredMessage } from "@/components/auth/AuthRequiredMessage";
import { getConnectedUsername } from "@/utils/hive/auth";

export default function MyProjectsPage() {
  // Add this state
  const [useSimpleForm, setUseSimpleForm] = useState(true);
  const {
    isCreateProjectOpen,
    isSimpleCreateOpen,
    handleCreateProject,
    handleSimpleCreateProject,
    closeCreateProjectModal,
    closeSimpleCreateModal,
  } = useProjectModal();
  const username = getConnectedUsername();
  
  // Function to toggle between simple and detailed form
  const toggleFormType = () => {
    setUseSimpleForm(!useSimpleForm);
  };

  // Use the form that is selected
  const openCreateProject = () => {
    if (useSimpleForm) {
      handleSimpleCreateProject();
    } else {
      handleCreateProject();
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFormType}
            className="text-xs"
          >
            {useSimpleForm ? "Use Detailed Form" : "Use Simple Form"}
          </Button>
          <Button onClick={openCreateProject}>
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </div>
      </div>

      {!username ? (
        <AuthRequiredMessage
          title="Connect to View Your Projects"
          description="Please connect your Hive wallet to view your projects and drafts."
        />
      ) : (
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="text-center text-gray-400 py-12">
              <p>You don't have any active projects yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={openCreateProject}
              >
                <Plus className="mr-2 h-4 w-4" /> Start a Project
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <div className="text-center text-gray-400 py-12">
              <p>You don't have any draft projects.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={openCreateProject}
              >
                <Plus className="mr-2 h-4 w-4" /> Create a Draft
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="text-center text-gray-400 py-12">
              <p>You don't have any completed projects yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Both forms available, they'll show based on which modal state is true */}
      <CreateProjectForm 
        isOpen={isCreateProjectOpen} 
        onClose={closeCreateProjectModal} 
      />
      
      <SimpleProjectForm
        isOpen={isSimpleCreateOpen}
        onClose={closeSimpleCreateModal}
      />
    </div>
  );
}
