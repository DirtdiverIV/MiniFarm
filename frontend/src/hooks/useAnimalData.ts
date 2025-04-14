import { useMemo } from 'react';
import { AnimalWithIncident } from '../services/dashboardService';

export const useAnimalData = (animalsWithIncidents: AnimalWithIncident[] | null) => {
  
  const convertedAnimals = useMemo(() => {
    if (!animalsWithIncidents) return [];
    
    return animalsWithIncidents.map(animal => ({
      id: animal.id,
      animal_type: animal.animal_type,
      identification_number: animal.identification_number,
      incidents: animal.incidents,
      farm_name: animal.farm_name,
      farm: {
        id: 0, 
        name: animal.farm_name
      },
      
      weight: 0,
      estimated_production: 0,
      sanitary_register: '',
      age: 0
    }));
  }, [animalsWithIncidents]);

  return convertedAnimals;
}; 