import PropTypes from 'prop-types';
import { useEffect } from 'react';

// next
import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/react';
import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
// types
import Loader from 'components/Loader';
// import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const { isLoading, session } = useSessionContext();
  // const supabaseClient = useSupabaseClient()
  const user = useUser();

  useEffect(() => {
    console.log({ Loading: isLoading, User: user });
    if (!isLoading && !user) {
      console.log({ Loading: isLoading, AuthGuardUser: user, RouterIsReady: router.isReady, Session: session });
      router.push({
        pathname: '/login',
        query: { from: router.asPath }
      });
    }
  }, [isLoading, session, user]);

  if (isLoading) return <Loader />;

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
