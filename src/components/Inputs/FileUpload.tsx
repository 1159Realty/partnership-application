"use client";
import React from "react";
import { FileUploadPreviewWrapper, FileUploadWrapper } from "./input.styles";
import { FileText, Image as SvgImage, X } from "@phosphor-icons/react/dist/ssr";
import { MobileCap1MGray400, MobileCap2MGray700 } from "@/utils/typography";
import { COLORS } from "@/utils/colors";
import { useDropzone } from "react-dropzone";
import { useAlertContext } from "@/contexts/AlertContext";
import { Stack } from "@mui/material";
import Image from "next/image";
import { truncateString } from "@/services/string";
import { FileType } from "@/lib/api/file-upload/file-upload.types";
import { SetState } from "@/utils/global-types";

interface Props {
  label: string;
  files: FileType[];
  setFiles: SetState<FileType[]>;
  handleReset?: () => void;
  prefix?: string;
  isDoc?: boolean;
}

const FileUpload = ({ label, files, setFiles, handleReset, prefix, isDoc }: Props) => {
  const { setAlert } = useAlertContext();

  const { getRootProps, getInputProps } = useDropzone({
    accept: isDoc
      ? {
          "application/pdf": [],
          "application/msword": [],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
          "text/plain": [],
          "image/*": [],
        }
      : {
          "image/*": [],
        },
    maxSize: 6 * 1024 * 1024,
    maxFiles: 1,
    onDropRejected(fileRejections) {
      const someFilesAreTooLarge = fileRejections.some((file) => file.errors.some((error) => error.code === "file-too-large"));

      const tooManyFiles = fileRejections.some((file) => file.errors.some((error) => error.code === "too-many-files"));

      if (someFilesAreTooLarge) {
        setAlert({
          severity: "error",
          show: true,
          message: "File should be 6mb or less",
        });
      }

      if (tooManyFiles) {
        setAlert({
          severity: "error",
          show: true,
          message: "Too many files",
        });
      }
    },
    onDrop: (acceptedFiles) => {
      handleReset?.();
      setFiles(
        acceptedFiles.map((file) => {
          const mutableFile: FileType = new File([file], `${prefix ? `${prefix}_` : ""}${file.name}`, {
            type: file.type,
          });
          mutableFile.preview = URL.createObjectURL(file);

          return mutableFile;
        })
      );
    },
  });

  function handleCancel() {
    handleReset?.();
    setFiles([]);
  }

  return (
    <div>
      <FileUploadWrapper {...getRootProps({ className: "dropzone" })}>
        {isDoc ? <FileText color={COLORS.gray600} weight="bold" /> : <SvgImage color={COLORS.gray600} weight="bold" />}
        <MobileCap2MGray700>{label}</MobileCap2MGray700>
        <input {...getInputProps()} />
      </FileUploadWrapper>
      {Boolean(files.length) && (
        <FileUploadPreviewWrapper>
          <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
            {isDoc ? (
              <FileText size={30} color={COLORS.gray600} weight="bold" />
            ) : (
              <Image width={40} height={40} src={files[0]?.preview || ""} alt="Preview" />
            )}
            <Stack justifyContent={"space-between"}>
              <MobileCap2MGray700>{truncateString(files[0]?.name)}</MobileCap2MGray700>
              <MobileCap1MGray400>{files[0]?.size && parseFloat((files[0].size / 1024).toFixed(1))}KB</MobileCap1MGray400>
            </Stack>
          </Stack>

          <X size={20} color={COLORS.blackNormal} cursor={"pointer"} weight="bold" onClick={handleCancel} />
        </FileUploadPreviewWrapper>
      )}
    </div>
  );
};

export { FileUpload };
