import "server-only";

export interface AuthCapabilities {
  secretConfigured: boolean;
  hostTrusted: boolean;
  oidcConfigured: boolean;
  oidcPartiallyConfigured: boolean;
  credentialsEnabled: false;
}

export function getAuthCapabilities(): AuthCapabilities {
  const oidcValues = [
    process.env.AUTH_OIDC_ISSUER,
    process.env.AUTH_OIDC_CLIENT_ID,
    process.env.AUTH_OIDC_CLIENT_SECRET,
  ];
  const configuredValues = oidcValues.filter(Boolean).length;

  return {
    secretConfigured: Boolean(process.env.AUTH_SECRET),
    hostTrusted:
      process.env.AUTH_TRUST_HOST === "true" ||
      process.env.NODE_ENV !== "production",
    oidcConfigured: configuredValues === oidcValues.length,
    oidcPartiallyConfigured: configuredValues > 0 && configuredValues < oidcValues.length,
    credentialsEnabled: false,
  };
}
