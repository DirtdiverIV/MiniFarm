// sonarignore:start
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllFarmTypes, getAllProductionTypes, getProvincias, getMunicipiosByProvincia, FarmType, ProductionType, Provincia, Municipio } from '../../services/typesService'
import { api } from '../../services/api'
import provinciasData from '../../assets/provincias.json'

// Mock de axios/api
vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn()
  }
}))

// Mock de los archivos JSON
vi.mock('../../assets/provincias.json', () => ({
  default: [
    { code: "01", parent_code: "ES", label: "Álava" },
    { code: "02", parent_code: "ES", label: "Albacete" }
  ]
}))

vi.mock('../../assets/poblaciones.json', () => ({
  default: [
    { code: "01001", parent_code: "01", label: "Alegría-Dulantzi" },
    { code: "01002", parent_code: "01", label: "Amurrio" },
    { code: "02001", parent_code: "02", label: "Abengibre" }
  ]
}))

describe('typesService', () => {
  const mockFarmTypes: FarmType[] = [
    { id: 1, name: 'Granja Lechera' },
    { id: 2, name: 'Granja Cárnica' }
  ]

  const mockProductionTypes: ProductionType[] = [
    { id: 1, name: 'Leche' },
    { id: 2, name: 'Carne' }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getAllFarmTypes debería obtener todos los tipos de granja', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockFarmTypes })

    const result = await getAllFarmTypes()

    expect(api.get).toHaveBeenCalledWith('/farm-types')
    expect(result).toEqual(mockFarmTypes)
  })

  it('getAllProductionTypes debería obtener todos los tipos de producción', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockProductionTypes })

    const result = await getAllProductionTypes()

    expect(api.get).toHaveBeenCalledWith('/production-types')
    expect(result).toEqual(mockProductionTypes)
  })

  it('getProvincias debería devolver las provincias del JSON local', async () => {
    const result = await getProvincias()

    expect(result).toEqual(provinciasData)
    expect(result.length).toBe(2)
    expect(result[0].label).toBe('Álava')
  })

  it('getMunicipiosByProvincia debería devolver los municipios filtrados por provincia', async () => {
    const result = await getMunicipiosByProvincia('01')

    expect(result.length).toBe(2)
    expect(result[0].parent_code).toBe('01')
    expect(result[1].parent_code).toBe('01')
    expect(result.every(m => m.parent_code === '01')).toBe(true)
  })

  it('getMunicipiosByProvincia debería devolver una lista vacía si no hay coincidencias', async () => {
    const result = await getMunicipiosByProvincia('99')

    expect(result).toEqual([])
  })
}) 
// sonarignore:end