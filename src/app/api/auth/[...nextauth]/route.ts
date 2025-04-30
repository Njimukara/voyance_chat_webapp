import NextAuth, { JWT } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import ApiClient from "../../../../utils/axiosbase";
import { AxiosError } from "axios";
import { NextAuthOptions } from "next-auth";

interface ErrorResponse {
  message?: string;
  errors?: string[];
  non_field_errors?: any[];
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("credentials", credentials);
        try {
          const data = {
            email: credentials?.email,
            password: credentials?.password,
          };

          const res = await ApiClient.post(`/auth/token/login/`, data);

          const { auth_token } = res.data;
          const userDetailsRes = await ApiClient.get(`/auth/users/me/`, {
            headers: {
              Authorization: `Token ${auth_token}`,
            },
          });
          const user = userDetailsRes.data;

          if (user) {
            user.auth_token = auth_token;
            return user;
          }
          return null;
        } catch (error) {
          // console.log("error", error);

          const axiosError = error as AxiosError<ErrorResponse>;

          const errorMessage =
            axiosError.response?.data?.message ||
            axiosError.response?.data?.non_field_errors?.[0] ||
            (axiosError.response?.data?.errors?.length
              ? axiosError.response?.data?.errors[0]
              : "Erreur de serveur, veuillez réessayer");

          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // token.role = user.role;
        token.user = user;
      }

      if (trigger === "update" && session?.user) {
        token.user = {
          ...(token.user as Record<string, any>),
          ...session.user,
        };
      }

      return token;
    },
    async session({ session, token }) {
      const customToken = token as unknown as JWT;

      if (customToken && session.user) {
        session.user = customToken.user;
        session.auth_token = customToken?.user.auth_token;
        session.user.role = customToken.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
