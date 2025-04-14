// sonarignore:start
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginUser, registerUser } from '../../services/authService'
import { api } from '../../services/api'

// Mock de axios/api
vi.mock('../../services/api', () => ({
  api: {
    post: vi.fn()
  }
}))

describe('authService', () => {
  const mockAuthResponse = {
    message: 'Login exitoso',
    token: 'jwt-token-example',
    user: {
      id: 1,
      email: 'usuario@ejemplo.com',
      role: 'user'
    }
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loginUser debería autenticar correctamente al usuario', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockAuthResponse })

    const credentials = {
      email: 'usuario@ejemplo.com',
      password: 'contraseña123'
    }

    const result = await loginUser(credentials)

    expect(api.post).toHaveBeenCalledWith('/users/login', credentials)
    expect(result).toEqual(mockAuthResponse)
  })

  it('registerUser debería registrar correctamente a un nuevo usuario', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockAuthResponse })

    const credentials = {
      email: 'usuario@ejemplo.com',
      password: 'contraseña123'
    }

    const result = await registerUser(credentials)

    expect(api.post).toHaveBeenCalledWith('/users/register', credentials)
    expect(result).toEqual(mockAuthResponse)
  })

  it('registerUser debería registrar usuario con rol específico', async () => {
    const adminAuthResponse = {
      ...mockAuthResponse,
      user: {
        ...mockAuthResponse.user,
        role: 'admin'
      }
    }

    vi.mocked(api.post).mockResolvedValueOnce({ data: adminAuthResponse })

    const credentials = {
      email: 'admin@ejemplo.com',
      password: 'contraseña123',
      role: 'admin'
    }

    const result = await registerUser(credentials)

    expect(api.post).toHaveBeenCalledWith('/users/register', credentials)
    expect(result).toEqual(adminAuthResponse)
  })

  it('loginUser debería manejar errores correctamente', async () => {
    const error = { message: 'Credenciales inválidas' }
    vi.mocked(api.post).mockRejectedValueOnce(error)

    const credentials = {
      email: 'usuario@ejemplo.com',
      password: 'contraseñaIncorrecta'
    }

    await expect(loginUser(credentials)).rejects.toEqual(error)
  })

  it('registerUser debería manejar errores correctamente', async () => {
    const error = { message: 'El email ya está en uso' }
    vi.mocked(api.post).mockRejectedValueOnce(error)

    const credentials = {
      email: 'usuario_existente@ejemplo.com',
      password: 'contraseña123'
    }

    await expect(registerUser(credentials)).rejects.toEqual(error)
  })
}) 
// sonarignore:end