
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import NavigationMenu from "./header/NavigationMenu";
import HeaderActions from "./header/HeaderActions";
import MobileMenu from "./header/MobileMenu";

const Header = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectCurrentUser);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0">
              <span className="text-3xl font-bold text-primary">
                TeacherConnect
              </span>
            </Link>
            <NavigationMenu />
          </div>

          <HeaderActions user={user} />
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;