// import PropTypes from 'prop-types';
import React from 'react';

// next
import Image from 'next/image';
// import NextLink from 'next/link';
// import { useSession, signIn } from 'next-auth/react';
import { /*useSession,*/ useSupabaseClient } from '@supabase/auth-helpers-react';

// material-ui

import {
  Box,
  useMediaQuery,
  Button
  /*Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography*/
} from '@mui/material';

// third party
/*import * as Yup from 'yup';
import { Formik } from 'formik';*/

// project import
// import FirebaseSocial from './FirebaseSocial';
// import { DEFAULT_PATH } from 'config';
// import IconButton from 'components/@extended/IconButton';
// import AnimateButton from 'components/@extended/AnimateButton';

// // assets
// import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// const Auth0 = '/assets/images/icons/auth0.svg';
// const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

// ============================|| AWS CONNITO - LOGIN ||============================ //

const AuthLogin = (/*{ providers, csrfToken }*/) => {
  const supabaseClient = useSupabaseClient();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  console.log('Auth login');
  return (
    <>
      <Box key="google-signin" sx={{ width: '100%' }}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth={!matchDownSM}
          startIcon={<Image src={Google} alt="Twitter" width={16} height={16} />}
          onClick={() => supabaseClient.auth.signInWithOAuth({ provider: 'google' }, { redirectTo: '/dashboard/analytics' })}
        >
          {!matchDownSM && 'Google'}
        </Button>
      </Box>
    </>
  );
};

export default AuthLogin;
