import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '@/features/auth/authSlice';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Roles optional hain
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();

  if (!isAuthenticated) {
    // Agar user logged in hi nahi hai, to login page par bhejo
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Agar roles diye gaye hain, to unhe check karo
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role.toLowerCase())) {
    // User logged in hai, par uske paas sahi role nahi hai
    // Aap use homepage ya "unauthorized" page par bhej sakte hain
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Sab theek hai: user logged in hai aur (agar zaroori hai to) sahi role bhi hai
  return <Outlet />;
};

export default ProtectedRoute;