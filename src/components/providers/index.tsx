import { AlertContextProvider } from "@/contexts/AlertContext";
import { GlobalContextProvider } from "@/contexts/GlobalContext";
import { UserContextProvider } from "@/contexts/UserContext";
import { TanstackProvider } from "./TanstackProvider";
import { User } from "@/lib/api/user/user.types";
import { NotificationContextProvider } from "@/contexts/NotificationContext";

export interface Props {
  children?: React.ReactNode;
  initialUserData: User | null;
}

const Providers = ({ children, initialUserData }: Props) => {
  return (
    <UserContextProvider initialUserData={initialUserData}>
      <AlertContextProvider>
        <GlobalContextProvider>
          <TanstackProvider>
            <NotificationContextProvider>{children}</NotificationContextProvider>
          </TanstackProvider>
        </GlobalContextProvider>
      </AlertContextProvider>
    </UserContextProvider>
  );
};

export default Providers;
