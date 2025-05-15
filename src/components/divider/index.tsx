import { DividerProps, Divider as MuiDivider } from "@mui/material";

interface Props extends Omit<DividerProps, "sx"> {
  border?: string;
}

const Divider = ({ border, ...props }: Props) => {
  return <MuiDivider variant="fullWidth" orientation="horizontal" sx={{ border: border || `5px solid #F5F5F5` }} {...props} />;
};

export { Divider };
