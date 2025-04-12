# Sistema de Carga de Imágenes en MiniFarm

Este documento describe cómo utilizar el sistema de carga de imágenes implementado con Multer para las granjas en MiniFarm.

## Estructura de Archivos

Las imágenes se almacenan en la siguiente estructura:
```
/uploads
  /farms
    - farm-[timestamp]-[random].jpg
```

## Endpoints para Granjas

### Crear una granja con imagen
```
POST /api/farms
```

#### Parámetros
- `name`: Nombre de la granja (obligatorio)
- `farm_type_id`: ID del tipo de granja (obligatorio)
- `production_type_id`: ID del tipo de producción (obligatorio)
- `image`: Archivo de imagen (opcional)

#### Formato de la Petición
La petición debe realizarse utilizando `FormData` ya que estamos subiendo un archivo:

```javascript
// Ejemplo con React
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('name', farmName);
  formData.append('farm_type_id', farmTypeId);
  formData.append('production_type_id', productionTypeId);
  
  // Aquí se agrega la imagen si se seleccionó
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  try {
    const response = await fetch('http://localhost:4000/api/farms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // Token de autenticación
      },
      body: formData // No establecer Content-Type, lo hace automáticamente FormData
    });
    
    const data = await response.json();
    // Manejar respuesta...
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Actualizar una granja con imagen
```
PUT /api/farms/:id
```

#### Parámetros
- `name`: Nombre de la granja (opcional)
- `farm_type_id`: ID del tipo de granja (opcional)
- `production_type_id`: ID del tipo de producción (opcional)
- `image`: Archivo de imagen (opcional)

#### Comportamiento
- Si se sube una nueva imagen, la imagen anterior será eliminada.
- Los campos no proporcionados conservarán sus valores actuales.

### Visualizar imágenes
Las imágenes se pueden acceder directamente desde:
```
GET /uploads/farms/[nombre-archivo]
```

Por ejemplo:
```
http://localhost:4000/uploads/farms/farm-bovine-example.jpg
```

## Limitaciones

- Solo se aceptan archivos de imagen con los formatos: JPEG, PNG, GIF y WEBP.
- El tamaño máximo de archivo es de 5MB.
- Sólo se puede subir una imagen por granja.

## Manejo de Errores

El sistema proporciona mensajes de error específicos para:
- Archivos demasiado grandes
- Formatos de archivo no admitidos
- Errores de validación de datos

## Ejemplo de Implementación en el Frontend

```jsx
// En un componente React
import { useState } from 'react';

function FarmForm() {
  const [name, setName] = useState('');
  const [farmTypeId, setFarmTypeId] = useState('');
  const [productionTypeId, setProductionTypeId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crear una vista previa
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('farm_type_id', farmTypeId);
    formData.append('production_type_id', productionTypeId);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Código para enviar formData...
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      
      {/* Otros campos... */}
      
      <div>
        <label>Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      
      {imagePreview && (
        <div>
          <p>Vista previa:</p>
          <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '200px' }} />
        </div>
      )}
      
      <button type="submit">Guardar Granja</button>
    </form>
  );
}
``` 