type NamedUser = {
  email?: string | null;
  firstName?: string | null;
  secondName?: string | null;
};

export function getDisplayName(user?: NamedUser | null, fallback = "User") {
  if (!user) return fallback;
  if (user.secondName?.trim()) return user.secondName.trim();
  if (user.firstName?.trim()) return user.firstName.trim();
  if (user.email?.trim()) {
    return user.email.trim().split("@")[0];
  }
  return fallback;
}
