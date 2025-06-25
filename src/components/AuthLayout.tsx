import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { useGetMeQuery } from '@/features/auth/authApiService';
import { logOut, setCredentials } from '@/features/auth/authSlice';
import { Loader2 } from 'lucide-react';

const AuthLayout = () => {
  const dispatch = useAppDispatch();
  // `skip: false` se hum ensure karte hain ki yeh query hamesha run ho
  const { data, isSuccess, isError, isLoading } = useGetMeQuery(undefined, {
    // Agar aapko baar-baar refetch nahi karna, toh isko true rakhein
    // refetchOnMountOrArgChange: false, 
  });

  useEffect(() => {
    if (isSuccess && data?.success) {
      // User data mila, Redux store mein daal do
      dispatch(setCredentials({ user: data.data }));
    } else if (isError) {
      // Token invalid tha ya server se error aaya, logout kar do
      dispatch(logOut());
    }
  }, [isSuccess, isError, data, dispatch]);

  // Jab tak user data load ho raha hai, loading spinner dikhao
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Loading poori ho gayi, ab bacchon (child routes) ko render karo
  return <Outlet />;
};

export default AuthLayout;