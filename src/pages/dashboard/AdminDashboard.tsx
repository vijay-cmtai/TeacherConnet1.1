import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentUser, logOut } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApiService";
import { apiService } from "@/features/api/apiService";
import {
  Shield,
  Briefcase,
  Users,
  BarChart3,
  Monitor,
  Home,
  Settings,
  Newspaper,
  DollarSign,
  Menu,
  X,
  Star,
  BookOpenCheck, // A better icon for Resources
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: Home, exact: true },
    { path: "/dashboard/admin/profile", label: "My Profile", icon: Shield },
    { path: "/dashboard/admin/jobs", label: "Manage Jobs", icon: Briefcase },
    { path: "/dashboard/admin/users", label: "User Management", icon: Users },
    { path: "/dashboard/admin/workflow", label: "Workflows", icon: BarChart3 },
    { path: "/dashboard/admin/reviews", label: "Manage Reviews", icon: Star },
    { path: "/dashboard/admin/articles", label: "Career Articles", icon: Newspaper },
    { path: "/dashboard/admin/press-articles", label: "News Articles", icon: Newspaper },
    { path: "/dashboard/admin/salary-guides", label: "Salary Guides", icon: DollarSign },
    { path: "/dashboard/admin/resources", label: "Manage Resources", icon: BookOpenCheck },
    { path: "/dashboard/admin/control", label: "Control Panel", icon: Monitor },
    { path: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ];

  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
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
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  Admin Panel
                </h2>
                <p className="text-sm text-muted-foreground truncate" title={user?.email}>
                  {user?.email}
                </p>
              </div>
            </div>
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
                Back to Site
              </Link>
            </Button>
            {menuItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="w-full justify-start"
                >
                  <Link to={item.path} onClick={handleLinkClick}>
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
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

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">Admin Menu</h1>
          <div className="w-8"></div> {/* Spacer */}
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

export default AdminDashboard;