import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { hash, compare } from "bcryptjs";
import prisma from "@/lib/db";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "PSU Passport",
      credentials: {
        psuId: { label: "PSU ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.psuId || !credentials?.password) {
            throw new Error("PSU ID and password are required");
          }

          const inputPsuId = String(credentials.psuId).trim();
          const inputPassword = String(credentials.password);

          // Check for hardcoded admin credentials first
          if (inputPsuId === '0100435000' && inputPassword === '980456221') {
            // Create or update admin user
            const adminUser = await prisma.user.upsert({
              where: { psuId: '0100435000' },
              update: {
                name: 'System Administrator',
                email: 'admin@psu.ac.th',
                isAdmin: true,
                faceRegistered: true,
                password: await hash('980456221', 12)
              },
              create: {
                psuId: '0100435000',
                name: 'System Administrator',
                email: 'admin@psu.ac.th',
                password: await hash('980456221', 12),
                isAdmin: true,
                faceRegistered: true
              }
            });

            return {
              id: adminUser.id,
              name: adminUser.name,
              psuId: adminUser.psuId,
              faceRegistered: adminUser.faceRegistered,
              isAdmin: adminUser.isAdmin,
            };
          }

          // Regular user authentication
          const user = await prisma.user.findUnique({
            where: {
              psuId: inputPsuId,
            },
          });

          if (!user) {
            throw new Error("Invalid PSU ID or password");
          }

          const bcryptOk = await compare(inputPassword, user.password).catch(() => false);
          const plainOk = user.password === inputPassword;
          if (!bcryptOk && !plainOk) {
            throw new Error("Invalid PSU ID or password");
          }

          // Auto-migrate legacy plaintext password to bcrypt hash
          if (!bcryptOk && plainOk) {
            const newHash = await hash(inputPassword, 12);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: newHash },
            });
          }

          return {
            id: user.id,
            name: user.name,
            psuId: user.psuId,
            faceRegistered: user.faceRegistered,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If user is admin and trying to access admin routes, allow it
      if (url.startsWith('/admin')) {
        return url
      }
      // Otherwise redirect to dashboard
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
    async session({ session, token }) {
      if (token.id) {
        const user = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            id: true,
            name: true,
            psuId: true,
            faceRegistered: true,
            isAdmin: true,
          },
        });
        
        if (user) {
          session.user = {
            id: user.id,
            name: user.name,
            psuId: user.psuId,
            faceRegistered: user.faceRegistered,
            isAdmin: user.isAdmin,
          };
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // On first JWT call after sign-in
      if (account && profile) {
        // Google login flow: ensure user exists
        if (account.provider === 'google') {
          const email = (profile as any).email as string | undefined;
          const name = (profile as any).name as string | undefined;
          const googleId = (profile as any).sub as string | undefined;

          // Create or update user by email
          const psuIdValue = email ? email.split('@')[0] : `google_${googleId || Date.now()}`;
          const userRecord = await prisma.user.upsert({
            where: email ? { email } : { psuId: psuIdValue },
            update: {
              name: name || psuIdValue,
            },
            create: {
              psuId: psuIdValue,
              email: email || `${psuIdValue}@example.com`,
              name: name || psuIdValue,
              password: await hash(psuIdValue, 12),
              faceRegistered: false, // Google users need to register face
              isAdmin: false,
            },
          });

          token.id = userRecord.id;
          token.psuId = userRecord.psuId;
          token.faceRegistered = userRecord.faceRegistered;
          token.isAdmin = userRecord.isAdmin;
          return token;
        }
      }
      // Credentials or subsequent JWT refresh
      if (user) {
        token.id = (user as any).id;
        token.psuId = (user as any).psuId;
        token.faceRegistered = (user as any).faceRegistered;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: true,
}; 

export { prisma };
