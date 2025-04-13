import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getDashboardStats, DashboardStats, AnimalWithIncident } from '../../services/dashboardService'
import { api } from '../../services/api'

// Mock de axios/api
vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn()
  }
}))

describe('dashboardService', () => {
  const mockDashboardStats: DashboardStats = {
    total_animals: 250,
    total_carne_production: 5000,
    total_leche_production: 1500,
    animals_with_incidents: [
      {
        id: 1,
        animal_type: 'vaca',
        identification_number: 'VAC001',
        incidents: 'Fiebre alta',
        farm_name: 'Granja Los Pinos'
      },
      {
        id: 2,
        animal_type: 'cerdo',
        identification_number: 'CER005',
        incidents: 'Herida en pata',
        farm_name: 'Granja El Encinar'
      }
    ]
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getDashboardStats debería obtener las estadísticas del dashboard', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockDashboardStats })

    const result = await getDashboardStats()

    expect(api.get).toHaveBeenCalledWith('/dashboard/stats')
    expect(result).toEqual(mockDashboardStats)
    expect(result.animals_with_incidents.length).toBe(2)
    expect(result.total_animals).toBe(250)
  })

  it('getDashboardStats debería manejar errores correctamente', async () => {
    const error = new Error('Network Error')
    vi.mocked(api.get).mockRejectedValueOnce(error)

    await expect(getDashboardStats()).rejects.toThrow()
  })
}) 