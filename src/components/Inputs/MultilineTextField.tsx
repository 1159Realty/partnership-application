import * as React from "react";
import { Box, TextField, TextFieldProps } from "@mui/material";

export default function MultilineTextField({ ...etc }: TextFieldProps) {
  return (
    <Box component="form" sx={{ "& .MuiTextField-root": { width: "100%" } }} noValidate autoComplete="off">
      <TextField id="outlined-multiline-static" multiline {...etc} />
    </Box>
  );
}
