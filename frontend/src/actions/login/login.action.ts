import { yupResolver } from "@hookform/resolvers/yup";
import { FormEvent, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { useLogInMutation } from "../../api/login/login.api";
import { useAppDispatch } from "../../redux/store";
import { setLoggedIn, setPermissions, setRole, setUser } from "../../slices/user/user.slice";
import { Yup } from "../../utils/utils";
import { API_STATUS } from "../../utils/constants";

const validationSchema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
});

const defaultValues = {
    username: "",
    password: "test123",
}

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const [loginApi, { status }] = useLogInMutation();

    const { control, handleSubmit } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = handleSubmit(async (data) => {
        try {
            const { user } = await loginApi(data).unwrap();
            if (user) {
                dispatch(setUser({ email: user.email, name: user.name, username: user.username }));
                dispatch(setLoggedIn(true));
                dispatch(setRole(user.role));
                dispatch(setPermissions(user.permissions))
            }
        } catch (error) {
            console.log('error: ', error);
        }
    });

    const debounced = useDebouncedCallback(onSubmit, 300);

    const debouncedSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        debounced();
    }, [debounced])

    return {
        control,
        onSubmit: debouncedSubmit,
        loading: status === API_STATUS.PENDING,
    };
}