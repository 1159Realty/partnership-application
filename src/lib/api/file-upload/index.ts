import { CloudinaryPreset, CloudinaryUploadResponse, FileType } from "./file-upload.types";
import { formatError } from "@/services/errors";

async function uploadToCloudinary(file: FileType, preset: CloudinaryPreset): Promise<CloudinaryUploadResponse | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/dhbwt5fuw/upload`, {
      method: "POST",
      body: formData,
    });
    return await response?.json();
  } catch (error) {
    console.error(`Unable to upload to cloudinary. ${formatError(error)}`);

    return null;
  }
}

export { uploadToCloudinary };
