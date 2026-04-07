type AthleteProfileReadinessInput = {
  firstName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  country?: string | null
}

export type RegistrationReadinessCode =
  | 'email_not_verified'
  | 'missing_first_name'
  | 'missing_last_name'
  | 'missing_date_of_birth'
  | 'missing_country'

export type RegistrationReadinessResult = {
  ready: boolean
  missing: RegistrationReadinessCode[]
}

const hasValue = (value?: string | null) => Boolean(value?.trim())

export const getRegistrationReadiness = ({
  isEmailVerified,
  profile,
}: {
  isEmailVerified: boolean
  profile: AthleteProfileReadinessInput
}): RegistrationReadinessResult => {
  const missing: RegistrationReadinessCode[] = []

  if (!isEmailVerified) missing.push('email_not_verified')
  if (!hasValue(profile.firstName)) missing.push('missing_first_name')
  if (!hasValue(profile.lastName)) missing.push('missing_last_name')
  if (!hasValue(profile.dateOfBirth)) missing.push('missing_date_of_birth')
  if (!hasValue(profile.country)) missing.push('missing_country')

  return {
    ready: missing.length === 0,
    missing,
  }
}
