import { useMemo } from 'react';
import { AnimalWithIncident } from '../services/dashboardService';

/**
 * Hook personalizado para convertir AnimalWithIncident a formato Animal
 * Esto elimina la duplicación y mejora la mantenibilidad
 */
export const useAnimalData = (animalsWithIncidents: AnimalWithIncident[] | null) => {
  // Memoizar la conversión para evitar cálculos innecesarios en cada render
  const convertedAnimals = useMemo(() => {
    if (!animalsWithIncidents) return [];
    
    return animalsWithIncidents.map(animal => ({
      id: animal.id,
      animal_type: animal.animal_type,
      identification_number: animal.identification_number,
      incidents: animal.incidents,
      farm_name: animal.farm_name,
      farm: {
        id: 0, // No tenemos el ID de la granja en este objeto
        name: animal.farm_name
      },
      // Valores por defecto para los campos requeridos que no están en AnimalWithIncident
      weight: 0,
      estimated_production: 0,
      sanitary_register: '',
      age: 0
    }));
  }, [animalsWithIncidents]);

  return convertedAnimals;
}; 