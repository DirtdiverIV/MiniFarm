export const FARM_TYPE_TO_ANIMAL_TYPE: { [key: string]: string } = {
  'bovina': 'vaca',
  'porcina': 'cerdo',
  'ovina': 'oveja'
} as const;

export const ANIMAL_TYPE_PREFIX: { [key: string]: string } = {
  'vaca': 'VAC',
  'cerdo': 'CER',
  'oveja': 'OVE'
} as const; 