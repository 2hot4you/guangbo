export const DEFAULT_LOCAL_ORIGIN = "http://localhost:43187";

type PublicEnv = {NODE_ENV?: string; NEXT_PUBLIC_SITE_URL?: string};

export function getSiteOrigin(env: PublicEnv = process.env): string {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_LOCAL_ORIGIN;

  try {
    const authority = raw.match(/^https?:\/\/([^/?#\\\s]+)(?:[/?#]|$)/i)?.[1];
    if (!authority || authority.includes("@")) {
      throw new Error("Missing or invalid URL authority");
    }
    const url = new URL(raw);
    if (url.username || url.password) {
      throw new Error("Credentials are not allowed in the site URL");
    }
    return url.origin;
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_SITE_URL");
  }
}

export function isIndexable(env: PublicEnv = process.env): boolean {
  if (!env.NEXT_PUBLIC_SITE_URL?.trim()) return false;

  const origin = new URL(getSiteOrigin(env));
  if (env.NODE_ENV !== "production" || origin.protocol !== "https:") return false;

  const host = origin.hostname.toLowerCase().replace(/\.+$/, "");
  if (!host.includes(".") || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) || host.startsWith("[")) {
    return false;
  }

  const reservedSuffixes = [
    "localhost", "localdomain", "local", "internal", "test", "invalid", "example",
    "example.com", "example.net", "example.org",
  ];
  return !reservedSuffixes.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}
