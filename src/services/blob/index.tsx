import { FileType } from "@/lib/api/file-upload/file-upload.types";

const toDataURL = (url: string) =>
  new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });

async function downloadBlob(url: string, filename: string) {
  if (!url?.trim() || typeof url !== "string") return;
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);
}

async function loadBlob(blobUrl: string, filename: string): Promise<FileType | null> {
  if (!blobUrl?.trim() || typeof blobUrl !== "string") return null;
  const response = await fetch(blobUrl);
  const blob = await response?.blob();

  const file: FileType = new File([blob], filename, {
    type: blob.type,
    lastModified: Date.now(),
  });
  // Add custom properties to the file
  file.preview = URL.createObjectURL(blob);
  return file;
}

export { toDataURL, downloadBlob, loadBlob };
