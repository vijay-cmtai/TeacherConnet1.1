import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Menu, User, FileText, PenSquare, Settings, GraduationCap, PlusCircle, ClipboardList, UserCheck, FileCheck,
  Settings as SettingsIcon, Shield, Briefcase, Users, BarChart3, Newspaper, DollarSign, Monitor, WalletCards, BookOpenCheck, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/app/hooks";
import { logOut } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApiService";
import { User as UserType } from "@/types/user";
import toast from "react-hot-toast";
import { apiService } from "@/features/api/apiService";

interface MobileMenuProps {
  user: UserType | null;
}

const MobileMenu = ({ user }: MobileMenuProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: t("header.nav.home"), path: "/" },
    { label: t("header.nav.companyReviews"), path: "/company-reviews" },
    { label: t("header.nav.salaryGuide"), path: "/salary-guide" },
    { label: t("header.nav.careerGuide"), path: "/career-guide" },
  ];

  const getProfileMenuItems = () => {
    if (!user) return [];

    switch (user.role.toLowerCase()) {
      case 'employer':
        return [
          { path: '/dashboard/employer/profile', label: 'My Profile', icon: User },
          { path: '/dashboard/employer/applications', label: 'My Applications', icon: FileText },
          { path: '/dashboard/employer/contributions', label: 'My Contributions', icon: PenSquare },
          { path: "/dashboard/employer/payment", label: "Payments", icon: WalletCards },
          { path: '/dashboard/employer/settings', label: 'Settings', icon: Settings },
        ];
      case 'college':
        return [
          { label: 'Profile', path: '/dashboard/college/profile', icon: GraduationCap },
          { label: 'Post New Job', path: '/dashboard/college/post-job', icon: PlusCircle },
          { label: 'Manage Posts', path: '/dashboard/college/posts', icon: ClipboardList },
          { label: 'Applications', path: '/dashboard/college/applications', icon: FileText },
          { label: 'Shortlist Candidates', path: '/dashboard/college/shortlist', icon: UserCheck },
          { label: 'Offer Letters', path: '/dashboard/college/offer-letter', icon: FileCheck },
          { label: 'Settings', path: '/dashboard/college/settings', icon: SettingsIcon },
        ];
      case 'admin':
        return [
          { path: '/dashboard/admin/profile', label: 'My Profile', icon: Shield },
          { path: '/dashboard/admin/jobs', label: 'Manage Jobs', icon: Briefcase },
          { path: '/dashboard/admin/users', label: 'User Management', icon: Users },
          { path: '/dashboard/admin/workflow', label: 'Workflows', icon: BarChart3 },
          { path: "/dashboard/admin/articles", label: "Manage Articles", icon: Newspaper },
          { path: "/dashboard/admin/salary-guides", label: "Salary Guides", icon: DollarSign },
          { path: '/dashboard/admin/control', label: 'Control Panel', icon: Monitor },
          { path: "/dashboard/admin/resources", label: "Manage Resources", icon: BookOpenCheck },
          { path: "/dashboard/admin/press-articles", label: "News Articles", icon: Newspaper },
          { path: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const profileMenuItems = getProfileMenuItems();

  const handleLogout = async () => {
    setIsMenuOpen(false);
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

  const getDashboardPath = () => user ? `/dashboard/${user.role.toLowerCase()}` : '/';

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-background z-50 shadow-xl flex flex-col animate-slide-in-left">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Menu</h2>
            </div>

            <div className="flex-grow overflow-y-auto">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {!user ? (
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="px-2 space-y-2">
                    <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="px-4 mb-3">
                    <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  <div className="px-2 space-y-1">
                    <Link to={getDashboardPath()} className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    {profileMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border px-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("header.profile.signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileMenu;