"use client";

import { Font5001218Gray500, Font5001421Gray800, MobileB2MGray900, MobileCap2MGray700 } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { AddDocument, DocumentContainer } from "./client.styles";
import { DownloadSimple, FileText, Plus, UploadSimple, X } from "@phosphor-icons/react/dist/ssr";
import { COLORS } from "@/utils/colors";
import { TextField } from "../Inputs";
import { useAlertContext } from "@/contexts/AlertContext";
import { useDropzone } from "react-dropzone";
import { Button, IconButton } from "../buttons";
import { FileType } from "@/lib/api/file-upload/file-upload.types";

type ListValue = "duration" | "size";

function ClientDocument() {
  const [sizes, setSizes] = useState<number[]>([]);
  const [durations, setDurations] = useState<number[]>([]);
  const [duration, setDuration] = useState("");
  const [size, setSize] = useState("");

  const { setAlert } = useAlertContext();
  const [files, setFiles] = useState<FileType[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 1,
    onDropRejected(fileRejections) {
      const someFilesAreTooLarge = fileRejections.some((file) => file.errors.some((error) => error.code === "file-too-large"));

      const tooManyFiles = fileRejections.some((file) => file.errors.some((error) => error.code === "too-many-files"));

      if (someFilesAreTooLarge) {
        setAlert({
          severity: "error",
          show: true,
          message: "The file you are trying to upload exceeds the limit of 50mb",
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
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  function addNewItem(type: ListValue) {
    const value = type === "duration" ? parseInt(duration) : parseInt(size);
    if (isNaN(value)) {
      setAlert({
        message: "Invalid value!",
        show: true,
        severity: "error",
      });
      return;
    }

    if (type === "duration") {
      if (durations.includes(value)) {
        setAlert({
          message: "Duration exists already!",
          show: true,
          severity: "error",
        });
        return;
      }
      setDurations((prev) => [...prev, value]);
      setDuration("");
    } else {
      if (sizes.includes(value)) {
        setAlert({
          message: "Size exists already!",
          show: true,
          severity: "error",
        });
        return;
      }
      setSizes((prev) => [...prev, value]);
      setSize("");
    }
  }

  // function removeItem(type: "duration" | "size", value: number) {
  //   if (type === "duration") {
  //     setDurations((prev) => prev.filter((i) => i !== value));
  //   } else {
  //     setSizes((prev) => prev.filter((i) => i !== value));
  //   }
  // }

  return (
    <Box px="16px">
      <MobileB2MGray900>Document</MobileB2MGray900>
      <Box mt="16px">
        <Font5001218Gray500>GENERAL UPLOAD</Font5001218Gray500>
      </Box>
      <Stack mt="8px" spacing={"8px"}>
        <DocumentContainer>
          <Stack direction={"row"} alignItems={"center"} spacing={"6px"}>
            <FileText />
            <Font5001421Gray800>Property Guidance</Font5001421Gray800>
          </Stack>
          <DownloadSimple color={COLORS.gray500} />
        </DocumentContainer>

        <DocumentContainer>
          <Stack direction={"row"} alignItems={"center"} spacing={"6px"}>
            <FileText />
            <Font5001421Gray800>Property Govt Accreditation</Font5001421Gray800>
          </Stack>
          <DownloadSimple color={COLORS.gray500} />
        </DocumentContainer>
      </Stack>

      {Boolean(files.length) && (
        <Stack spacing={"8px"} mt="20px">
          <TextField size="small" label="File name" />
          <MobileCap2MGray700>{files?.[0]?.name}</MobileCap2MGray700>
          <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
            <Button
              size="small"
              onClick={() => addNewItem("duration")}
              startIcon={<UploadSimple weight="bold" />}
              sx={{ width: "fit-content" }}
            >
              Upload
            </Button>
            <IconButton onClick={() => setFiles([])} bg_color={COLORS.gray200}>
              <X />
            </IconButton>
          </Stack>
        </Stack>
      )}

      <AddDocument {...getRootProps({ className: "dropzone" })}>
        <Plus />
        <span> Add document</span> <input {...getInputProps()} />
      </AddDocument>
    </Box>
  );
}

export { ClientDocument };
