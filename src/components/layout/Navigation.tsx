
import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoProjectModal } from "@/components/project/DemoProjectModal";
import { WalletConnect } from "@/components/hive/WalletConnect";
import { Home, Search, BookmarkPlus, Folder, Users, Shield, Lightbulb } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navigation() {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Memoize the handler to avoid re-creation on each render
  const handleOpenCreateProject = useCallback(() => {
    setIsCreateProjectOpen(true);
  }, []);

  // Memoize the close handler as well
  const handleCloseCreateProject = useCallback(() => {
    setIsCreateProjectOpen(false);
  }, []);

  // Navigation links with active state
  const navigation = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Projects", href: "/projects", icon: <Lightbulb className="h-4 w-4" /> },
    { name: "Saved", href: "/bookmarks", icon: <BookmarkPlus className="h-4 w-4" /> },
    { name: "My Projects", href: "/my-projects", icon: <Folder className="h-4 w-4" /> },
    { name: "Membership", href: "/membership", icon: <Users className="h-4 w-4" /> },
    { name: "Protection", href: "/protection", icon: <Shield className="h-4 w-4" /> }
  ];

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 sticky top-0 z-40 py-3 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold gradient-text mr-2 flex items-center gap-1">
              Crowd<span className="text-primary">Hive</span>
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:block">
          <div className="flex space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? "bg-primary/20 text-primary"
                    : "text-gray-300 hover:bg-primary/10 hover:text-gray-100"
                }
                  px-3 py-2 rounded-md text-sm font-medium flex items-center`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobile && (
          <div className="md:hidden flex space-x-2">
            {navigation.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? "bg-primary/20 text-primary"
                    : "text-gray-300 hover:bg-primary/10 hover:text-gray-100"
                }
                  p-2 rounded-md text-sm font-medium flex items-center`}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side - Search, Wallet, Create */}
        <div className="flex gap-2 items-center">
          {!isMobile && (
            <div className="relative w-56">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects"
                className="pl-8"
              />
            </div>
          )}

          <WalletConnect />

          <Button
            variant="default"
            onClick={handleOpenCreateProject}
            size="sm"
            id="create-project-btn"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isMobile ? "Create" : "Create Project"}
          </Button>
        </div>
      </div>

      {/* Static Demo Project Modal */}
      {isCreateProjectOpen && (
        <DemoProjectModal 
          isOpen={isCreateProjectOpen} 
          onClose={handleCloseCreateProject} 
        />
      )}
    </nav>
  );
}
