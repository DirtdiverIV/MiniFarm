import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Animal, AnimalCreateData, getAnimalsByFarm, getAnimalById, createAnimal, updateAnimal, deleteAnimal } from '../../services/animalService'
import { api } from '../../services/api'

// Mock de axios/api
vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('animalService', () => {
  const mockAnimal: Animal = {
    id: 1,
    animal_type: 'vaca',
    identification_number: 'VAC001',
    weight: 500,
    estimated_production: 30,
    sanitary_register: 'SR001',
    age: 5,
    incidents: '',
    farm: {
      id: 1,
      name: 'Granja Los Pinos'
    }
  }

  const mockCreateData: AnimalCreateData = {
    farm_id: 1,
    animal_type: 'vaca',
    identification_number: 'VAC001',
    weight: 500,
    estimated_production: 30,
    sanitary_register: 'SR001',
    age: 5,
    incidents: ''
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getAnimalsByFarm debería obtener todos los animales de una granja', async () => {
    const mockAnimals = [mockAnimal]
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockAnimals })

    const result = await getAnimalsByFarm(1)

    expect(api.get).toHaveBeenCalledWith('/animals/farm/1')
    expect(result).toEqual(mockAnimals)
  })

  it('getAnimalById debería obtener un animal por su ID', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockAnimal })

    const result = await getAnimalById(1)

    expect(api.get).toHaveBeenCalledWith('/animals/1')
    expect(result).toEqual(mockAnimal)
  })

  it('createAnimal debería crear un nuevo animal', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ 
      data: {
        message: 'Animal creado con éxito',
        animal: mockAnimal
      }
    })

    const result = await createAnimal(mockCreateData)

    expect(api.post).toHaveBeenCalledWith('/animals', mockCreateData)
    expect(result).toEqual(mockAnimal)
  })

  it('updateAnimal debería actualizar un animal existente', async () => {
    const updateData = { weight: 550 }
    const updatedAnimal = { ...mockAnimal, weight: 550 }
    
    vi.mocked(api.put).mockResolvedValueOnce({ 
      data: {
        message: 'Animal actualizado con éxito',
        animal: updatedAnimal
      }
    })

    const result = await updateAnimal(1, updateData)

    expect(api.put).toHaveBeenCalledWith('/animals/1', updateData)
    expect(result).toEqual(updatedAnimal)
  })

  it('deleteAnimal debería eliminar un animal', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})

    await deleteAnimal(1)

    expect(api.delete).toHaveBeenCalledWith('/animals/1')
  })

  it('debería manejar errores correctamente', async () => {
    const error = new Error('Network Error')
    vi.mocked(api.get).mockRejectedValueOnce(error)

    await expect(getAnimalById(1)).rejects.toThrow()
  })
}) 