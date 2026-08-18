import { createHash } from "node:crypto";

/**
 * Peppered hashing for anything derived from an IP address.
 *
 * A bare sha256 of an IPv4 address is not anonymisation. The whole address
 * space is four billion values, which is minutes of work to enumerate, so the
 * hash is trivially reversible. Mixing in a server side secret is what makes
 * the stored value genuinely non identifying, which is the claim POPIA
 * requires us to be able to stand behind.
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;

  const pepper = process.env.IP_HASH_PEPPER;
  if (!pepper) {
    // Better to store nothing than to store a reversible hash and call it
    // anonymous. Fail loudly in development, quietly degrade in production.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "IP_HASH_PEPPER is not set. Refusing to store an unpeppered IP hash.",
      );
    }
    return null;
  }

  return createHash("sha256").update(`${pepper}:${ip}`).digest("hex");
}

/** Pull the caller's IP from the usual proxy headers. */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return headers.get("x-real-ip");
}
