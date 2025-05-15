import { AlertContextProvider } from "@/contexts/AlertContext";
import { GlobalContextProvider } from "@/contexts/GlobalContext";
import { UserContextProvider } from "@/contexts/UserContext";
import { TanstackProvider } from "./TanstackProvider";
import { User } from "@/lib/api/user/user.types";

export interface Props {
  children?: React.ReactNode;
  initialUserData: User | null;
}

const Providers = ({ children, initialUserData }: Props) => {
  return (
    <UserContextProvider initialUserData={initialUserData}>
      <AlertContextProvider>
        <GlobalContextProvider>
          <TanstackProvider>{children} </TanstackProvider>
        </GlobalContextProvider>
      </AlertContextProvider>
    </UserContextProvider>
  );
};

export default Providers;
