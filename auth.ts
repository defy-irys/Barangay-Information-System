import NextAuth from "next-auth";
import type { OIDCConfig } from "next-auth/providers";
import { NextResponse } from "next/server";
import { createAdminCredentialsProvider } from "@/lib/auth/credentials-provider";
import {
  getModuleReadPermissionForPath,
  hasPermission,
  isAdminRoleId,
} from "@/lib/auth/rbac";
import { getAuthCapabilities } from "@/lib/auth/provider-configuration";

type AdminOidcProfile = Record<string, unknown> & {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
};

function getOidcProvider(): OIDCConfig<AdminOidcProfile> | null {
  const issuer = process.env.AUTH_OIDC_ISSUER;
  const clientId = process.env.AUTH_OIDC_CLIENT_ID;
  const clientSecret = process.env.AUTH_OIDC_CLIENT_SECRET;
  const capabilities = getAuthCapabilities();

  if (
    !capabilities.oidcConfigured ||
    !capabilities.secretConfigured ||
    !capabilities.hostTrusted ||
    !issuer ||
    !clientId ||
    !clientSecret
  ) {
    return null;
  }

  const issuerUrl = new URL(issuer);
  if (
    issuerUrl.username ||
    issuerUrl.password ||
    issuerUrl.search ||
    issuerUrl.hash ||
    (process.env.NODE_ENV === "production" && issuerUrl.protocol !== "https:")
  ) {
    throw new Error("AUTH_OIDC_ISSUER must be a clean HTTPS issuer URL in production.");
  }

  const roleClaim = process.env.AUTH_OIDC_ROLE_CLAIM || "role";
  if (!/^[A-Za-z0-9._-]+$/.test(roleClaim)) {
    throw new Error("AUTH_OIDC_ROLE_CLAIM must be a single claim name.");
  }

  return {
    id: "barangay-oidc",
    name: "Organization SSO",
    type: "oidc",
    issuer,
    clientId,
    clientSecret,
    checks: ["pkce", "state", "nonce"],
    profile(profile) {
      const claim = profile[roleClaim];
      return {
        id: profile.sub,
        name: typeof profile.name === "string" ? profile.name : undefined,
        email: typeof profile.email === "string" ? profile.email : undefined,
        image: typeof profile.picture === "string" ? profile.picture : undefined,
        role: isAdminRoleId(claim) ? claim : undefined,
      };
    },
  };
}

const oidcProvider = getOidcProvider();
const credentialsProvider = createAdminCredentialsProvider(null);
const publicPaths = ["/login", "/api/v1/health", "/api/v1/auth/capabilities"];

function isPublicPath(pathname: string): boolean {
  return (
    publicPaths.includes(pathname) ||
    pathname === "/api/auth" ||
    pathname.startsWith("/api/auth/")
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(process.env.AUTH_TRUST_HOST === "true" ? { trustHost: true } : {}),
  providers: oidcProvider
    ? [credentialsProvider, oidcProvider]
    : [credentialsProvider],
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 },
  callbacks: {
    signIn({ user }) {
      return Boolean(user.id && isAdminRoleId(user.role));
    },
    jwt({ token, user }) {
      if (user) {
        if (user.id && isAdminRoleId(user.role)) {
          token.sub = user.id;
          token.role = user.role;
        } else {
          delete token.sub;
          delete token.role;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (isAdminRoleId(token.role)) {
          session.user.role = token.role;
        } else {
          delete session.user.role;
        }
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const { pathname, search } = request.nextUrl;
      if (isPublicPath(pathname)) {
        return true;
      }

      const user = session?.user;
      const role = user?.role;
      if (!user?.id || !isAdminRoleId(role)) {
        if (pathname.startsWith("/api/")) {
          return Response.json(
            { error: { code: "UNAUTHENTICATED", message: "Sign-in is required." } },
            { status: 401, headers: { "Cache-Control": "no-store" } },
          );
        }

        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
      }

      const requiredPermission = getModuleReadPermissionForPath(pathname);
      if (requiredPermission && !hasPermission(role, requiredPermission)) {
        if (pathname.startsWith("/api/")) {
          return Response.json(
            { error: { code: "FORBIDDEN", message: "You do not have permission." } },
            { status: 403, headers: { "Cache-Control": "no-store" } },
          );
        }

        return NextResponse.redirect(new URL("/?access=denied", request.url));
      }

      return true;
    },
  },
});
