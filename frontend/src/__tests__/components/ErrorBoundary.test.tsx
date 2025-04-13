import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ErrorBoundary from '../../components/ErrorBoundary'

// Componente que lanza un error a propósito
const ErrorComponent = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Error de prueba')
  }
  return <div>Componente sin errores</div>
}

describe('ErrorBoundary', () => {
  // Mock para console.error para evitar que los errores esperados ensucien la salida de prueba
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renderiza sus hijos cuando no hay errores', () => {
    render(
      <ErrorBoundary>
        <div>Contenido sin errores</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Contenido sin errores')).toBeInTheDocument()
  })
  
  it('muestra el mensaje de error cuando un componente hijo falla', () => {
    // Suprimimos el error de React que se muestra en la consola durante las pruebas
    // Esto es necesario porque React muestra errores incluso cuando están manejados por ErrorBoundary
    const spy = vi.spyOn(console, 'error')
    spy.mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(/¡Ups! Algo salió mal/i)).toBeInTheDocument()
    expect(screen.getByText(/Error de prueba/i)).toBeInTheDocument()
    
    // Verificar que el botón de recarga está presente
    expect(screen.getByText(/Recargar página/i)).toBeInTheDocument()
    
    // Limpiar el mock
    spy.mockRestore()
  })
  
  it('permite reintentar cuando ocurre un error', () => {
    // Mock para window.location.reload
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    })
    
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(/¡Ups! Algo salió mal/i)).toBeInTheDocument()
    
    // Hacer clic en el botón de recargar
    fireEvent.click(screen.getByText(/Recargar página/i))
    
    // Verificar que se llamó a window.location.reload
    expect(reloadMock).toHaveBeenCalled()
  })
}) 