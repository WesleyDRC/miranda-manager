import { Request, Response } from "express";

export class UploadController {
  async handle(request: Request, response: Response): Promise<Response> {
    const file = request.file;

    if (!file) {
      return response.status(400).json({ message: "File not provided." });
    }

    const fileUrl = `/uploads/${file.filename}`;

    return response.json({ url: fileUrl });
  }
}
