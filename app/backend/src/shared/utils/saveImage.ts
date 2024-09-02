import path from "path";
import fs from "fs"

import { getAppDataPath } from "./getAppDataFolder";

export function saveImage(imageBuffer: Buffer, imageName: string) {
  const appDataPath = getAppDataPath();

  const imagePath = path.join(appDataPath, imageName);

  fs.writeFileSync(imagePath, imageBuffer); 

  return imagePath; 
}
