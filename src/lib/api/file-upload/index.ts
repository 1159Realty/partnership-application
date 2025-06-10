import { postClient } from "../client.api";
import { CloudinaryPreset, CloudinaryUploadResponse, FileType, FileUploadResponse, FileUploadType } from "./file-upload.types";
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

async function uploadFile(file: FileType, type: FileUploadType): Promise<FileUploadResponse | null> {
  try {
    const getUploadPath = () => {
      if (type === "property-banner") {
        return "properties/upload";
      }
      if (type === "document") {
        return "documents/upload";
      }
      if (type === "profile-picture") {
        return "users/upload";
      }
      return "";
    };

    const filePath = getUploadPath();

    const formData = new FormData();
    formData.append("file", file);

    const response = await postClient<FileUploadResponse>(filePath, formData, "form-data");
    return response?.result;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { uploadToCloudinary, uploadFile };
