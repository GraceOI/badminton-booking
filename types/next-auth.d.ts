import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      psuId: string
      name: string
      faceRegistered: boolean
      isAdmin: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    psuId: string
    name: string
    faceRegistered: boolean
    isAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    psuId: string
    faceRegistered: boolean
    isAdmin: boolean
  }
}