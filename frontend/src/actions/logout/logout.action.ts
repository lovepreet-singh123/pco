import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { setLoggedIn, setPermissions, setRole, setUser } from "../../slices/user/user.slice";
import { ROUTES } from "../../utils/constants";
import { useCallback } from "react";

const useLogout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        dispatch(setUser({}));
        dispatch(setRole(null))
        dispatch(setPermissions([]))
        dispatch(setLoggedIn(false))
        navigate(ROUTES.LOGIN);
    }, [dispatch, navigate])

    return handleLogout;
}
export default useLogout;