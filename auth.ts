import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبة");
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user || !user.password) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("يرجى تأكيد بريدك الإلكتروني أولاً");
        }

        // Check if account is active
        if (user.status !== 'active') {
          throw new Error("هذا الحساب غير نشط");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        // Update last login
        await db.update(users)
          .set({ 
            lastLoginAt: new Date(),
          } as any)
          .where(eq(users.id, user.id));

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.picture = user.image;
        token.role = user.role;
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle Google OAuth
      if (account?.provider === "google") {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        if (!existingUser) {
          // Create new user from Google
          const newUser = await db.insert(users).values({
            email: user.email!,
            name: user.name || "",
            avatar: user.image,
            emailVerified: true, // Google emails are pre-verified
            password: "", // No password for OAuth users
            role: "user",
            status: "active",
            onboardingCompleted: false,
          } as any).returning();

          user.id = newUser[0].id.toString();
        } else {
          // Update existing user
          await db.update(users)
            .set({
              avatar: user.image,
              emailVerified: true,
              lastLoginAt: new Date(),
            } as any)
            .where(eq(users.id, existingUser.id));

          user.id = existingUser.id.toString();
        }
      }

      return true;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`✅ User signed in: ${user.email}`);
    },
    async signOut() {
      console.log(`👋 User signed out`);
    },
  },
});
