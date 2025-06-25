
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "../LanguageToggle";
import ProfileDropdown from "./ProfileDropdown";
import { User as UserType } from "@/types/user";

interface HeaderActionsProps {
  user: UserType | null;
}

const HeaderActions = ({ user }: HeaderActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2">
        {user ? (
          <>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Link>
            </Button>
            <ProfileDropdown user={user} />
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>

      <span className="hidden md:block text-border text-2xl font-light">
        |
      </span>

      <div className="hidden md:block">
        <Link
          to="/post-job"
          className="text-sm font-medium text-muted-foreground hover:text-primary"
        >
          For Employers
        </Link>
      </div>
    </div>
  );
};

export default HeaderActions;
