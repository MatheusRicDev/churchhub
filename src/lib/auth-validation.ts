export type FieldErrors = Record<string, string>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class AuthValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message)
    this.name = "AuthValidationError"
  }
}

export function validateEmail(email: string): string | undefined {
  const value = email.trim()
  if (!value) return "Informe seu email"
  if (!EMAIL_REGEX.test(value)) return "Digite um email válido"
  return undefined
}

export function validateName(name: string): string | undefined {
  const value = name.trim()
  if (!value) return "Informe seu nome"
  if (value.length < 3) return "O nome deve ter pelo menos 3 caracteres"
  return undefined
}

export function validateChurchName(churchName: string): string | undefined {
  const value = churchName.trim()
  if (!value) return "Informe o nome da igreja"
  if (value.length < 3) return "O nome da igreja deve ter pelo menos 3 caracteres"
  return undefined
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Crie uma senha"
  if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres"
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return "A senha deve conter letras e números"
  }
  return undefined
}

export function validateLogin(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  if (!password) errors.password = "Informe sua senha"

  return errors
}

export interface RegisterInput {
  name: string
  churchName: string
  email: string
  password: string
  confirmPassword: string
}

export function validateRegister(input: RegisterInput): FieldErrors {
  const errors: FieldErrors = {}

  const nameError = validateName(input.name)
  if (nameError) errors.name = nameError

  const churchError = validateChurchName(input.churchName)
  if (churchError) errors.churchName = churchError

  const emailError = validateEmail(input.email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(input.password)
  if (passwordError) errors.password = passwordError

  if (!input.confirmPassword) {
    errors.confirmPassword = "Confirme sua senha"
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem"
  }

  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}