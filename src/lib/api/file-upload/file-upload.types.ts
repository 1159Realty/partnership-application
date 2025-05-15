interface FileType extends File {
  preview?: string;
  path?: string;
  fileName?: string;
}

type CloudinaryPreset = "property_image" | "user_profile_picture" | "document_file";

type CloudinaryUploadResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
};

export type { FileType, CloudinaryPreset, CloudinaryUploadResponse };
