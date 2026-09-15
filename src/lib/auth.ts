import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/content/prisma";
import * as argon2 from "@node-rs/argon2";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiter for login attempts: 5 requests per 15 minutes
const loginRateLimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "@upstash/ratelimit/login",
    })
  : null;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        if (loginRateLimit) {
          const ip = req.headers?.get("x-forwarded-for") || "unknown";
          const { success } = await loginRateLimit.limit(`login_${ip}_${email}`);
          if (!success) {
            throw new Error("Too many login attempts. Please try again later.");
          }
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

        const isValid = await argon2.verify(user.passwordHash, password);
        if (!isValid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return user;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role || "VIEWER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});

export const requireRole = (userRole: string, allowedRoles: string[]) => {
  if (!allowedRoles.includes(userRole)) {
    throw new Error("Unauthorized access");
  }
};
