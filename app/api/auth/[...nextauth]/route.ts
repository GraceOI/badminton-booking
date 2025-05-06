import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/db";

const handler = NextAuth({
  providers: [
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

          const user = await prisma.user.findUnique({
            where: {
              psuId: credentials.psuId,
            },
          });

          if (!user) {
            throw new Error("Invalid PSU ID or password");
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid PSU ID or password");
          }

          return {
            id: user.id,
            name: user.name,
            psuId: user.psuId,
            faceRegistered: user.faceRegistered,
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
    async session({ session, token }) {
      if (token.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            psuId: true,
            faceRegistered: true,
          },
        });
        
        if (user) {
          session.user = {
            id: user.id,
            name: user.name,
            psuId: user.psuId,
            faceRegistered: user.faceRegistered,
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.psuId = user.psuId;
        token.faceRegistered = user.faceRegistered;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };