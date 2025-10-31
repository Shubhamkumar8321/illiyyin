import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// 👇 Custom type so we can safely assign `role`
interface ExtendedUser {
  role?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /** ✅ When user signs in — create record if new */
    async signIn({ user }) {
      await connectDB();

      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: "user",
        });
      }

      // ✅ assign role safely
      (user as ExtendedUser).role = existingUser.role;

      return true;
    },

    /** ✅ Attach role into JWT */
    async jwt({ token, user }) {
      await connectDB();

      if (user) {
        token.role = (user as ExtendedUser).role;
      } else {
        const dbUser = await User.findOne({ email: token.email });
        token.role = dbUser?.role || "user";
      }

      return token;
    },

    /** ✅ Attach role into session */
    async session({ session, token }) {
      if (token?.role && session.user) {
        (session.user as ExtendedUser).role = token.role as string;
      }
      return session;
    },
  },
};
