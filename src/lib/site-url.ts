export const DEFAULT_LOCAL_ORIGIN = "http://localhost:43187";

type PublicEnv = {NODE_ENV?: string; NEXT_PUBLIC_SITE_URL?: string};

export function getSiteOrigin(env: PublicEnv = process.env): string {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_LOCAL_ORIGIN;

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported site URL protocol");
    }
    return url.origin;
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_SITE_URL");
  }
}

export function isIndexable(env: PublicEnv = process.env): boolean {
  if (env.NODE_ENV !== "production" || !env.NEXT_PUBLIC_SITE_URL?.trim()) return false;
  getSiteOrigin(env);
  return true;
}
