type NamedUser = {
  email?: string | null;
  firstName?: string | null;
  secondName?: string | null;
};

function toDisplayCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function getDisplayName(user?: NamedUser | null, fallback = "User") {
  if (!user) return fallback;
  if (user.secondName?.trim()) return toDisplayCase(user.secondName);
  if (user.firstName?.trim()) return toDisplayCase(user.firstName);
  if (user.email?.trim()) {
    return toDisplayCase(user.email.trim().split("@")[0].replace(/[._-]+/g, " "));
  }
  return fallback;
}
