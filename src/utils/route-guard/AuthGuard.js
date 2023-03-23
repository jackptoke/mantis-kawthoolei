import PropTypes from 'prop-types';
import { useEffect } from 'react';

// next
import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/react';
import { useSession } from '@supabase/auth-helpers-react';

// types
import Loader from 'components/Loader';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const session = useSession();
  const router = useRouter();
  // const user = useUser();

  useEffect(() => {
    // const fetchData = async () => {
    //   const res = await fetch('/api/auth/protected');
    //   const json = await res.json();
    //   if (!json.protected) {
    //     router.push({
    //       pathname: '/login',
    //       query: { from: router.asPath }
    //     });
    //   }
    // };
    // fetchData();
    // eslint-disable-next-line
    if (session === null)
      router.push({
        pathname: '/login',
        query: { from: router.asPath }
      });
  }, [session]);

  if (status === 'loading' || !session?.user) return <Loader />;

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
