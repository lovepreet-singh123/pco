import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { ROUTES } from "../../utils/constants";

const NoGaurd = () => {
    const { isLoggedIn } = useAppSelector(state => state.user);
    if (isLoggedIn) {
        return <Navigate to={ROUTES.DASHBOARD} />
    }
    return <Outlet />
}

export default NoGaurd