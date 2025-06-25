import { useState } from "react"; // Step 1: useState import karein
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentUser, logOut } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApiService";
import { apiService } from "@/features/api/apiService";
import {
  GraduationCap,
  PlusCircle,
  ClipboardList,
  FileText,
  UserCheck,
  FileCheck,
  Settings,
  Home,
  Menu, // Step 2: Menu icon import karein
  X, // Step 3: Close (X) icon import karein
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const CollegeDashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Step 4: Sidebar ko mobile par open/close karne ke liye state banayein
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      path: "/dashboard/college/profile",
      label: "Profile",
      icon: GraduationCap,
    },
    {
      path: "/dashboard/college/post-job",
      label: "Post New Job",
      icon: PlusCircle,
    },
    {
      path: "/dashboard/college/posts",
      label: "Manage Posts",
      icon: ClipboardList,
    },
    {
      path: "/dashboard/college/applications",
      label: "Applications",
      icon: FileText,
    },
    {
      path: "/dashboard/college/shortlist",
      label: "Shortlist Candidates",
      icon: UserCheck,
    },
    {
      path: "/dashboard/college/offer-letter",
      label: "Offer Letters",
      icon: FileCheck,
    },
    { path: "/dashboard/college/settings", label: "Settings", icon: Settings },
  ];

  // Ek function jo sidebar ko band kar dega, jab koi menu item click ho
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
      {/* Step 5: Sidebar ke liye responsive classes add karein */}
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
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  College Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            {/* Close button (sirf mobile par dikhega) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
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
                variant={location.pathname === item.path ? "default" : "ghost"}
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

      {/* Step 6: Backdrop (Overlay jo sidebar ke peeche dikhega mobile par) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Step 7: Mobile Header (sirf mobile par dikhega) */}
        <header className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">College Dashboard</h1>
          <div className="w-8"></div> {/* Spacer */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;