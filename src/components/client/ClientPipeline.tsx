import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// import StepContent from "@mui/material/StepContent";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
import { MobileB1M, MobileB2MGray900, MobileCap2MGray400 } from "@/utils/typography";
// import { RadioButton } from "@phosphor-icons/react/dist/ssr";
import { COLORS, SEVERITY_COLORS } from "@/utils/colors";
import { Button } from "../buttons";

const steps = [
  {
    label: "Interested",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "Contacted",
    description: "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Ongoing",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
  {
    label: "Completed",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
  {
    label: "Rejected",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

function ClientPipeline() {
  // const [activeStep, setActiveStep] = React.useState(2);

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  return (
    <Box px="16px">
      <MobileB2MGray900>Lead Pipeline</MobileB2MGray900>

      <Box mt="16px">
        <Stepper
          sx={{
            svg: { color: `${COLORS.greenNormal}!important` },
          }}
          // activeStep={activeStep}
          orientation="vertical"
        >
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel optional={<MobileCap2MGray400>Wed Feb 16 2021</MobileCap2MGray400>}>
                <Box color={"#1A1B25"}>
                  <MobileB1M>{step.label}</MobileB1M>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt="20px">
          <Button sx={{ bgcolor: SEVERITY_COLORS.danger.light }} size="small" color="error">
            <Box color={SEVERITY_COLORS.danger.dark}>Terminate</Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export { ClientPipeline };
