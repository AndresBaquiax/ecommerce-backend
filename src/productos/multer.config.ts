import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './src/img',
    filename: (req, file, callback) => {
      // El nombre del archivo será el nombre del producto + extensión
      const nombre = req.body.nombre || 'producto';
      const fileExtName = extname(file.originalname);
      const fileName = `${nombre.replace(/[^a-zA-Z0-9]/g, '_')}${fileExtName}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Solo se permiten archivos de imagen'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};
