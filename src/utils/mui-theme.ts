"use client";
import { createTheme } from "@mui/material";
import { COLORS } from "./colors";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxs: true; // removes the `xs` breakpoint
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: string) => augmentColor({ color: { main: mainColor } });

export const muiTheme = createTheme({
  breakpoints: {
    values: {
      xxs: 0,
      xs: 421,
      sm: 600,
      md: 769,
      lg: 1200,
      xl: 1440,
    },
  },
  palette: {
    primary: createColor(COLORS.gray800),
    secondary: createColor(COLORS.greenNormal),
  },
  typography: {
    fontFamily: "Inter",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "40px",
          textTransform: "capitalize",
          padding: "10px 30px",
        },
        outlined: {
          border: `1px solid`,
          "&:hover": {
            border: `1px solid`,
          },
        },
        contained: {
          "&:hover": {},
        },
      },
    },

    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: "0.625rem",
    //     },
    //   },
    // },
    // MuiSelect: {
    //   styleOverrides: {
    //     select: {
    //       padding: "0.813rem 0.875rem",
    //     },
    //   },
    // },
    // MuiTooltip: {
    //   styleOverrides: {
    //     tooltip: {
    //       background: "black",
    //       padding: "4px 10px",
    //       color: COLORS.black1,
    //       boxShadow: "0px 8px 16px -2px rgba(27, 33, 44, 0.12)",
    //       fontSize: "12px",
    //       fontStyle: "normal",
    //       fontWeight: "500",
    //       lineHeight: "16px",
    //     },
    //     arrow: {
    //       color: "black",
    //     },
    //   },
    // },
    // MuiTab: {
    //   styleOverrides: {
    //     root: {
    //       textTransform: "capitalize",
    //       fontSize: 16,
    //     },
    //   },
    // },
  },
});
