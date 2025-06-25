import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  User,
  FileText,
  Settings as SettingsIcon,
  GraduationCap,
  PlusCircle,
  ClipboardList,
  UserCheck,
  FileCheck,
  Briefcase,
  Users,
  BarChart3,
  Monitor,
  ChevronDown,
  Shield,
  Newspaper,
  DollarSign,
  Settings,
  LogOut,
  WalletCards,
  BookOpenCheck, // Using a better icon for Resources
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/app/hooks";
import { logOut } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApiService";
import { User as UserType } from '@/types/user';
import toast from "react-hot-toast";
// YEH SABSE ZAROORI IMPORT HAI
import { apiService } from "@/features/api/apiService";

interface ProfileDropdownProps {
  user: UserType;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutMutation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  if (!user.role) {
    return null;
  }

  // Chhota sa sudhaar: Resource ke liye behtar icon
  const getProfileMenuItems = () => {
    switch (user.role.toLowerCase()) {
      case 'employer':
        return [
          { path: '/dashboard/employer/profile', label: 'My Profile', icon: User },
          { path: '/dashboard/employer/applications', label: 'My Applications', icon: FileText },
          { path: "/dashboard/employer/payment", label: "Payments", icon: WalletCards },
          { path: '/dashboard/employer/settings', label: 'Settings', icon: Settings },
        ];
      case 'college':
        return [
          { label: 'Profile', path: '/dashboard/college/profile', icon: GraduationCap },
          { label: 'Post New Job', path: '/dashboard/college/post-job', icon: PlusCircle },
          { label: 'Manage Posts', path: '/dashboard/college/posts', icon: ClipboardList },
          { label: 'Applications', path: '/dashboard/college/applications', icon: FileText },
          { label: 'Shortlist', path: '/dashboard/college/shortlist', icon: UserCheck },
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
          { path: "/dashboard/admin/press-articles", label:"News Articles", icon: Newspaper },
          { path: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const getDashboardPath = () => `/dashboard/${user.role.toLowerCase()}`;
  const profileMenuItems = getProfileMenuItems();

  // === YEH HAI CORRECTED LOGOUT FUNCTION ===
  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    const loadingToast = toast.loading("Signing out...");
    try {
      // Step 1: Server ko logout ke liye request bhejein
      await logoutUser({}).unwrap();
      
      // Step 2: Client-side par auth slice ko saaf karein
      dispatch(logOut());

      // Step 3 (THE MAGIC BULLET): RTK Query ke poore cache ko reset karein
      // Yeh saare purane API data ko mita dega
      dispatch(apiService.util.resetApiState());

      // Step 4: User ko safalta ka sandesh dikhayein aur homepage par bhej dein
      toast.success("Signed out successfully.", { id: loadingToast });
      navigate('/');
      
    } catch (error) {
      toast.error("Failed to sign out. Please try again.", { id: loadingToast });
    }
  };

  const getRoleDisplayName = () => {
    switch (user.role.toLowerCase()) {
      case 'employer': return 'Teacher/Job Seeker';
      case 'college': return 'College/Institution';
      case 'admin': return 'Administrator';
      default: return user.role;
    }
  };

  const handleProfileClick = () => {
    navigate(getDashboardPath());
    setIsProfileMenuOpen(false);
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <User className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isProfileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-lg z-50 border border-border overflow-hidden animate-fade-in-down">
            <div className="px-4 py-3 border-b border-border bg-muted/50">
              <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">{getRoleDisplayName()}</p>
            </div>
            <div className="py-2">
              <button onClick={handleProfileClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors font-medium">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Go to Dashboard</span>
              </button>
            </div>
            <div className="py-2 border-t border-border max-h-60 overflow-y-auto">
              {profileMenuItems.map((item) => (
                <Link key={item.path} to={item.path} className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-border">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;