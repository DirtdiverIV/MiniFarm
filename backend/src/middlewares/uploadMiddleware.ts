import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurarse de que el directorio de uploads existe
const uploadsDir = path.join(process.cwd(), 'uploads');
const farmUploadsDir = path.join(uploadsDir, 'farms');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(farmUploadsDir)) {
  fs.mkdirSync(farmUploadsDir);
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, farmUploadsDir);
  },
  filename: (req, file, cb) => {
    // Crear un nombre de archivo único usando timestamp y extensión original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'farm-' + uniqueSuffix + ext);
  }
});

// Filtro de archivos: solo aceptar imágenes
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no soportado. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)'));
  }
};

// Configuración de Multer
export const uploadFarmImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // límite de 5MB
  }
}).single('image'); // 'image' es el nombre del campo del formulario

// Middleware para manejar errores de multer
export const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB' });
    }
    return res.status(400).json({ error: `Error de Multer: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
}; 