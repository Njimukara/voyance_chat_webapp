// next-auth.d.ts (place this in your project root or in a folder like `types`)

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { UserDTO } from "./user";

// Extend the User type with custom fields (id, role)
declare module "next-auth" {
  // interface User {
  //   role: UserDTO;
  // }

  interface Session {
    auth_token: string | undefined | null;
    user: UserDTO & DefaultSession["user"]; // Merge with the default session
  }

  interface JWT {
    user: any;
    id: string;
    email: string;
    role: string;
  }
}
