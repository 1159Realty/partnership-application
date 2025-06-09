import { ChildrenProps } from "@/utils/global-types";
import Layout from "../layout";
import { muiTheme } from "@/utils/mui-theme";
import { ThemeProvider } from "@mui/material";
import Providers from "../providers";
import { Toast } from "../toast";
import { Suspense } from "react";
import { Spinner } from "../loaders";
import { getServerSession } from "@/lib/session/server";
import { OnboardingDialog } from "@/components/dialog/onboarding";
import { ClientOnboarding } from "@/components/forms/OnboardClient";
import { UpdateBankAccountForm } from "../forms/UpdateBankAccountForm";
import NotificationAlert from "../notificationAlert/alert";

async function Component({ children }: ChildrenProps) {
  const session = await getServerSession();
  const userData = session?.user || null;

  return (
    <Providers initialUserData={userData}>
      <Layout>{children}</Layout>
      <NotificationAlert />
      <Toast />
      <OnboardingDialog />
      <ClientOnboarding />
      <UpdateBankAccountForm />
    </Providers>
  );
}

const AppWrapper = ({ children }: ChildrenProps) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <Suspense fallback={<Spinner />}>
        <Component>{children}</Component>
      </Suspense>
    </ThemeProvider>
  );
};

export { AppWrapper };
