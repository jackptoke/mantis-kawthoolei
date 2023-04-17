// next
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// third-party
import axios from 'axios';

export let users = [
  {
    id: 1,
    name: 'Jone Doe',
    email: 'info@codedthemes.com',
    password: '123456'
  }
];

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    GoogleProvider({
      name: 'Google',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    // functionality provided for credentials based authentication is intentionally limited to discourage use of passwords due to the
    // inherent security risks associated with them and the additional complexity associated with supporting usernames and passwords.
    // We recommend to ignore credential based auth unless its super necessary
    // Ref: https://next-auth.js.org/providers/credentials
    // https://github.com/nextauthjs/next-auth/issues/3562
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const user = await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            password: credentials?.password,
            email: credentials?.email
          });

          console.log({ NextAuthAuthorize: user });

          if (user) {
            return user.data;
          }
        } catch (e) {
          const errorMessage = e?.response.data.message;
          throw new Error(errorMessage);
        }
      }
    }),
    // functionality provided for credentials based authentication is intentionally limited to discourage use of passwords due to the
    // inherent security risks associated with them and the additional complexity associated with supporting usernames and passwords.
    // We recommend to ignore credential based auth unless its super necessary
    // Ref: https://next-auth.js.org/providers/credentials
    // https://github.com/nextauthjs/next-auth/issues/3562
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'Enter Name' },
        email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const user = await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/register`, {
            name: credentials?.name,
            password: credentials?.password,
            email: credentials?.email
          });

          console.log('Credentials Provider [...nextauth]');

          if (user) {
            users.push(user.data);
            return user.data;
          }
        } catch (e) {
          const errorMessage = e?.response.data.message;
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user, account }) => {
      console.log({ CallbacksJWT: token });
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log({ CallbackSession: session, CallbackToken: token });
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.tocken = token;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.JWT_TIMEOUT)
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  }
});
