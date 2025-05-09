import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post('/session', { email, password })

  const { token } = response.data

  // Armazena no localStorage
  localStorage.setItem('token', token)
}
