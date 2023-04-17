// This is an example of to protect an API route
// import { getSession } from 'next-auth/react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
// import { useSession } from '@supabase/auth-helpers-react'
// import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default async function handler(req, res) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // const session = await getSession({ req });
  console.log('Protected');
  if (session) {
    console.log({ YesSession: session });
    res.send({ protected: true });
  } else {
    console.log({ NoSession: session });
    res.send({ protected: false });
  }
}
