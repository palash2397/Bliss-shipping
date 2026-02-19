import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = (folderName: string) => ({
  storage: diskStorage({
    destination: `./uploads/${folderName}`,
    filename: (req: any, file: any, callback: any) => {
      const fileExtName = extname(file.originalname);
      const randomName = Date.now();
      callback(null, `${randomName}${fileExtName}`);
    },
  }),
});
