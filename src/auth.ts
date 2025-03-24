
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === "Ximvub-gybhe6-nahdax") {
          return { id: "0" }; // Mock user object
        }
        return null; // Authentication failed
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: "wyfmas-2sargo-Hihnyd", // Replace with a secure secret
};
