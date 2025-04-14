// sonarignore:start
import { describe, it, expect } from 'vitest'
import { api } from '../../services/api'

describe('api service', () => {
  it('debería exportar una instancia de api', () => {
    expect(api).toBeDefined()
  })
}) 
// sonarignore:end