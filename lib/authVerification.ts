export const isEmailVerified = (
  user: { email_confirmed_at?: string | null } | null | undefined
) => Boolean(user?.email_confirmed_at)

