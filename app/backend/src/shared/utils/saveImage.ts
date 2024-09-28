import path from "path";
import fs from "fs"

export function saveImage(pathToSave: string, imageBuffer: Buffer, imageName: string) {

  const imagePath = path.join(pathToSave, imageName);

  fs.writeFileSync(imagePath, imageBuffer); 

  return imagePath; 
}
