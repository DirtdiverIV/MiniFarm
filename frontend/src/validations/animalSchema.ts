import * as Yup from 'yup';

export const AnimalFormSchema = Yup.object().shape({
  farm_id: Yup.number()
    .required('La granja es obligatoria')
    .min(1, 'ID de granja inválido'),
  animal_type: Yup.string()
    .required('El tipo de animal es obligatorio'),
  identification_number: Yup.string()
    .required('El número de identificación es obligatorio')
    .matches(/^[A-Z]{3}\d{3}$/, 'El formato debe ser XXX000 (ejemplo: VAC001)'),
  weight: Yup.number()
    .required('El peso es obligatorio')
    .min(0, 'El peso no puede ser negativo'),
  estimated_production: Yup.number()
    .required('La producción estimada es obligatoria')
    .min(0, 'La producción no puede ser negativa'),
  sanitary_register: Yup.string()
    .required('El registro sanitario es obligatorio')
    .matches(/^SR\d{3}$/, 'El formato debe ser SR000 (ejemplo: SR001)'),
  age: Yup.number()
    .required('La edad es obligatoria')
    .min(0, 'La edad no puede ser negativa')
    .integer('La edad debe ser un número entero'),
  has_incidents: Yup.boolean(),
  incidents: Yup.string().when(['has_incidents'], {
    is: (has_incidents: boolean) => has_incidents === true,
    then: () => Yup.string().required('Las incidencias son obligatorias cuando están activadas'),
    otherwise: () => Yup.string()
  })
}); 