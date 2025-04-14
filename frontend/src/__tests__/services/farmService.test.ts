// sonarignore:start
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Farm, FarmCreateData, FarmUpdateData, getAllFarms, getFarmById, createFarm, updateFarm, deleteFarm } from '../../services/farmService'
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

describe('farmService', () => {
  const mockFarm: Farm = {
    id: 1,
    name: 'Granja Los Pinos',
    farm_type: {
      id: 1,
      name: 'bovina'
    },
    production_type: {
      id: 1,
      name: 'leche'
    },
    provincia: 'Madrid',
    municipio: 'Alcobendas',
    image_path: '/images/farms/farm1.jpg'
  }

  const mockFarmCreateData: FarmCreateData = {
    name: 'Granja Los Pinos',
    farm_type_id: 1,
    production_type_id: 1,
    provincia: 'Madrid',
    municipio: 'Alcobendas'
  }

  const mockFile = new File(['dummy content'], 'farm.jpg', { type: 'image/jpeg' })

  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(window, 'FormData').mockImplementation(() => {
      const map = new Map()
      return {
        append: (key: string, value: any) => map.set(key, value),
        get: (key: string) => map.get(key),
        getAll: (key: string) => [map.get(key)],
        has: (key: string) => map.has(key),
        delete: (key: string) => map.delete(key),
        forEach: (callback: Function) => map.forEach((value, key) => callback(value, key)),
        entries: () => map.entries(),
        keys: () => map.keys(),
        values: () => map.values(),
        [Symbol.iterator]: () => map[Symbol.iterator]()
      } as unknown as FormData
    })
  })

  it('getAllFarms debería obtener todas las granjas', async () => {
    const mockFarms = [mockFarm]
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockFarms })

    const result = await getAllFarms()

    expect(api.get).toHaveBeenCalledWith('/farms')
    expect(result).toEqual(mockFarms)
  })

  it('getFarmById debería obtener una granja por su ID', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockFarm })

    const result = await getFarmById(1)

    expect(api.get).toHaveBeenCalledWith('/farms/1')
    expect(result).toEqual(mockFarm)
  })

  it('createFarm debería crear una nueva granja sin imagen', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ 
      data: {
        message: 'Granja creada con éxito',
        farm: mockFarm
      }
    })

    const result = await createFarm(mockFarmCreateData)

    expect(api.post).toHaveBeenCalledWith(
      '/farms', 
      expect.anything(), 
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    expect(result).toEqual(mockFarm)
  })

  it('createFarm debería crear una nueva granja con imagen', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ 
      data: {
        message: 'Granja creada con éxito',
        farm: mockFarm
      }
    })

    const farmDataWithImage = { ...mockFarmCreateData, image: mockFile }
    const result = await createFarm(farmDataWithImage)

    expect(api.post).toHaveBeenCalledWith(
      '/farms', 
      expect.anything(), 
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    expect(result).toEqual(mockFarm)
  })

  it('updateFarm debería actualizar una granja existente', async () => {
    const updateData: FarmUpdateData = { name: 'Granja Actualizada' }
    const updatedFarm = { ...mockFarm, name: 'Granja Actualizada' }
    
    vi.mocked(api.put).mockResolvedValueOnce({ 
      data: {
        message: 'Granja actualizada con éxito',
        farm: updatedFarm
      }
    })

    const result = await updateFarm(1, updateData)

    expect(api.put).toHaveBeenCalledWith(
      '/farms/1', 
      expect.anything(),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    expect(result).toEqual(updatedFarm)
  })

  it('updateFarm debería actualizar una granja con todos los campos', async () => {
    const updateData: FarmUpdateData = {
      name: 'Granja Actualizada',
      farm_type_id: 2,
      production_type_id: 2,
      provincia: 'Barcelona',
      municipio: 'Sitges',
      image: mockFile
    }
    
    const updatedFarm = {
      ...mockFarm, 
      name: 'Granja Actualizada',
      farm_type: { id: 2, name: 'porcina' },
      production_type: { id: 2, name: 'carne' },
      provincia: 'Barcelona',
      municipio: 'Sitges',
      image_path: '/images/farms/farm1_updated.jpg'
    }
    
    vi.mocked(api.put).mockResolvedValueOnce({ 
      data: {
        message: 'Granja actualizada con éxito',
        farm: updatedFarm
      }
    })

    const result = await updateFarm(1, updateData)

    expect(api.put).toHaveBeenCalledWith(
      '/farms/1', 
      expect.anything(),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    expect(result).toEqual(updatedFarm)
  })

  it('deleteFarm debería eliminar una granja', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({})

    await deleteFarm(1)

    expect(api.delete).toHaveBeenCalledWith('/farms/1')
  })

  it('debería manejar errores correctamente', async () => {
    const error = new Error('Network Error')
    vi.mocked(api.get).mockRejectedValueOnce(error)

    await expect(getFarmById(1)).rejects.toThrow()
  })
})  
// sonarignore:end