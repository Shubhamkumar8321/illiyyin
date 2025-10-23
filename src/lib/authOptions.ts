import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { connectDB } from "@/lib/mongodb"; // Mongo connection helper
import User from "@/models/User"; // Mongoose user model

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // ✅ When user signs in
    async signIn({ user }) {
      await connectDB();
      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: "user", // default
        });
      }

      (user as any).role = existingUser.role;
      return true;
    },

    // ✅ On every JWT create / update
    async jwt({ token, user }) {
      await connectDB();
      if (user) {
        token.role = (user as any).role;
      } else {
        const dbUser = await User.findOne({ email: token.email });
        token.role = dbUser?.role || "user";
      }
      return token;
    },

    // ✅ Add role to session
    async session({ session, token }) {
      if (token?.role) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
