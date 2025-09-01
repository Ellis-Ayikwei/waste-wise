import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthUser } from "./customer/AccountSettings/types";
import CustomerAccountSettings from "./customer/AccountSettings/AccountSettings";
import ProviderAccountSettings from "./provider/AccountSettings/AccountSettings";
import IconLoader from "../components/Icon/IconLoader";

const UserAccountSetting = () => {
    const authUser = useAuthUser() as AuthUser | null;

    if (!authUser) {
        return <IconLoader />;
    }

    if (authUser.user.user_type === 'customer') {
        return <CustomerAccountSettings />;
    } else if (authUser.user.user_type === 'provider') {
        return <ProviderAccountSettings />;
    }
    
};

export default UserAccountSetting;