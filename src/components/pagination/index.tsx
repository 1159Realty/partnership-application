import React from "react";
import { PaginationProps } from "@mui/material";
import { StyledPagination } from "./pagination.styles";

function Pagination({ ...props }: PaginationProps) {
  return <StyledPagination count={10} shape="rounded" {...props} />;
}

export { Pagination };
