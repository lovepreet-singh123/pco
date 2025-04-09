import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { ROLE, ROUTES } from "../../utils/constants";

type PropTypes = {
    module: string,
}

const AuthGaurd = ({ module }: PropTypes) => {
    const { role, permissions, isLoggedIn } = useAppSelector(state => state.user);

    if (!isLoggedIn) {
        return <Navigate to={ROUTES.LOGIN} />
    }
    
    const permissionSet = new Set(permissions);

    if (role !== ROLE.ADMIN && !permissionSet.has(module)) {
        return <Navigate to={ROUTES.LOGIN} />
    }

    return <Outlet />
}

export default AuthGaurd