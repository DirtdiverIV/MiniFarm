import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useFilteredData } from '../../hooks/useFilteredData'

describe('useFilteredData', () => {
  // Datos para las pruebas
  const testItems = [
    { id: 1, name: 'Manzana', category: 'fruta' },
    { id: 2, name: 'Banana', category: 'fruta' },
    { id: 3, name: 'Zanahoria', category: 'verdura' },
    { id: 4, name: 'Lechuga', category: 'verdura' }
  ]
  
  // Función de filtrado por nombre
  const filterByName = (item: any, term: string) => {
    return item.name.toLowerCase().includes(term.toLowerCase())
  }
  
  it('devuelve todos los datos cuando el término de búsqueda está vacío', () => {
    const { result } = renderHook(() => useFilteredData(testItems, filterByName))
    
    expect(result.current.filteredData).toEqual(testItems)
    expect(result.current.hasFilter).toBe(false)
  })
  
  it('filtra correctamente los datos cuando se aplica un término de búsqueda', () => {
    const { result } = renderHook(() => useFilteredData(testItems, filterByName))
    
    // Aplicar un término de búsqueda
    act(() => {
      result.current.setSearchTerm('ana')
    })
    
    // Debería encontrar "manzana", "banana" y "zanahoria"
    expect(result.current.filteredData).toHaveLength(3)
    expect(result.current.filteredData).toEqual([
      { id: 1, name: 'Manzana', category: 'fruta' },
      { id: 2, name: 'Banana', category: 'fruta' },
      { id: 3, name: 'Zanahoria', category: 'verdura' }
    ])
    expect(result.current.hasFilter).toBe(true)
  })
  
  it('actualiza los resultados cuando cambia el término de búsqueda', () => {
    const { result } = renderHook(() => useFilteredData(testItems, filterByName))
    
    // Aplicar un término de búsqueda
    act(() => {
      result.current.setSearchTerm('manzana')
    })
    
    // Verificar que filtra correctamente
    expect(result.current.filteredData).toHaveLength(1)
    expect(result.current.filteredData[0].name).toBe('Manzana')
    
    // Cambiar a otro término
    act(() => {
      result.current.setSearchTerm('verdura')
    })
    
    // El filtrado debería cambiar también
    expect(result.current.filteredData).toHaveLength(0) // No hay coincidencias en el nombre
  })
  
  it('acepta un término de búsqueda inicial', () => {
    const { result } = renderHook(() => 
      useFilteredData(testItems, filterByName, 'lechuga')
    )
    
    // Debería estar preconfigurado con "lechuga"
    expect(result.current.searchTerm).toBe('lechuga')
    expect(result.current.filteredData).toHaveLength(1)
    expect(result.current.filteredData[0].name).toBe('Lechuga')
    expect(result.current.hasFilter).toBe(true)
  })
  
  it('resetea correctamente el filtro', () => {
    const { result } = renderHook(() => 
      useFilteredData(testItems, filterByName, 'manzana')
    )
    
    // Verificar el estado inicial
    expect(result.current.filteredData).toHaveLength(1)
    
    // Resetear el filtro
    act(() => {
      result.current.resetFilter()
    })
    
    // Verificar que se ha reseteado
    expect(result.current.searchTerm).toBe('')
    expect(result.current.filteredData).toEqual(testItems)
    expect(result.current.hasFilter).toBe(false)
  })
  
  it('maneja correctamente datos vacíos', () => {
    const { result } = renderHook(() => 
      useFilteredData([], filterByName)
    )
    
    expect(result.current.filteredData).toEqual([])
    
    // Aplicar un término de búsqueda
    act(() => {
      result.current.setSearchTerm('manzana')
    })
    
    // No debería dar error con el array vacío
    expect(result.current.filteredData).toEqual([])
  })
  
  it('maneja correctamente la función de filtrado personalizada', () => {
    // Función para filtrar por categoría en lugar de nombre
    const filterByCategory = (item: any, term: string) => {
      return item.category.toLowerCase().includes(term.toLowerCase())
    }
    
    const { result } = renderHook(() => 
      useFilteredData(testItems, filterByCategory, 'verdura')
    )
    
    // Debería encontrar las verduras
    expect(result.current.filteredData).toHaveLength(2)
    expect(result.current.filteredData).toEqual([
      { id: 3, name: 'Zanahoria', category: 'verdura' },
      { id: 4, name: 'Lechuga', category: 'verdura' }
    ])
  })
}) 