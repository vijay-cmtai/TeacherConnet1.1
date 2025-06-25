import { useState } from "react"; // Step 1: Import useState for state management
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentUser, logOut } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApiService";
import { apiService } from "@/features/api/apiService";
import {
  User,
  FileText,
  Settings,
  Home,
  PenSquare,
  Menu, // Step 2: Import the Menu icon for the hamburger button
  X,
  WalletCards,
  LogOut,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const EmployerDashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Step 4: Create state to manage the sidebar's visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard/employer/profile", label: "My Profile", icon: User },
    {
      path: "/dashboard/employer/applications",
      label: "My Applications",
      icon: FileText,
    },
    {
      path: "/dashboard/employer/posts",
      label: "Manage Posts",
      icon: Briefcase,
    },
    {
      path: "/dashboard/employer/contributions",
      label: "My Contributions",
      icon: PenSquare,
    },
    { path: "/dashboard/employer/payment", label: "Payments", icon: WalletCards },
    { path: "/dashboard/employer/settings", label: "Settings", icon: Settings },
  ];

  // A helper function to close the sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    const loadingToast = toast.loading("Signing out...");
    try {
      await logoutUser({}).unwrap();
      dispatch(logOut());
      dispatch(apiService.util.resetApiState());
      toast.success("Signed out successfully.", { id: loadingToast });
      navigate('/');
    } catch (error) {
      toast.error("Failed to sign out. Please try again.", { id: loadingToast });
    }
  };

  return (
    <div className="h-screen bg-page flex overflow-hidden">
      {/* --- SIDEBAR --- */}
      {/* Step 5: Apply responsive classes to the sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  Employer Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            {/* Close button (only visible on mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full justify-start"
            >
              <Link to="/" onClick={handleLinkClick}>
                <Home className="w-4 h-4 mr-3" />
                Back to Home
              </Link>
            </Button>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={
                  location.pathname.startsWith(item.path) ? "default" : "ghost"
                }
                size="sm"
                asChild
                className="w-full justify-start"
              >
                <Link to={item.path} onClick={handleLinkClick}>
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Step 6: Add a backdrop overlay for mobile view */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Step 7: Add a header for mobile view */}
        <header className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">Employer Dashboard</h1>
          <div className="w-8"></div> {/* Spacer to balance the title */}
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;